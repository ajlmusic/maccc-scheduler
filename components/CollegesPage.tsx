'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Sport {
  id: number
  name: string
}

interface College {
  id: number
  name: string
  acronym: string
  city: string
  state: string
  sports: Sport[] // ✅ Make sure this is always defined
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get<College[]>('/api/colleges')
        // Ensure sports is always defined
        const safeData = res.data.map((c) => ({
          ...c,
          sports: c.sports ?? [],
        }))
        setColleges(safeData)
      } catch (err) {
        console.error('Failed to fetch colleges:', err)
        setError('Failed to load colleges')
      } finally {
        setLoading(false)
      }
    }

    fetchColleges()
  }, [])

  if (loading) return <p className="mt-10 px-4">Loading colleges...</p>
  if (error) return <p className="mt-10 px-4 text-red-600">{error}</p>

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">🏫 Participating Colleges</h1>
      <ul className="space-y-4">
        {colleges.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow-sm">
            <div className="text-lg font-semibold">
              {c.acronym} — {c.name}
            </div>
            <div className="text-sm text-gray-600">
              📍 {c.city}, {c.state}
            </div>
            {(c.sports?.length ?? 0) > 0 && (
              <div className="text-sm text-blue-600 mt-1">
                Sports:{' '}
                {c.sports.map((sport, index) => (
                  <span key={sport.id}>
                    {sport.name}
                    {index < c.sports.length - 1 && ', '}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}