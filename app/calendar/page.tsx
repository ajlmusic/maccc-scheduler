'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'

// ✅ Server match type returned from API
interface Match {
  id: string
  matchDate: string // ISO string
  homeTeam: {
    name: string
  }
  awayTeam: {
    name: string
  }
}

// ✅ FullCalendar event format
interface MatchEvent {
  id: string
  title: string
  start: string // ISO date
  extendedProps: {
    matchId: string
  }
}

export default function CalendarPage() {
  const [events, setEvents] = useState<MatchEvent[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>('/api/matches')
        const matches = res.data

        const mapped: MatchEvent[] = matches.map((match) => ({
          id: String(match.id),
          title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          start: new Date(match.matchDate).toISOString(), // FullCalendar requires ISO
          extendedProps: {
            matchId: match.id,
          },
        }))

        setEvents(mapped)
      } catch (error) {
        console.error('Error fetching matches:', error)
      }
    }

    fetchMatches()
  }, [])

  const handleEventDrop = async (info: any) => {
    const matchId = info.event.extendedProps.matchId
    const newDate = info.event.start?.toISOString()

    try {
      await axios.patch(`/api/matches/${matchId}`, {
        matchDate: newDate,
      })
    } catch (err) {
      console.error('Error updating match date:', err)
      alert('Failed to update match date.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Match Calendar</h1>

      <div className="mb-4 flex gap-4">
        <a href="/api/export/pdf" className="btn btn-sm btn-outline">
          Download PDF
        </a>
        <a href="/api/export/ics" className="btn btn-sm btn-outline">
          Download ICS
        </a>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate="2025-09-01"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        editable={true}
        selectable={true}
        events={events}
        eventDrop={handleEventDrop}
        height="auto"
      />
    </div>
  )
}