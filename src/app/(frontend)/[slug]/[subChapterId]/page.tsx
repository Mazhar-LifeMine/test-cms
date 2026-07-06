import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import BottomTabsClient from './BottomTabsClient'
import { ArrowLeft, ArrowRight } from 'lucide-react'
export const revalidate = 3600
export async function generateStaticParams() {
  return []
}
export default async function SubChapterPage({
  params,
}: {
  params: Promise<{ slug: string; subChapterId: string }>
}) {
  const { slug, subChapterId } = await params
  const payload = await getPayload({ config })

  const subChapter = await payload.findByID({
    collection: 'sub-chapters',
    id: subChapterId,
  })

  if (!subChapter) return notFound()

  const chapter = await payload.findByID({
    collection: 'chapters',
    id: typeof subChapter.chapter === 'string' ? subChapter.chapter : subChapter.chapter.id,
  })

  const { docs: subjects } = await payload.find({
    collection: 'subjects',
    where: { slug: { equals: slug } },
  })
  const direction = (subjects[0]?.direction as 'ltr' | 'rtl') ?? 'ltr'
  const isRTL = direction === 'rtl'
  const contentFont = isRTL ? 'var(--font-arabic)' : 'var(--font-latin)'

  const { docs: allSubs } = await payload.find({
    collection: 'sub-chapters',
    where: { chapter: { equals: chapter?.id } },
    sort: 'order',
  })

  const currentIndex = allSubs.findIndex((s) => s.id === subChapterId)
  const prev = allSubs[currentIndex - 1]
  const next = allSubs[currentIndex + 1]

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top Bar */}
      <div className="border-b border-zinc-800 px-4 py-3 flex items-center gap-3">
        <Link
          href={`/${slug}`}
          className="text-gray-500 text-sm hover:text-white transition-colors flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <span className="text-gray-600">|</span>
        <span className="text-white text-sm truncate">{subChapter.title}</span>
      </div>

      {/* Content */}
      <div
        className="px-4 py-6"
        dir={direction}
        style={{ textAlign: isRTL ? 'right' : 'left', fontFamily: contentFont }}
      >
        <p
          className="text-purple-400 text-xs font-mono tracking-widest uppercase mb-2"
          style={{ direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }}
        >
          {chapter?.order}.{subChapter.order} — {chapter?.title}
        </p>
        <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: contentFont }}>
          {subChapter.title}
        </h1>

        <BottomTabsClient
          content={{
            theory: subChapter.content?.theory,
            example: subChapter.content?.example,
            codeBlock: subChapter.content?.codeBlock ?? undefined,
            summary: subChapter.content?.summary ?? undefined,
            exercise: subChapter.content?.exercise,
          }}
          isRTL={isRTL}
          contentFont={contentFont}
        />

        {/* Prev / Next Navigation */}
        <div
          className="flex justify-between mt-6 pt-4 border-t border-zinc-800"
          style={{ marginBottom: '70px' }}
        >
          {prev ? (
            <Link
              href={`/${slug}/${prev.id}`}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> {prev.title}
            </Link>
          ) : (
            <div />
          )}

          {next ? (
            <Link
              href={`/${slug}/${next.id}`}
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {next.title} <ArrowRight size={14} />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </main>
  )
}
