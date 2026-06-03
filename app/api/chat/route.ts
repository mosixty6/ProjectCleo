import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const { message, analysisContext } = await req.json()

  const msg = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You are Cleo, a clinical decision support assistant for licensed prescribers. Be concise and clinically precise. Frame all suggestions as "for prescriber consideration." Never prescribe directly.

Analysis context:
${JSON.stringify(analysisContext, null, 2)}`,
    messages: [{ role: 'user', content: message }],
  })

  const response = msg.content[0].type === 'text' ? msg.content[0].text : ''
  return Response.json({ response })
}
