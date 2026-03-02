import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-3 h-3 rounded-full bg-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Blueprint Content Pipeline</h1>
          <p className="text-sm text-gray-500">BPRS Publishing Workflow</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/approve"
            className="block p-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white group-hover:text-red-400 transition">
                  Review Content
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Review articles awaiting CK approval
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-red-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/dashboard"
            className="block p-6 rounded-xl border border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">
                  Manage Pipeline
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Full pipeline dashboard &amp; SEO tracking
                </p>
              </div>
              <svg className="w-5 h-5 text-gray-600 group-hover:text-blue-400 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>

        <p className="text-center text-[11px] text-gray-600 mt-10">
          Blueprint Resolution Services &middot; DuckShrug LLC
        </p>
      </div>
    </main>
  )
}
