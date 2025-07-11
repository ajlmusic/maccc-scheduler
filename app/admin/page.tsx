// app/admin/page.tsx
'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
        import Link from 'next/link'

export default function AdminPage() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      redirect('/')
    }
  }, [session, status])

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading...</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, {session?.user?.name}</p>
      <ul className="mt-6 list-disc list-inside">



<ul className="mt-6 list-disc list-inside space-y-2">
  <li>
    <Link href="/admin/calendar" className="text-blue-600 hover:underline">📅 View Calendar</Link>
  </li>
  <li>
    <Link href="/admin/schedule" className="text-blue-600 hover:underline">📅 View and generate schedule</Link>
  </li>
  <li>
    <Link href="/admin/matches" className="text-blue-600 hover:underline">🖊️ Manage matches and results</Link>
  </li>
  <li>
    <Link href="/admin/export" className="text-blue-600 hover:underline">📤 Export calendars and logs</Link>
  </li>
  <li>
    <Link href="/admin/settings" className="text-blue-600 hover:underline">⚙️ Admin settings</Link>
  </li>
</ul>
      </ul>
    </div>
  )
}