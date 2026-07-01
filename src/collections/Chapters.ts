import { CollectionConfig } from 'payload'

export const Chapters: CollectionConfig = {
  slug: 'chapters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'difficulty', 'order'],
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
      // required: true,
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
