import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { FormularyResult, Medication, Visit } from '@/lib/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

function parseJSON<T>(text: string, fallback: T): T {
  try {
    return JSON.parse(text.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim())
  } catch {
    return fallback
  }
}

async function extractMedications(transcript: string): Promise<Medication[]> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `Extract all medications from this clinical transcript. Return ONLY a JSON array, no markdown. Each element: name (generic preferred, lowercase), dose (optional), frequency (optional).

Example: [{"name":"sertraline","dose":"50mg","frequency":"daily"}]

Transcript:\n${transcript}`,
    }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '[]'
  return parseJSON<Medication[]>(text, [])
}

async function checkFormulary(medications: Medication[], plan: string): Promise<FormularyResult> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a pharmacy benefits expert. For the plan "${plan}", assess formulary status for: ${medications.map((m) => m.name).join(', ')}.

Return ONLY JSON (no markdown):
{"plan":"${plan}","items":[{"name":"drug","tier":"2","status":"covered|non-preferred|pa-required|not-covered|unknown","notes":""}],"paRequired":["drug"]}

Use typical formulary patterns. Mark status "unknown" where uncertain. Flag PA-required items in paRequired array.`,
    }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '{}'
  return parseJSON<FormularyResult>(text, { plan, items: [], paRequired: [] })
}

async function fetchFDALabel(drugName: string): Promise<string | null> {
  const encoded = encodeURIComponent(drugName)
  for (const url of [
    `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encoded}"&limit=1`,
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"&limit=1`,
  ]) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json()
      const text = data.results?.[0]?.drug_interactions?.[0] as string | undefined
      if (text) return text.slice(0, 1000)
    } catch {
      continue
    }
  }
  return null
}

async function synthesize(
  transcript: string,
  medications: Medication[],
  fdaData: Record<string, string>,
  formulary: FormularyResult | null,
  previousVisit: Visit | null
): Promise<object> {
  const medList = medications
    .map((m) => `${m.name}${m.dose ? ` ${m.dose}` : ''}${m.frequency ? ` ${m.frequency}` : ''}`)
    .join(', ')

  const fdaSections = Object.entries(fdaData)
    .map(([drug, text]) => `[${drug.toUpperCase()} — FDA]\n${text}`)
    .join('\n\n')

  const prevSection = previousVisit
    ? `\n\nPREVIOUS VISIT (${previousVisit.date}):\nPrior medications: ${previousVisit.medications.map((m) => m.name).join(', ')}\nOpen recommendations: ${previousVisit.result.recommendations.join(' | ')}\nNote any changes and whether prior recommendations appear to have been addressed.`
    : ''

  const formularySection = formulary?.paRequired?.length
    ? `\n\nFORMULARY FLAGS: PA required for ${formulary.paRequired.join(', ')}.`
    : ''

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: 'You are Cleo, a clinical decision support tool for licensed prescribers. Follow APA guidelines for psychiatric medications and standard clinical guidelines otherwise. Never prescribe — support only.',
    messages: [{
      role: 'user',
      content: `Analyze this medication regimen and provide clinical decision support.

Medications: ${medList || 'none detected'}
FDA Interaction Data:\n${fdaSections || 'None available.'}${prevSection}${formularySection}

Transcript:\n${transcript}

Return ONLY JSON (no markdown):
{"summary":"2-3 sentence clinical summary","recommendations":["Use 'consider','may warrant review','prescriber should evaluate'"],"interactions":[{"drug1":"","drug2":"","description":"","severity":"mild|moderate|severe"}],"followUpQuestions":["q1","q2","q3"],"disclaimer":"This is AI-generated clinical decision support only. All recommendations require review by the licensed prescriber."}`,
    }],
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '{}'
  return parseJSON<object>(text, {
    summary: '',
    recommendations: [],
    interactions: [],
    followUpQuestions: [],
    disclaimer: 'AI-generated clinical decision support only. Not a substitute for professional medical judgment.',
  })
}

async function generateBerriesNote(
  medications: Medication[],
  recommendations: string[],
  paRequired: string[]
): Promise<string> {
  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `Write a clinical progress note PLAN section ready to paste into Berries or an EHR. Concise, professional, prescriber-style.

Include current medications with any changes, action items, and PA items to address.

Medications: ${medications.map((m) => `${m.name}${m.dose ? ' ' + m.dose : ''}${m.frequency ? ' ' + m.frequency : ''}`).join(', ')}
Recommendations: ${recommendations.join('; ')}
${paRequired.length ? `PA Required: ${paRequired.join(', ')}` : ''}

Return plain text only — no JSON, no markdown. Write the note text directly.`,
    }],
  })
  return msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
}

export async function POST(req: NextRequest) {
  const { transcript, insurancePlan, previousVisit } = await req.json()

  if (!transcript?.trim()) {
    return Response.json({ error: 'No transcript provided' }, { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) =>
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))

      try {
        // 1. Extract
        send({ step: 'extract', status: 'running' })
        const medications = await extractMedications(transcript)
        send({ step: 'extract', status: 'done', data: { medications } })

        // 2. Formulary (optional)
        let formulary: FormularyResult | null = null
        if (insurancePlan?.trim()) {
          send({ step: 'formulary', status: 'running' })
          formulary = await checkFormulary(medications, insurancePlan)
          send({ step: 'formulary', status: 'done', data: formulary })
        } else {
          send({ step: 'formulary', status: 'skipped' })
        }

        // 3. OpenFDA
        send({ step: 'openfda', status: 'running' })
        const fdaData: Record<string, string> = {}
        await Promise.all(
          medications.map(async (med) => {
            const label = await fetchFDALabel(med.name)
            if (label) fdaData[med.name] = label
          })
        )
        send({ step: 'openfda', status: 'done', data: { found: Object.keys(fdaData).length } })

        // 4. Synthesize
        send({ step: 'synthesize', status: 'running' })
        const result = await synthesize(transcript, medications, fdaData, formulary, previousVisit ?? null) as {
          recommendations?: string[]
        }
        send({ step: 'synthesize', status: 'done', data: result })

        // 5. Berries note
        send({ step: 'note', status: 'running' })
        const note = await generateBerriesNote(
          medications,
          result.recommendations ?? [],
          formulary?.paRequired ?? []
        )
        send({ step: 'note', status: 'done', data: { note } })

        send({ step: 'complete', status: 'done' })
      } catch (err) {
        send({ step: 'error', status: 'error', error: err instanceof Error ? err.message : 'Analysis failed' })
      }

      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
