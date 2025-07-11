// scripts/create-user.ts
import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 3) {
    console.log("Usage: ts-node scripts/create-user.ts <name> <email> <password> [role]")
    process.exit(1)
  }

  const [name, email, password, role = "USER"] = args

  const hashed = await argon2.hash(password)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log(`User with email ${email} already exists.`)
    process.exit(1)
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: role.toUpperCase() === "ADMIN" ? "ADMIN" : "USER"
    }
  })

  console.log(`✅ Created ${role.toUpperCase()} user: ${email}`)
}

main().catch((err) => {
  console.error("❌ Failed:", err)
}).finally(() => prisma.$disconnect())