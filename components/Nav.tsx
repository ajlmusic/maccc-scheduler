'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-black text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">MACCC Admin</h1>

        {/* Hamburger Button */}
        <button
          className="lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Menu */}
        <nav
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute left-0 top-16 w-full bg-black px-4 py-4 space-y-2 lg:space-y-0 lg:space-x-6 lg:static lg:flex lg:flex-row lg:items-center lg:w-auto lg:bg-transparent`}
        >
          <Link href="/admin" className="block hover:underline">Dashboard</Link>
          <Link href="/admin/calendar" className="block hover:underline">📅 Calendar</Link>
          <Link href="/admin/colleges" className="block hover:underline">🏫 Colleges</Link>
          <Link href="/admin/schedule" className="block hover:underline">⚙️ Generate</Link>
          <Link href="/admin/export" className="block hover:underline">Export</Link>
          <Link href="/admin/settings" className="block hover:underline">Settings</Link>
          {session?.user && (
            <button
              onClick={() => signOut()}
              className="block text-sm text-red-400 hover:underline"
            >
              🚪 Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}