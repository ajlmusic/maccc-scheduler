'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Sport {
  name: string
}

interface College {
  id: string
  name: string
  acronym: string
  city?: string
  state?: string
  sports?: Sport[] // ✅ use objects, not string[]
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get<College[]>('/api/colleges')
        setColleges(res.data)
      } catch (err: any) {
        console.error('Error fetching colleges:', err)
        setError('Failed to load colleges.')
      }
    }

    fetchColleges()
  }, [])

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">🏫 Manage Colleges</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {colleges.length === 0 && !error && (
        <p className="text-gray-500">No colleges found.</p>
      )}

      <ul className="space-y-2">
        {colleges.map((c) => (
          <li key={c.id} className="border p-3 rounded shadow-sm">
            <strong>{c.name}</strong> ({c.acronym})
            {c.city && c.state && (
              <span className="text-sm text-gray-600 ml-2">
                – {c.city}, {c.state}
              </span>
            )}
            {c.sports && c.sports.length > 0 && (
              <div className="text-sm text-blue-600 mt-1">
                Sports: {c.sports.map((s) => s.name).join(', ')}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}