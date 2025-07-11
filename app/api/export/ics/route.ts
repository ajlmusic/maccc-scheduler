import { prisma } from "@/lib/prisma"
import { createEvents } from "ics"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const acronym = searchParams.get("college")
  if (!acronym) {
    return NextResponse.json({ error: "Missing college param" }, { status: 400 })
  }

  const college = await prisma.college.findUnique({
    where: { acronym },
    include: {
      matchesAsHome: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
      matchesAsAway: {
        include: {
          homeTeam: true,
          awayTeam: true,
        },
      },
    },
  })

  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 })
  }

  const allMatches = [...college.matchesAsHome, ...college.matchesAsAway].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const events: Parameters<typeof createEvents>[0] = allMatches.map((match) => {
    const date = new Date(match.date)
    return {
      start: [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
      ],
      duration: { hours: 2 },
      title: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      location: match.location,
    }
  })

  const { error, value } = createEvents(events)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new Response(value, {
    headers: {
      "Content-Type": "text/calendar",
      "Content-Disposition": `attachment; filename=${acronym}_schedule.ics`,
    },
  })
}