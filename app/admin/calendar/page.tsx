import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar',
}

export default function CalendarPage() {
  return (
    <div>
      <h1>📅 Calendar</h1>
      <CalendarPage/>
    </div>
  )
}