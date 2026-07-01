'use client'

import { useState } from 'react'
import Link from 'next/link'

const ITEMS_PER_PAGE = 8

type SubChapter = {
  id: string
  title: string
  order: number
}

type Chapter = {
  id: string
  title: string
  order: number
  difficulty: string
  description?: string
  subChapters: SubChapter[]
}

type Props = {
  subject: { title: string; description?: string }
  chapters: Chapter[]
  slug: string
}

const DIFF: Record<string, { color: string; dot: string }> = {
  easy: { color: 'text-green-400', dot: 'bg-green-400' },
  intermediate: { color: 'text-yellow-400', dot: 'bg-yellow-400' },
  hard: { color: 'text-red-400', dot: 'bg-red-400' },
}

export default function ContentsClient({ subject, chapters, slug }: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(chapters.length / ITEMS_PER_PAGE)
  const paginated = chapters.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const totalSubs = chapters.reduce((acc, c) => acc + c.subChapters.length, 0)

  return (
    <main
      className="min-h-screen bg-[#0f0e0c] text-[#e8e6e0]"
      style={{ fontFamily: 'Georgia, serif' }}
    >
      {/* Top Bar */}
      <div className="border-b border-[#2a2820] px-8 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs text-[#6b6860] hover:text-[#e8e6e0] transition-colors font-sans"
        >
          ← Home
        </Link>
        <span className="text-xs text-[#6b6860] font-sans tracking-widest uppercase">
          {subject.title}
        </span>
        <span className="text-xs text-[#4a4840] font-sans">
          {chapters.length} ch · {totalSubs} sec
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">
        {/* Title */}
        <div className="text-center mb-8 pb-8 border-b border-[#2a2820]">
          <p className="text-xs text-[#6b6860] tracking-[6px] uppercase mb-3 font-sans">
            Table of Contents
          </p>
          <h1 className="text-4xl font-bold mb-2 text-[#f0ede6]">{subject.title}</h1>
          {subject.description && (
            <p className="text-[#6b6860] text-sm italic">{subject.description}</p>
          )}
        </div>

        {/* Chapters */}
        <div className="mb-8">
          {paginated.map((chapter, idx) => {
            const diff = DIFF[chapter.difficulty]
            const globalIdx = (page - 1) * ITEMS_PER_PAGE + idx + 1
            return (
              <div key={chapter.id} className="mb-5">
                {/* Chapter Row */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#4a4840] text-xs font-mono w-6 flex-shrink-0">
                    {String(chapter.order).padStart(2, '0')}
                  </span>
                  <h2 className="text-base font-bold text-[#f0ede6] flex-1">{chapter.title}</h2>
                  <span className="border-b border-dotted border-[#2a2820] flex-1 mx-2 mb-0.5" />
                  <span
                    className={`text-xs font-sans flex items-center gap-1 flex-shrink-0 ${diff.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                    {chapter.difficulty}
                  </span>
                </div>

                {/* SubChapters */}
                {chapter.subChapters.length > 0 && (
                  <div className="ml-8 flex flex-col">
                    {chapter.subChapters.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/${slug}/${sub.id}`}
                        className="flex items-center gap-2 py-0.5 group/sub"
                      >
                        <span className="text-[#4a4840] text-xs font-mono w-6 flex-shrink-0">
                          {chapter.order}.{sub.order}
                        </span>
                        <span className="text-[#9b9890] text-sm group-hover/sub:text-[#e8e6e0] transition-colors flex-1">
                          {sub.title}
                        </span>
                        <span className="border-b border-dotted border-[#1e1c18] flex-1 mx-2 mb-0.5" />
                        <span className="text-[#4a4840] text-xs font-mono flex-shrink-0">
                          {String(globalIdx).padStart(3, '0')}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {idx < paginated.length - 1 && <div className="mt-4 border-b border-[#1a1916]" />}
              </div>
            )
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-6 border-t border-[#2a2820]">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-xs text-[#6b6860] hover:text-[#e8e6e0] transition-colors disabled:opacity-30 font-sans"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-6 h-6 rounded-full text-xs font-sans transition-colors
                    ${page === i + 1 ? 'bg-[#2a2820] text-[#e8e6e0]' : 'text-[#6b6860] hover:text-[#e8e6e0]'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-xs text-[#6b6860] hover:text-[#e8e6e0] transition-colors disabled:opacity-30 font-sans"
            >
              Next →
            </button>
          </div>
        )}

        {/* Page number */}
        <div className="text-center mt-8 text-[#3a3830] text-xs font-sans">— {page} —</div>
      </div>
    </main>
  )
}
