// app/admin/schedule/[sport]/page.tsx
import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    sport: string
  }
}

export default function SportSchedulePage({ params }: PageProps) {
  const { sport } = params

  if (!sport) return notFound()

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Schedule for {sport}</h1>
      {/* You can fetch and show matches by sport here */}
    </div>
  )
}