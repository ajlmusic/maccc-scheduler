import ScheduleList from './ScheduleList'
export default async function Page({
  params,
}: {
  params: Promise<{ sport: string }>
}) {
  const { sport } = await params
  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">📅 Schedule for {sport}</h1>
      <ScheduleList sport={sport} />
    </div>)
}