// RevalidateSubChapterButton.tsx
'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { RevalidateButton } from './RevalidateButton'

export default function RevalidateSubChapterButton() {
  const { savedDocumentData } = useDocumentInfo()
  const doc = savedDocumentData as any
  const subjectSlug = typeof doc?.subject === 'object' ? doc.subject?.slug : null
  const docId = doc?.id

  if (!subjectSlug) return null

  return <RevalidateButton paths={['/', `/${subjectSlug}`, `/${subjectSlug}/${docId}`]} />
}
