import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import Mascot from '@/components/Mascot'

export const metadata: Metadata = {
  title: 'Aaditya Jaiswar -- Software Engineer',
  description: 'Aaditya Jaiswar is a software engineer building full-stack, AI and LLM-powered products.',
  generator: 'v0.app',
  icons: {
    icon: '/face.png',
    apple: '/face.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Mascot />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
