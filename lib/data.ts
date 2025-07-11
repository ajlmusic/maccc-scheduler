import {prisma} from '@/lib/prisma'

export async function getMatchesBySport(sport: string) {
  return prisma.match.findMany({
    where: {
      homeTeam: {
        sport: {
          name: {
            equals: sport,
            mode: 'insensitive',
          },
        },
      },
    },
    include: {
      homeTeam: true,
      awayTeam: true,
    },
    orderBy: {
      date: 'asc',
    },
  })
}