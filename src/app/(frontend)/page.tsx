import { getPayload } from 'payload'
import config from '@payload-config'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import LogoutButton from './LogoutButton'

export const revalidate = 3600

export async function generateStaticParams() {
  return []
}

export default async function HomePage() {
  const session = await getServerSession()
  const payload = await getPayload({ config })

  const { docs: subjects } = await payload.find({
    collection: 'subjects',
    sort: 'order',
  })

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12 flex justify-between items-start">
        <div>
          <p className="text-purple-400 text-sm font-mono tracking-widest uppercase mb-3">
            Personal Learning Platform
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-4">My Learning Hub</h1>
          <p className="text-gray-400 text-lg">Structured path from Rookie to Master 🚀</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
            {session?.user?.email}
          </p>
          <LogoutButton />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="max-w-4xl mx-auto">
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Subjects</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/${subject.slug}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-purple-500 transition-colors cursor-pointer block"
            >
              <h2 className="text-lg font-semibold mb-2">{subject.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{subject.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
