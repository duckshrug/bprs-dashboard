import { kv } from '@vercel/kv'
import { Article } from '../../../types'

const KV_KEY = 'bprs:articles'

export async function POST() {
  const articles = await kv.get<Article[]>(KV_KEY)
  if (!articles) return Response.json({ ok: false, error: 'No articles found' }, { status: 404 })

  const cleared = articles.map(a => ({
    ...a,
    ckHistory: [],
    history: [],
    ckResponse: null,
    ckNote: '',
    ckRespondedAt: null,
  }))

  await kv.set(KV_KEY, cleared)
  return Response.json({ ok: true, count: cleared.length })
}
