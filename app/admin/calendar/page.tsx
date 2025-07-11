'use client'

import dynamic from 'next/dynamic'

const Calendar = dynamic(() => import('@/components/DraggableCalendar'), { ssr: false })

export default function CalendarPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">📆 Calendar</h2>
      <Calendar />
    </div>
  )
}