// lib/auth.ts
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const g = globalThis as unknown as { prisma?: PrismaClient };
export const prisma =
  g.prisma ?? new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });
if (process.env.NODE_ENV !== "production") g.prisma = prisma;

// Infer the correct public origin for dev/preview/prod (Codespaces-friendly)
function inferBaseURL() {
  // 1) Explicit override (useful in prod)
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL;

  // 2) GitHub Codespaces (stable pattern)
  if (process.env.CODESPACE_NAME && process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN) {
    const port = process.env.PORT ?? "3000";
    return `https://${process.env.CODESPACE_NAME}-${port}.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}`;
  }

  // 3) Vercel previews
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  // 4) Fallback to local dev
  return "http://localhost:3000";
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),

  emailAndPassword: { enabled: true },

  // The magic: dynamic baseURL that matches your current Codespaces URL
  baseURL: inferBaseURL(),
  secret: process.env.BETTER_AUTH_SECRET,

  plugins: [nextCookies()],
});