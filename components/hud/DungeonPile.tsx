'use client'

import React from 'react'
import { CardBack } from '../cards/CardBack'

interface DungeonPileProps {
  count: number
}

export const DungeonPile: React.FC<DungeonPileProps> = ({ count }) => {
  // Visual layers scale with card count (up to 6 edges)
  const layers = Math.min(6, Math.max(1, Math.ceil(count / 7)))

  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full flex items-center justify-between mb-1.5 px-3 py-1 rounded-lg bg-[#14100D]/95 border border-[#C9A227]/30 text-[10px] font-mono text-[#A39281]">
        <span className="uppercase tracking-widest">DUNGEON DECK</span>
        <span className="font-bold text-[#F2D06B] font-mono">{count} / 44</span>
      </div>

      <div className="relative w-32 sm:w-36 xl:w-40 h-44 sm:h-50 xl:h-56 flex items-center justify-center my-1">
        {count > 0 ? (
          <>
            {Array.from({ length: layers }).map((_, idx) => {
              const offset = idx * 2
              return (
                <div
                  key={idx}
                  className="absolute inset-0 rounded-lg overflow-hidden border border-[#C9A227]/20 shadow-md bg-[#161311]"
                  style={{
                    transform: `translate(${offset}px, ${-offset}px)`,
                    zIndex: idx
                  }}
                >
                  <CardBack className="opacity-75" />
                </div>
              )
            })}
            <div
              className="absolute inset-0 rounded-lg overflow-hidden border border-[#C9A227]/50 shadow-2xl bg-[#161311]"
              style={{
                transform: `translate(${layers * 2}px, ${-layers * 2}px)`,
                zIndex: 10
              }}
            >
              <CardBack />
              {/* Brass Count Plaque */}
              <div className="absolute bottom-2 inset-x-2 flex justify-center pointer-events-none">
                <div className="px-2 py-0.5 rounded bg-[#14100D]/95 border border-[#C9A227]/60 shadow-lg text-[10px] font-mono font-bold text-[#F2D06B]">
                  {count} REMAINING
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full rounded-lg border border-dashed border-stone-800 flex items-center justify-center text-[10px] text-stone-600 font-mono">
            DECK EXHAUSTED
          </div>
        )}
      </div>
    </div>
  )
}
