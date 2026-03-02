'use client'

import { EditorialSEO, TechnicalSEO, AEOSEO } from '../types'

const EDITORIAL_LABELS: Record<string, string> = {
  titleTag: 'Title tag optimized',
  metaDescription: 'Meta description',
  h1Optimized: 'H1 matches intent',
  headerHierarchy: 'Header hierarchy',
  internalLinks: 'Internal links (2-3)',
  externalLinks: 'External sources cited',
  ctaPresent: 'CTA present',
  readability: 'Readable & scannable',
}

const TECHNICAL_LABELS: Record<string, string> = {
  schemaMarkup: 'FAQPage schema',
  canonicalUrl: 'Canonical URL',
  ogTags: 'Open Graph tags',
  featuredImage: 'Custom featured image',
  imageAltText: 'Image alt text',
  urlSlug: 'Clean URL slug',
  mobileRendering: 'Mobile verified',
  pageSpeed: 'No blocking resources',
}

const AEO_LABELS: Record<string, string> = {
  faqSchema: 'FAQ structured data',
  directAnswers: 'Direct answer in P1',
  definitionBlocks: 'Definition blocks',
  comparisonStructure: 'Comparison format',
  statsCited: 'Stats with sources',
  entityClarity: 'BPRS as authority',
  conciseSummary: 'Extractable summary',
  freshness: 'Date & year stamped',
}

function ChecklistColumn({ title, data, labels, color }: {
  title: string
  data: Record<string, unknown>
  labels: Record<string, string>
  color: string
}) {
  const items = Object.entries(labels)
  const done = items.filter(([k]) => data[k] === true).length
  const total = items.length
  const pct = Math.round((done / total) * 100)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold" style={{ color }}>{title}</h4>
        <span className="text-xs text-gray-400">{done}/{total} ({pct}%)</span>
      </div>
      <div className="space-y-1.5">
        {items.map(([key, label]) => {
          const checked = data[key] === true
          return (
            <div key={key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                checked ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {checked ? '✓' : '✗'}
              </div>
              <span className={`text-xs ${checked ? 'text-gray-300' : 'text-gray-500'}`}>{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function SEOPanel({ editorial, technical, aeo }: {
  editorial: EditorialSEO
  technical: TechnicalSEO
  aeo: AEOSEO
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-white/[0.02] rounded-lg border border-white/5">
      <ChecklistColumn
        title="Editorial SEO"
        data={editorial as unknown as Record<string, unknown>}
        labels={EDITORIAL_LABELS}
        color="#22c55e"
      />
      <ChecklistColumn
        title="Technical SEO"
        data={technical as unknown as Record<string, unknown>}
        labels={TECHNICAL_LABELS}
        color="#3b82f6"
      />
      <ChecklistColumn
        title="AEO / GEO"
        data={aeo as unknown as Record<string, unknown>}
        labels={AEO_LABELS}
        color="#a855f7"
      />
    </div>
  )
}
