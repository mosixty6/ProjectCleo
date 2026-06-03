import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const MEMBERS = [
  {
    id: 'psychiatrist',
    name: 'Psychiatrist',
    color: 'blue',
    system: `You are a board-certified psychiatrist providing a focused case consultation.
Review from a psychopharmacology and APA guideline lens. Cover diagnosis-medication alignment,
evidence-based augmentation, titration strategy, and long-term psychiatric considerations.
Respond in 3-5 tight bullet points. No intro, no closing — just your clinical read.`,
  },
  {
    id: 'pharmacist',
    name: 'Clinical Pharmacist',
    color: 'green',
    system: `You are a clinical pharmacist reviewing this regimen.
Focus on: interactions, pharmacokinetics, generic substitution opportunities, formulation
considerations for adherence, and cost optimization. Flag anything the prescriber may have missed
from a pharmacy perspective. 3-5 bullet points. No intro or closing.`,
  },
  {
    id: 'advocate',
    name: 'Patient Advocate',
    color: 'purple',
    system: `You are a patient advocate and shared decision-making specialist.
Read the transcript closely for what the patient is actually experiencing — burden, side effects,
cost concerns, avoidance signals, unspoken concerns. Translate the patient voice into clinical
action items. What does this patient need the prescriber to hear? 3-5 bullet points. No intro or closing.`,
  },
  {
    id: 'internist',
    name: 'Internist',
    color: 'orange',
    system: `You are an internist consulting on the systemic implications of this psychiatric regimen.
Focus on: metabolic effects, cardiac considerations, lab monitoring gaps, drug-disease interactions,
and anything the psychiatric lens might miss from a whole-body standpoint. 3-5 bullet points. No intro or closing.`,
  },
  {
    id: 'professor',
    name: 'Professor',
    color: 'indigo',
    system: `You are an attending physician and clinical educator reviewing this case for teaching purposes.
Extract the most instructive lessons a resident-level physician should take from this encounter.
Cover: common pitfalls this case illustrates, one or two clinical pearls grounded in evidence,
a memorable teaching point about the drug class or clinical situation, and what a resident might
get wrong here and why. Write for a PGY-2 or PGY-3 audience. 3-5 bullet points. No intro or closing.`,
  },
]

export async function POST(req: NextRequest) {
  const { transcript, medications, analysis } = await req.json()

  const context = `Medications: ${medications
    .map((m: { name: string; dose?: string; frequency?: string }) =>
      `${m.name}${m.dose ? ' ' + m.dose : ''}${m.frequency ? ' ' + m.frequency : ''}`
    )
    .join(', ')}

Current analysis summary: ${analysis.summary}

Recommendations: ${analysis.recommendations?.join('; ')}

Transcript:
${String(transcript).slice(0, 2500)}`

  const results = await Promise.all(
    MEMBERS.map(async (member) => {
      const msg = await anthropic.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 600,
        system: member.system,
        messages: [{ role: 'user', content: `Please review this case:\n\n${context}` }],
      })
      const opinion = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
      return { id: member.id, name: member.name, color: member.color, opinion }
    })
  )

  return Response.json({ members: results })
}
