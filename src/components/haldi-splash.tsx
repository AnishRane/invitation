export function HaldiSplash({ className = "" }: { className?: string }) {
  return <svg className={`haldi-splash ${className}`} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
    <g fill="currentColor">
      <path opacity=".24" d="M48 62C32 41 53 20 74 33C86 13 111 25 111 44C137 31 157 54 142 75C169 83 171 111 145 119C156 143 136 162 115 146C105 173 76 174 69 147C44 161 24 140 39 117C12 108 15 80 41 80C35 71 40 66 48 62Z" />
      <path opacity=".32" d="M52 78C43 61 61 45 77 53C88 40 107 46 110 62C132 55 144 72 132 88C150 101 145 121 126 123C126 145 102 152 90 136C73 151 52 137 57 120C36 118 32 95 52 88Z" />
      <path opacity=".17" d="M70 53C83 31 111 46 112 67C136 59 150 84 135 103C153 126 128 151 108 137C91 156 63 141 65 119C43 105 48 74 70 72Z" />
      <g opacity=".5">
        <ellipse cx="29" cy="47" rx="3" ry="7" transform="rotate(-34 29 47)" />
        <ellipse cx="145" cy="32" rx="3.5" ry="7" transform="rotate(35 145 32)" />
        <ellipse cx="168" cy="91" rx="6" ry="3" transform="rotate(-12 168 91)" />
        <ellipse cx="149" cy="159" rx="3" ry="6" transform="rotate(-33 149 159)" />
        <circle cx="48" cy="164" r="3.5" /><circle cx="22" cy="130" r="2.5" />
        <circle cx="70" cy="23" r="2" /><circle cx="125" cy="174" r="2.5" />
      </g>
      <g opacity=".35"><circle cx="16" cy="65" r="1.7" /><circle cx="158" cy="49" r="2" /><circle cx="182" cy="119" r="1.5" /><circle cx="35" cy="177" r="1.5" /><circle cx="83" cy="180" r="2" /></g>
    </g>
  </svg>;
}
