'use client'

import { Article } from '../types'

export default function HoldAlert({ articles }: { articles: Article[] }) {
  const held = articles.filter(a => a.status === 'on-hold')
  if (held.length === 0) return null

  return (
    <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-amber-400 text-lg">&#9888;</span>
        <span className="text-amber-400 font-semibold text-sm">
          {held.length} article{held.length !== 1 ? 's' : ''} on hold
        </span>
      </div>
      <div className="space-y-2">
        {held.map(a => (
          <div key={a.id} className="text-sm">
            <span className="text-white font-medium">&ldquo;{a.title}&rdquo;</span>
            {a.ckNote && (
              <span className="text-amber-300/70 ml-2">&mdash; CK: &ldquo;{a.ckNote}&rdquo;</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
