import { prisma } from "@/lib/prisma"
import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const acronym = searchParams.get("college")
  if (!acronym) return NextResponse.json({ error: "Missing college param" }, { status: 400 })

  const college = await prisma.college.findUnique({
    where: { acronym },
    include: {
      matchesAsHome: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      },
      matchesAsAway: {
        include: {
          homeTeam: true,
          awayTeam: true
        }
      }
    }
  })

  if (!college) return NextResponse.json({ error: "College not found" }, { status: 404 })

  const allMatches = [...college.matchesAsHome, ...college.matchesAsAway]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pdf = await PDFDocument.create()
  const page = pdf.addPage()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  page.drawText(`Schedule: ${college.name}`, { x: 50, y: 750, size: 20, font, color: rgb(0, 0, 0.6) })

  let y = 720
  for (const match of allMatches) {
    const line = `${new Date(match.date).toDateString()}: ${match.homeTeam.name} vs ${match.awayTeam.name}`
    page.drawText(line, { x: 50, y, size: 12, font })
    y -= 18
  }

  const pdfBytes = await pdf.save()
  return new Response(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=${acronym}_schedule.pdf`
    }
  })
}