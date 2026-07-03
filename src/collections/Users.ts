import { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      options: [
        { label: '👑 Admin', value: 'admin' },
        { label: '📖 User', value: 'user' },
        { label: '🚫 Blocked', value: 'blocked' },
      ],
      defaultValue: 'user',
      admin: { position: 'sidebar' },
    },
    {
      name: 'allowedSubjects',
      type: 'relationship',
      relationTo: 'subjects',
      hasMany: true,
      admin: {
        description: 'Leave empty for no access. Admin has access to all.',
        position: 'sidebar',
      },
    },
  ],
}
