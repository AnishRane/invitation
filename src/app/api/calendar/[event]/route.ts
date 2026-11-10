import { eventsForSide, googleCalendarUrl } from "@/lib/wedding";
import { languageCookie, parseLocale } from "@/lib/i18n";

export async function GET(request: Request, { params }: { params: Promise<{ event: string }> }) {
  const { event: id } = await params;
  const query = new URL(request.url).searchParams;
  const side = query.get("side");
  const savedLanguage = request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${languageCookie}=`))?.split("=")[1];
  const locale = parseLocale(query.get("lang") || savedLanguage);
  const event = eventsForSide(side === "bride" ? "bride" : "groom").find((item) => item.id === id);
  if (!event) return new Response("Event not found", { status: 404 });
  return Response.redirect(googleCalendarUrl(event, locale), 307);
}
