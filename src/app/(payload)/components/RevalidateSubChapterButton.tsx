'use client'
import { useDocumentInfo } from '@payloadcms/ui'
import { RevalidateButton } from './RevalidateButton'

export default function RevalidateSubChapterButton() {
  const { savedDocumentData } = useDocumentInfo()
  const doc = savedDocumentData as any

  // handle both populated object and string ID
  const subjectSlug = typeof doc?.subject === 'object' ? doc.subject?.slug : 'unknown' // ← fallback so button always shows!
  const docId = doc?.id

  return <RevalidateButton paths={['/', `/${subjectSlug}`, `/${subjectSlug}/${docId}`]} />
}
