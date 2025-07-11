'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

// ✅ Interface for settings data
interface SettingsData {
  seasonLabel: string | null
  googleMapsApiKey: string | null
}

export default function SettingsPage() {
  const [seasonLabel, setSeasonLabel] = useState('')
  const [googleMapsApiKey, setGoogleMapsApiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await axios.get<SettingsData>('/api/settings')
        const data = res.data
        setSeasonLabel(data.seasonLabel || '')
        setGoogleMapsApiKey(data.googleMapsApiKey || '')
      } catch (err) {
        console.error('Failed to load settings:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const handleSave = async () => {
    try {
      await axios.put('/api/settings', {
        seasonLabel,
        googleMapsApiKey,
      })
      setMessage('✅ Settings saved successfully!')
    } catch (err) {
      console.error('Save failed:', err)
      setMessage('❌ Failed to save settings.')
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="mb-6 text-gray-600">
        Edit application preferences, set season label, and update API keys.
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSave()
          }}
          className="space-y-6"
        >
          <div>
            <label className="block font-medium">Season Label</label>
            <input
              type="text"
              value={seasonLabel}
              onChange={(e) => setSeasonLabel(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="e.g., Fall 2025"
            />
          </div>

          <div>
            <label className="block font-medium">Google Maps API Key</label>
            <input
              type="text"
              value={googleMapsApiKey}
              onChange={(e) => setGoogleMapsApiKey(e.target.value)}
              className="mt-1 block w-full border rounded px-3 py-2"
              placeholder="Enter Google Maps API key"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Settings
          </button>

          {message && (
            <p
              className={`text-sm mt-2 ${
                message.startsWith('✅')
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {message}
            </p>
          )}
        </form>
      )}
    </div>
  )
}