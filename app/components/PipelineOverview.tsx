'use client'

import { useEffect, useRef, useState } from 'react'
import { Article, STAGES } from '../types'

function AnimatedCount({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current === value) return
    const from = prevRef.current
    const to = value
    const start = performance.now()
    const duration = 300

    const animate = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(animate)
    }

    requestAnimationFrame(animate)
    prevRef.current = value
  }, [value])

  return (
    <span className="text-2xl font-bold transition-all" style={{ color }}>
      {display}
    </span>
  )
}

export default function PipelineOverview({ articles }: { articles: Article[] }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">Pipeline</h2>
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STAGES.map((stage, i) => {
          const count = articles.filter(a => a.stage === stage.num).length
          return (
            <div key={stage.num} className="flex items-center shrink-0">
              <div
                className="rounded-lg p-3 border border-white/10"
                style={{ backgroundColor: `${stage.color}15`, minWidth: '120px' }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.num}
                  </div>
                  <span className="text-xs font-medium text-white whitespace-nowrap">{stage.name}</span>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">{stage.owner}</div>
                <div className="mt-1.5">
                  <AnimatedCount value={count} color={stage.color} />
                  <span className="text-xs text-gray-500 ml-1">article{count !== 1 ? 's' : ''}</span>
                </div>
              </div>
              {i < STAGES.length - 1 && (
                <svg className="w-4 h-4 text-gray-600 shrink-0 mx-0.5" fill="currentColor" viewBox="0 0 20 20">
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
