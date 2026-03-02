'use client'

import { Article } from '../types'

export default function CKApprovalPanel({ articles }: { articles: Article[] }) {
  const pendingCK = articles.filter(a => a.stage === 3 && !a.ckResponse)

  if (pendingCK.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-300 mb-4">
        CK Approval Queue
        <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
          {pendingCK.length} pending
        </span>
      </h2>

      <div className="space-y-3">
        {pendingCK.map(article => (
          <div key={article.id} className="border border-white/10 rounded-lg p-5 bg-white/[0.02]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-white font-medium">{article.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {article.editorial.targetKeyword} &middot; {article.stream} &middot; {article.batch}
                </p>
              </div>
              {article.googleDocUrl && (
                <a
                  href={article.googleDocUrl}
                  target="_blank"
                  rel="noopener"
                  className="shrink-0 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded text-xs font-medium hover:bg-blue-500/30 transition"
                >
                  Open Doc
                </a>
              )}
            </div>

            {/* Response buttons — visual only in v1 */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 font-bold text-lg hover:bg-green-500/25 transition cursor-default">
                A
                <span className="block text-[10px] font-normal text-green-400/70">Approved</span>
              </button>
              <button className="flex-1 py-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-lg hover:bg-amber-500/25 transition cursor-default">
                E
                <span className="block text-[10px] font-normal text-amber-400/70">Edit</span>
              </button>
              <button className="flex-1 py-3 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 font-bold text-lg hover:bg-red-500/25 transition cursor-default">
                H
                <span className="block text-[10px] font-normal text-red-400/70">Hold</span>
              </button>
            </div>

            {/* CK Rules reference */}
            <div className="mt-4 p-3 bg-white/[0.02] rounded border border-white/5">
              <p className="text-[10px] text-gray-500 font-medium mb-1">CK CAN:</p>
              <p className="text-[10px] text-gray-400">Approve as-is &middot; Change tone &middot; Remove risky claims &middot; Add personal story &middot; Swap CTA</p>
              <p className="text-[10px] text-gray-500 font-medium mt-2 mb-1">CK SHOULD NOT:</p>
              <p className="text-[10px] text-gray-400">Rewrite entire article &middot; Restructure content &middot; Edit formatting</p>
              <p className="text-[10px] text-gray-500 mt-2">Big changes &rarr; returns to Stage 2 (MK Edit)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
