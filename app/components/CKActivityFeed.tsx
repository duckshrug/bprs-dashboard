'use client'

import { Article, STAGES } from '../types'

const RESPONSE_CONFIG = {
  A: { icon: '&#10003;', label: 'APPROVED', color: '#22c55e', bg: 'bg-green-500/15' },
  E: { icon: '&#9998;', label: 'EDIT', color: '#f59e0b', bg: 'bg-amber-500/15' },
  H: { icon: '&#9208;', label: 'HOLD', color: '#ef4444', bg: 'bg-red-500/15' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function getStageName(num: number): string {
  return STAGES.find(s => s.num === num)?.name || `Stage ${num}`
}

function getStageColor(num: number): string {
  return STAGES.find(s => s.num === num)?.color || '#6b7280'
}

type ActivityEntry = {
  title: string
  type: 'ck' | 'move'
  at: string
  // CK fields
  response?: 'A' | 'E' | 'H'
  note?: string
  // Move fields
  from?: number
  to?: number
  by?: string
}

export default function CKActivityFeed({ articles, onClear }: { articles: Article[]; onClear?: () => void }) {
  const entries: ActivityEntry[] = []

  for (const a of articles) {
    // CK history
    if (a.ckHistory) {
      for (const h of a.ckHistory) {
        entries.push({ title: a.title, type: 'ck', response: h.response, note: h.note, at: h.at })
      }
    }
    // Stage history
    if (a.history) {
      for (const h of a.history) {
        entries.push({ title: a.title, type: 'move', from: h.from, to: h.to, by: h.by, note: h.note, at: h.at })
      }
    }
  }

  entries.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const recent = entries.slice(0, 20)

  if (recent.length === 0) return null

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-300">Activity</h2>
        {onClear && (
          <button
            onClick={onClear}
            className="text-[11px] text-gray-500 hover:text-red-400 transition px-2 py-1 rounded border border-white/5 hover:border-red-500/30"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="border border-white/10 rounded-lg divide-y divide-white/5">
        {recent.map((entry, i) => {
          if (entry.type === 'ck' && entry.response) {
            const cfg = RESPONSE_CONFIG[entry.response]
            return (
              <div key={i} className="flex items-start gap-3 px-4 py-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${cfg.bg}`}
                  style={{ color: cfg.color }}
                  dangerouslySetInnerHTML={{ __html: cfg.icon }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-white truncate">&ldquo;{entry.title.length > 50 ? entry.title.slice(0, 50) + '...' : entry.title}&rdquo;</span>
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{ backgroundColor: `${cfg.color}20`, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  {entry.note && (
                    <p className="text-xs text-gray-400 mt-0.5">&ldquo;{entry.note}&rdquo;</p>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 shrink-0">{timeAgo(entry.at)}</span>
              </div>
            )
          }

          // Stage move
          const toColor = getStageColor(entry.to!)
          return (
            <div key={i} className="flex items-start gap-3 px-4 py-3">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: `${toColor}20`, color: toColor }}
              >
                &rarr;
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-white truncate">&ldquo;{entry.title.length > 50 ? entry.title.slice(0, 50) + '...' : entry.title}&rdquo;</span>
                  <span className="text-[10px] text-gray-400">
                    {getStageName(entry.from!)} &rarr; {getStageName(entry.to!)}
                  </span>
                </div>
                {entry.by && (
                  <p className="text-xs text-gray-500 mt-0.5">by {entry.by}{entry.note ? ` — ${entry.note}` : ''}</p>
                )}
              </div>
              <span className="text-[11px] text-gray-500 shrink-0">{timeAgo(entry.at)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
