import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

// Define types for clarity
interface Team {
  id: number
  collegeId: number
  sportId: number
}

interface MatchInput {
  homeTeamId: number
  awayTeamId: number
  homeCollegeId: number
  awayCollegeId: number
  sportId: number
}

export async function POST() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        college: true,
        sport: true,
      },
    })

    // Group teams by sport
    const teamsBySport = teams.reduce<Record<number, Team[]>>((acc, team) => {
      if (!acc[team.sportId]) {
        acc[team.sportId] = []
      }
      acc[team.sportId].push(team)
      return acc
    }, {})

    const newMatches: MatchInput[] = []

    for (const sportId in teamsBySport) {
      const sportTeams = teamsBySport[parseInt(sportId)]
      for (let i = 0; i < sportTeams.length; i++) {
        for (let j = i + 1; j < sportTeams.length; j++) {
          const home = sportTeams[i]
          const away = sportTeams[j]

          newMatches.push({
            homeTeamId: home.id,
            awayTeamId: away.id,
            homeCollegeId: home.collegeId,
            awayCollegeId: away.collegeId,
            sportId: home.sportId,
          })

          // Optionally add reverse match for home/away balance
          newMatches.push({
            homeTeamId: away.id,
            awayTeamId: home.id,
            homeCollegeId: away.collegeId,
            awayCollegeId: home.collegeId,
            sportId: away.sportId,
          })
        }
      }
    }

    // Delete existing matches before generating new ones
    await prisma.match.deleteMany()

    // Generate matches with placeholder date and location
    const now = new Date()
    await prisma.match.createMany({
      data: newMatches.map((m, index) => ({
        homeTeamId: m.homeTeamId,
        awayTeamId: m.awayTeamId,
        homeCollegeId: m.homeCollegeId,
        awayCollegeId: m.awayCollegeId,
        date: new Date(now.getTime() + index * 86400000), // one match per day
        location: 'TBD',
      })),
    })

    return NextResponse.json({ success: true, count: newMatches.length })
  } catch (err) {
    console.error('Schedule generation failed:', err)
    return NextResponse.json({ error: 'Failed to generate schedule' }, { status: 500 })
  }
}