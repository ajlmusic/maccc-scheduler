import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

// Prisma singleton
const g = globalThis as unknown as { prisma?: PrismaClient; __AUTH_BY_ORIGIN__?: Map<string, ReturnType<typeof betterAuth>> };
export const prisma =
  g.prisma ?? new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

// Cache Better Auth instances by origin so we don't recreate on every request
const cache = g.__AUTH_BY_ORIGIN__ ?? new Map<string, ReturnType<typeof betterAuth>>();
if (process.env.NODE_ENV !== "production") g.__AUTH_BY_ORIGIN__ = cache;

export function getAuthForOrigin(origin: string) {
  if (!cache.has(origin)) {
    const instance = betterAuth({
      database: prismaAdapter(prisma, { provider: "sqlite" }),
      emailAndPassword: { enabled: true },
      baseURL: origin,                            // <-- mirror the request origin
      secret: process.env.BETTER_AUTH_SECRET,     // keep this in .env.local
      plugins: [nextCookies()],
    });
    cache.set(origin, instance);
  }
  return cache.get(origin)!;
}