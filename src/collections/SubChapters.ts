import { CollectionConfig } from 'payload'

export const SubChapters: CollectionConfig = {
  slug: 'sub-chapters',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'chapter', 'order', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    // Step 1 — select subject first
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      required: true,
      admin: {
        description: 'Select subject first to filter chapters',
      },
    },
    // Step 2 — chapter filtered by subject
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
          name: 'theory',
          type: 'richText',
          admin: { description: '📖 Main explanation' },
        },
        {
          name: 'example',
          type: 'richText',
          admin: { description: '💻 Real world example' },
        },
        {
          name: 'codeBlock',
          type: 'code',
          admin: {
            language: 'typescript',
            description: '⌨️ Code snippet',
          },
        },
        {
          name: 'summary',
          type: 'textarea',
          admin: { description: '📝 Key points to remember' },
        },
        {
          name: 'exercise',
          type: 'richText',
          admin: { description: '✏️ Practice question' },
        },
      ],
    },
  ],
}
