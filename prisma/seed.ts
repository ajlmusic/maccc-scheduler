import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const sports = [
    { name: "Football", preferredMatchDay: "Saturday", preferredMatchTime: "13:00" },
    { name: "Basketball", preferredMatchDay: "Wednesday", preferredMatchTime: "18:00" },
    { name: "Soccer", preferredMatchDay: "Tuesday", preferredMatchTime: "16:00" }
  ]

  // Seed Sports
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: {},
      create: sport,
    })
  }

  // Seed Teams for existing colleges
  const colleges = await prisma.college.findMany()
  for (const college of colleges) {
    for (const sport of sports) {
      const sportData = await prisma.sport.findUnique({ where: { name: sport.name } })
      const teamName = `${college.acronym} ${sport.name}`

      const existingTeam = await prisma.team.findFirst({
        where: { name: teamName }
      })

      if (!existingTeam) {
        await prisma.team.create({
          data: {
            name: teamName,
            collegeId: college.id,
            sportId: sportData!.id
          }
        })
      }
    }
  }

  // Seed Admin User
  const hashedPassword = await argon2.hash("maccc123")
  await prisma.user.upsert({
    where: { email: "admin@maccc.edu" },
    update: {},
    create: {
      name: "MACCC Admin",
      email: "admin@maccc.edu",
      password: hashedPassword,
      role: "ADMIN"
    }
  })

  console.log("✅ Sports, teams, and admin user seeded successfully.")
}

main().catch(console.error).finally(() => prisma.$disconnect())