// app/api/teams/route.ts
import { NextResponse } from 'next/server'
import {prisma} from '@/lib/prisma'

export async function POST(req: Request) {
  const { collegeId, sportId } = await req.json()

  const existing = await prisma.team.findFirst({
    where: { collegeId, sportId },
  })

  if (existing) {
    return NextResponse.json({ message: 'Already assigned' }, { status: 409 })
  }

  const team = await prisma.team.create({
    data: {
      name: 'Team ' + Math.random().toString(36).substring(7),
      collegeId,
      sportId,
    },
  })

  return NextResponse.json(team)
}