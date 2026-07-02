// RevalidateChapterButton.tsx
'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { RevalidateButton } from './RevalidateButton'

export default function RevalidateChapterButton() {
  const { savedDocumentData } = useDocumentInfo()
  const doc = savedDocumentData as any
  const subjectSlug = typeof doc?.subject === 'object' ? doc.subject?.slug : null

  if (!subjectSlug) return null

  return <RevalidateButton paths={['/', `/${subjectSlug}`]} />
}
