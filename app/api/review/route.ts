import { getArticle, updateArticle } from '../../lib/store'
import { CKHistoryEntry, Stage, StageHistoryEntry, Status } from '../../types'

export async function POST(request: Request) {
  const body = await request.json()
  const { articleId, response, note } = body as {
    articleId: string
    response: string
    note?: string
  }

  if (!articleId || !response) {
    return Response.json({ error: 'articleId and response required' }, { status: 400 })
  }

  if (!['A', 'E', 'H'].includes(response)) {
    return Response.json({ error: 'response must be A, E, or H' }, { status: 400 })
  }

  if (response === 'E' && (!note || !note.trim())) {
    return Response.json({ error: 'Note required for Edit response' }, { status: 400 })
  }

  const article = await getArticle(articleId)
  if (!article) {
    return Response.json({ error: 'Article not found' }, { status: 404 })
  }

  const now = new Date().toISOString()
  const historyEntry: CKHistoryEntry = {
    response: response as 'A' | 'E' | 'H',
    note: note || '',
    at: now,
  }
  const ckHistory = [...(article.ckHistory || []), historyEntry]

  let stagePatch: { stage?: Stage; status: Status; owner?: string }
  if (response === 'A') {
    stagePatch = { stage: 4, status: 'approved', owner: 'Qua' }
  } else if (response === 'E') {
    stagePatch = { stage: 2, status: 'edit-requested', owner: 'MK' }
  } else {
    stagePatch = { status: 'on-hold' }
  }

  // Build stage history entry
  const stageHistory = article.history || []
  const newStage = stagePatch.stage || article.stage
  let stageHistoryUpdate = stageHistory
  if (newStage !== article.stage) {
    const stageEntry: StageHistoryEntry = {
      from: article.stage,
      to: newStage,
      by: 'CK',
      at: now,
      note: note || '',
    }
    stageHistoryUpdate = [...stageHistory, stageEntry]
  }

  const updated = await updateArticle(articleId, {
    ckResponse: response as 'A' | 'E' | 'H',
    ckNote: note || '',
    ckRespondedAt: now,
    ckHistory,
    history: stageHistoryUpdate,
    updatedAt: now,
    ...stagePatch,
  })

  return Response.json(updated)
}
