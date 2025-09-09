"use client";
import { createAuthClient } from "better-auth/react";

// Hooks (useSession) + methods (signIn/signUp/signOut)
export const authClient = createAuthClient({
  // baseURL: process.env.NEXT_PUBLIC_SITE_URL, // optional if same-origin
});