import { prisma } from "@/lib/prisma"
import { START_DATE } from "@/lib/settings"
import { NextResponse } from "next/server"

export async function POST() {
  const sports = await prisma.sport.findMany({
    include: {
      teams: {
        include: {
          college: true
        }
      }
    }
  })

  const matchesToCreate: any[] = []

  for (const sport of sports) {
    const teams = sport.teams
    const totalRounds = teams.length - 1
    const matchesPerRound = teams.length / 2
    const scheduleDate = new Date(START_DATE)

    for (let round = 0; round < totalRounds; round++) {
      for (let match = 0; match < matchesPerRound; match++) {
        const homeIdx = (round + match) % (teams.length - 1)
        const awayIdx = (teams.length - 1 - match + round) % (teams.length - 1)

        let home = teams[homeIdx]
        let away = teams[awayIdx]

        // Last team always fixed if odd number
        if (match === 0) away = teams[teams.length - 1]

        matchesToCreate.push({
          date: new Date(scheduleDate),
          location: home.college.name,
          homeTeamId: home.id,
          awayTeamId: away.id,
          homeCollegeId: home.collegeId,
          awayCollegeId: away.collegeId,
          status: "Scheduled"
        })
      }

      scheduleDate.setDate(scheduleDate.getDate() + 7) // weekly interval
    }
  }

  // Clear existing matches
  await prisma.match.deleteMany()

  // Bulk create
  await prisma.match.createMany({ data: matchesToCreate })

  return NextResponse.json({ success: true, created: matchesToCreate.length })
}