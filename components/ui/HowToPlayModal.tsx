'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'

export const HowToPlayModal: React.FC = () => {
  const showHowToPlay = useGameStore((s) => s.showHowToPlay)
  const setShowHowToPlay = useGameStore((s) => s.setShowHowToPlay)

  useEffect(() => {
    if (!showHowToPlay) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowHowToPlay(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showHowToPlay, setShowHowToPlay])

  if (!showHowToPlay) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto p-5 sm:p-8 rounded-2xl bg-[#14100D] border-2 border-[#C9A227]/50 shadow-[0_0_60px_rgba(201,162,39,0.25)] text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#C9A227]/30 mb-5">
          <div>
            <div className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#A39281] uppercase">
              TOME OF RULES
            </div>
            <h2 id="rules-title" className="font-serif font-black text-xl sm:text-3xl text-[#F2D06B]">
              Rules of Scoundrel
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowHowToPlay(false)}
            className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-stone-900 border border-stone-700 text-stone-300 hover:text-white hover:border-[#F2D06B] transition-colors"
            aria-label="Close rules [ESC]"
          >
            <span className="text-lg">✕</span>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 text-xs sm:text-sm text-[#D4C3B3] font-sans leading-relaxed">
          <section>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F2D06B] mb-1.5">
              1. The Dungeon (44 Cards)
            </h3>
            <p>
              Scoundrel uses a standard 52-card deck stripped of all Jokers, red face cards (J, Q, K), and red Aces.
              The remaining 44 cards form the Dungeon:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1 font-mono text-[11px] sm:text-xs">
              <li><strong className="text-[#F2D06B]">♣ Clubs & ♠ Spades (26 Cards):</strong> Monsters. Damage equals rank (Ace is high = 14, K=13, Q=12, J=11, 10–2).</li>
              <li><strong className="text-sky-400">♦ Diamonds (9 Cards, 2–10 only):</strong> Weapons. Slay monsters and mitigate damage.</li>
              <li><strong className="text-emerald-400">♥ Hearts (9 Cards, 2–10 only):</strong> Health Potions. Restores HP (capped at 20).</li>
            </ul>
          </section>

          <section>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F2D06B] mb-1.5">
              2. Exploring Rooms
            </h3>
            <p>
              Each turn deals a Room of 4 cards into the four table slots. You must confront <strong>3 of the 4 cards</strong> in any order you choose.
              The unplayed 4th card carries over into the next Room.
            </p>
          </section>

          <section>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F2D06B] mb-1.5">
              3. Avoiding a Room
            </h3>
            <p>
              You may scoop all 4 cards and place them at the bottom of the Dungeon. However, <strong>you cannot avoid two Rooms in a row</strong>, and avoiding requires at least 4 cards remaining in the Dungeon.
            </p>
          </section>

          <section>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F2D06B] mb-1.5">
              4. Combat & The Degradation Rule
            </h3>
            <p>
              You may fight monsters barehanded (take full damage) or with an equipped weapon:
            </p>
            <p className="p-2.5 my-2 rounded-lg bg-[#241712] border-l-4 border-[#C9A227] text-xs font-mono text-[#F2D06B]">
              Weapon Damage Taken = max(0, monster.value - weapon.value)
            </p>
            <p className="mt-1.5">
              <strong className="text-[#F2D06B]">The Degradation Rule:</strong> A weapon that slays a monster can thereafter only attack monsters with a value <strong>strictly lower</strong> than the last monster it slew.
              A blocked weapon is <em>never discarded</em>; it remains equipped and usable against weaker foes.
            </p>
          </section>

          <section>
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#F2D06B] mb-1.5">
              5. Potions (One Per Room)
            </h3>
            <p>
              Only the <strong>first potion</strong> quaffed in a Room heals you. Any subsequent potions chosen in the same Room are discarded with 0 healing.
            </p>
          </section>

          <section className="pt-3 border-t border-[#C9A227]/20 text-[11px] text-stone-400 font-mono">
            <p>
              Designed by <strong>Zach Gage & Kurt Bieg</strong> (Scoundrel v1.0, 15 August 2011).
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  )
}
