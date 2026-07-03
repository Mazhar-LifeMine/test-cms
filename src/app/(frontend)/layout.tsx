import React from 'react'
import './styles.css'

export const metadata = {
  title: 'MazharLearn — Personal Learning Platform',
  description: 'My personal learning platform for Payload CMS, Arabic, English and more!',
  icons: {
    icon: '/og-image.png', // browser tab icon
    shortcut: '/og-image.png', // shortcut icon
    apple: '/og-image.png', // apple touch icon
  },
  openGraph: {
    title: 'MazharLearn — Personal Learning Platform',
    description: 'My personal learning platform for Payload CMS, Arabic, English and more!',
    url: 'https://learn.qutbul-madar.in',
    siteName: 'MazharLearn',
    images: [
      {
        url: 'https://learn.qutbul-madar.in/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MazharLearn',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MazharLearn',
    description: 'My personal learning platform',
    images: ['https://learn.qutbul-madar.in/og-image.png'],
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
