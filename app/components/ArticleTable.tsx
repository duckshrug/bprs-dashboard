'use client'

import { useState } from 'react'
import { Article, STAGES, STAGE_ACTIONS, STATUS_COLORS, getSEOScore, getStageName, Stream, Batch, Stage, Status, StageAction } from '../types'
import SEOBar from './SEOBar'
import SEOPanel from './SEOPanel'

const STREAM_LABELS: Record<Stream, string> = {
  'rewrites-30': 'Rewrites (30)',
  'rewrites-3': 'Rewrites (3)',
  'new-batch-1': 'New Batch 1',
  'future': 'Future',
}

const BATCH_LABELS: Record<Batch, string> = {
  'batch-1': 'Batch 1',
  'batch-2': 'Batch 2',
  'batch-3': 'Batch 3',
  'none': 'None',
}

function StageBadge({ stage }: { stage: number }) {
  const s = STAGES.find(st => st.num === stage)
  if (!s) return null
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: `${s.color}30`, color: s.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.color }} />
      {s.num}
    </span>
  )
}

function StatusBadge({ status }: { status: Status }) {
  const color = STATUS_COLORS[status]
  return (
    <span
      className="px-2 py-0.5 rounded text-[11px] font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {status}
    </span>
  )
}

function CKBadge({ response }: { response: 'A' | 'E' | 'H' | null }) {
  if (!response) return <span className="text-gray-600 text-xs">--</span>
  const map = { A: { color: '#22c55e', label: 'Approved' }, E: { color: '#f59e0b', label: 'Edit' }, H: { color: '#ef4444', label: 'Hold' } }
  const { color, label } = map[response]
  return (
    <span className="px-2 py-0.5 rounded text-[11px] font-bold" style={{ backgroundColor: `${color}20`, color }}>
      {label}
    </span>
  )
}

function SEOGateWarning({ article }: { article: Article }) {
  if (article.stage !== 4) return null
  const ed = getSEOScore(article.editorial)
  const tech = getSEOScore(article.technical)
  const aeo = getSEOScore(article.aeo)
  const edPct = ed.total > 0 ? (ed.done / ed.total) * 100 : 0
  const techPct = tech.total > 0 ? (tech.done / tech.total) * 100 : 0
  const aeoPct = aeo.total > 0 ? (aeo.done / aeo.total) * 100 : 0
  if (edPct >= 80 && techPct >= 80 && aeoPct >= 80) return null
  return (
    <span className="ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px] font-medium" title="SEO score below 80% — cannot advance to Publish">
      SEO GATE
    </span>
  )
}

// --- Confirmation Dialog ---
function ConfirmDialog({ title, message, onCancel, onConfirm }: {
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onCancel}>
      <div className="bg-[#1a2332] border border-white/10 rounded-lg p-6 max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded text-sm text-gray-300 bg-white/5 hover:bg-white/10 transition">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded text-sm text-white bg-blue-600 hover:bg-blue-500 transition font-medium">Confirm</button>
        </div>
      </div>
    </div>
  )
}

// --- Toast ---
function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useState(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  })
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg text-sm font-medium animate-fade-in">
      {message}
    </div>
  )
}

