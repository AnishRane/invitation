import type { EventId } from "@/lib/wedding";
import { HaldiSplash } from "./haldi-splash";

function WeddingPetals({ className }: { className: string }) {
  return <svg className={`wedding-petals ${className}`} viewBox="0 0 200 240" aria-hidden="true" focusable="false">
    <g fill="var(--rosewood)">
      <path opacity=".18" d="M37 66C15 39 39 13 65 29C78 7 110 17 109 44C139 30 157 59 139 81C167 99 151 129 124 124C119 154 83 157 74 129C44 144 19 119 35 96C17 87 22 74 37 66Z" />
      <path opacity=".24" d="M58 71C45 52 62 35 80 44C95 30 115 46 108 63C133 64 140 89 120 103C124 126 95 138 82 120C62 132 43 112 52 96C36 87 42 72 58 71Z" />
      <path opacity=".2" d="M72 70C79 51 103 55 103 75C125 84 114 108 96 105C83 123 60 109 67 93C49 82 59 65 72 70Z" />
      <path opacity=".36" d="M97 83C84 72 70 81 75 94C79 104 97 105 104 94M62 58C47 76 51 102 73 116M112 53C132 76 122 108 104 117" fill="none" stroke="var(--rosewood)" strokeWidth="1.2" strokeLinecap="round" />
      <path opacity=".3" d="M41 153C51 148 61 155 61 168C49 172 39 165 41 153ZM121 166C130 153 142 157 144 169C137 180 125 181 121 166ZM89 197C95 188 105 189 110 199C104 210 92 209 89 197ZM151 120C162 114 169 120 166 131C156 137 149 132 151 120Z" />
    </g>
    <g fill="none" stroke="var(--wedding-gold)" strokeWidth="1.3" strokeLinecap="round" opacity=".72">
      <path d="M25 99C23 140 52 178 94 187M39 143C23 140 18 128 21 118C34 120 42 129 39 143ZM53 163C49 147 56 136 65 132C72 145 68 158 53 163ZM72 178C59 181 49 176 46 166C59 161 70 166 72 178ZM114 129C138 116 150 91 148 61M137 102C135 88 142 78 154 76C159 90 151 99 137 102Z" />
      <path d="M157 156V164M153 160H161M60 211V217M57 214H63" />
    </g>
    <g fill="var(--wedding-gold)" opacity=".65">
      <circle cx="27" cy="178" r="2" /><circle cx="145" cy="196" r="1.5" /><circle cx="173" cy="97" r="2" />
      <path d="M118 143L121 148L118 153L115 148ZM45 192L47 196L45 200L43 196Z" />
    </g>
  </svg>;
}

export function EventAccents({ eventId }: { eventId: EventId }) {
  return eventId === "haldi"
    ? <><HaldiSplash className="haldi-splash-top" /><HaldiSplash className="haldi-splash-bottom" /></>
    : <><WeddingPetals className="wedding-petals-top" /><WeddingPetals className="wedding-petals-bottom" /></>;
}
