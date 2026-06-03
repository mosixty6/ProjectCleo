import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { medication, diagnosis, clinicalJustification } = await req.json()

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    messages: [{
      role: 'user',
      content: `Draft a prior authorization letter for a prescriber to submit.

Medication: ${medication}
Diagnosis: ${diagnosis}
Clinical justification: ${clinicalJustification}

Write a complete, professional PA letter that:
1. States medical necessity clearly
2. References relevant clinical guidelines (APA, FDA labeling, clinical evidence)
3. Documents why formulary alternatives are insufficient where applicable
4. Is formatted for direct submission

Write the letter text only — no JSON, no extra commentary.`,
    }],
  })

  const letter = msg.content[0].type === 'text' ? msg.content[0].text.trim() : ''
  return Response.json({ letter })
}
