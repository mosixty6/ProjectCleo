import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface Medication {
  name: string
  dose?: string
  frequency?: string
}

function parseJSON<T>(text: string, fallback: T): T {
  try {
    const cleaned = text.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
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
      content: `Extract all medications from this clinical transcript. Return ONLY a JSON array, no markdown, no explanation. Each element: name (generic preferred, lowercase), dose (optional string), frequency (optional string).

Example: [{"name":"sertraline","dose":"50mg","frequency":"daily"}]

Transcript:
${transcript}`
    }]
  })
  const text = msg.content[0].type === 'text' ? msg.content[0].text.trim() : '[]'
  return parseJSON<Medication[]>(text, [])
}

async function fetchFDALabel(drugName: string): Promise<string | null> {
  const encoded = encodeURIComponent(drugName)
  const endpoints = [
    `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encoded}"&limit=1`,
    `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encoded}"&limit=1`,
  ]
  for (const url of endpoints) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
      if (!res.ok) continue
      const data = await res.json()
      const interactions = data.results?.[0]?.drug_interactions?.[0]
      if (interactions) return (interactions as string).slice(0, 1000)
    } catch {
      continue
    }
  }
  return null
}

async function synthesize(
  transcript: string,
  medications: Medication[],
  fdaData: Record<string, string>
): Promise<object> {
  const medList = medications
    .map(m => `${m.name}${m.dose ? ` ${m.dose}` : ''}${m.frequency ? ` ${m.frequency}` : ''}`)
    .join(', ')

  const fdaSections = Object.entries(fdaData)
    .map(([drug, text]) => `[${drug.toUpperCase()} — FDA Interactions]\n${text}`)
    .join('\n\n')

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: 'You are Cleo, a clinical decision support tool assisting licensed prescribers. Follow APA guidelines for psychiatric medications and standard clinical guidelines otherwise. Never prescribe — support only.',
    messages: [{
      role: 'user',
      content: `Analyze this patient's medication regimen and provide clinical decision support.

Medications identified: ${medList || 'none detected'}

FDA Drug Interaction Data:
${fdaSections || 'No FDA interaction data available.'}

Full Transcript:
${transcript}

Respond ONLY with a JSON object (no markdown):
{
  "summary": "2-3 sentence clinical summary of the regimen",
  "recommendations": ["Use language like 'consider', 'may warrant review', 'prescriber should evaluate'"],
  "interactions": [{"drug1":"name","drug2":"name","description":"clinical significance","severity":"mild|moderate|severe"}],
  "followUpQuestions": ["Suggested question 1","Suggested question 2","Suggested question 3"],
  "disclaimer": "This is AI-generated clinical decision support only. All recommendations require review and approval by the licensed prescriber. This tool does not replace clinical judgment."
}`
    }]
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

export async function POST(req: NextRequest) {
  const { transcript } = await req.json()

  if (!transcript?.trim()) {
    return Response.json({ error: 'No transcript provided' }, { status: 400 })
  }

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
      }

      try {
        // Step 1 — extract medications
        send({ step: 'extract', status: 'running' })
        const medications = await extractMedications(transcript)
        send({ step: 'extract', status: 'done', data: { medications } })

        // Step 2 — OpenFDA lookups
        send({ step: 'openfda', status: 'running' })
        const fdaData: Record<string, string> = {}
        await Promise.all(
          medications.map(async (med) => {
            const label = await fetchFDALabel(med.name)
            if (label) fdaData[med.name] = label
          })
        )
        send({ step: 'openfda', status: 'done', data: { found: Object.keys(fdaData).length } })

        // Step 3 — synthesize
        send({ step: 'synthesize', status: 'running' })
        const result = await synthesize(transcript, medications, fdaData)
        send({ step: 'synthesize', status: 'done', data: result })

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
