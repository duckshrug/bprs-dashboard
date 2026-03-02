import { kv } from '@vercel/kv'
import seedData from '../../../../data/articles.json'
import { Article } from '../../../types'

const KV_KEY = 'bprs:articles'

export async function POST() {
  const seed = JSON.parse(JSON.stringify(seedData)) as Article[]
  await kv.set(KV_KEY, seed)
  return Response.json({ ok: true, count: seed.length })
}
