import { getServerSession } from 'next-auth'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function getUserWithAccess() {
  const session = await getServerSession()

  if (!session?.user?.email) return null

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'users',
    where: { email: { equals: session.user.email } },
    depth: 1, // populate allowedSubjects
  })

  if (!docs[0]) return null

  const user = docs[0] as any

  return {
    email: user.email,
    role: user.role,
    allowedSubjects: user.allowedSubjects ?? [],
    isAdmin: user.role === 'admin',
  }
}

export function hasSubjectAccess(
  user: Awaited<ReturnType<typeof getUserWithAccess>>,
  subjectId: string,
): boolean {
  if (!user) return false
  if (user.isAdmin) return true // admin has access to all
  if (user.role === 'blocked') return false

  // check if subject is in allowedSubjects
  return user.allowedSubjects.some((s: any) => (typeof s === 'object' ? s.id : s) === subjectId)
}
