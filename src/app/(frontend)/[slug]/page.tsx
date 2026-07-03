import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import SubjectClient from './SubjectClient'
import { getUserWithAccess, hasSubjectAccess } from '@/lib/auth'

export const revalidate = 3600

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const { docs: subjects } = await payload.find({
    collection: 'subjects',
    limit: 100,
  })
  return subjects.map((subject) => ({
    slug: subject.slug as string,
  }))
}

export default async function SubjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: subjects } = await payload.find({
    collection: 'subjects',
    where: { slug: { equals: slug } },
  })

  if (!subjects[0]) return notFound()
  const subject = subjects[0]

  // check access
  const user = await getUserWithAccess()
  if (!hasSubjectAccess(user, subject.id)) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#1e1e1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <h1 style={{ color: '#ef4444', fontSize: '24px' }}>Access Denied</h1>
        <p style={{ color: '#888', fontSize: '14px' }}>You don't have access to this subject.</p>
        <a href="/" style={{ color: '#6c63ff', fontSize: '14px' }}>
          ← Back to Home
        </a>
      </div>
    )
  }

  const { docs: chapters } = await payload.find({
    collection: 'chapters',
    where: { subject: { equals: subject.id } },
    sort: 'order',
  })

  const chaptersWithSubs = await Promise.all(
    chapters.map(async (chapter) => {
      const { docs: subChapters } = await payload.find({
        collection: 'sub-chapters',
        where: { chapter: { equals: chapter.id } },
        sort: 'order',
      })
      return { ...chapter, subChapters }
    }),
  )

  return (
    <SubjectClient
      subject={{
        title: subject.title,
        description: subject.description ?? undefined,
        direction: (subject.direction as 'ltr' | 'rtl') ?? 'ltr',
      }}
      chapters={chaptersWithSubs.map((c) => ({
        id: c.id,
        title: c.title,
        order: c.order ?? 0,
        difficulty: c.difficulty,
        description: c.description ?? undefined,
        subChapters: c.subChapters.map((s) => ({
          id: s.id,
          title: s.title,
          order: s.order ?? 0,
          content: s.content
            ? {
                theory: s.content.theory ?? undefined,
                example: s.content.example ?? undefined,
                codeBlock: s.content.codeBlock ?? undefined,
                summary: s.content.summary ?? undefined,
                exercise: s.content.exercise ?? undefined,
              }
            : undefined,
        })),
      }))}
      slug={slug}
    />
  )
}