// --- CK Approval Panel (inline for Stage 3) ---
function CKApprovalInline({ article, onAction }: {
  article: Article
  onAction: (response: 'A' | 'E' | 'H', note: string) => void
}) {
  const [selected, setSelected] = useState<'A' | 'E' | 'H' | null>(null)
  const [note, setNote] = useState('')
  const [noteError, setNoteError] = useState(false)

  const handleSubmit = () => {
    if (selected === 'E' && !note.trim()) {
      setNoteError(true)
      return
    }
    onAction(selected!, note)
  }

  return (
    <div className="border border-white/10 rounded-lg p-4 bg-white/[0.02]">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">CK Approval</div>

      {article.googleDocUrl && (
        <a href={article.googleDocUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-blue-400 hover:underline text-sm mb-4">
          View in Google Docs
        </a>
      )}

      <div className="flex gap-3 mb-4">
        <button
          onClick={() => { setSelected('A'); setNoteError(false) }}
          className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition ${selected === 'A' ? 'bg-green-500 ring-2 ring-green-300' : 'bg-green-600 hover:bg-green-500'}`}
          style={{ minHeight: '48px' }}
        >
          A<span className="block text-xs font-normal mt-0.5">Approve</span>
        </button>
        <button
          onClick={() => { setSelected('E'); setNoteError(false) }}
          className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition ${selected === 'E' ? 'bg-amber-500 ring-2 ring-amber-300' : 'bg-amber-600 hover:bg-amber-500'}`}
          style={{ minHeight: '48px' }}
        >
          E<span className="block text-xs font-normal mt-0.5">Edit</span>
        </button>
        <button
          onClick={() => { setSelected('H'); setNoteError(false) }}
          className={`flex-1 py-3 rounded-lg font-bold text-white text-lg transition ${selected === 'H' ? 'bg-red-500 ring-2 ring-red-300' : 'bg-red-600 hover:bg-red-500'}`}
          style={{ minHeight: '48px' }}
        >
          H<span className="block text-xs font-normal mt-0.5">Hold</span>
        </button>
      </div>

      {(selected === 'E' || selected === 'H') && (
        <div className="mb-4">
          <label className="block text-xs text-gray-400 mb-1">
            Edit note {selected === 'E' ? '(required)' : '(optional)'}:
          </label>
          <textarea
            value={note}
            onChange={e => { setNote(e.target.value); setNoteError(false) }}
            className={`w-full bg-white/5 border rounded px-3 py-2 text-sm text-gray-200 ${noteError ? 'border-red-500' : 'border-white/10'}`}
            rows={2}
            placeholder="Describe what needs changing..."
          />
          {noteError && <p className="text-red-400 text-xs mt-1">Edit note required.</p>}
        </div>
      )}

      {selected && (
        <button onClick={handleSubmit} className="w-full py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition">
          Submit
        </button>
      )}

      <details className="mt-4">
        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">CK Rules</summary>
        <div className="mt-2 text-xs text-gray-500 space-y-1 pl-2 border-l border-white/10">
          <p className="text-green-400/70">Approve as-is</p>
          <p className="text-green-400/70">Change tone</p>
          <p className="text-green-400/70">Remove risky claims</p>
          <p className="text-green-400/70">Add personal story line</p>
          <p className="text-green-400/70">Swap CTA emphasis</p>
          <p className="text-red-400/70">Do NOT rewrite entire article</p>
          <p className="text-red-400/70">Do NOT restructure content</p>
          <p className="text-red-400/70">Do NOT edit formatting</p>
          <p className="text-gray-400 italic">Big changes? Send back to editor.</p>
          <p className="text-gray-400 mt-2">Target: 5-12 minutes per article</p>
        </div>
      </details>
    </div>
  )
}

// --- Stage Actions (non-CK stages) ---
function StageActions({ article, onAdvance }: {
  article: Article
  onAdvance: (action: StageAction) => void
}) {
  const actions = STAGE_ACTIONS[article.stage]
  if (!actions || actions.length === 0) return null

  return (
    <div className="border-t border-white/10 pt-3 mt-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Actions</div>
      <div className="flex gap-2">
        {actions.map(action => (
          <button
            key={action.label}
            onClick={() => onAdvance(action)}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition"
          >
            {action.label} &rarr;
          </button>
        ))}
      </div>
    </div>
  )
}

