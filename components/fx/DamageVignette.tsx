'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'

export const DamageVignette: React.FC = () => {
  const damageFlash = useGameStore((s) => s.damageFlash)
  const healFlash = useGameStore((s) => s.healFlash)
  const reducedMotion = useGameStore((s) => s.reducedMotion)

  if (reducedMotion) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50 select-none overflow-hidden" aria-hidden="true">
      {/* Damage Red Vignette Pulse */}
      <AnimatePresence>
        {damageFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0 bg-radial from-transparent via-[#7E1E1E]/20 to-[#7E1E1E]/80 mix-blend-multiply"
          />
        )}
      </AnimatePresence>

      {/* Healing Emerald Glow Pulse */}
      <AnimatePresence>
        {healFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-radial from-transparent via-[#1F6F5C]/20 to-[#1F6F5C]/60 mix-blend-screen"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
