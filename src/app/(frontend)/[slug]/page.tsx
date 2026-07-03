import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import SubjectClient from './SubjectClient'

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
