import React from 'react'
import { Rank } from '@/lib/types'

interface PotionArtProps {
  rank: Rank
}

export const PotionArt: React.FC<PotionArtProps> = ({ rank }) => {
  const value = parseInt(rank, 10) || 2
  // Glow intensity scales with value
  const glowOpacity = 0.35 + (value / 10) * 0.55

  return (
    <div className="relative w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 xl:w-48 xl:h-48 2xl:w-52 2xl:h-52 flex items-center justify-center">
      <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md select-none" aria-hidden="true">
        <defs>
          <radialGradient id={`pot-glow-${rank}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22C55E" stopOpacity={glowOpacity} />
            <stop offset="60%" stopColor="#15803D" stopOpacity={glowOpacity * 0.5} />
            <stop offset="100%" stopColor="#0B0907" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`elixir-${rank}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#14532D" />
            <stop offset="60%" stopColor="#16A34A" />
            <stop offset="100%" stopColor="#4ADE80" />
          </linearGradient>
          <linearGradient id={`glass-${rank}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E2E8F0" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Outer Aura Glow */}
        <circle cx="60" cy="60" r="50" fill={`url(#pot-glow-${rank})`} />

        {/* Heart Medallion Frame */}
        <circle cx="60" cy="60" r="54" fill="#0B150F" stroke="#22C55E" strokeWidth="1.2" strokeDasharray="3 1.5" />
        <circle cx="60" cy="60" r="48" fill="none" stroke="#C9A227" strokeWidth="0.8" />

        {/* 9 Hand-Authored Potions */}
        {rank === '2' && (
          // Tiny Medicine Vial
          <g transform="translate(35, 20) scale(0.65)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <rect x="35" y="45" width="30" height="50" rx="6" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <rect x="42" y="32" width="16" height="13" fill="#64748B" stroke="#94A3B8" />
            <rect x="40" y="24" width="20" height="9" rx="2" fill="#78350F" />
            <circle cx="50" cy="68" r="3" fill="#86EFAC" />
          </g>
        )}

        {rank === '3' && (
          // Corked Flask
          <g transform="translate(30, 18) scale(0.68)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <path d="M42 35 L42 48 L25 85 Q22 95 32 95 L68 95 Q78 95 75 85 L58 48 L58 35 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <rect x="40" y="22" width="20" height="13" rx="2" fill="#78350F" />
            <circle cx="45" cy="72" r="3.5" fill="#86EFAC" />
            <circle cx="55" cy="62" r="2" fill="#86EFAC" />
          </g>
        )}

        {rank === '4' && (
          // Round Alchemical Bottle
          <g transform="translate(25, 18) scale(0.7)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <circle cx="50" cy="68" r="28" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <rect x="44" y="28" width="12" height="14" fill="#64748B" stroke="#94A3B8" />
            <ellipse cx="50" cy="24" rx="9" ry="5" fill="#CA8A04" />
            <circle cx="42" cy="60" r="4" fill="#86EFAC" />
            <circle cx="58" cy="72" r="3" fill="#86EFAC" />
          </g>
        )}

        {rank === '5' && (
          // Elixir Beaker with Effervescent Bubbles
          <g transform="translate(25, 15) scale(0.7)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <path d="M30 35 L30 85 Q30 95 40 95 L60 95 Q70 95 70 85 L70 35 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <path d="M26 35 H74" stroke="#CBD5E1" strokeWidth="2.5" />
            <circle cx="42" cy="75" r="3.5" fill="#86EFAC" />
            <circle cx="56" cy="65" r="4.5" fill="#86EFAC" />
            <circle cx="46" cy="50" r="2.5" fill="#86EFAC" />
            <circle cx="54" cy="40" r="2" fill="#86EFAC" />
          </g>
        )}

        {rank === '6' && (
          // Spurred Lab Flask
          <g transform="translate(24, 15) scale(0.72)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <path d="M44 32 L44 50 L18 85 Q14 96 26 96 L74 96 Q86 96 82 85 L56 50 L56 32 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <rect x="41" y="20" width="18" height="12" rx="2" fill="#CA8A04" />
            <path d="M30 86 Q50 80 70 86" stroke="#86EFAC" strokeWidth="2" fill="none" />
            <circle cx="50" cy="70" r="5" fill="#86EFAC" />
            <circle cx="38" cy="78" r="3" fill="#86EFAC" />
          </g>
        )}

        {rank === '7' && (
          // Ornate Crystal Decanter
          <g transform="translate(25, 12) scale(0.72)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <path d="M44 36 L44 52 L26 70 L34 94 L66 94 L74 70 L56 52 L56 36 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            <path d="M50 14 L58 26 L42 26 Z" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
            <rect x="42" y="26" width="16" height="10" fill="#CA8A04" />
            <line x1="50" y1="52" x2="50" y2="94" stroke="#86EFAC" strokeWidth="1.5" strokeDasharray="3 3" />
          </g>
        )}

        {rank === '8' && (
          // Potion Amphora with Double Handles
          <g transform="translate(20, 12) scale(0.74)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            {/* Body */}
            <path d="M42 36 Q30 50 30 70 Q30 94 50 96 Q70 94 70 70 Q70 50 58 36 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            {/* Handles */}
            <path d="M32 46 Q16 54 22 72 Q26 78 30 76" fill="none" stroke="#CA8A04" strokeWidth="3" />
            <path d="M68 46 Q84 54 78 72 Q74 78 70 76" fill="none" stroke="#CA8A04" strokeWidth="3" />
            {/* Neck & Stopper */}
            <rect x="42" y="26" width="16" height="10" fill="#CA8A04" stroke="#FDE047" />
            <circle cx="50" cy="20" r="7" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="50" cy="65" r="6" fill="#86EFAC" />
          </g>
        )}

        {rank === '9' && (
          // Glowing Crystal Urn
          <g transform="translate(20, 10) scale(0.75)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            <path d="M35 34 L65 34 L72 65 Q74 94 50 96 Q26 94 28 65 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2" />
            {/* Filigree Rings */}
            <ellipse cx="50" cy="34" rx="16" ry="6" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
            <ellipse cx="50" cy="65" rx="22" ry="7" fill="none" stroke="#FDE047" strokeWidth="1.5" />
            <path d="M50 14 L56 28 L44 28 Z" fill="#CA8A04" stroke="#FDE047" />
            <circle cx="50" cy="65" r="7" fill="#86EFAC" />
            <circle cx="40" cy="78" r="4" fill="#86EFAC" />
            <circle cx="60" cy="78" r="4" fill="#86EFAC" />
          </g>
        )}

        {rank === '10' && (
          // Ornate Gilded Royal Carafe
          <g transform="translate(18, 8) scale(0.78)" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round">
            {/* Elaborate Gilded Carafe Body */}
            <path d="M34 40 Q22 60 26 80 Q32 98 50 98 Q68 98 74 80 Q78 60 66 40 Z" fill={`url(#elixir-${rank})`} stroke={`url(#glass-${rank})`} strokeWidth="2.5" />
            {/* Gold Filigree Overlays */}
            <path d="M30 65 Q50 50 70 65 Q50 80 30 65 Z" fill="none" stroke="#FDE047" strokeWidth="2" />
            <circle cx="50" cy="65" r="7" fill="#86EFAC" stroke="#FFF" strokeWidth="1.5" />
            {/* Spout & Royal Crown Stopper */}
            <rect x="42" y="26" width="16" height="14" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
            <path d="M38 26 L42 12 L50 20 L58 12 L62 26 Z" fill="#CA8A04" stroke="#FDE047" strokeWidth="1.5" />
            <circle cx="50" cy="12" r="3" fill="#22C55E" />
            {/* Handle */}
            <path d="M68 44 Q90 56 82 82 Q76 92 70 88" fill="none" stroke="#CA8A04" strokeWidth="3.5" />
          </g>
        )}

        {/* Bottom Engraved Accent */}
        <circle cx="60" cy="60" r="44" fill="none" stroke="#22C55E" strokeWidth="0.5" strokeOpacity="0.4" />
      </svg>
    </div>
  )
}
