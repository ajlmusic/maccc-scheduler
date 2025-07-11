'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

interface Sport {
  id: number
  name: string
}

interface AssignSportsModalProps {
  collegeId: number
  onClose: () => void
  onAssigned: () => void
}

export default function AssignSportsModal({
  collegeId,
  onClose,
  onAssigned,
}: AssignSportsModalProps) {
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSportId, setSelectedSportId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const res = await axios.get<Sport[]>('/api/sports')
        setSports(res.data)
      } catch (err) {
        console.error('Failed to fetch sports:', err)
      }
    }
    fetchSports()
  }, [])

  const assignSport = async () => {
    if (!selectedSportId) return

    try {
      setLoading(true)
      await axios.post('/api/teams', {
        collegeId,
        sportId: selectedSportId,
      })
      onAssigned()
      onClose()
    } catch (err) {
      console.error('Failed to assign sport:', err)
      alert('Error assigning sport.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md shadow">
        <h2 className="text-xl font-bold mb-4">Assign Sport</h2>

        <select
          onChange={(e) => setSelectedSportId(parseInt(e.target.value))}
          className="w-full mb-4 p-2 border rounded"
          value={selectedSportId ?? ''}
        >
          <option value="">-- Select a sport --</option>
          {sports.map((sport) => (
            <option key={sport.id} value={sport.id}>
              {sport.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end gap-4">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedSportId || loading}
            onClick={assignSport}
          >
            {loading ? 'Assigning...' : 'Assign'}
          </button>
        </div>
      </div>
    </div>
  )
}