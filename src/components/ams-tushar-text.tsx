"use client";

import metrics from "@/lib/ams-tushar-metrics.json";
import { useLanguage } from "./language-provider";

// Only verified lettering uses the legacy font. All source text remains Unicode.
export function AmsTusharText({ text }: { text: string }) {
  const { locale } = useLanguage();
  const glyph = locale === "mr" ? metrics[text as keyof typeof metrics] : undefined;
  if (!glyph) return <>{text}</>;

  return <span className="ams-tushar-text" onCopy={(event) => { event.preventDefault(); event.clipboardData.setData("text/plain", text); }}>
    <span className="ams-tushar-source">{text}</span>
    <svg className="ams-tushar-lettering" aria-hidden="true" focusable="false" viewBox={`0 0 ${glyph.width} ${glyph.height}`} style={{ width: `${glyph.width / 1000}em` }}>
      <use href={`/calligraphy/ams-tushar.svg#${glyph.id}`} />
    </svg>
  </span>;
}
