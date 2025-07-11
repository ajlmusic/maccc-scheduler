// app/admin/layout.tsx

import { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/authOptions'

interface Props {
  children: ReactNode
}

export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login')
  }

  return (
    <div>
      {children}
    </div>
  )
}