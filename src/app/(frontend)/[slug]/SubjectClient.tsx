'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown, ChevronRight, Plus, Minus } from 'lucide-react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BookOpen, Code2, FileText, PenLine, Lightbulb } from 'lucide-react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
type SubChapter = {
  id: string
  title: string
  order: number
  content?: {
    theory?: any
    example?: any
    codeBlock?: string
    summary?: string
    exercise?: any
  }
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
  subject: { title: string; description?: string; direction: 'ltr' | 'rtl' }
  chapters: Chapter[]
  slug: string
}

const DIFF: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  intermediate: { label: 'Intermediate', color: '#eab308', bg: 'rgba(234,179,8,0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
}

const TAB_CONFIG = [
  { key: 'theory', label: 'Theory', Icon: BookOpen, color: '#569cd6' },
  { key: 'example', label: 'Example', Icon: Lightbulb, color: '#4ec9b0' },
  { key: 'codeBlock', label: 'Code', Icon: Code2, color: '#888' },
  { key: 'summary', label: 'Summary', Icon: FileText, color: '#22c55e' },
  { key: 'exercise', label: 'Exercise', Icon: PenLine, color: '#eab308' },
] as const

export default function SubjectClient({ subject, chapters, slug }: Props) {
  const firstSub = chapters[0]?.subChapters[0]
  const [activeSubId, setActiveSubId] = useState(firstSub?.id || '')
  const [expandedChapters, setExpandedChapters] = useState<string[]>(
    chapters.length > 0 ? [chapters[0].id] : [],
  )
  // separate expand state for mobile list (independent from desktop sidebar)
  const [mobileExpanded, setMobileExpanded] = useState<string[]>(
    chapters.length > 0 ? [chapters[0].id] : [],
  )

  const isRTL = subject.direction === 'rtl'
  const contentFont = isRTL ? 'var(--font-arabic)' : 'var(--font-latin)'

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const toggleMobileChapter = (id: string) => {
    setMobileExpanded((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const activeSubChapter = chapters.flatMap((c) => c.subChapters).find((s) => s.id === activeSubId)
  const activeChapter = chapters.find((c) => c.subChapters.some((s) => s.id === activeSubId))

  // Reusable content tabs
  const ContentTabs = ({ subChapter }: { subChapter: typeof activeSubChapter }) => {
    if (!subChapter) return null
    const availableTabs = TAB_CONFIG.filter(
      (t) => subChapter.content?.[t.key as keyof typeof subChapter.content],
    )
    if (availableTabs.length === 0) return null

    return (
      <Tabs
        defaultValue={availableTabs[0].key}
        dir={subject.direction}
        className="flex flex-col gap-2"
      >
        <TabsList
          className="flex flex-wrap"
          style={{
            background: '#252526',
            border: '1px solid #3c3c3c',
            borderRadius: '6px',
            padding: '4px',
            height: 'auto',
            width: 'fit-content',
          }}
        >
          {availableTabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="data-active:bg-zinc-700! rounded-md"
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                color: tab.color,
                padding: '8px 16px',
              }}
            >
              <tab.Icon size={14} style={{ marginRight: '6px' }} />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {availableTabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key} style={{ marginTop: '16px' }}>
            <div
              style={{
                background: tab.key === 'codeBlock' ? '#0d1117' : '#252526',
                border: '1px solid #3c3c3c',
                borderRadius: '8px',
                padding: '20px',
              }}
            >
              {tab.key === 'codeBlock' ? (
                <pre
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#9cdcfe',
                    fontFamily: 'monospace',
                    overflowX: 'auto',
                    lineHeight: '1.8',
                    direction: 'ltr',
                    textAlign: 'left',
                  }}
                >
                  {subChapter.content?.codeBlock}
                </pre>
              ) : tab.key === 'summary' ? (
                <div
                  style={{
                    fontSize: isRTL ? '20px' : '14px',
                    color: '#d4d4d4',
                    lineHeight: isRTL ? '2' : '1.8',
                    whiteSpace: 'pre-line',
                    fontFamily: contentFont,
                  }}
                >
                  {subChapter.content?.summary}
                </div>
              ) : (
                <div
                  className={`rich-text ${isRTL ? 'rtl-content' : ''}`}
                  style={{
                    fontSize: isRTL ? '20px' : '14px',
                    color: '#d4d4d4',
                    lineHeight: isRTL ? '2' : '1.8',
                    fontFamily: contentFont,
                  }}
                >
                  <RichText
                    data={subChapter.content?.[tab.key as keyof typeof subChapter.content]}
                  />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    )
  }

  const SidebarContent = () => (
    <>
      <div style={{ padding: '20px 12px', borderBottom: '1px solid #3c3c3c', flexShrink: 0 }}>
        <div
          style={{
            fontSize: '11px',
            color: '#bbb',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          Explorer
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#fff',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subject.title}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {chapters.map((chapter) => {
          const isExpanded = expandedChapters.includes(chapter.id)
          const isActiveChapter = chapter.subChapters.some((s) => s.id === activeSubId)
          return (
            <div key={chapter.id}>
              <div
                onClick={() => toggleChapter(chapter.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '3px 12px',
                  cursor: 'pointer',
                  background: isActiveChapter ? '#2a2d2e' : 'transparent',
                  fontSize: '13px',
                  color: isActiveChapter ? '#fff' : '#ccc',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#2a2d2e')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = isActiveChapter ? '#2a2d2e' : 'transparent')
                }
              >
                <span style={{ fontSize: '20px', color: '#888', width: '12px', flexShrink: 0 }}>
                  {isExpanded ? (
                    <ChevronDown size={14} color="#888" />
                  ) : (
                    <ChevronRight size={14} color="#888" />
                  )}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#888',
                    fontFamily: 'monospace',
                    flexShrink: 0,
                  }}
                >
                  {String(chapter.order).padStart(2, '0')}
                </span>
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {chapter.title}
                </span>
              </div>
              {isExpanded && (
                <div>
                  {chapter.subChapters.length === 0 ? (
                    <div style={{ padding: '3px 12px 3px 36px', fontSize: '12px', color: '#555' }}>
                      No sections yet
                    </div>
                  ) : (
                    chapter.subChapters.map((sub) => (
                      <div
                        key={sub.id}
                        onClick={() => setActiveSubId(sub.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '3px 12px 3px 28px',
                          cursor: 'pointer',
                          background: activeSubId === sub.id ? '#094771' : 'transparent',
                          fontSize: '12px',
                          color: activeSubId === sub.id ? '#fff' : '#aaa',
                        }}
                        onMouseEnter={(e) => {
                          if (activeSubId !== sub.id) e.currentTarget.style.background = '#2a2d2e'
                        }}
                        onMouseLeave={(e) => {
                          if (activeSubId !== sub.id)
                            e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#fff',
                            fontFamily: 'monospace',
                            flexShrink: 0,
                          }}
                        >
                          {chapter.order}.{sub.order}
                        </span>
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {sub.title}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div style={{ borderTop: '1px solid #3c3c3c', padding: '8px 12px', flexShrink: 0 }}>
        <a href="/" style={{ fontSize: '12px', color: '#888', textDecoration: 'none' }}>
          ← Home
        </a>
      </div>
    </>
  )

  return (
    <div
      style={{
        background: '#1e1e1e',
        color: '#cccccc',
        fontFamily: 'system-ui, sans-serif',
        minHeight: '100vh',
      }}
    >
      {/* ── MOBILE VIEW ── */}
      <div className="md:hidden" style={{ minHeight: '100vh' }}>
        <div
          style={{
            background: '#252526',
            borderBottom: '1px solid #3c3c3c',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <a
            href="/"
            style={{
              fontSize: '12px',
              color: '#888',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <ArrowLeft size={14} /> Home
          </a>
          <span style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{subject.title}</span>
          <div style={{ width: '40px' }} />
        </div>

        <div
          style={{
            padding: '16px',
            direction: subject.direction,
            textAlign: isRTL ? 'right' : 'left',
            fontFamily: contentFont,
          }}
        >
          {chapters.map((chapter) => {
            const isMobileExpanded = mobileExpanded.includes(chapter.id)
            return (
              <div key={chapter.id} style={{ marginBottom: '12px' }}>
                <button
                  onClick={() => toggleMobileChapter(chapter.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: '#252526',
                    border: 'none',
                    borderRadius: isMobileExpanded ? '6px 6px 0 0' : '6px',
                    borderBottom: isMobileExpanded ? '1px solid #3c3c3c' : 'none',
                    cursor: 'pointer',
                    direction: 'inherit',
                  }}
                >
                  {isMobileExpanded ? (
                    <Minus size={14} color="#888" style={{ flexShrink: 0 }} />
                  ) : (
                    <Plus size={14} color="#888" style={{ flexShrink: 0 }} />
                  )}
                  <span style={{ fontSize: '11px', color: '#888', fontFamily: 'monospace' }}>
                    {String(chapter.order).padStart(2, '0')}
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#d4d4d4',
                      flex: 1,
                      textAlign: isRTL ? 'right' : 'left',
                    }}
                  >
                    {chapter.title}
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '20px',
                      background: DIFF[chapter.difficulty]?.bg,
                      color: DIFF[chapter.difficulty]?.color,
                      flexShrink: 0,
                    }}
                  >
                    {DIFF[chapter.difficulty]?.label}
                  </span>
                </button>

                {isMobileExpanded && (
                  <div
                    style={{
                      background: '#1e1e1e',
                      border: '1px solid #3c3c3c',
                      borderTop: 'none',
                      borderRadius: '0 0 6px 6px',
                      overflow: 'hidden',
                    }}
                  >
                    {chapter.subChapters.length === 0 ? (
                      <div style={{ padding: '10px 14px', fontSize: '12px', color: '#555' }}>
                        No sections yet
                      </div>
                    ) : (
                      chapter.subChapters.map((sub, idx) => (
                        <Link
                          key={sub.id}
                          href={`/${slug}/${sub.id}`}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '12px 14px',
                            textDecoration: 'none',
                            borderBottom:
                              idx < chapter.subChapters.length - 1 ? '1px solid #2a2a2a' : 'none',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              color: '#555',
                              fontFamily: 'monospace',
                              flexShrink: 0,
                            }}
                          >
                            {chapter.order}.{sub.order}
                          </span>
                          <span
                            style={{
                              fontSize: '13px',
                              color: '#ccc',
                              flex: 1,
                              fontFamily: contentFont,
                            }}
                          >
                            {sub.title}
                          </span>
                          <span style={{ color: '#555', fontSize: '14px' }}>›</span>
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── DESKTOP VIEW ── */}
      <div className="hidden md:flex" style={{ height: '100vh', overflow: 'hidden' }}>
        <div
          style={{
            width: '260px',
            background: '#252526',
            borderRight: '1px solid #3c3c3c',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}
        >
          <SidebarContent />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: '#1e1e1e' }}>
          {!activeSubChapter ? (
            <div style={{ padding: '40px', color: '#555', fontSize: '14px' }}>
              Select a section from the sidebar.
            </div>
          ) : (
            <div
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 32px',
                direction: subject.direction,
                textAlign: isRTL ? 'right' : 'left',
                fontFamily: contentFont,
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  color: '#555',
                  marginBottom: '16px',
                  fontFamily: 'monospace',
                  direction: 'ltr',
                  textAlign: 'left',
                }}
              >
                {subject.title} / {activeChapter?.title} / {activeSubChapter.title}
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}
              >
                <h1
                  style={{
                    fontSize: '28px',
                    fontWeight: 600,
                    color: '#d4d4d4',
                    margin: 0,
                    fontFamily: contentFont,
                  }}
                >
                  {activeSubChapter.title}
                </h1>
                {activeChapter && (
                  <span
                    style={{
                      fontSize: '11px',
                      padding: '3px 20px',
                      borderRadius: '20px',
                      background: DIFF[activeChapter.difficulty]?.bg,
                      color: DIFF[activeChapter.difficulty]?.color,
                      flexShrink: 0,
                    }}
                  >
                    {DIFF[activeChapter.difficulty]?.label}
                  </span>
                )}
              </div>

              <ContentTabs subChapter={activeSubChapter} />

              {(() => {
                const allSubs = chapters.flatMap((c) => c.subChapters)
                const currentIdx = allSubs.findIndex((s) => s.id === activeSubId)
                const prev = allSubs[currentIdx - 1]
                const next = allSubs[currentIdx + 1]
                return (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '48px',
                      paddingTop: '24px',
                      borderTop: '1px solid #3c3c3c',
                    }}
                  >
                    {prev ? (
                      <button
                        onClick={() => setActiveSubId(prev.id)}
                        style={{
                          fontSize: '12px',
                          color: '#888',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <ArrowLeft size={14} /> {prev.title}
                      </button>
                    ) : (
                      <div />
                    )}
                    {next ? (
                      <button
                        onClick={() => setActiveSubId(next.id)}
                        style={{
                          fontSize: '12px',
                          color: '#888',
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        {next.title} <ArrowRight size={14} />
                      </button>
                    ) : (
                      <div />
                    )}
                  </div>
                )
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
