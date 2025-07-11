import { prisma } from "@/lib/prisma"
import { PDFDocument, StandardFonts } from "pdf-lib"
import archiver from "archiver"
import { PassThrough } from "stream"

export async function GET() {
  const colleges = await prisma.college.findMany({
    include: {
      matchesAsHome: { include: { homeTeam: true, awayTeam: true } },
      matchesAsAway: { include: { homeTeam: true, awayTeam: true } }
    }
  })

  const archive = archiver("zip", { zlib: { level: 9 } })
  const pass = new PassThrough()
  archive.pipe(pass)

  for (const college of colleges) {
    const matches = [...college.matchesAsHome, ...college.matchesAsAway]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    const pdf = await PDFDocument.create()
    const page = pdf.addPage()
    const font = await pdf.embedFont(StandardFonts.Helvetica)

    page.drawText(`Schedule: ${college.name}`, { x: 50, y: 750, size: 20, font })

    let y = 720
    for (const match of matches) {
      const line = `${new Date(match.date).toDateString()}: ${match.homeTeam.name} vs ${match.awayTeam.name}`
      page.drawText(line, { x: 50, y, size: 12, font })
      y -= 18
    }

    const bytes = await pdf.save()
    archive.append(Buffer.from(bytes), { name: `${college.acronym}.pdf` })
  }

  archive.finalize()

  // Convert Node.js stream to Web-compatible ReadableStream
  const readable = new ReadableStream({
    start(controller) {
      pass.on("data", (chunk) => controller.enqueue(chunk))
      pass.on("end", () => controller.close())
      pass.on("error", (err) => controller.error(err))
    }
  })

  return new Response(readable, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": "attachment; filename=maccc_calendars.zip"
    }
  })
}