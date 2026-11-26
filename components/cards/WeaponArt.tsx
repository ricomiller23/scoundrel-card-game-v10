import React from 'react'
import { Rank } from '@/lib/types'

interface WeaponArtProps {
  rank: Rank
}

export const WeaponArt: React.FC<WeaponArtProps> = ({ rank }) => {
  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none" aria-hidden="true">
        <defs>
          <radialGradient id={`wep-grad-${rank}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1E293B" stopOpacity="0.95" />
            <stop offset="70%" stopColor="#0F172A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B0907" stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`steel-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id={`gold-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#CA8A04" />
          </linearGradient>
        </defs>

        {/* Steel-Blue Diamond Medallion Frame */}
        <path d="M60 6 L114 60 L60 114 L6 60 Z" fill={`url(#wep-grad-${rank})`} stroke="#38BDF8" strokeWidth="1.2" strokeDasharray="3 1.5" />
        <path d="M60 12 L108 60 L60 108 L12 60 Z" fill="none" stroke="#C9A227" strokeWidth="0.8" />

        {/* 9 Hand-Authored Weapons */}
        {rank === '2' && (
          // Iron Dagger
          <g transform="translate(30, 20) scale(0.65)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M45 15 L50 70 L40 70 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" />
            <line x1="45" y1="15" x2="45" y2="70" stroke="#475569" strokeWidth="1" />
            <rect x="30" y="70" width="30" height="6" rx="2" fill="#CA8A04" stroke="#FDE047" />
            <rect x="42" y="76" width="6" height="22" rx="1" fill="#78350F" />
            <circle cx="45" cy="102" r="5" fill="#CA8A04" stroke="#FDE047" />
          </g>
        )}

        {rank === '3' && (
          // Curved Scimitar
          <g transform="translate(25, 20) scale(0.65)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M40 80 Q50 40 75 15 Q60 45 42 75 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" />
            <path d="M35 78 Q38 88 48 84" stroke="#CA8A04" strokeWidth="4" fill="none" />
            <rect x="38" y="84" width="7" height="18" rx="1" transform="rotate(-15 38 84)" fill="#78350F" />
            <circle cx="36" cy="106" r="4.5" fill="#CA8A04" />
          </g>
        )}

        {rank === '4' && (
          // Steel Shortsword
          <g transform="translate(28, 16) scale(0.68)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <path d="M46 10 L54 25 L53 72 L47 72 L46 25 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" />
            <line x1="50" y1="18" x2="50" y2="72" stroke="#475569" strokeWidth="1.5" />
            <path d="M26 72 Q50 70 74 72" stroke="#CA8A04" strokeWidth="4" />
            <rect x="47" y="74" width="6" height="22" rx="1" fill="#78350F" />
            <circle cx="50" cy="100" r="5.5" fill="#CA8A04" stroke="#FDE047" strokeWidth="1" />
          </g>
        )}

        {rank === '5' && (
          // Spiked Morningstar
          <g transform="translate(25, 18) scale(0.68)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <rect x="47" y="55" width="6" height="50" rx="2" fill="#78350F" stroke="#94A3B8" strokeWidth="1.5" />
            <circle cx="50" cy="35" r="16" fill={`url(#steel-${rank})`} stroke="#CBD5E1" strokeWidth="2" />
            {/* Spikes */}
            <path d="M50 12 L50 20 M50 50 L50 58 M27 35 L35 35 M65 35 L73 35 M34 19 L40 25 M66 19 L60 25 M34 51 L40 45 M66 51 L60 45" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="50" cy="35" r="4" fill="#E2E8F0" />
          </g>
        )}

        {rank === '6' && (
          // Flanged War Mace
          <g transform="translate(25, 15) scale(0.68)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <rect x="47" y="45" width="6" height="60" rx="2" fill="#475569" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Flanges */}
            <path d="M42 15 Q30 30 42 45 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <path d="M58 15 Q70 30 58 45 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" strokeWidth="1.5" />
            <rect x="46" y="10" width="8" height="38" fill="#CBD5E1" stroke="#F8FAFC" />
            <path d="M50 4 L53 10 L47 10 Z" fill="#CA8A04" stroke="#FDE047" strokeWidth="1" />
            <circle cx="50" cy="108" r="5" fill="#CA8A04" />
          </g>
        )}

        {rank === '7' && (
          // Battle Halberd
          <g transform="translate(24, 15) scale(0.68)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            <rect x="48" y="20" width="5" height="90" fill="#78350F" stroke="#475569" strokeWidth="1" />
            {/* Axe blade */}
            <path d="M48 25 Q20 30 24 50 Q48 55 48 40 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Rear spike */}
            <path d="M53 32 L75 35 L53 40 Z" fill={`url(#steel-${rank})`} stroke="#CBD5E1" />
            {/* Top spearhead */}
            <path d="M50 5 L56 22 L44 22 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          </g>
        )}

        {rank === '8' && (
          // Executioner Greatsword
          <g transform="translate(28, 12) scale(0.7)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            {/* Broad flat-tip blade */}
            <path d="M42 12 L58 12 L56 68 L44 68 Z" fill={`url(#steel-${rank})`} stroke="#E2E8F0" strokeWidth="1.8" />
            <line x1="50" y1="16" x2="50" y2="65" stroke="#334155" strokeWidth="2" />
            {/* Crossguard */}
            <path d="M22 68 H78" stroke="#CA8A04" strokeWidth="5" />
            <rect x="47" y="72" width="6" height="28" rx="1" fill="#78350F" />
            <circle cx="50" cy="104" r="6" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
          </g>
        )}

        {rank === '9' && (
          // Zweihänder
          <g transform="translate(26, 10) scale(0.72)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            {/* Flammard Wavy Blade */}
            <path d="M50 6 L55 22 Q46 30 55 42 Q46 54 54 66 L46 66 Q54 54 45 42 Q54 30 45 22 Z" fill={`url(#steel-${rank})`} stroke="#E2E8F0" strokeWidth="1.8" />
            {/* Parrying Lugs */}
            <path d="M38 52 L62 52" stroke="#CA8A04" strokeWidth="3" />
            {/* Main Guard with side rings */}
            <path d="M20 68 H80" stroke="#CA8A04" strokeWidth="5" />
            <circle cx="35" cy="68" r="4" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="65" cy="68" r="4" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            {/* Long two-handed grip */}
            <rect x="47" y="72" width="6" height="32" rx="1" fill="#451A03" />
            <circle cx="50" cy="108" r="6.5" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
          </g>
        )}

        {rank === '10' && (
          // Legendary Runed Sun Blade
          <g transform="translate(24, 8) scale(0.74)" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
            {/* Luminous Blade */}
            <path d="M50 4 L57 20 L55 65 L45 65 L43 20 Z" fill={`url(#steel-${rank})`} stroke="#FDE047" strokeWidth="2" />
            {/* Glowing Runes */}
            <path d="M50 18 L50 24 M48 20 L52 20 M50 32 L47 38 L53 38 M50 46 L50 54 M47 50 L53 50 M50 58 L52 61" stroke="#38BDF8" strokeWidth="2" />
            {/* Winged Sun Crossguard */}
            <path d="M16 66 Q50 60 84 66 L78 72 Q50 68 22 72 Z" fill={`url(#gold-${rank})`} stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="50" cy="67" r="4" fill="#38BDF8" stroke="#FFF" strokeWidth="1" />
            {/* Grip & Sun Pommel */}
            <rect x="47" y="72" width="6" height="26" rx="1" fill="#78350F" />
            <circle cx="50" cy="104" r="7" fill={`url(#gold-${rank})`} stroke="#FDE047" strokeWidth="2" />
            <circle cx="50" cy="104" r="3" fill="#38BDF8" />
          </g>
        )}

        {/* Inset Diamond Accent */}
        <path d="M60 22 L98 60 L60 98 L22 60 Z" fill="none" stroke="#38BDF8" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
    </div>
  )
}
