'use client'

import { Article } from '../types'

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

export default function CKActivityFeed({ articles }: { articles: Article[] }) {
  const entries: { title: string; response: 'A' | 'E' | 'H'; note: string; at: string }[] = []

  for (const a of articles) {
    if (a.ckHistory) {
      for (const h of a.ckHistory) {
        entries.push({ title: a.title, response: h.response, note: h.note, at: h.at })
      }
    }
  }

  entries.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
  const recent = entries.slice(0, 10)

  if (recent.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-300 mb-3">CK Activity</h2>
      <div className="border border-white/10 rounded-lg divide-y divide-white/5">
        {recent.map((entry, i) => {
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
        })}
      </div>
    </div>
  )
}
