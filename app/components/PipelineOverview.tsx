'use client'

import { Article, STAGES } from '../types'

export default function PipelineOverview({ articles }: { articles: Article[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">Pipeline</h2>
      <div className="flex items-center gap-1">
        {STAGES.map((stage, i) => {
          const count = articles.filter(a => a.stage === stage.num).length
          return (
            <div key={stage.num} className="flex items-center flex-1 min-w-0">
              <div
                className="flex-1 rounded-lg p-4 border border-white/10 min-w-0"
                style={{ backgroundColor: `${stage.color}15` }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.num}
                  </div>
                  <span className="text-sm font-medium text-white truncate">{stage.name}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">{stage.owner}</div>
                <div className="mt-2">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: stage.color }}
                  >
                    {count}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">article{count !== 1 ? 's' : ''}</span>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <svg className="w-5 h-5 text-gray-600 shrink-0 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
