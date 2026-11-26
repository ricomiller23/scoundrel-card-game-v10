'use client'

import React from 'react'
import { CardBack } from '../cards/CardBack'

interface DiscardPileProps {
  count: number
}

export const DiscardPile: React.FC<DiscardPileProps> = ({ count }) => {
  return (
    <div className="w-full flex flex-col items-center select-none">
      <div className="w-full flex items-center justify-between mb-1.5 px-3 py-1 rounded-lg bg-[#14100D]/95 border border-[#C9A227]/30 text-[10px] font-mono text-[#A39281]">
        <span className="uppercase tracking-widest">DISCARD PILE</span>
        <span className="font-bold text-stone-300 font-mono">{count}</span>
      </div>

      <div className="relative w-32 sm:w-36 xl:w-40 h-44 sm:h-50 xl:h-56 rounded-lg border border-[#C9A227]/25 flex items-center justify-center bg-[#120F0D]/60 shadow-inner">
        {count > 0 ? (
          <div className="relative w-full h-full rounded-lg overflow-hidden shadow-md">
            <CardBack className="opacity-60" />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <span className="font-serif font-black text-2xl text-stone-300 drop-shadow">
                {count}
              </span>
              <span className="text-[9px] font-mono text-stone-400 uppercase tracking-wider mt-0.5">
                DISCARDED
              </span>
            </div>
          </div>
        ) : (
          <span className="text-[10px] text-stone-600 font-mono">EMPTY</span>
        )}
      </div>
    </div>
  )
}
