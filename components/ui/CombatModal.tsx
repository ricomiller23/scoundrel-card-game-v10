'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { Card } from '../cards/Card'
import { canUseWeapon, damageFrom } from '@/lib/rules'

export const CombatModal: React.FC = () => {
  const combatChoiceCard = useGameStore((s) => s.combatChoiceCard)
  const equippedWeapon = useGameStore((s) => s.game.equippedWeapon)
  const faceCard = useGameStore((s) => s.faceCard)
  const setCombatChoiceCard = useGameStore((s) => s.setCombatChoiceCard)

  useEffect(() => {
    if (!combatChoiceCard) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setCombatChoiceCard(null)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [combatChoiceCard, setCombatChoiceCard])

  if (!combatChoiceCard) return null

  const weaponUsable = canUseWeapon(combatChoiceCard, equippedWeapon)
  const weaponDmg = equippedWeapon ? damageFrom(combatChoiceCard, equippedWeapon, true) : null
  const barehandedDmg = combatChoiceCard.value

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="combat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md p-6 rounded-2xl bg-[#14100D] border-2 border-[#C9A227]/50 shadow-[0_0_50px_rgba(201,162,39,0.3)] text-center flex flex-col items-center select-none"
      >
        <div className="text-[10px] font-mono font-bold tracking-widest text-[#A39281] uppercase mb-1">
          CHOOSE COMBAT METHOD
        </div>
        <h2 id="combat-modal-title" className="font-serif font-black text-2xl text-[#F2D06B] mb-4">
          Confront {combatChoiceCard.rank} of {combatChoiceCard.suit}
        </h2>

        {/* Card Preview */}
        <div className="mb-5 pointer-events-none">
          <Card card={combatChoiceCard} interactive={false} className="w-44 h-64 sm:w-52 sm:h-74 mx-auto shadow-2xl" />
        </div>

        {/* Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mb-4">
          {/* Weapon Option */}
          <button
            type="button"
            disabled={!weaponUsable}
            onClick={() => faceCard(combatChoiceCard.id, 'weapon')}
            className={`min-h-[44px] p-3.5 rounded-xl border flex flex-col items-center justify-between transition-all ${
              weaponUsable
                ? 'bg-sky-950/40 border-sky-400/60 hover:bg-sky-900/60 hover:border-sky-300 shadow-lg cursor-pointer'
                : 'opacity-40 border-stone-800 bg-stone-900/40 cursor-not-allowed'
            }`}
          >
            <div className="text-xs font-mono font-bold text-sky-400 mb-1">WITH WEAPON</div>
            <div className="font-serif font-black text-2xl text-sky-200">
              -{weaponDmg} HP
            </div>
            <div className="text-[10px] text-stone-400 mt-1 leading-tight font-mono">
              Degrades ceiling to &lt; {combatChoiceCard.value}
            </div>
          </button>

          {/* Barehanded Option */}
          <button
            type="button"
            onClick={() => faceCard(combatChoiceCard.id, 'barehanded')}
            className="min-h-[44px] p-3.5 rounded-xl border border-rose-600/50 bg-rose-950/40 hover:bg-rose-900/60 hover:border-rose-400 transition-all flex flex-col items-center justify-between shadow-lg cursor-pointer"
          >
            <div className="text-xs font-mono font-bold text-rose-400 mb-1">BAREHANDED</div>
            <div className="font-serif font-black text-2xl text-rose-200">
              -{barehandedDmg} HP
            </div>
            <div className="text-[10px] text-stone-400 mt-1 leading-tight font-mono">
              Preserves blade ceiling
            </div>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setCombatChoiceCard(null)}
          className="min-h-[44px] flex items-center justify-center px-4 text-xs font-mono text-stone-400 hover:text-stone-200 transition-colors underline underline-offset-4"
        >
          Cancel [ESC]
        </button>
      </motion.div>
    </div>
  )
}
