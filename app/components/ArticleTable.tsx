'use client'

import { useState } from 'react'
import { Article, STAGES, STATUS_COLORS, getSEOScore, Stream, Batch, Stage, Status } from '../types'
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

export default function ArticleTable({ articles }: { articles: Article[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterStream, setFilterStream] = useState<string>('all')
  const [filterBatch, setFilterBatch] = useState<string>('all')
  const [filterStage, setFilterStage] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterOwner, setFilterOwner] = useState<string>('all')

  const filtered = articles.filter(a => {
    if (filterStream !== 'all' && a.stream !== filterStream) return false
    if (filterBatch !== 'all' && a.batch !== filterBatch) return false
    if (filterStage !== 'all' && a.stage !== Number(filterStage)) return false
    if (filterStatus !== 'all' && a.status !== filterStatus) return false
    if (filterOwner !== 'all' && a.owner !== filterOwner) return false
    return true
  })

  const owners = [...new Set(articles.map(a => a.owner))]

  return (
    <div className="mb-8">
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

      {/* Table */}
      <div className="border border-white/10 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400">Title</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">Stream</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400 hidden sm:table-cell">Batch</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Stage</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400">Status</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400 hidden md:table-cell">Owner</th>
              <th className="text-center px-3 py-2.5 text-xs font-medium text-gray-400 hidden lg:table-cell">CK</th>
              <th className="text-left px-3 py-2.5 text-xs font-medium text-gray-400 hidden lg:table-cell w-40">SEO</th>
            </tr>
          </thead>
            {filtered.map(article => {
              const expanded = expandedId === article.id
              const ed = getSEOScore(article.editorial)
              const tech = getSEOScore(article.technical)
              const aeo = getSEOScore(article.aeo)
              return (
                <tbody key={article.id}>
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
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-400 hidden md:table-cell">{STREAM_LABELS[article.stream]}</td>
                    <td className="px-3 py-3 text-center hidden sm:table-cell">
                      <span className="text-xs text-gray-400">{BATCH_LABELS[article.batch]}</span>
                    </td>
                    <td className="px-3 py-3 text-center"><StageBadge stage={article.stage} /></td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={article.status} /></td>
                    <td className="px-3 py-3 text-center text-xs text-gray-300 hidden md:table-cell">{article.owner}</td>
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
                          {/* Meta info */}
                          <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                            <span>Keyword: <span className="text-gray-200">{article.editorial.targetKeyword}</span></span>
                            {article.ckNote && <span>CK Note: <span className="text-amber-400">{article.ckNote}</span></span>}
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
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              )
            })}
        </table>
      </div>
    </div>
  )
}
