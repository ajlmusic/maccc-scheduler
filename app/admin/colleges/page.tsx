'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import AssignSportsModal from '@/components/AssignSportsModal'

interface College {
  id: number
  name: string
  acronym: string
  city?: string
  state?: string
  sports: string[] // ✅ sports is always an array
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [selectedCollegeId, setSelectedCollegeId] = useState<number | null>(null)

  const fetchColleges = async () => {
    try {
      const res = await axios.get<College[]>('/api/colleges')
      const data = res.data.map((c) => ({
        ...c,
        sports: Array.isArray(c.sports) ? c.sports : [], // ✅ guarantee array
      }))
      setColleges(data)
    } catch (err) {
      console.error('Error fetching colleges:', err)
      setError('Failed to load colleges.')
    }
  }

  useEffect(() => {
    fetchColleges()
  }, [])

  const openModal = (collegeId: number) => {
    setSelectedCollegeId(collegeId)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedCollegeId(null)
    setShowModal(false)
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-4">🏫 Manage Colleges</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {colleges.length === 0 && !error && (
        <p className="text-gray-500">No colleges found.</p>
      )}

      <ul className="space-y-4">
        {colleges.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <strong>{c.name}</strong> ({c.acronym})
                {c.city && c.state && (
                  <span className="text-sm text-gray-600 ml-2">
                    – {c.city}, {c.state}
                  </span>
                )}
                {Array.isArray(c.sports) && c.sports.length > 0 && (
                  <div className="text-sm text-blue-600 mt-1">
                    Sports:{' '}
                    {c.sports.map((sport, index) => (
                      <Link
                        key={sport}
                        href={`/schedule/${sport.toLowerCase()}`}
                        className="text-blue-600 underline hover:text-blue-800"
                      >
                        {sport}
                        {index < c.sports.length - 1 ? ', ' : ''}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <button
                onClick={() => openModal(c.id)}
                className="btn btn-sm btn-primary"
              >
                ➕ Assign Sport
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showModal && selectedCollegeId !== null && (
        <AssignSportsModal
          collegeId={selectedCollegeId}
          onClose={closeModal}
          onAssigned={fetchColleges}
        />
      )}
    </div>
  )
}