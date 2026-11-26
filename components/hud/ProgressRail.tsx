'use client'

import React from 'react'

interface ProgressRailProps {
  cardsFacedTotal: number
  roomsCleared: number
}

export const ProgressRail: React.FC<ProgressRailProps> = ({ cardsFacedTotal, roomsCleared }) => {
  const percent = Math.min(100, Math.round((cardsFacedTotal / 44) * 100))

  return (
    <div className="w-full max-w-md flex flex-col gap-1 select-none">
      <div className="flex items-center justify-between text-[11px] font-mono text-[#A39281]">
        <span>DUNGEON PROGRESS</span>
        <span className="font-bold text-[#F2D06B]">
          ROOM {roomsCleared + 1} • {cardsFacedTotal}/44 CARDS ({percent}%)
        </span>
      </div>

      <div className="relative w-full h-2 rounded-full overflow-hidden bg-[#161311] border border-[#C9A227]/30 shadow-inner">
        <div
          className="h-full bg-gradient-to-r from-[#C9A227] via-[#F2D06B] to-[#FFE28A] transition-all duration-500 shadow-[0_0_8px_rgba(242,208,107,0.5)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
