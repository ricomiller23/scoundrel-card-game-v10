import React from 'react'

interface CardBackProps {
  className?: string
}

export const CardBack: React.FC<CardBackProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full h-full rounded-xl overflow-hidden border border-[#C9A227]/40 bg-[#3B0E0E] shadow-2xl select-none ${className}`}>
      {/* Oxblood Vignette */}
      <div className="absolute inset-0 bg-radial from-[#571414] via-[#380B0B] to-[#1F0505]" />

      {/* Gold Filigree Geometric Lattice */}
      <svg className="absolute inset-0 w-full h-full opacity-60" viewBox="0 0 160 220" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <pattern id="lattice" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M0 8 L8 0 L16 8 L8 16 Z" fill="none" stroke="#C9A227" strokeWidth="0.6" strokeOpacity="0.7" />
            <circle cx="8" cy="8" r="1.5" fill="#F2D06B" fillOpacity="0.8" />
          </pattern>
        </defs>

        <rect x="6" y="6" width="148" height="208" rx="8" fill="url(#lattice)" stroke="#C9A227" strokeWidth="1" />
        <rect x="12" y="12" width="136" height="196" rx="6" fill="none" stroke="#F2D06B" strokeWidth="0.8" strokeDasharray="4 2" />

        {/* Center Emblem */}
        <circle cx="80" cy="110" r="32" fill="#240707" stroke="#C9A227" strokeWidth="1.5" />
        <circle cx="80" cy="110" r="26" fill="none" stroke="#F2D06B" strokeWidth="0.8" strokeDasharray="3 1.5" />
        <path d="M80 88 L85 105 L102 110 L85 115 L80 132 L75 115 L58 110 L75 105 Z" fill="#C9A227" stroke="#F2D06B" strokeWidth="0.8" />
        <circle cx="80" cy="110" r="4" fill="#571414" stroke="#F2D06B" strokeWidth="1" />
      </svg>

      {/* Subtle Specular Sheen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
    </div>
  )
}
