'use client'

import { useSession, signOut } from 'next-auth/react'

export default function UserInfo() {
  const { data: session } = useSession()

  return (
    <div style={{ textAlign: 'right' }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>{session?.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        style={{
          background: 'transparent',
          border: '1px solid #3c3c3c',
          color: '#888',
          padding: '6px 14px',
          borderRadius: '6px',
          fontSize: '12px',
          cursor: 'pointer',
        }}
      >
        Sign out
      </button>
    </div>
  )
}
