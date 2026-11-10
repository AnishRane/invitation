import type { Metadata } from "next";
import { Celebrations } from "@/components/celebrations";
import { getRequestLocale } from "@/lib/server-language";
import { translate } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { return { title: translate(await getRequestLocale(), "events.heading") }; }
export default async function CelebrationsPage({ searchParams }: { searchParams: Promise<{ side?: string }> }) {
  const { side } = await searchParams;
  return <Celebrations side={side === "bride" ? "bride" : "groom"} />;
}
