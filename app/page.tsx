import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center  bg-[#fbebd6] px-4">
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="MACCC Scheduler Logo"
          width={200}
          height={200}
          className="mx-auto mb-6"
          priority
        />
        <Link
          href="/auth/login"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Admin Login 
        </Link>
      </div>
    </main>
  )
}