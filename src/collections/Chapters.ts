import { CollectionConfig } from 'payload'

const revalidate = async (paths: string[]) => {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paths,
        secret: process.env.REVALIDATE_SECRET,
      }),
    })
  } catch (err) {
    console.error('Revalidation failed:', err)
  }
}

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'difficulty', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create' && !data.order) {
          const { docs } = await req.payload.find({
            collection: 'chapters',
            where: { subject: { equals: data.subject } },
            sort: '-order',
            limit: 1,
          })
          data.order = docs.length > 0 ? (docs[0].order || 0) + 1 : 1
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, req }) => {
        // get subject slug from relationship
        const subject = await req.payload.findByID({
          collection: 'subjects',
          id: typeof doc.subject === 'string' ? doc.subject : doc.subject.id,
        })
        const slug = subject?.slug
        if (slug) {
          await revalidate(['/', `/${slug}`])
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        const subject = await req.payload.findByID({
          collection: 'subjects',
          id: typeof doc.subject === 'string' ? doc.subject : doc.subject.id,
        })
        const slug = subject?.slug
        if (slug) {
          await revalidate(['/', `/${slug}`])
        }
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
    },
    {
      name: 'difficulty',
      type: 'select',
      required: true,
      options: [
        { label: '🟢 Easy', value: 'easy' },
        { label: '🟡 Intermediate', value: 'intermediate' },
        { label: '🔴 Hard', value: 'hard' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Chapter number e.g. 1, 2, 3',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief summary of what this chapter covers',
      },
    },
  ],
}
