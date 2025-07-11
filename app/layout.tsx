import './globals.css'
import type { Metadata } from 'next'
import SessionWrapper from '@/components/SessionWrapper'
import Nav from '@/components/Nav'
export const metadata: Metadata = {
  title: 'MACCC Scheduler',
  description: 'Schedule Manager',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#9E1B32" />
      </head>
      <body>
        
        <SessionWrapper>
          <>
          <Nav/>
          {children}
          </>
        </SessionWrapper>
      </body>
    </html>
  )
}