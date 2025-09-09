"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-black text-2xl font-bold text-center">Create account</h1>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const { data, error } = await authClient.signUp.email({ email, password });
            if (error) {
              setErr(error.message ?? "Sign up failed");
              return;
            }
            router.push("/dashboard");
          }}
          className="space-y-4"
        >
          <input
            type="email"
            className="w-full text-black rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            className="w-full text-black rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
          >
            Sign up
          </button>
          {err && <p className="text-sm text-red-600">{err}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-600 hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}