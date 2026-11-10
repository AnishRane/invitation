import { cookies, headers } from "next/headers";
import { languageCookie, parseLocale } from "./i18n";
import { localeHeader } from "./locale-routing";

export async function getRequestLocale() {
  const locale = (await headers()).get(localeHeader);
  if (locale === "en" || locale === "mr") return locale;
  return parseLocale((await cookies()).get(languageCookie)?.value);
}
