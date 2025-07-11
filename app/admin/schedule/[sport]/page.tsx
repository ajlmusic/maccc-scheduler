import { notFound } from 'next/navigation'
import { getMatchesBySport } from '@/lib/data' // Adjust if needed
import Link from 'next/link'

interface Params {
  sport: string
}

export default async function SportSchedulePage({ params }: { params: Params }) {
  const { sport } = params

  const matches = await getMatchesBySport(sport)

  if (!matches || matches.length === 0) {
    return notFound()
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">📅 {sport.toUpperCase()} Schedule</h1>

      <ul className="space-y-2">
        {matches.map((match: any) => (
          <li key={match.id} className="border p-3 rounded">
            <strong>{match.homeTeam.name}</strong> vs{' '}
            <strong>{match.awayTeam.name}</strong> —{' '}
            {new Date(match.date).toLocaleDateString()}
            <div className="text-sm text-gray-600">{match.location}</div>
          </li>
        ))}
      </ul>

      <Link href="/admin/calendar" className="text-blue-500 underline mt-6 inline-block">
        ← Back to Calendar
      </Link>
    </div>
  )
}