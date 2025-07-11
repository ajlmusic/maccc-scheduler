// scripts/createAdmin.ts
import { prisma } from '@/lib/prisma'
import argon2 from 'argon2'

async function main() {
  const hashed = await argon2.hash('maccc123')
  await prisma.user.upsert({
    where: { email: 'admin@maccc.edu' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@maccc.edu',
      password: hashed,
      role:'ADMIN',
    }
  })
  console.log('✅ Admin created')
}

main()