// --- Stage History Timeline ---
function StageTimeline({ article }: { article: Article }) {
  const history = article.history
  if (!history || history.length === 0) return null

  return (
    <div className="border-t border-white/10 pt-3 mt-3">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">History</div>
      <div className="space-y-2">
        {history.map((entry, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0" />
            <div>
              <span className="text-gray-400">
                Stage {entry.from} &rarr; {entry.to}
              </span>
              <span className="text-gray-500 ml-2">by {entry.by}</span>
              <span className="text-gray-600 ml-2">{new Date(entry.at).toLocaleDateString()}</span>
              {entry.note && <span className="text-amber-400 ml-2">&mdash; {entry.note}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Edit-Requested Note Strip ---
function EditRequestedStrip({ article }: { article: Article }) {
  if (article.status !== 'edit-requested' || !article.ckNote) return null
  return (
    <div className="bg-amber-500/15 border border-amber-500/30 rounded px-3 py-2 text-sm">
      <span className="text-amber-400 font-medium text-xs uppercase">Edit Requested: </span>
      <span className="text-amber-300">{article.ckNote}</span>
    </div>
  )
}

// --- Main Component ---
export default function ArticleTable({ articles, onRefresh }: { articles: Article[]; onRefresh?: () => void }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStream, setFilterStream] = useState<string>('all')
  const [filterBatch, setFilterBatch] = useState<string>('all')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterOwner, setFilterOwner] = useState<string>('all')
  const [confirmAction, setConfirmAction] = useState<{ article: Article; action: StageAction } | null>(null)
  const [confirmCK, setConfirmCK] = useState<{ article: Article; response: 'A' | 'E' | 'H'; note: string } | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [acting, setActing] = useState(false)

  const filtered = articles
    .filter(a => {
      if (filterStream !== 'all' && a.stream !== filterStream) return false
      if (filterBatch !== 'all' && a.batch !== filterBatch) return false
      if (filterStage !== 'all' && a.stage !== Number(filterStage)) return false
      if (filterStatus !== 'all' && a.status !== filterStatus) return false
      if (filterOwner !== 'all' && a.owner !== filterOwner) return false
      return true
    })
    // Sort: on-hold articles go to bottom within their stage
    .sort((a, b) => {
      if (a.stage !== b.stage) return a.stage - b.stage
      if (a.status === 'on-hold' && b.status !== 'on-hold') return 1
      if (a.status !== 'on-hold' && b.status === 'on-hold') return -1
      return 0
    })

  const owners = [...new Set(articles.map(a => a.owner))]

  const handleStageAdvance = async (article: Article, action: StageAction) => {
    setActing(true)
    try {
      await fetch(`/api/articles/${article.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: action.nextStage,
          status: action.newStatus,
          owner: action.newOwner,
          updatedAt: new Date().toISOString(),
        }),
      })
      setToast(`Article moved to ${getStageName(action.nextStage)}`)
      onRefresh?.()
    } finally {
      setActing(false)
      setConfirmAction(null)
    }
  }

  const handleCKAction = async (article: Article, response: 'A' | 'E' | 'H', note: string) => {
    setActing(true)
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id, response, note }),
      })
      const labels = { A: 'Pre-Publish Prep', E: 'MK Edit (edit requested)', H: 'Hold' }
      setToast(`Article moved to ${labels[response]}`)
      onRefresh?.()
    } finally {
      setActing(false)
      setConfirmCK(null)
    }
  }

  return (
    <div className="mb-8">
      {/* Confirmation dialog */}
      {confirmAction && (
        <ConfirmDialog
          title="Confirm Stage Change"
          message={`Move "${confirmAction.article.title}" to ${getStageName(confirmAction.action.nextStage)}?`}
          onCancel={() => setConfirmAction(null)}
          onConfirm={() => handleStageAdvance(confirmAction.article, confirmAction.action)}
        />
      )}
      {confirmCK && (
        <ConfirmDialog
          title="Confirm CK Decision"
          message={`${confirmCK.response === 'A' ? 'Approve' : confirmCK.response === 'E' ? 'Request edit for' : 'Hold'} "${confirmCK.article.title}"?`}
          onCancel={() => setConfirmCK(null)}
          onConfirm={() => handleCKAction(confirmCK.article, confirmCK.response, confirmCK.note)}
        />
      )}
      {toast && <Toast message={toast} onDone={() => setToast(null)} />}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-300">Articles</h2>
        <span className="text-sm text-gray-500">{filtered.length} of {articles.length}</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <select value={filterStream} onChange={e => setFilterStream(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-300">
          <option value="all">All Streams</option>
          {Object.entries(STREAM_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterBatch} onChange={e => setFilterBatch(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-300">
          <option value="all">All Batches</option>
          {Object.entries(BATCH_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={filterStage} onChange={e => setFilterStage(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-300">
          <option value="all">All Stages</option>
          {STAGES.map(s => <option key={s.num} value={s.num}>{s.num}. {s.name}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-300">
          <option value="all">All Status</option>
          {(['in-progress', 'ready', 'approved', 'edit-requested', 'on-hold', 'published'] as const).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-gray-300">
          <option value="all">All Owners</option>
          {owners.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>

      {/* Desktop Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden hidden md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Title</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-400">Stream</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Batch</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Stage</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Status</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Owner</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400 hidden lg:table-cell">CK</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-400 hidden lg:table-cell w-40">SEO</th>
            </tr>
          </thead>
          {filtered.map(article => {
            const expanded = expandedId === article.id
            const ed = getSEOScore(article.editorial)
            const tech = getSEOScore(article.technical)
            const aeo = getSEOScore(article.aeo)
            const isOnHold = article.status === 'on-hold'
            return (
              <tbody key={article.id} style={isOnHold ? { opacity: 0.6 } : undefined}>
                <tr
                  className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition-colors"
                  onClick={() => setExpandedId(expanded ? null : article.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <svg className={`w-3 h-3 mr-2 text-gray-500 transition-transform ${expanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-200 text-sm">{article.title}</span>
                      <SEOGateWarning article={article} />
                      {isOnHold && (
                        <span className="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold uppercase">Hold</span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-400">{STREAM_LABELS[article.stream]}</td>
                  <td className="px-3 py-3 text-center">
                    <span className="text-xs text-gray-400">{BATCH_LABELS[article.batch]}</span>
                  </td>
                  <td className="px-3 py-3 text-center"><StageBadge stage={article.stage} /></td>
                  <td className="px-3 py-3 text-center"><StatusBadge status={article.status} /></td>
                  <td className="px-3 py-3 text-center text-xs text-gray-300">{article.owner}</td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell"><CKBadge response={article.ckResponse} /></td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <div className="space-y-1">
                      <SEOBar done={ed.done} total={ed.total} label="Ed" color="#22c55e" />
                      <SEOBar done={tech.done} total={tech.total} label="Tech" color="#3b82f6" />
                      <SEOBar done={aeo.done} total={aeo.total} label="AEO" color="#a855f7" />
                    </div>
                  </td>
                </tr>
                {expanded && (
                  <tr className="border-b border-white/5">
                    <td colSpan={8} className="px-4 py-4 bg-white/[0.01]">
                      <div className="space-y-4">
                        {/* Edit-requested note strip */}
                        <EditRequestedStrip article={article} />

                        {/* Meta info */}
                        <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                          <span>Keyword: <span className="text-gray-200">{article.editorial.targetKeyword}</span></span>
                          {article.ckNote && article.status !== 'edit-requested' && (
                            <span>CK Note: <span className="text-amber-400">{article.ckNote}</span></span>
                          )}
                          {article.googleDocUrl && (
                            <a href={article.googleDocUrl} target="_blank" rel="noopener" className="text-blue-400 hover:underline">Google Doc</a>
                          )}
                          {article.wordpressUrl && (
                            <a href={article.wordpressUrl} target="_blank" rel="noopener" className="text-purple-400 hover:underline">WordPress</a>
                          )}
                          <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                        </div>

                        {/* SEO Panel */}
                        <SEOPanel editorial={article.editorial} technical={article.technical} aeo={article.aeo} />

                        {/* Stage 3: CK Approval Panel */}
                        {article.stage === 3 && article.status !== 'on-hold' && (
                          <CKApprovalInline
                            article={article}
                            onAction={(response, note) => setConfirmCK({ article, response, note })}
                          />
                        )}

                        {/* Other stages: Action buttons */}
                        {article.stage !== 3 && (
                          <StageActions
                            article={article}
                            onAdvance={(action) => setConfirmAction({ article, action })}
                          />
                        )}

                        {/* Stage History Timeline */}
                        <StageTimeline article={article} />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            )
          })}
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {filtered.map(article => {
          const expanded = expandedId === article.id
          const ed = getSEOScore(article.editorial)
          const tech = getSEOScore(article.technical)
          const aeo = getSEOScore(article.aeo)
          const isOnHold = article.status === 'on-hold'
          return (
            <div
              key={article.id}
              className="border border-white/10 rounded-lg overflow-hidden"
              style={isOnHold ? { opacity: 0.6 } : undefined}
            >
              <div
                className="p-3 cursor-pointer hover:bg-white/[0.03] transition-colors"
                onClick={() => setExpandedId(expanded ? null : article.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-gray-200 text-sm font-medium flex-1 pr-2">{article.title}</span>
                  <svg className={`w-3 h-3 text-gray-500 transition-transform shrink-0 mt-1 ${expanded ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StageBadge stage={article.stage} />
                  <StatusBadge status={article.status} />
                  <span className="text-xs text-gray-400">{article.owner}</span>
                  <CKBadge response={article.ckResponse} />
                  {isOnHold && (
                    <span className="px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold uppercase">Hold</span>
                  )}
                  <SEOGateWarning article={article} />
                </div>
                {/* Mini SEO bars */}
                <div className="mt-2 space-y-1">
                  <SEOBar done={ed.done} total={ed.total} label="Ed" color="#22c55e" />
                  <SEOBar done={tech.done} total={tech.total} label="Tech" color="#3b82f6" />
                  <SEOBar done={aeo.done} total={aeo.total} label="AEO" color="#a855f7" />
                </div>
              </div>

              {expanded && (
                <div className="px-3 pb-3 border-t border-white/5 pt-3 space-y-4">
                  <EditRequestedStrip article={article} />

                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    <span>Keyword: <span className="text-gray-200">{article.editorial.targetKeyword}</span></span>
                    <span>Batch: <span className="text-gray-200">{BATCH_LABELS[article.batch]}</span></span>
                    <span>Updated: {new Date(article.updatedAt).toLocaleDateString()}</span>
                  </div>

                  <SEOPanel editorial={article.editorial} technical={article.technical} aeo={article.aeo} />

                  {article.stage === 3 && article.status !== 'on-hold' && (
                    <CKApprovalInline
                      article={article}
                      onAction={(response, note) => setConfirmCK({ article, response, note })}
                    />
                  )}

                  {article.stage !== 3 && (
                    <StageActions
                      article={article}
                      onAdvance={(action) => setConfirmAction({ article, action })}
                    />
                  )}

                  <StageTimeline article={article} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
