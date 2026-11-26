'use client'

import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'

export const FloatingNumbers: React.FC = () => {
  const floatingTexts = useGameStore((s) => s.floatingTexts)

  return (
    <div className="fixed inset-0 pointer-events-none z-50 select-none" aria-hidden="true">
      <AnimatePresence>
        {floatingTexts.map((item) => {
          const isDamage = item.type === 'damage'
          const color = isDamage
            ? 'text-rose-400 drop-shadow-[0_2px_10px_rgba(244,63,94,0.8)]'
            : 'text-emerald-400 drop-shadow-[0_2px_10px_rgba(52,211,153,0.8)]'

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15, scale: 0.6 }}
              animate={{ opacity: 1, y: -45, scale: 1.25 }}
              exit={{ opacity: 0, y: -80, scale: 0.9 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                left: `${item.x}px`,
                top: `${item.y}px`
              }}
              className={`font-serif font-black text-3xl sm:text-4xl tracking-wider ${color}`}
            >
              {item.text}
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
