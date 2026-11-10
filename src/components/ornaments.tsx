import { useId } from "react";

const viewBoxes = {
  mandala: "0 0 200 200",
  paisley: "0 0 40 60",
  sprig: "0 0 170 200",
  crest: "0 0 220 64",
  arch: "0 0 358 96",
};

export function Ornament({ name, className = "" }: { name: keyof typeof viewBoxes; className?: string }) {
  return <svg aria-hidden="true" className={`ornament ${className}`} viewBox={viewBoxes[name]}><use href={`/ornaments.svg#${name}`} /></svg>;
}

function ToranFlower({ rose = false }: { rose?: boolean }) {
  const petal = rose ? "var(--toran-rose)" : "var(--toran-marigold)";
  const highlight = rose ? "var(--toran-rose-light)" : "var(--toran-marigold-light)";
  const center = rose ? "var(--toran-rose-center)" : "var(--toran-marigold-center)";
  return <g transform="translate(26 13)">
    <g fill={petal}>{Array.from({ length: 10 }, (_, index) => <ellipse key={index} cx="0" cy="-4.3" rx="2.6" ry="3.5" transform={`rotate(${index * 36})`} />)}</g>
    <circle r="4.2" fill={petal} />
    <g fill={highlight}>{Array.from({ length: 8 }, (_, index) => <ellipse key={index} cx="0" cy="-2.6" rx="1.6" ry="2.2" transform={`rotate(${index * 45 + 18})`} />)}</g>
    <circle r="2.1" fill={center} />
    <circle cx="-.5" cy="-.6" r=".7" fill={highlight} />
  </g>;
}

export function Toran({ className = "", animated = true }: { className?: string; animated?: boolean }) {
  const id = useId().replaceAll(":", "");
  return <div className={`toran ${animated ? "toran-animated" : ""} ${className}`} aria-hidden="true">
    {(["left", "right"] as const).map((side) => <div className={`toran-half toran-half-${side}`} key={side}>
      {/* Both halves contain the full-width artwork so the repeat meets seamlessly at any viewport width. */}
      <svg className="toran-art" width="200%" height="64">
        <defs><pattern id={`${id}-${side}`} width="104" height="64" patternUnits="userSpaceOnUse">
          {[0, 52].map((offset) => <g key={offset} transform={`translate(${offset} 0)`}>
          <path d="M0 5Q13 13 26 5Q39 13 52 5" fill="none" stroke="var(--sand)" strokeWidth="1.4" />
          <path d="M39 10C49 23 47 38 39 51C31 38 29 23 39 10Z" fill="var(--toran-leaf)" />
          <path d="M39 15V46" stroke="var(--petal)" strokeWidth=".7" />
          {[15, 24, 33, 41, 48].map((y, i) => <circle key={y} cx="13" cy={y} r={4.8 - i * .4} fill={i % 2 ? "var(--toran-marigold)" : "var(--rosewood)"} />)}
          <path d="M13 51V58" stroke="var(--leaf)" /><circle cx="13" cy="60" r="1.7" fill="var(--leaf)" />
          <ToranFlower rose={offset !== 0} />
          </g>)}
        </pattern></defs>
        <rect width="100%" height="64" fill={`url(#${id}-${side})`} /><path d="M0 1H10000" stroke="var(--rosewood)" strokeWidth="3" />
      </svg>
    </div>)}
  </div>;
}

export function Divider({ className = "" }: { className?: string }) {
  return <div className={`ornamental-divider ${className}`} aria-hidden="true"><Ornament name="paisley" /><span /><i /><span /><Ornament name="paisley" /></div>;
}

export function PatternBorder({ className = "" }: { className?: string }) {
  const id = useId().replaceAll(":", "");
  return <svg className={`pattern-border ${className}`} aria-hidden="true" width="100%" height="22"><defs>
    <pattern id={id} width="28" height="22" patternUnits="userSpaceOnUse"><path d="M0 1H28M0 21H28M0 21C0 11 7 7 14 4C21 7 28 11 28 21" fill="none" stroke="currentColor" strokeWidth=".8" /><circle cx="14" cy="13" r="1.8" fill="currentColor" /><circle cx="0" cy="10" r="1" fill="currentColor" /></pattern>
  </defs><rect width="100%" height="22" fill={`url(#${id})`} /></svg>;
}
