// app/api/colleges/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      include: {
        teams: {
          include: {
            sport: true,
          },
        },
      },
    })

    const formatted = colleges.map((college) => ({
      id: college.id,
      name: college.name,
      acronym: college.acronym,
      city: college.city,
      state: college.state,
      sports: college.teams.map((team) => team.sport.name),
    }))

    return NextResponse.json(formatted)
  } catch (err) {
    console.error('[GET /api/colleges] Error:', err)
    return NextResponse.json({ error: 'Failed to fetch colleges' }, { status: 500 })
  }
}