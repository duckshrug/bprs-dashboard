'use client'

import { Article } from '../types'

const BATCHES = [
  { id: 'batch-1', name: 'Batch 1: Highest Intent', description: 'Core service pages — OIC, tax debt, IRS resolution', color: '#22c55e' },
  { id: 'batch-2', name: 'Batch 2: Competitive', description: 'vs-pages — Blueprint vs Anthem, Precision, Larson', color: '#3b82f6' },
  { id: 'batch-3', name: 'Batch 3: Long Tail', description: 'Educational / TAXWIKI — bookkeeping, penalties, IRS letters', color: '#a855f7' },
]

export default function BatchSummary({ articles }: { articles: Article[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">Batches</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {BATCHES.map(batch => {
          const batchArticles = articles.filter(a => a.batch === batch.id)
          const total = batchArticles.length
          const published = batchArticles.filter(a => a.status === 'published').length
          const pct = total > 0 ? Math.round((published / total) * 100) : 0
          const inStage = new Map<number, number>()
          batchArticles.forEach(a => inStage.set(a.stage, (inStage.get(a.stage) || 0) + 1))

          return (
            <div
              key={batch.id}
              className="rounded-lg border border-white/10 p-5"
              style={{ backgroundColor: `${batch.color}08` }}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-sm font-semibold text-white">{batch.name}</h3>
                <span className="text-2xl font-bold" style={{ color: batch.color }}>{total}</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">{batch.description}</p>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: batch.color }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{published}/{total} published</span>
                <span>{pct}%</span>
              </div>
              {total > 0 && (
                <div className="flex gap-1 mt-3">
                  {[1, 2, 3, 4, 5, 6].map(stage => {
                    const count = inStage.get(stage) || 0
                    if (count === 0) return null
                    const stageColors = ['', '#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899']
                    return (
                      <span
                        key={stage}
                        className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                        style={{ backgroundColor: `${stageColors[stage]}30`, color: stageColors[stage] }}
                        title={`Stage ${stage}`}
                      >
                        S{stage}: {count}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
