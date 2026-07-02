'use client'

import { useState } from 'react'

type Props = {
  paths?: string[]
}

export const RevalidateButton = ({ paths = ['/'] }: Props) => {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleRevalidate = async () => {
    setLoading(true)
    setStatus('idle')
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/my-route/revalidate-pages`
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paths,
          secret: process.env.NEXT_PUBLIC_REVALIDATE_SECRET,
        }),
      })
      const data = await res.json()
      console.log('Revalidation response:', res.status, data)
      if (res.ok) setStatus('success')
      else setStatus('error')
    } catch (err) {
      console.error('Revalidation fetch failed:', err)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '8px 0' }}>
      <button
        onClick={handleRevalidate}
        disabled={loading}
        style={{
          background: loading ? '#444' : '#6c63ff',
          color: '#fff',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '6px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '13px',
          fontWeight: 600,
        }}
      >
        {loading ? 'Revalidating...' : '🔄 Revalidate'}
      </button>
      {status === 'success' && (
        <p style={{ color: '#22c55e', marginTop: '6px', fontSize: '12px' }}>✅ Revalidated!</p>
      )}
      {status === 'error' && (
        <p style={{ color: '#ef4444', marginTop: '6px', fontSize: '12px' }}>❌ Failed!</p>
      )}
    </div>
  )
}

export default RevalidateButton
