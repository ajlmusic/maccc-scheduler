import { toNextJsHandler } from "better-auth/next-js";
import { getAuthForOrigin } from "@/lib/auth-factory";

export const runtime = "nodejs";

// We create the handler per request, so baseURL always matches the caller's origin
export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const auth = getAuthForOrigin(origin);
  const { GET } = toNextJsHandler(auth.handler);
  return GET!(req);
}

export async function POST(req: Request) {
  const origin = new URL(req.url).origin;
  const auth = getAuthForOrigin(origin);
  const { POST } = toNextJsHandler(auth.handler);
  return POST!(req);
}