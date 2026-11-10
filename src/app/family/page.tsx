import type { Metadata } from "next";
import { FamilySelector } from "@/components/family-selector";
import { getRequestLocale } from "@/lib/server-language";
import { translate } from "@/lib/i18n";

export async function generateMetadata(): Promise<Metadata> { return { title: translate(await getRequestLocale(), "family.chooseLabel") }; }
export default function FamilyPage() { return <FamilySelector />; }
