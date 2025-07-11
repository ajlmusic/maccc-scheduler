// app/admin/layout.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"
import Link from "next/link"
import { ReactNode } from "react"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)

  // ✅ Redirect if not admin
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">MACCC Admin</h1>
        <nav className="space-x-4">
          <Link href="/admin" className="hover:underline">Dashboard</Link>
          <Link href="/admin/schedule" className="hover:underline">Schedule</Link>
          <Link href="/admin/export" className="hover:underline">Export</Link>
          <Link href="/admin/settings" className="hover:underline">Settings</Link>
        </nav>
      </header>
      <main className="p-6">{children}</main>
    </div>
  )
}