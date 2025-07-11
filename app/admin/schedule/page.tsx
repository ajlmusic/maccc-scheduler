'use client'

import { useState } from "react"
import axios from "axios"

export default function ScheduleGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  const generateSchedule = async () => {
    setLoading(true)
    const res = await axios.post("/api/generate")
    setResult(`✅ Generated ${res.data.created} matches`)
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Generate Match Schedule</h1>
      <p className="mb-4">This will overwrite all current matches.</p>
      <button
        onClick={generateSchedule}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Generating..." : "Generate Schedule"}
      </button>
      {result && <p className="mt-4 text-green-600 font-semibold">{result}</p>}
    </div>
  )
}