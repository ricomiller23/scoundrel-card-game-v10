import React from 'react'
import { Rank, Suit } from '@/lib/types'

interface MonsterArtProps {
  rank: Rank
  suit: Suit
}

export const MonsterArt: React.FC<MonsterArtProps> = ({ rank, suit }) => {
  const isSpade = suit === 'spades'
  const primaryStroke = isSpade ? '#D4AF37' : '#C5A059'
  const accentFill = isSpade ? '#2A1810' : '#1C1917'

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 flex items-center justify-center">
      {/* Engraved Circular Medallion */}
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none" aria-hidden="true">
        <defs>
          <radialGradient id={`mon-grad-${rank}-${suit}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2A1B14" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#17120E" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#0B0907" stopOpacity="1" />
          </radialGradient>
          <pattern id={`hatch-${rank}-${suit}`} width="4" height="4" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="#7E1E1E" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
        </defs>

        {/* Outer Filigree Ring */}
        <circle cx="60" cy="60" r="56" fill={`url(#mon-grad-${rank}-${suit})`} stroke="#C9A227" strokeWidth="1.2" strokeDasharray="3 1.5" />
        <circle cx="60" cy="60" r="51" fill="none" stroke="#7E1E1E" strokeWidth="0.8" />
        <circle cx="60" cy="60" r="49" fill={`url(#hatch-${rank}-${suit})`} opacity="0.6" />

        {/* 13 Hand-Authored Monster Engravings */}
        {rank === '2' && (
          // Sewer Rat
          <g transform="translate(25, 25) scale(0.6)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M20 70 Q30 50 55 45 Q75 40 85 55 Q90 65 75 75 Z" fill="#3D1D16" />
            <path d="M75 55 Q95 50 100 60 Q90 68 75 65" fill="#4A251D" />
            <circle cx="85" cy="56" r="2.5" fill="#F2D06B" />
            <path d="M88 64 Q105 66 112 60" />
            <path d="M88 66 Q105 72 110 76" />
            <path d="M20 70 Q5 75 2 65 Q-2 50 15 45" />
            <path d="M45 75 L45 88 M65 75 L70 88" strokeWidth="2" />
          </g>
        )}

        {rank === '3' && (
          // Shadow Bat
          <g transform="translate(20, 26) scale(0.68)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M60 45 Q40 10 10 30 Q25 60 40 55 Q50 75 60 70 Q70 75 80 55 Q95 60 110 30 Q80 10 60 45 Z" fill="#311914" />
            <circle cx="55" cy="48" r="2" fill="#E53E3E" />
            <circle cx="65" cy="48" r="2" fill="#E53E3E" />
            <path d="M57 56 L60 60 L63 56" />
            <path d="M25 35 Q40 40 50 50" strokeWidth="1" strokeDasharray="1 1" />
            <path d="M95 35 Q80 40 70 50" strokeWidth="1" strokeDasharray="1 1" />
          </g>
        )}

        {rank === '4' && (
          // Cave Viper
          <g transform="translate(22, 22) scale(0.65)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M30 90 Q15 60 35 40 Q55 20 80 35 Q100 50 85 75 Q70 95 45 80 Q30 70 45 55 Q60 45 70 55" strokeWidth="3" />
            <path d="M78 30 Q92 25 96 35 Q90 44 80 38 Z" fill="#4B1E17" />
            <circle cx="88" cy="32" r="2" fill="#F2D06B" />
            <path d="M96 35 L106 33 L110 28 M106 33 L110 38" stroke="#E53E3E" strokeWidth="1.2" />
          </g>
        )}

        {rank === '5' && (
          // Dire Wolf
          <g transform="translate(22, 20) scale(0.65)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M25 40 L45 20 L50 35 Q70 30 85 45 L105 50 L95 65 L80 65 L70 85 L50 85 L45 70 L30 65 Z" fill="#3B1C16" />
            <path d="M75 52 L85 54 L75 58 Z" fill="#FAF5FF" />
            <circle cx="68" cy="44" r="2.5" fill="#E53E3E" />
            <path d="M35 30 L45 42 M85 58 L98 62 M80 66 L90 75" />
          </g>
        )}

        {rank === '6' && (
          // Skeleton Warrior
          <g transform="translate(25, 20) scale(0.6)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M35 25 Q60 10 85 25 L80 50 Q60 65 40 50 Z" fill="#2E1C17" />
            <circle cx="48" cy="38" r="4.5" fill="#0B0907" stroke="#C9A227" strokeWidth="1" />
            <circle cx="72" cy="38" r="4.5" fill="#0B0907" stroke="#C9A227" strokeWidth="1" />
            <path d="M57 48 L63 48 L60 54 Z" fill="#C9A227" />
            <path d="M48 60 L72 60 M52 56 L52 64 M60 56 L60 64 M68 56 L68 64" strokeWidth="1.8" />
            <path d="M25 22 L35 28 M95 22 L85 28" strokeWidth="2" />
            <path d="M60 66 L60 95 M42 75 L78 75 M45 85 L75 85" strokeWidth="2.5" />
          </g>
        )}

        {rank === '7' && (
          // Crypt Gargoyle
          <g transform="translate(20, 20) scale(0.65)" stroke={primaryStroke} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <path d="M15 40 Q40 20 50 45 Q70 20 95 40 Q85 70 60 85 Q35 70 15 40 Z" fill="#3D201A" />
            <path d="M35 25 L45 38 M75 25 L65 38" strokeWidth="2" />
            <circle cx="45" cy="48" r="3" fill="#F2D06B" />
            <circle cx="65" cy="48" r="3" fill="#F2D06B" />
            <path d="M48 62 Q55 68 62 62" strokeWidth="2" />
            <path d="M20 40 Q5 60 18 80 M90 40 Q105 60 92 80" strokeWidth="1.8" />
          </g>
        )}

        {rank === '8' && (
          // Horned Minotaur
          <g transform="translate(20, 18) scale(0.65)" stroke={primaryStroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M20 15 Q25 45 45 40 Q35 75 60 88 Q85 75 75 40 Q95 45 100 15 Q80 25 72 38 Q60 30 48 38 Q40 25 20 15 Z" fill="#441C15" />
            <ellipse cx="60" cy="65" rx="14" ry="10" fill="#24120D" stroke="#C9A227" strokeWidth="1.2" />
            <circle cx="54" cy="65" r="2.5" fill="#E53E3E" />
            <circle cx="66" cy="65" r="2.5" fill="#E53E3E" />
            <circle cx="60" cy="78" r="5" stroke="#F2D06B" strokeWidth="1.8" />
          </g>
        )}

        {rank === '9' && (
          // Venomous Wyvern
          <g transform="translate(18, 18) scale(0.68)" stroke={primaryStroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M10 50 Q35 15 60 40 Q85 15 110 50 Q85 60 65 52 Q60 85 45 95 Q55 80 55 55 Q35 60 10 50 Z" fill="#3D1812" />
            <circle cx="58" cy="38" r="2.5" fill="#E53E3E" />
            <circle cx="68" cy="38" r="2.5" fill="#E53E3E" />
            <path d="M52 46 L72 46 L62 55 Z" fill="#F2D06B" />
            <path d="M45 95 L35 105 L45 102 L52 108" stroke="#E53E3E" strokeWidth="1.5" />
          </g>
        )}

        {rank === '10' && (
          // Cave Troll
          <g transform="translate(18, 16) scale(0.68)" stroke={primaryStroke} strokeWidth="1.7" fill="none" strokeLinecap="round">
            <path d="M30 40 Q60 15 90 40 Q98 75 80 92 Q60 100 40 92 Q22 75 30 40 Z" fill="#381D17" />
            <path d="M35 48 Q60 38 85 48" strokeWidth="2.5" />
            <circle cx="45" cy="54" r="3" fill="#F2D06B" />
            <circle cx="75" cy="54" r="3" fill="#F2D06B" />
            <path d="M40 76 Q60 68 80 76" strokeWidth="2" />
            <path d="M46 76 L50 68 L54 76 M66 76 L70 68 L74 76" fill="#FFF" stroke="#FFF" strokeWidth="1" />
          </g>
        )}

        {rank === 'J' && (
          // Dark Knight (11)
          <g transform="translate(20, 16) scale(0.68)" stroke={primaryStroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M35 30 Q60 15 85 30 L90 70 Q60 95 30 70 Z" fill="#2B1612" />
            <path d="M60 15 L60 85 M40 45 L80 45" strokeWidth="2" stroke="#F2D06B" />
            <path d="M45 42 H75 V48 H45 Z" fill="#0B0907" stroke="#E53E3E" strokeWidth="1.2" />
            <path d="M30 30 Q20 50 25 70 M90 30 Q100 50 95 70" strokeWidth="2" />
            <circle cx="60" cy="22" r="3" fill="#F2D06B" />
          </g>
        )}

        {rank === 'Q' && (
          // Shadow Sorceress (12)
          <g transform="translate(20, 15) scale(0.68)" stroke={primaryStroke} strokeWidth="1.6" fill="none" strokeLinecap="round">
            <path d="M30 45 Q60 10 90 45 Q95 85 60 95 Q25 85 30 45 Z" fill="#2E1210" />
            <path d="M40 30 L50 18 L60 28 L70 18 L80 30" stroke="#F2D06B" strokeWidth="2" fill="none" />
            <circle cx="60" cy="40" r="3.5" fill="#9F7AEA" stroke="#F2D06B" strokeWidth="1.2" />
            <path d="M46 56 Q52 52 58 56 M62 56 Q68 52 74 56" stroke="#F2D06B" strokeWidth="1.5" />
            <path d="M52 68 Q60 74 68 68" stroke="#E53E3E" strokeWidth="1.5" />
          </g>
        )}

        {rank === 'K' && (
          // Crowned Tyrant / Lich King (13)
          <g transform="translate(18, 14) scale(0.7)" stroke={primaryStroke} strokeWidth="1.7" fill="none" strokeLinecap="round">
            {/* Crown */}
            <path d="M32 35 L30 18 L45 28 L60 12 L75 28 L90 18 L88 35 Z" fill="#C9A227" stroke="#F2D06B" strokeWidth="1.5" />
            {/* Skull Face */}
            <path d="M35 35 Q60 25 85 35 L88 65 Q60 92 32 65 Z" fill="#26100D" />
            <circle cx="48" cy="48" r="5" fill="#0B0907" stroke="#F2D06B" strokeWidth="1.2" />
            <circle cx="72" cy="48" r="5" fill="#0B0907" stroke="#F2D06B" strokeWidth="1.2" />
            <circle cx="48" cy="48" r="2" fill="#E53E3E" />
            <circle cx="72" cy="48" r="2" fill="#E53E3E" />
            <path d="M56 60 L64 60 L60 66 Z" fill="#C9A227" />
            <path d="M46 72 H74 M50 68 V76 M58 68 V76 M66 68 V76" strokeWidth="1.8" />
          </g>
        )}

        {rank === 'A' && (
          // Ancient Dragon (14) - The Apex Terror
          <g transform="translate(15, 12) scale(0.74)" stroke={primaryStroke} strokeWidth="1.8" fill="none" strokeLinecap="round">
            {/* Horns */}
            <path d="M40 35 Q20 15 10 2 Q28 15 45 25 M80 35 Q100 15 110 2 Q92 15 75 25" stroke="#F2D06B" strokeWidth="2.2" fill="#3D1A14" />
            {/* Dragon Head */}
            <path d="M35 45 Q60 20 85 45 L98 62 L82 72 L60 96 L38 72 L22 62 Z" fill="#38100B" />
            {/* Eye */}
            <circle cx="48" cy="48" r="4" fill="#F2D06B" />
            <line x1="48" y1="44" x2="48" y2="52" stroke="#7E1E1E" strokeWidth="2" />
            <circle cx="72" cy="48" r="4" fill="#F2D06B" />
            <line x1="72" y1="44" x2="72" y2="52" stroke="#7E1E1E" strokeWidth="2" />
            {/* Spikes & Nostrils */}
            <circle cx="54" cy="65" r="1.5" fill="#E53E3E" />
            <circle cx="66" cy="65" r="1.5" fill="#E53E3E" />
            <path d="M38 72 L45 80 L52 72 L60 82 L68 72 L75 80 L82 72" fill="#FAF5FF" stroke="#FFF" strokeWidth="1.2" />
            {/* Flame Plume */}
            <path d="M60 88 Q70 102 60 114 Q50 104 60 88 Z" fill="#E53E3E" stroke="#F2D06B" strokeWidth="1.2" />
          </g>
        )}

        {/* Inner Engraved Accent Border */}
        <circle cx="60" cy="60" r="46" fill="none" stroke="#F2D06B" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
    </div>
  )
}
