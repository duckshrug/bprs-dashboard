'use client'

import { Article } from '../types'
import PipelineOverview from './PipelineOverview'
import ArticleTable from './ArticleTable'
import CKApprovalPanel from './CKApprovalPanel'
import BatchSummary from './BatchSummary'

export default function Dashboard({ articles }: { articles: Article[] }) {
  return (
    <>
      <PipelineOverview articles={articles} />
      <CKApprovalPanel articles={articles} />
      <ArticleTable articles={articles} />
      <BatchSummary articles={articles} />
    </>
  )
}
