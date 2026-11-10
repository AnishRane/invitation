import { NextResponse, type NextRequest } from "next/server.js";
import { languageCookie, parseLocale } from "./lib/i18n.ts";
import { isInvitationPage, localeFromPath, localeHeader, localizedPath, withoutLocale } from "./lib/locale-routing.ts";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = localeFromPath(pathname);
  const headers = new Headers(request.headers);
  headers.delete(localeHeader);

  if (locale) {
    headers.set(localeHeader, locale);
    const destination = request.nextUrl.clone();
    destination.pathname = withoutLocale(pathname);
    // Only page routes are rewritten; APIs and assets keep their root URLs.
    const response = isInvitationPage(destination.pathname)
      ? NextResponse.rewrite(destination, { request: { headers } })
      : NextResponse.next({ request: { headers } });
    if (request.cookies.get(languageCookie)?.value !== locale) {
      response.cookies.set(languageCookie, locale, { path: "/", maxAge: 31536000, sameSite: "lax" });
    }
    return response;
  }

  if (isInvitationPage(pathname)) {
    const destination = request.nextUrl.clone();
    destination.pathname = localizedPath(pathname, parseLocale(request.cookies.get(languageCookie)?.value));
    return NextResponse.redirect(destination);
  }
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/", "/family", "/celebrations", "/en/:path*", "/mr/:path*"],
};
