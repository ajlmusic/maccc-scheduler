'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'

interface Match {
  id: number
  date: string // Must match API key exactly
  homeTeam: { name: string }
  awayTeam: { name: string }
}

interface CalendarEvent {
  id: string
  title: string
  start: string
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>('/api/matches')
        const matches = res.data

        const mapped = matches.map(match => ({
          id: match.id.toString(),
          title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          start: match.date, // already ISO string like "2025-09-01T00:00:00.000Z"
        }))

        console.log('✅ Calendar events:', mapped)
        setEvents(mapped)
      } catch (err) {
        console.error('❌ Error loading matches:', err)
      }
    }

    fetchMatches()
  }, [])

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">📅 Match Calendar</h1>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
      />
    </div>
  )
}