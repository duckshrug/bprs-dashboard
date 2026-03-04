'use client'

import { useState, useEffect, useCallback } from 'react'
import { Article } from '../types'
import PipelineOverview from '../components/PipelineOverview'
import ArticleTable from '../components/ArticleTable'
import BatchSummary from '../components/BatchSummary'
import CKActivityFeed from '../components/CKActivityFeed'
import HoldAlert from '../components/HoldAlert'

export default function DashboardPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const fetchArticles = useCallback(async () => {
    const r = await fetch('/api/articles')
    const data = await r.json()
    setArticles(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading dashboard...</div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-center gap-5">
          <div>
            <h1 className="text-2xl font-bold text-white leading-tight">BPRS Content<br />Pipeline Tracker</h1>
          </div>
          <div className="w-20 h-20 rounded-full border-2 border-blue-500/40 overflow-hidden shrink-0">
            <img
              src="/blueper-logo.png"
              alt="Blueper"
              className="w-full h-[160%] object-cover object-top"
            />
          </div>
        </div>

        <HoldAlert articles={articles} />
        <PipelineOverview articles={articles} />
        <CKActivityFeed articles={articles} onClear={async () => {
          if (!confirm('Clear all activity? Articles stay at their current stages.')) return
          await fetch('/api/articles/clear-activity', { method: 'POST' })
          fetchArticles()
        }} />
        <ArticleTable articles={articles} onRefresh={fetchArticles} />
        <BatchSummary articles={articles} />
      </div>
    </main>
  )
}
