import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true
    }
  })
  return NextResponse.json(matches)
}

export async function PUT(req: NextRequest) {
  const { matchId, newDate } = await req.json()

  await prisma.match.update({
    where: { id: Number(matchId) },
    data: { date: new Date(newDate) }
  })

  return NextResponse.json({ success: true })
}