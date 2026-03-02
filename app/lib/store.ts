import { kv } from '@vercel/kv'
import seedData from '../../data/articles.json'
import { Article } from '../types'

const KV_KEY = 'bprs:articles'

export async function getArticles(): Promise<Article[]> {
  const stored = await kv.get<Article[]>(KV_KEY)
  if (stored) return stored
  // First access: seed from JSON
  const seed = JSON.parse(JSON.stringify(seedData)) as Article[]
  await kv.set(KV_KEY, seed)
  return seed
}

export async function getArticle(id: string): Promise<Article | undefined> {
  const articles = await getArticles()
  return articles.find(a => a.id === id)
}

export async function updateArticle(id: string, patch: Partial<Article>): Promise<Article | null> {
  const articles = await getArticles()
  const idx = articles.findIndex(a => a.id === id)
  if (idx === -1) return null
  articles[idx] = { ...articles[idx], ...patch }
  await kv.set(KV_KEY, articles)
  return articles[idx]
}
