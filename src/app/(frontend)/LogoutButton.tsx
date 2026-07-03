'use client'

import { signOut } from 'next-auth/react'

export default function LogoutButton() {
  return (
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
  )
}
