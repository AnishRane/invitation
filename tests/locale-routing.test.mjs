import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server.js";
import { proxy } from "../src/proxy.ts";
import { localeFromPath, localizedPath, withoutLocale, localeHeader } from "../src/lib/locale-routing.ts";

const origin = "https://invitation.example";
function request(path, savedLocale, extraHeaders = {}) {
  return new NextRequest(`${origin}${path}`, {
    headers: { ...extraHeaders, ...(savedLocale ? { cookie: `wedding-language=${savedLocale}` } : {}) },
  });
}

test("language paths match complete segments and switching keeps family, query, and section", () => {
  assert.equal(localeFromPath("/mr"), "mr");
  assert.equal(localeFromPath("/en/family"), "en");
  assert.equal(localeFromPath("/english"), null);
  assert.equal(localeFromPath("/mru/family"), null);
  assert.equal(localizedPath("/mr/celebrations?side=bride#rsvp", "en"), "/en/celebrations?side=bride#rsvp");
  assert.equal(localizedPath("/family", "mr"), "/mr/family");
  assert.equal(localizedPath("/", "en"), "/en");
  assert.equal(localizedPath("/en?source=invite#seal", "mr"), "/mr?source=invite#seal");
  assert.equal(withoutLocale("/mr"), "/");
  for (const external of ["https://maps.example/place", "//maps.example/place", "#rsvp", "mailto:guest@example.com"]) {
    assert.equal(localizedPath(external, "mr"), external);
  }
});

test("shared language links override an opposite saved preference before rendering", () => {
  for (const [locale, saved] of [["en", "mr"], ["mr", "en"]]) {
    for (const path of ["", "/family", "/celebrations?side=bride"]) {
      const response = proxy(request(`/${locale}${path}`, saved));
      assert.equal(response.headers.get("x-middleware-rewrite"), `${origin}${path || "/"}`);
      assert.equal(response.headers.get(`x-middleware-request-${localeHeader}`), locale);
      assert.match(response.headers.get("set-cookie"), new RegExp(`wedding-language=${locale};`));
      assert.equal(response.headers.get("location"), null);
    }
  }
});

test("old entry links redirect to the saved language and preserve query parameters", () => {
  for (const [saved, locale] of [[undefined, "en"], ["mr", "mr"], ["en", "en"], ["invalid", "en"]]) {
    for (const path of ["/", "/family", "/celebrations?side=groom"]) {
      const response = proxy(request(path, saved));
      assert.equal(response.status, 307);
      assert.equal(response.headers.get("location"), `${origin}${localizedPath(path, locale)}`);
    }
  }
});

test("localized unknown pages never rewrite to API endpoints or public assets", () => {
  for (const path of ["/mr/api/rsvp", "/en/ornaments.svg", "/mr/missing"]) {
    const response = proxy(request(path));
    assert.equal(response.headers.get("x-middleware-rewrite"), null);
    assert.equal(response.headers.get("location"), null);
    assert.equal(response.headers.get("x-middleware-next"), "1");
  }
  const response = proxy(request("/en", "en", { [localeHeader]: "mr" }));
  assert.equal(response.headers.get(`x-middleware-request-${localeHeader}`), "en");
});
