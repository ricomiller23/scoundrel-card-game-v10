'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

interface HealthMeterProps {
  health: number
  maxHealth?: number
  compact?: boolean
}

export const HealthMeter: React.FC<HealthMeterProps> = ({ health, maxHealth = 20, compact = false }) => {
  const clamped = Math.max(0, Math.min(maxHealth, health))
  const isCritical = clamped <= 5

  if (compact) {
    return (
      <div
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#14100D]/90 border border-[#C9A227]/30 shadow-md select-none"
        aria-live="polite"
        aria-label={`Vitality ${clamped} of ${maxHealth}`}
      >
        <span className="text-[10px] font-mono font-bold tracking-wider text-[#A39281] uppercase">
          HP
        </span>
        <span className={`font-serif font-black text-lg leading-none ${isCritical ? 'text-rose-400' : 'text-[#F2D06B]'}`}>
          {clamped}
        </span>
        <span className="text-[10px] text-stone-500 font-mono">/ {maxHealth}</span>
        
        {/* Compact mini bar */}
        <div className="w-14 h-2 rounded-full overflow-hidden bg-[#161311] border border-[#C9A227]/30 ml-1">
          <div
            className={`h-full transition-all duration-300 ${
              isCritical ? 'bg-rose-500' : 'bg-gradient-to-r from-[#C9A227] to-[#F2D06B]'
            }`}
            style={{ width: `${(clamped / maxHealth) * 100}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative w-full flex flex-col items-start gap-2 p-3.5 rounded-xl bg-[#14100D]/95 border border-[#C9A227]/35 shadow-2xl backdrop-blur-md select-none"
      aria-live="polite"
      aria-label={`Vitality ${clamped} of ${maxHealth}`}
    >
      <div className="flex items-baseline justify-between w-full">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold tracking-widest uppercase text-[#A39281]">
            VITALITY
          </span>
          {isCritical && (
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-950/80 text-rose-400 border border-rose-600/50"
            >
              CRITICAL
            </motion.span>
          )}
        </div>
        <div className="flex items-baseline font-serif">
          <span className={`text-3xl font-black transition-colors ${isCritical ? 'text-rose-400' : 'text-[#F2D06B]'}`}>
            {clamped}
          </span>
          <span className="text-xs text-[#7A6C5D] font-mono ml-1">/ {maxHealth}</span>
        </div>
      </div>

      {/* 20 Discrete Engraved Hearts / Pips Meter */}
      <div className="grid grid-cols-10 gap-1 sm:gap-1.5 w-full pt-1">
        {Array.from({ length: maxHealth }).map((_, idx) => {
          const isAlive = idx < clamped
          return (
            <div
              key={idx}
              className="relative aspect-square flex items-center justify-center"
            >
              <AnimatePresence mode="wait">
                {isAlive ? (
                  <motion.div
                    key="pip-alive"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{
                      scale: [1, 1.4, 0],
                      opacity: 0,
                      transition: { duration: 0.25 }
                    }}
                    className="relative w-full h-full"
                  >
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-[#F2D06B] drop-shadow-[0_0_3px_rgba(242,208,107,0.7)]">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                    </svg>
                  </motion.div>
                ) : (
                  <div key="pip-dead" className="w-full h-full opacity-20">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-stone-600">
                      <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
                    </svg>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
