'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { CardBack } from '../cards/CardBack'

export const MenuScreen: React.FC = () => {
  const startNewGame = useGameStore((s) => s.startNewGame)
  const highScore = useGameStore((s) => s.highScore)
  const setShowHowToPlay = useGameStore((s) => s.setShowHowToPlay)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const reducedMotion = useGameStore((s) => s.reducedMotion)
  const toggleReducedMotion = useGameStore((s) => s.toggleReducedMotion)

  return (
    <div className="relative min-h-screen h-[100dvh] flex flex-col items-center justify-between p-4 sm:p-8 text-center select-none overflow-hidden bg-[#07060A]">
      {/* Crypt Ambient Radial Light Pool */}
      <div className="absolute inset-0 bg-radial from-[#C9A227]/10 via-[#14100D]/80 to-[#07060A] pointer-events-none" />

      {/* Decorative Triptych Reliquary Cards */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative flex items-center justify-center mt-4 sm:mt-8"
      >
        <div className="relative w-36 h-50 sm:w-44 sm:h-62 transform -rotate-12 translate-x-4 opacity-75 shadow-2xl">
          <CardBack />
        </div>
        <div className="relative w-40 h-56 sm:w-48 sm:h-68 z-10 shadow-[0_0_45px_rgba(201,162,39,0.35)]">
          <CardBack />
        </div>
        <div className="relative w-36 h-50 sm:w-44 sm:h-62 transform rotate-12 -translate-x-4 opacity-75 shadow-2xl">
          <CardBack />
        </div>
      </motion.div>

      {/* Main Reliquary Title Inscription */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="my-3 sm:my-6 z-10"
      >
        <div className="inline-block px-3 py-0.5 rounded-full border border-[#C9A227]/40 bg-[#14100D]/90 text-[10px] sm:text-[11px] font-mono tracking-widest text-[#A39281] uppercase mb-2">
          THE GILDED RELIQUARY
        </div>
        <h1 className="font-serif font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-[#FFF2CC] via-[#F2D06B] to-[#C9A227] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          SCOUNDREL
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-[#D4C3B3] max-w-sm mx-auto font-sans">
          Forty-four cards in the crypt. One equipped blade. Slay the monsters or perish in the gilded depths.
        </p>
      </motion.div>

      {/* Action Controls & Best Record */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-xs flex flex-col gap-2.5 z-10 mb-2"
      >
        <button
          type="button"
          onClick={startNewGame}
          className="group relative min-h-[48px] px-6 py-3.5 rounded-xl font-serif font-black text-base sm:text-lg tracking-wider text-[#07060A] bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] hover:brightness-110 active:scale-95 shadow-[0_0_25px_rgba(242,208,107,0.35)] transition-all cursor-pointer"
        >
          <span>ENTER THE DUNGEON</span>
          <div className="absolute inset-0 rounded-xl border border-white/40 pointer-events-none" />
        </button>

        <button
          type="button"
          onClick={() => setShowHowToPlay(true)}
          className="min-h-[44px] px-5 py-2.5 rounded-xl font-mono text-xs tracking-wider text-[#D4C3B3] bg-[#14100D]/90 border border-[#C9A227]/40 hover:border-[#F2D06B] hover:text-[#F2D06B] transition-colors shadow-lg cursor-pointer"
        >
          HOW TO PLAY &amp; RULES [?]
        </button>

        {/* Ambient Settings Bar */}
        <div className="flex items-center justify-center gap-4 mt-1 text-xs font-mono text-[#A39281]">
          <button
            type="button"
            onClick={toggleSound}
            className="min-h-[36px] flex items-center gap-1 hover:text-[#F2D06B] transition-colors cursor-pointer"
          >
            <span>Audio:</span>
            <span className={soundEnabled ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
              {soundEnabled ? 'ON' : 'MUTED'}
            </span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={toggleReducedMotion}
            className="min-h-[36px] flex items-center gap-1 hover:text-[#F2D06B] transition-colors cursor-pointer"
          >
            <span>Motion:</span>
            <span className={!reducedMotion ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
              {!reducedMotion ? 'FULL' : 'REDUCED'}
            </span>
          </button>
        </div>

        {/* Best Record Display */}
        {highScore !== null && (
          <div className="mt-2 p-2.5 rounded-xl bg-[#14100D]/80 border border-[#C9A227]/25 text-xs font-mono text-[#A39281]">
            <span>RECORD DESCENT: </span>
            <span className="font-serif font-black text-sm text-[#F2D06B]">
              {highScore > 0 ? `+${highScore}` : highScore}
            </span>
          </div>
        )}
      </motion.div>

      {/* Footer Inscription */}
      <footer className="mt-2 text-[10px] sm:text-[11px] font-mono text-[#7A6C5D] max-w-md z-10 pb-2">
        A rogue card crawler designed by <span className="text-[#A39281]">Zach Gage &amp; Kurt Bieg</span> (2011).
      </footer>
    </div>
  )
}
