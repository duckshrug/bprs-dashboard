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
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-8 rounded-full bg-blue-500" />
              <h1 className="text-2xl font-bold text-white">BPRS Publishing Dashboard</h1>
            </div>
            <p className="text-sm text-gray-500 ml-5">
              Blueprint Resolution Services &middot; Content Pipeline Tracker
            </p>
          </div>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">&larr; Home</a>
        </div>

        <HoldAlert articles={articles} />
        <CKActivityFeed articles={articles} />
        <PipelineOverview articles={articles} />
        <ArticleTable articles={articles} onRefresh={fetchArticles} />
        <BatchSummary articles={articles} />
      </div>
    </main>
  )
}
