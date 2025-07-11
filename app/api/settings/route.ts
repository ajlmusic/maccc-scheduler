// app/api/settings/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const settings = await prisma.setting.findFirst()
  return NextResponse.json(settings ?? {})
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { seasonLabel, googleMapsApiKey } = body

  let settings = await prisma.setting.findFirst()

  if (settings) {
    settings = await prisma.setting.update({
      where: { id: settings.id },
      data: { seasonLabel, googleMapsApiKey },
    })
  } else {
    settings = await prisma.setting.create({
      data: { seasonLabel, googleMapsApiKey },
    })
  }

  return NextResponse.json(settings)
}