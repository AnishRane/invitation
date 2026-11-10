import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/rsvp-schema";
import { InvalidReceiptError, saveRsvp } from "@/lib/rsvp-store";
import { localizeError, parseLocale } from "@/lib/i18n";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const headers = { "Cache-Control": "no-store" };
  const locale = parseLocale(request.headers.get("accept-language")?.split(/[-,;]/)[0]);
  const fail = (message: string, status: number) => NextResponse.json({ error: localizeError(message, locale) }, { status, headers });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("Please send your RSVP from the invitation.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail("Expected a JSON response.", 415);

  try {
    // Bound the stream itself instead of trusting a client-supplied Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return fail("Please complete your response.", 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16384) { await reader.cancel(); return fail("Your response is too long.", 413); }
      chunks.push(value);
    }
    let payload: unknown;
    try { payload = JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { return fail("Please complete your response and try again.", 400); }
    const result = rsvpSchema.safeParse(payload);
    if (!result.success) return fail(result.error.issues[0]?.message || "Please check your response.", 400);
    const saved = await saveRsvp(result.data);
    return NextResponse.json(saved, { status: saved.updated ? 200 : 201, headers });
  } catch (error) {
    if (error instanceof InvalidReceiptError) return fail("This response could not be verified. Please use the browser you originally replied from.", 403);
    return fail("We couldn’t save your response just now. Please try again in a moment.", 503);
  }
}
