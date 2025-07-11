'use client'

import { useEffect, useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import { EventDropArg } from '@fullcalendar/core' // ✅ Correct source
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import axios from 'axios'

// ✅ API response shape (from Prisma)
interface Match {
  id: number
  date: string
  homeTeam: {
    name: string
  }
  awayTeam: {
    name: string
  }
}

// ✅ FullCalendar event shape
interface MatchEvent {
  id: string
  title: string
  start: string
  extendedProps: {
    matchId: number
  }
}

export default function DraggableCalendar() {
  const [events, setEvents] = useState<MatchEvent[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>('/api/matches') // ✅ typed response
        const mapped: MatchEvent[] = res.data.map((match) => ({
          id: String(match.id),
          title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          start: match.date,
          extendedProps: {
            matchId: match.id,
          },
        }))
        setEvents(mapped)
      } catch (err) {
        console.error('Error fetching matches:', err)
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
      console.error('Error updating match date:', err)
      alert('Failed to update match date.')
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Match Calendar</h1>
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
    </div>
  )
}