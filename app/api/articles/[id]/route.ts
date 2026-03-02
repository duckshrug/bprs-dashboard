import { getArticle, updateArticle } from '../../../lib/store'
import { Article, StageHistoryEntry } from '../../../types'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const article = await getArticle(id)
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }
  return Response.json(article)
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json() as Partial<Article> & { _historyNote?: string }

  const article = await getArticle(id)
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  // Build stage history entry if stage is changing
  let history = article.history || []
  if (body.stage && body.stage !== article.stage) {
    const entry: StageHistoryEntry = {
      from: article.stage,
      to: body.stage,
      by: body.owner || article.owner,
      at: body.updatedAt || new Date().toISOString(),
      note: body._historyNote || '',
    }
    history = [...history, entry]
  }

  // Remove internal field before persisting
  const { _historyNote, ...patch } = body

  const updated = await updateArticle(id, {
    ...patch,
    history,
    updatedAt: patch.updatedAt || new Date().toISOString(),
  })

  return Response.json(updated)
}
