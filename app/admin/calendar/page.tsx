'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { EventDropArg } from '@fullcalendar/core'
import axios from 'axios'

// Type for Match object from API
interface Match {
  id: number
  date: string
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

// Calendar event structure
interface MatchEvent {
  id: string
  title: string
  start: string
  extendedProps: {
    matchId: number
  }
}

export default function CalendarPage() {
  const [events, setEvents] = useState<MatchEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>('/api/matches')
        const mapped = res.data.map((match) => ({
          id: String(match.id),
          title: `${match.homeTeam.college.acronym} ${match.homeTeam.name} vs ${match.awayTeam.college.acronym} ${match.awayTeam.name}`,
          start: match.date,
          extendedProps: {
            matchId: match.id,
          },
        }))
        setEvents(mapped)
      } catch (err) {
        console.error('Failed to fetch matches:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMatches()
  }, [])

  const handleEventDrop = async (info: EventDropArg) => {
    const matchId = info.event.extendedProps.matchId
    const newDate = info.event.start?.toISOString()

    if (!newDate) return

    try {
      await axios.patch(`/api/matches/${matchId}`, {
        date: newDate,
      })
    } catch (err) {
      console.error('Failed to update match date:', err)
      alert('Failed to update match date.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">📅 Match Calendar</h1>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          editable={true}
          events={events}
          eventDrop={handleEventDrop}
          height="auto"
        />
      )}
    </div>
  )
}