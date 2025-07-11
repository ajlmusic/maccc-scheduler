'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Match {
  id: number
  date: string
  location: string
  homeTeam: {
    name: string
    college: {
      acronym: string
    }
  }
  awayTeam: {
    name: string
    college: {
      acronym: string
    }
  }
}

interface Props {
  sport: string
}

export default function ScheduleList({ sport }: Props) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>(`/api/schedule/${sport}`)
        setMatches(res.data)
      } catch (err) {
        console.error('Failed to fetch schedule:', err)
        setError('Failed to load schedule')
      } finally {
        setLoading(false)
      }
    }

    if (sport) fetchMatches()
  }, [sport])

  if (loading) return <p className="text-gray-500">Loading schedule...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (matches.length === 0) return <p className="text-gray-500">No matches scheduled.</p>

  return (
    <ul className="space-y-3">
      {matches.map((match) => (
        <li key={match.id} className="border rounded p-4 shadow-sm">
          <div className="font-medium text-lg">
            {match.homeTeam.college.acronym} {match.homeTeam.name} vs{' '}
            {match.awayTeam.college.acronym} {match.awayTeam.name}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            📍 {match.location} | 🕒 {new Date(match.date).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  )
}