'use client'

import { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { BookOpen, Code2, FileText, PenLine, Lightbulb } from 'lucide-react'

type Props = {
  content: {
    theory?: any
    example?: any
    codeBlock?: string
    summary?: string
    exercise?: any
  }
  isRTL: boolean
  contentFont: string
}

const TAB_CONFIG = [
  { key: 'theory', label: 'Theory', Icon: BookOpen, color: '#569cd6' },
  { key: 'example', label: 'Example', Icon: Lightbulb, color: '#4ec9b0' },
  { key: 'codeBlock', label: 'Code', Icon: Code2, color: '#888' },
  { key: 'summary', label: 'Summary', Icon: FileText, color: '#22c55e' },
  { key: 'exercise', label: 'Exercise', Icon: PenLine, color: '#eab308' },
] as const

export default function BottomTabsClient({ content, isRTL, contentFont }: Props) {
  const availableTabs = TAB_CONFIG.filter((t) => content[t.key as keyof typeof content])
  const [activeTab, setActiveTab] = useState(availableTabs[0]?.key || 'theory')

  if (availableTabs.length === 0) return null

  const activeConfig = availableTabs.find((t) => t.key === activeTab)

  return (
    <div style={{ paddingBottom: '70px' }}>
      {/* Active Tab Content */}
      <div
        style={{
          background: activeTab === 'codeBlock' ? '#0d1117' : '#18181b',
          border: '1px solid #27272a',
          borderRadius: '8px',
          padding: '18px',
        }}
      >
        <p
          style={{
            fontSize: '13px', // 11→13
            fontFamily: 'monospace',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            color: activeConfig?.color,
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          {activeConfig && <activeConfig.Icon size={16} />} {/* 14→16 */}
          {activeConfig?.label}
        </p>

        {activeTab === 'codeBlock' ? (
          <pre
            style={{
              margin: 0,
              fontSize: '15px', // 13→15
              color: '#9cdcfe',
              fontFamily: 'monospace',
              overflowX: 'auto',
              lineHeight: '1.8',
              direction: 'ltr',
              textAlign: 'left',
            }}
          >
            {content.codeBlock}
          </pre>
        ) : activeTab === 'summary' ? (
          <div
            style={{
              fontSize: isRTL ? '20px' : '16px', // 14→16
              color: '#d1d5db',
              lineHeight: isRTL ? '2' : '1.8',
              whiteSpace: 'pre-line',
              fontFamily: contentFont,
            }}
          >
            {content.summary}
          </div>
        ) : (
          <div
            className={`rich-text ${isRTL ? 'rtl-content' : ''}`}
            style={{
              fontSize: isRTL ? '20px' : '16px', // 14→16
              color: '#d1d5db',
              lineHeight: isRTL ? '2' : '1.8',
              fontFamily: contentFont,
            }}
          >
            <RichText data={content[activeTab as keyof typeof content]} />
          </div>
        )}
      </div>

      {/* Bottom Tab Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#18181b',
          borderTop: '1px solid #27272a',
          display: 'flex',
          zIndex: 50,
        }}
      >
        {availableTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              borderTop: activeTab === tab.key ? `2px solid ${tab.color}` : '2px solid transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            <tab.Icon size={18} color={activeTab === tab.key ? tab.color : '#666'} /> {/* 16→18 */}
            <span
              style={{
                fontSize: '12px', // 10→12
                color: activeTab === tab.key ? tab.color : '#666',
              }}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
