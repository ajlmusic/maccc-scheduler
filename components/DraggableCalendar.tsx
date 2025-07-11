'use client'

import { useEffect, useState } from 'react'
import {
  Calendar as BaseCalendar,
  dateFnsLocalizer,
  SlotInfo,
  Event as CalendarEvent,
} from 'react-big-calendar'
import withDragAndDrop, {
  type EventInteractionArgs,
} from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

import { parse, startOfWeek, format, getDay } from 'date-fns'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import axios from 'axios'

// ✅ Locale fix for date-fns
const locales = {
  'en-US': require('date-fns/locale/en-US').default,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
})

// ✅ Match API response shape
interface Match {
  id: string
  matchDate: string
  homeTeam: { name: string }
  awayTeam: { name: string }
}

// ✅ MatchEvent type for calendar
interface MatchEvent extends CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource?: Match
}

// ✅ Enhance base calendar with drag and drop
const DragAndDropCalendar = withDragAndDrop<MatchEvent>(BaseCalendar)

export default function DraggableCalendar() {
  const [events, setEvents] = useState<MatchEvent[]>([])

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get<Match[]>('/api/matches')

        const matches: MatchEvent[] = res.data.map((match) => ({
          id: match.id,
          title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
          start: new Date(match.matchDate),
          end: new Date(new Date(match.matchDate).getTime() + 2 * 60 * 60 * 1000),
          resource: match,
        }))

        setEvents(matches)
      } catch (err) {
        console.error('Failed to fetch matches:', err)
      }
    }

    fetchMatches()
  }, [])

  const moveEvent = async ({
    event,
    start,
    end,
  }: EventInteractionArgs<MatchEvent>) => {
    try {
      const newStart =
        start instanceof Date ? start : new Date(start as string)

      await axios.patch(`/api/matches/${event.id}`, {
        matchDate: newStart.toISOString(),
      })

      const updated = events.map((evt) =>
        evt.id === event.id
          ? {
              ...evt,
              start: new Date(start as string | Date),
              end: new Date(end as string | Date),
            }
          : evt
      )

      setEvents(updated)
    } catch (error) {
      alert('Failed to update match date')
    }
  }

  const onSelectSlot = (slotInfo: SlotInfo) => {
    alert(`Create new match at ${slotInfo.start.toLocaleString()}`)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 bg-white rounded shadow">
        <h2 className="text-xl font-bold mb-4">Drag & Drop Calendar</h2>
        <DragAndDropCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          defaultView="week"
          draggableAccessor={() => true}
          selectable
          onEventDrop={moveEvent}
          onSelectSlot={onSelectSlot}
        />
      </div>
    </DndProvider>
  )
}