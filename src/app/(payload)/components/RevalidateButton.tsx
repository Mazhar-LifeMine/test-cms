'use client'

import { useState } from 'react'

export const RevalidateButton = () => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleRevalidate = async () => {
    setLoading(true)
    setStatus('idle')
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/my-route/revalidate-pages`
      console.log('Calling revalidate URL:', url)

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths: ['/'],
          secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        }),
      })

      const data = await res.json()
      console.log('Revalidation response:', res.status, data)

      if (res.ok) {
        setStatus('success')
      } else {
        console.error('Revalidation error:', data)
        setStatus('error')
      }
    } catch (err) {
      console.error('Revalidation fetch failed:', err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <button
        onClick={handleRevalidate}
        disabled={loading}
        style={{
          background: loading ? '#444' : '#6c63ff',
          color: '#fff',
          border: 'none',
          padding: '10px 24px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 600,
        }}
      >
        {loading ? 'Revalidating...' : '🔄 Revalidate All Pages'}
      </button>
      {status === 'success' && (
        <p style={{ color: '#22c55e', marginTop: '8px', fontSize: '13px' }}>
          ✅ Pages revalidated successfully!
        </p>
      )}
      {status === 'error' && (
        <p style={{ color: '#ef4444', marginTop: '8px', fontSize: '13px' }}>
          ❌ Revalidation failed!
        </p>
      )}
    </div>
  )
}

export default RevalidateButton
