export function VenueMap() {
  return <svg className="venue-map" viewBox="0 0 600 360" aria-hidden="true" fill="none">
    <rect width="600" height="360" fill="#f6e8e7" />
    <g fill="#e8c7c5" opacity=".65"><rect x="20" y="20" width="140" height="95" rx="6" /><rect x="180" y="20" width="150" height="95" rx="6" /><rect x="350" y="20" width="230" height="95" rx="6" /><rect x="20" y="135" width="140" height="205" rx="6" /><rect x="180" y="135" width="150" height="95" rx="6" /><rect x="350" y="135" width="100" height="205" rx="6" /><rect x="470" y="135" width="110" height="205" rx="6" /><rect x="180" y="250" width="150" height="90" rx="6" /></g>
    <rect x="180" y="135" width="150" height="95" rx="6" fill="#6a6834" opacity=".12" />
    <g fill="#6a6834" opacity=".25"><circle cx="210" cy="160" r="10" /><circle cx="240" cy="175" r="13" /><circle cx="294" cy="196" r="14" /><circle cx="216" cy="205" r="8" /></g>
    <path d="M-20 330C180 325 252 252 600 55" stroke="#d29d9b" strokeWidth="22" /><path d="M-20 330C180 325 252 252 600 55" stroke="#fceeed" strokeWidth="15" />
    <path className="map-route" d="M65 296H170V125H460V84" stroke="#8b4152" strokeWidth="2" strokeDasharray="2 9" strokeLinecap="round" />
    <circle cx="65" cy="296" r="8" fill="#f6e8e7" stroke="#8b4152" strokeWidth="2" /><circle cx="65" cy="296" r="3" fill="#8b4152" />
    <circle cx="460" cy="83" r="40" fill="#f6e8e7" fillOpacity=".65" /><circle cx="460" cy="83" r="28" fill="#e8c7c5" fillOpacity=".7" />
    <path d="M460 104c-10-14-17-22-17-31a17 17 0 0 1 34 0c0 9-7 17-17 31Z" fill="#a6636f" stroke="#8b4152" strokeWidth="1.5" /><circle cx="460" cy="73" r="5.5" fill="#f6e8e7" />
  </svg>;
}
