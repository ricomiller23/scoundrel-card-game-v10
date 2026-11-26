'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { EquippedWeapon } from '@/lib/types'
import { Card } from '../cards/Card'
import { SuitGlyph } from '../cards/SuitGlyphs'

interface WeaponSlotProps {
  equipped: EquippedWeapon | null
  potionUsedThisRoom?: boolean
  className?: string
}

export const WeaponSlot: React.FC<WeaponSlotProps> = ({
  equipped,
  potionUsedThisRoom = false,
  className = ''
}) => {
  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* Slot Label & Ceiling HUD */}
      <div className="w-full flex items-center justify-between mb-2 px-3 py-1 rounded-lg bg-[#14100D]/95 border border-[#C9A227]/30 shadow-md">
        <span className="text-[10px] font-mono font-bold tracking-widest text-[#A39281] uppercase">
          BLADE
        </span>
        {equipped ? (
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-sky-500/40 bg-sky-950/80 text-sky-300">
            {equipped.lastSlain === null ? (
              <span className="text-emerald-400">FRESH</span>
            ) : (
              <span>&lt; {equipped.lastSlain}</span>
            )}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-stone-500">NONE</span>
        )}
      </div>

      {/* Main Weapon Display & Slain Stack Container */}
      <div className="relative w-full h-50 sm:h-58 xl:h-64 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {equipped ? (
            <motion.div
              key={equipped.card.id}
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 40, opacity: 0, scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="relative w-36 sm:w-40 xl:w-44 h-50 sm:h-56 xl:h-62"
            >
              {/* Stacked Slain Monsters Accordion Fanned Beneath */}
              {equipped.slain.map((slainMonster, idx) => {
                const offset = (idx + 1) * 14
                return (
                  <motion.div
                    key={slainMonster.id}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: offset, opacity: 0.95 }}
                    className="absolute inset-0 rounded-xl overflow-hidden border border-[#7E1E1E]/60 bg-[#24100D] shadow-md pointer-events-none"
                    style={{ zIndex: idx }}
                  >
                    <div className="absolute top-1.5 left-2 flex items-center gap-1">
                      <span className="font-serif font-black text-xs text-[#F2D06B]">
                        {slainMonster.rank}
                      </span>
                      <SuitGlyph suit={slainMonster.suit} className="w-2.5 h-2.5 text-[#F2D06B]" />
                      <span className="text-[9px] font-mono text-stone-400">
                        ({slainMonster.value})
                      </span>
                    </div>
                  </motion.div>
                )
              })}

              {/* Top Weapon Card */}
              <div
                className="relative w-full h-full"
                style={{ zIndex: equipped.slain.length + 10 }}
              >
                <Card
                  card={equipped.card}
                  interactive={false}
                  className="w-full h-full shadow-[0_0_20px_rgba(56,189,248,0.2)] border-[#38BDF8]/50"
                />
              </div>
            </motion.div>
          ) : (
            /* Empty Weapon Slot Ghost Outline */
            <div
              key="empty-slot"
              className="w-36 sm:w-40 xl:w-44 h-50 sm:h-56 xl:h-62 rounded-xl border-2 border-dashed border-[#C9A227]/25 bg-[#120F0D]/60 flex flex-col items-center justify-center p-3 text-center"
            >
              <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-[#C9A227]/30 fill-none mb-1.5" strokeWidth="1.2">
                <path d="M12 2L20 12L12 22L4 12L12 2Z" />
              </svg>
              <span className="text-[11px] font-serif font-semibold text-[#A39281]">
                No Blade Equipped
              </span>
              <span className="text-[9px] text-stone-500 mt-1 max-w-[110px] leading-tight font-mono">
                Face a ♦ Diamond to equip
              </span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Potion Socket Indicator at Bottom of Left Rail */}
      <div className="w-full mt-3 p-2 rounded-lg bg-[#14100D]/90 border border-[#C9A227]/25 flex items-center justify-between text-[10px] font-mono">
        <span className="text-[#A39281] uppercase tracking-wider flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${potionUsedThisRoom ? 'bg-stone-600' : 'bg-emerald-400 animate-pulse'}`} />
          POTION
        </span>
        <span className={potionUsedThisRoom ? 'text-stone-500 font-bold' : 'text-emerald-400 font-bold'}>
          {potionUsedThisRoom ? 'USED (1/ROOM)' : 'AVAILABLE'}
        </span>
      </div>
    </div>
  )
}
