import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Subjects } from './collections/Subjects'
import { Chapters } from './collections/Chapters'
import { SubChapters } from './collections/SubChapters'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  cors: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://test-cms-git-main-mahmmod-hashmi.vercel.app',
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://test-cms-git-main-mahmmod-hashmi.vercel.app',
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: ['/src/components/RevalidateButton'],
    },
  },
  collections: [Users, Media, Subjects, Chapters, SubChapters],

  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
    connectOptions: {
      maxPoolSize: 1, // ← add this
      minPoolSize: 1, // ← add this
      serverSelectionTimeoutMS: 5000,
    },
  }),
  sharp,
  plugins: [],
})
