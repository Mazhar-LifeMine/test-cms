'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AccessDeniedPopup() {
  const searchParams = useSearchParams()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (searchParams.get('error') === 'access_denied') {
      setShow(true)
    }
  }, [searchParams])

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          background: '#252526',
          border: '1px solid #3c3c3c',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
        <h2 style={{ color: '#ef4444', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>
          Access Denied
        </h2>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px', lineHeight: '1.6' }}>
          You don't have access to this subject. Please contact admin for access.
        </p>
        <button
          onClick={() => setShow(false)}
          style={{
            background: '#6c63ff',
            color: '#fff',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          OK
        </button>
      </div>
    </div>
  )
}
