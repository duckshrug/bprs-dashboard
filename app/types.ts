export type Stream = 'rewrites-30' | 'rewrites-3' | 'new-batch-1' | 'future'
export type Batch = 'batch-1' | 'batch-2' | 'batch-3' | 'none'
export type Stage = 1 | 2 | 3 | 4 | 5 | 6
export type Status = 'in-progress' | 'ready' | 'approved' | 'edit-requested' | 'on-hold' | 'published'
export type CKResponse = 'A' | 'E' | 'H' | null

export interface EditorialSEO {
  targetKeyword: string
  secondaryKeywords: string[]
  titleTag: boolean
  metaDescription: boolean
  h1Optimized: boolean
  headerHierarchy: boolean
  internalLinks: boolean
  externalLinks: boolean
  ctaPresent: boolean
  readability: boolean
}

export interface TechnicalSEO {
  schemaMarkup: boolean
  canonicalUrl: boolean
  ogTags: boolean
  featuredImage: boolean
  imageAltText: boolean
  urlSlug: boolean
  mobileRendering: boolean
  pageSpeed: boolean
}

export interface AEOSEO {
  faqSchema: boolean
  directAnswers: boolean
  definitionBlocks: boolean
  comparisonStructure: boolean
  statsCited: boolean
  entityClarity: boolean
  conciseSummary: boolean
  freshness: boolean
}

export interface CKHistoryEntry {
  response: 'A' | 'E' | 'H'
  note: string
  at: string
}

export interface StageHistoryEntry {
  from: Stage
  to: Stage
  by: string
  at: string
  note: string
}

export interface Article {
  id: string
  title: string
  stream: Stream
  batch: Batch
  stage: Stage
  status: Status
  owner: string
  ckResponse: CKResponse
  ckNote: string
  ckRespondedAt?: string
  ckHistory?: CKHistoryEntry[]
  history?: StageHistoryEntry[]
  googleDocUrl: string
  wordpressUrl: string
  updatedAt: string
  editorial: EditorialSEO
  technical: TechnicalSEO
  aeo: AEOSEO
}

export const STAGES = [
  { num: 1, name: 'Draft & Humanize', owner: 'Qua', color: '#22c55e' },
  { num: 2, name: 'MK Edit & Approve', owner: 'MK', color: '#f59e0b' },
  { num: 3, name: 'CK Approval', owner: 'CK', color: '#ef4444' },
  { num: 4, name: 'Pre-Publish Prep', owner: 'Qua', color: '#3b82f6' },
  { num: 5, name: 'Publish to WP', owner: 'Rey', color: '#8b5cf6' },
  { num: 6, name: 'Post-Publish', owner: 'Rey / Qua', color: '#ec4899' },
] as const

export const STATUS_COLORS: Record<Status, string> = {
  'in-progress': '#f59e0b',
  'ready': '#22c55e',
  'approved': '#3b82f6',
  'edit-requested': '#ef4444',
  'on-hold': '#6b7280',
  'published': '#8b5cf6',
}

// Stage transition rules: maps current stage to available actions
export interface StageAction {
  label: string
  nextStage: Stage
  newOwner: string
  newStatus: Status
}

export const STAGE_ACTIONS: Record<number, StageAction[]> = {
  1: [{ label: 'Send to MK Edit', nextStage: 2, newOwner: 'MK', newStatus: 'ready' }],
  2: [{ label: 'Send to CK Approval', nextStage: 3, newOwner: 'CK', newStatus: 'ready' }],
  // Stage 3 uses CK Approval Panel instead
  4: [{ label: 'Send to Publish', nextStage: 5, newOwner: 'Rey', newStatus: 'ready' }],
  5: [{ label: 'Published', nextStage: 6, newOwner: 'Rey / Qua', newStatus: 'published' }],
}

export function getSEOScore(obj: EditorialSEO | TechnicalSEO | AEOSEO): { done: number; total: number } {
  const entries = Object.entries(obj)
  const boolKeys = entries.filter(([, v]) => typeof v === 'boolean')
  const done = boolKeys.filter(([, v]) => v === true).length
  return { done, total: boolKeys.length }
}

export function getStageName(stage: Stage): string {
  return STAGES.find(s => s.num === stage)?.name || `Stage ${stage}`
}
