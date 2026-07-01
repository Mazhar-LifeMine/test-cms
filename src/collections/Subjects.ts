import { CollectionConfig } from 'payload'

export const Subjects: CollectionConfig = {
  slug: 'subjects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'color', 'createdAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'direction',
      type: 'select',
      required: true,
      defaultValue: 'ltr',
      options: [
        { label: '→ LTR (English, Hindi etc)', value: 'ltr' },
        { label: '← RTL (Urdu, Arabic etc)', value: 'rtl' },
      ],
      admin: {
        description: 'Text direction for this subject',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL friendly name e.g. mongodb, nodejs',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload SVG or PNG icon for this subject',
      },
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        description: 'Hex color e.g. #22d3a0',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        description: 'Display order on homepage',
      },
    },
  ],
}
