'use client'

import { useEffect, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import { DateTime } from "luxon"
import axios from "axios"

interface MatchEvent {
  id: string
  title: string
  start: string
  extendedProps: {
    matchId: number
  }
}

export default function CalendarPage({ acronym }: { acronym: string }) {
  const [events, setEvents] = useState<MatchEvent[]>([])

  useEffect(() => {
    async function fetchMatches() {
      const res = await axios.get("/api/matches")
      const matchEvents = res.data.map((match: any) => ({
        id: String(match.id),
        title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
        start: match.date,
        extendedProps: {
          matchId: match.id
        }
      }))
      setEvents(matchEvents)
    }

    fetchMatches()
  }, [])

  const handleEventDrop = async (info: any) => {
    const matchId = info.event.extendedProps.matchId
    const newDate = info.event.start

    await axios.put("/api/matches", {
      matchId,
      newDate
    })
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Match Calendar</h1>
<a href={`/api/export/pdf?college=${acronym}`} className="btn btn-sm btn-outline">Download PDF</a>
<a href={`/api/export/ics?college=${acronym}`} className="btn btn-sm btn-outline ml-2">Download ICS</a>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        selectable={true}
        events={events}
        eventDrop={handleEventDrop}
        height="auto"
      />
    </div>
  )
}