'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { LogEntry } from '@/lib/types'

interface EventLogProps {
  entries: LogEntry[]
  compact?: boolean
}

export const EventLog: React.FC<EventLogProps> = ({ entries, compact = false }) => {
  const [expanded, setExpanded] = useState(false)
  const last3 = entries.slice(-3).reverse()
  const latest = entries[entries.length - 1]

  const getIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'damage':
        return '🩸'
      case 'heal':
        return '🧪'
      case 'slay':
        return '⚔'
      case 'equip':
        return '♦'
      case 'avoid':
        return '💨'
      default:
        return '📜'
    }
  }

  const getColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'damage':
        return 'text-rose-400'
      case 'heal':
        return 'text-emerald-400'
      case 'slay':
        return 'text-[#F2D06B]'
      case 'equip':
        return 'text-sky-300'
      case 'avoid':
        return 'text-amber-400'
      default:
        return 'text-stone-400'
    }
  }

  if (compact) {
    return (
      <div className="relative select-none">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#14100D]/90 border border-[#C9A227]/30 text-xs font-mono text-[#D4C3B3] hover:border-[#F2D06B] transition-colors"
          aria-expanded={expanded}
          aria-label="Combat Chronicle"
        >
          <span>📜</span>
          <span className="font-bold">CHRONICLE</span>
          <span className="text-[10px] text-[#A39281] font-mono">({entries.length})</span>
        </button>

        <AnimatePresence>
          {expanded && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm p-4">
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="w-full max-w-md max-h-[60vh] overflow-y-auto p-4 rounded-t-2xl bg-[#14100D] border-t-2 border-x-2 border-[#C9A227]/40 shadow-2xl flex flex-col gap-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#C9A227]/30">
                  <span className="text-xs font-bold text-[#F2D06B] uppercase tracking-wider">
                    CHRONICLE OF COMBAT
                  </span>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="p-1 rounded text-stone-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 mt-1" aria-live="polite">
                  {entries.slice().reverse().map((entry) => (
                    <div key={entry.id} className={`flex items-start gap-2 py-1 border-b border-stone-900 ${getColor(entry.type)}`}>
                      <span className="shrink-0">{getIcon(entry.type)}</span>
                      <span className="leading-tight">{entry.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col select-none">
      {/* Header with Expand trigger */}
      <div className="w-full flex items-center justify-between mb-1.5 px-3 py-1 rounded-lg bg-[#14100D]/95 border border-[#C9A227]/30 text-[10px] font-mono">
        <span className="uppercase tracking-widest text-[#A39281]">CHRONICLE</span>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-[#F2D06B] hover:underline font-bold"
          aria-expanded={expanded}
        >
          {expanded ? 'COLLAPSE' : 'EXPAND'}
        </button>
      </div>

      {/* Visible Last 3 Events */}
      <div
        className="w-full p-2.5 rounded-lg bg-[#120F0D]/90 border border-[#C9A227]/25 shadow-inner flex flex-col gap-1.5 text-[11px] font-mono min-h-[90px]"
        aria-live="polite"
      >
        {last3.length > 0 ? (
          last3.map((entry) => (
            <div key={entry.id} className={`flex items-start gap-1.5 leading-snug ${getColor(entry.type)}`}>
              <span className="shrink-0 text-xs">{getIcon(entry.type)}</span>
              <span className="line-clamp-2">{entry.text}</span>
            </div>
          ))
        ) : (
          <div className="text-stone-600 text-[10px] italic py-3 text-center">
            The dungeon remains silent...
          </div>
        )}
      </div>

      {/* Expanded Sheet Modal */}
      <AnimatePresence>
        {expanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-lg max-h-[75vh] overflow-y-auto p-5 rounded-2xl bg-[#14100D] border-2 border-[#C9A227]/40 shadow-2xl flex flex-col font-mono text-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#C9A227]/30 mb-3">
                <span className="font-serif font-black text-lg text-[#F2D06B]">
                  CHRONICLE OF COMBAT
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="px-2 py-1 rounded bg-stone-900 border border-stone-700 text-stone-300 hover:text-white"
                >
                  CLOSE [ESC]
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                {entries.slice().reverse().map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className={`flex items-start gap-2 p-2 rounded bg-[#0D0B0A] border border-[#C9A227]/15 ${getColor(entry.type)}`}
                  >
                    <span className="text-sm shrink-0">{getIcon(entry.type)}</span>
                    <div className="flex-1">
                      <div className="leading-snug">{entry.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
