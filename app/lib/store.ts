import seedData from '../../data/articles.json'
import { Article } from '../types'

let articles: Article[] | null = null

function init() {
  if (!articles) {
    articles = JSON.parse(JSON.stringify(seedData)) as Article[]
  }
}

export function getArticles(): Article[] {
  init()
  return articles!
}

export function getArticle(id: string): Article | undefined {
  init()
  return articles!.find(a => a.id === id)
}

export function updateArticle(id: string, patch: Partial<Article>): Article | null {
  init()
  const idx = articles!.findIndex(a => a.id === id)
  if (idx === -1) return null
  articles![idx] = { ...articles![idx], ...patch }
  return articles![idx]
}
