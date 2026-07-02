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

export const SubChapters: CollectionConfig = {
  slug: 'sub-chapters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'chapter', 'order', 'createdAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => !!req.user,
    update: ({ req }) => !!req.user,
    delete: ({ req }) => !!req.user,
  },
  hooks: {
    afterChange: [
      async ({ doc, req }) => {
        // get subject slug
        console.log('🔥 SubChapter afterChange hook fired!', doc.id)
        const subject = await req.payload.findByID({
          collection: 'subjects',
          id: typeof doc.subject === 'string' ? doc.subject : doc.subject.id,
        })
        const slug = subject?.slug
        if (slug) {
          revalidate([
            '/', // homepage
            `/${slug}`, // subject page
            `/${slug}/${doc.id}`, // subchapter page
          ])
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
          await revalidate(['/', `/${slug}`, `/${slug}/${doc.id}`])
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
      admin: {
        description: 'Select subject first to filter chapters',
      },
    },
    {
      name: 'chapter',
      type: 'relationship',
      relationTo: 'chapters',
      required: true,
      filterOptions: ({ data }) => {
        if (!data?.subject) return false
        return {
          subject: { equals: data.subject },
        }
      },
      admin: {
        description: 'Only shows chapters of selected subject',
      },
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },

    {
      name: 'content',
      type: 'group',
      fields: [
        {
          type: 'tabs',
          tabs: [
            {
              label: '📖 Theory',
              fields: [
                { name: 'theory', type: 'richText', admin: { description: 'Main explanation' } },
              ],
            },
            {
              label: '💻 Example',
              fields: [
                { name: 'example', type: 'richText', admin: { description: 'Real world example' } },
              ],
            },
            {
              label: '⌨️ Code',
              fields: [
                {
                  name: 'codeBlock',
                  type: 'code',
                  admin: { language: 'typescript', description: 'Code snippet' },
                },
              ],
            },
            {
              label: '📝 Summary',
              fields: [
                {
                  name: 'summary',
                  type: 'textarea',
                  admin: { description: 'Key points to remember' },
                },
              ],
            },
            {
              label: '✏️ Exercise',
              fields: [
                { name: 'exercise', type: 'richText', admin: { description: 'Practice question' } },
              ],
            },
          ],
        },
      ],
    },
  ],
}
