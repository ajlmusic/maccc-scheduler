// app/admin/layout.tsx
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"
import Nav from "@/components/Nav"

import { ReactNode } from "react"


export default async function AdminLayout({ children }: { children: ReactNode }) {
 



  return (
<>

<Nav/>
      <main className="p-6">{children}</main>
</>
    
  )
}