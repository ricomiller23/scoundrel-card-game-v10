'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useGameStore } from '@/lib/store'

export const GameOverScreen: React.FC = () => {
  const game = useGameStore((s) => s.game)
  const highScore = useGameStore((s) => s.highScore)
  const startNewGame = useGameStore((s) => s.startNewGame)
  const returnToMenu = useGameStore((s) => s.returnToMenu)

  const isVictory = game.outcome === 'victory'
  const score = game.score ?? 0

  return (
    <div className="relative min-h-screen h-[100dvh] flex flex-col items-center justify-center p-4 sm:p-6 text-center select-none overflow-hidden bg-[#07060A]">
      {/* Background Crypt Ambience */}
      <div
        className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${
          isVictory
            ? 'bg-radial from-[#C9A227]/20 via-[#14100D] to-[#07060A]'
            : 'bg-radial from-[#7E1E1E]/25 via-[#14100D] to-[#07060A]'
        }`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#14100D]/95 border-2 border-[#C9A227]/40 shadow-[0_0_60px_rgba(0,0,0,0.9)] backdrop-blur-xl z-10 flex flex-col items-center"
      >
        {/* Heraldic Medallion */}
        <div className="mb-3">
          {isVictory ? (
            <div className="w-14 h-14 rounded-full bg-[#F2D06B]/20 border border-[#F2D06B] flex items-center justify-center shadow-[0_0_25px_rgba(242,208,107,0.5)]">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#F2D06B]">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#7E1E1E]/30 border border-[#B45245] flex items-center justify-center shadow-[0_0_25px_rgba(180,82,69,0.4)]">
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#B45245]">
                <path d="M12 2a9 9 0 0 0-9 9c0 3.6 2.1 6.7 5.2 8.1l.8 2.9h6l.8-2.9C18.9 17.7 21 14.6 21 11a9 9 0 0 0-9-9zm-3 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-5.5 5.5l1.5-1.5 1 1 1-1 1.5 1.5-5 0z" />
              </svg>
            </div>
          )}
        </div>

        <div className="text-[10px] font-mono font-bold tracking-widest text-[#A39281] uppercase mb-1">
          {isVictory ? 'THE RELIQUARY IS CONQUERED' : 'EPITAPH IN THE CRYPT'}
        </div>

        <h1
          className={`font-serif font-black text-3xl sm:text-4xl mb-2 tracking-wide ${
            isVictory ? 'text-[#F2D06B]' : 'text-[#E8A598]'
          }`}
        >
          {isVictory ? 'TRIUMPH' : 'FALLEN IN BATTLE'}
        </h1>

        <p className="text-xs sm:text-sm text-[#D4C3B3] mb-5 max-w-xs font-sans">
          {isVictory
            ? 'You endured all forty-four trials and carried your blade into the light.'
            : 'Your vitality expired. Your bones rest in the gilded catacombs.'}
        </p>

        {/* Score Ledger */}
        <div className="w-full p-4 rounded-xl bg-[#0A0807] border border-[#C9A227]/30 flex flex-col gap-2 mb-5 text-xs font-mono">
          <div className="flex justify-between items-center text-stone-400">
            <span>SURVIVING VITALITY</span>
            <span className="font-bold text-white">{Math.max(0, game.health)} / 20</span>
          </div>
          <div className="flex justify-between items-center text-stone-400">
            <span>CHAMBERS CLEARED</span>
            <span className="font-bold text-white">{game.roomsCleared}</span>
          </div>
          <div className="border-t border-stone-800 my-0.5" />
          <div className="flex justify-between items-baseline">
            <span className="text-[#A39281] font-bold">DESCENT SCORE</span>
            <span className="font-serif font-black text-2xl text-[#F2D06B]">
              {score > 0 ? `+${score}` : score}
            </span>
          </div>
          {highScore !== null && (
            <div className="flex justify-between items-center text-[10px] text-stone-500 pt-0.5">
              <span>RECORD DESCENT</span>
              <span className="font-bold text-[#D4AF37]">
                {highScore > 0 ? `+${highScore}` : highScore}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            onClick={startNewGame}
            className="flex-1 min-h-[44px] py-3 px-5 rounded-xl font-serif font-black text-sm text-[#07060A] bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] hover:brightness-110 active:scale-95 shadow-lg transition-all cursor-pointer"
          >
            DESCEND AGAIN
          </button>
          <button
            type="button"
            onClick={returnToMenu}
            className="min-h-[44px] py-3 px-5 rounded-xl font-mono text-xs font-bold text-[#D4C3B3] bg-stone-900 border border-[#C9A227]/40 hover:border-[#F2D06B] transition-colors cursor-pointer"
          >
            TITLE MENU
          </button>
        </div>
      </motion.div>
    </div>
  )
}
