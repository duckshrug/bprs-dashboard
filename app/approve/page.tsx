'use client'

import { useState, useEffect, useRef } from 'react'
import { Article } from '../types'

type Response = 'A' | 'E' | 'H'

export default function ApprovePage() {
  const [queue, setQueue] = useState<Article[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [rulesOpen, setRulesOpen] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch('/api/articles')
      .then(r => r.json())
      .then((data: Article[]) => {
        const pending = data
          .filter(a => a.stage === 3 && !a.ckResponse)
          .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime())
        setQueue(pending)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if ((selectedResponse === 'E' || selectedResponse === 'H') && noteRef.current) {
      noteRef.current.focus()
    }
  }, [selectedResponse])

  const article = queue[currentIndex]
  const remaining = queue.length - currentIndex
  const isLast = remaining === 1
  const canSubmit = selectedResponse && (selectedResponse !== 'E' || note.trim().length > 0) && !submitting

  async function handleSubmit() {
    if (!canSubmit || !article) return
    setSubmitting(true)

    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: article.id,
          response: selectedResponse,
          note: note.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.error || 'Something went wrong')
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setSelectedResponse(null)
        setNote('')
        setSubmitting(false)
        setCurrentIndex(prev => prev + 1)
      }, 800)
    } catch {
      alert('Network error — try again')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-gray-500 text-sm">Loading...</div>
      </main>
    )
  }

  // Empty state
  if (!article || currentIndex >= queue.length) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">All caught up.</h2>
          <p className="text-sm text-gray-500 mb-6">
            No articles waiting for review right now.<br />
            We&rsquo;ll send you a heads-up when the next batch is ready.
          </p>
          <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition">&larr; Back to home</a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[500px]">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-white">Blueprint Content Review</h1>
        </div>

        {/* Progress */}
        <div className="text-center mb-6">
          {isLast ? (
            <span className="text-sm text-green-400 font-medium">Last one!</span>
          ) : (
            <span className="text-sm text-gray-500">
              Article {currentIndex + 1} of {queue.length}
              <span className="mx-2">&middot;</span>
              {remaining - 1} more waiting
            </span>
          )}
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6">
          {/* Submitted flash */}
          {submitted && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl z-10">
              <div className="text-green-400 font-bold text-lg">Submitted!</div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-xl font-bold text-white mb-2 leading-tight">
            {article.title}
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            {article.editorial.targetKeyword} &middot; {article.batch}
          </p>

          {/* Google Doc link */}
          {article.googleDocUrl ? (
            <a
              href={article.googleDocUrl}
              target="_blank"
              rel="noopener"
              className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-blue-500/15 border border-blue-500/30 rounded-xl text-blue-400 font-medium text-sm hover:bg-blue-500/25 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Article in Google Docs
            </a>
          ) : (
            <div className="w-full py-3 mb-6 bg-white/[0.02] border border-white/5 rounded-xl text-center text-gray-600 text-sm">
              No Google Doc link yet
            </div>
          )}

          {/* A / E / H Buttons */}
          <div className="flex gap-3 mb-4">
            {([
              { key: 'A' as Response, label: 'Approve', color: '#22c55e', bgIdle: 'bg-green-500/15 border-green-500/30 text-green-400', bgActive: 'bg-green-500 border-green-500 text-white' },
              { key: 'E' as Response, label: 'Edit', color: '#f59e0b', bgIdle: 'bg-amber-500/15 border-amber-500/30 text-amber-400', bgActive: 'bg-amber-500 border-amber-500 text-white' },
              { key: 'H' as Response, label: 'Hold', color: '#ef4444', bgIdle: 'bg-red-500/15 border-red-500/30 text-red-400', bgActive: 'bg-red-500 border-red-500 text-white' },
            ]).map(btn => {
              const active = selectedResponse === btn.key
              return (
                <button
                  key={btn.key}
                  onClick={() => {
                    setSelectedResponse(btn.key)
                    if (btn.key === 'A') setNote('')
                  }}
                  className={`flex-1 py-4 rounded-xl border font-bold text-xl transition ${active ? btn.bgActive : btn.bgIdle} hover:opacity-90`}
                  style={{ minHeight: '60px' }}
                >
                  {btn.key}
                  <span className="block text-[11px] font-normal opacity-80">{btn.label}</span>
                </button>
              )
            })}
          </div>

          {/* Note field */}
          {(selectedResponse === 'E' || selectedResponse === 'H') && (
            <div className="mb-4">
              <label className="text-xs text-gray-400 mb-1.5 block">
                {selectedResponse === 'E' ? (
                  <span>Edit note <span className="text-red-400">*required</span></span>
                ) : (
                  <span>Note <span className="text-gray-600">(optional)</span></span>
                )}
              </label>
              <textarea
                ref={noteRef}
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={selectedResponse === 'E' ? 'What needs to change?' : 'Any context for the team?'}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-blue-500/50"
                rows={2}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) e.preventDefault()
                }}
              />
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm transition ${
              canSubmit
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        {/* CK Rules */}
        <div className="mt-6">
          <button
            onClick={() => setRulesOpen(!rulesOpen)}
            className="text-xs text-gray-600 hover:text-gray-400 transition flex items-center gap-1 mx-auto"
          >
            <svg className={`w-3 h-3 transition ${rulesOpen ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
            </svg>
            Review guidelines
          </button>
          {rulesOpen && (
            <div className="mt-3 p-4 bg-white/[0.02] border border-white/5 rounded-lg text-xs text-gray-400 max-w-sm mx-auto">
              <p className="text-gray-500 font-medium mb-1">Your decisions:</p>
              <p>Approve as-is &middot; Change tone &middot; Remove risky claims &middot; Add personal story &middot; Swap CTA emphasis</p>
              <p className="text-gray-500 font-medium mt-3 mb-1">Send back for revision if you want:</p>
              <p>Full rewrite &middot; Restructured content &middot; Formatting changes</p>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-xs text-gray-600 hover:text-gray-400 transition">&larr; Back</a>
        </div>
      </div>
    </main>
  )
}
