'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function CollegesPage() {
  const [colleges, setColleges] = useState<any[]>([])

  useEffect(() => {
    axios.get('/api/colleges').then(res => setColleges(res.data))
  }, [])

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">🏫 Manage Colleges</h2>
      <ul className="space-y-2">
        {colleges.map(c => (
          <li key={c.id} className="border p-2 rounded">{c.name} ({c.acronym})</li>
        ))}
      </ul>
      {/* TODO: Add UI to edit colleges and assign sports */}
    </div>
  )
}