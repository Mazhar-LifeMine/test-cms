'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AccessDeniedPopup() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [show, setShow] = useState(false)

  const allowedSlugs: string[] = (session?.user as any)?.allowedSlugs ?? []
  const isAdmin = (session?.user as any)?.role === 'admin'

  useEffect(() => {
    if (searchParams.get('error') === 'access_denied') {
      setShow(true)
    }
  }, [searchParams])

  const handleClose = () => {
    setShow(false)
    router.replace('/', { scroll: false })
  }

  if (!show) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: '16px',
      }}
    >
      <div
        style={{
          background: '#1e1e1e',
          border: '1px solid #3c3c3c',
          borderRadius: '16px',
          padding: '40px 32px',
          textAlign: 'center',
          maxWidth: '420px',
          width: '100%',
        }}
      >
        {/* Red bar at top */}
        <div
          style={{
            width: '48px',
            height: '4px',
            background: '#ef4444',
            borderRadius: '2px',
            margin: '0 auto 24px',
          }}
        />

        <h2
          style={{
            color: '#fff',
            fontSize: '22px',
            fontWeight: 700,
            marginBottom: '12px',
          }}
        >
          Access Denied
        </h2>

        <p
          style={{
            color: '#888',
            fontSize: '14px',
            marginBottom: '24px',
            lineHeight: '1.6',
          }}
        >
          You don't have access to this subject.
        </p>

        {/* Allowed subjects */}
        {!isAdmin && (
          <div
            style={{
              background: '#252526',
              border: '1px solid #3c3c3c',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left',
            }}
          >
            <p
              style={{
                color: '#555',
                fontSize: '11px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Your allowed subjects
            </p>
            {allowedSlugs.length === 0 ? (
              <p style={{ color: '#555', fontSize: '13px' }}>No subjects assigned yet.</p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {allowedSlugs.map((slug) => (
                  <span
                    key={slug}
                    style={{
                      background: 'rgba(108,99,255,0.15)',
                      color: '#6c63ff',
                      border: '1px solid rgba(108,99,255,0.3)',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {slug}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleClose}
          style={{
            width: '100%',
            background: '#6c63ff',
            color: '#fff',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Got it
        </button>
      </div>
    </div>
  )
}
