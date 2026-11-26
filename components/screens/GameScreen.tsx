'use client'

import React, { useEffect, useCallback, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGameStore } from '@/lib/store'
import { canAvoid } from '@/lib/rules'
import { Card as CardType } from '@/lib/types'
import { HealthMeter } from '../hud/HealthMeter'
import { WeaponSlot } from '../hud/WeaponSlot'
import { DungeonPile } from '../hud/DungeonPile'
import { DiscardPile } from '../hud/DiscardPile'
import { ProgressRail } from '../hud/ProgressRail'
import { EventLog } from '../hud/EventLog'
import { Card } from '../cards/Card'
import { SuitGlyph } from '../cards/SuitGlyphs'
import { CombatModal } from '../ui/CombatModal'
import { HowToPlayModal } from '../ui/HowToPlayModal'

interface SlotState {
  card: CardType | null
  facedCard: CardType | null
}

export const GameScreen: React.FC = () => {
  const game = useGameStore((s) => s.game)
  const faceCard = useGameStore((s) => s.faceCard)
  const avoidCurrentRoom = useGameStore((s) => s.avoidCurrentRoom)
  const advanceToNextRoom = useGameStore((s) => s.advanceToNextRoom)
  const returnToMenu = useGameStore((s) => s.returnToMenu)
  const setShowHowToPlay = useGameStore((s) => s.setShowHowToPlay)
  const soundEnabled = useGameStore((s) => s.soundEnabled)
  const toggleSound = useGameStore((s) => s.toggleSound)
  const screenShake = useGameStore((s) => s.screenShake)
  const reducedMotion = useGameStore((s) => s.reducedMotion)

  const [mobileBladeDetailOpen, setMobileBladeDetailOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isRoomClear = game.phase === 'ROOM_CLEAR'
  const isAwaiting = game.phase === 'AWAITING_ACTION'
  const isAvoidAllowed = canAvoid(game)

  // Reason why Avoid is disabled
  let avoidReason = ''
  if (!isAvoidAllowed) {
    if (game.cardsFacedThisRoom > 0) {
      avoidReason = 'Already faced cards in this room'
    } else if (game.lastActionWasAvoid) {
      avoidReason = 'Cannot avoid two rooms in a row'
    } else if (game.dungeon.length < 4) {
      avoidReason = 'Dungeon requires ≥ 4 cards to avoid'
    } else if (game.room.length < 4) {
      avoidReason = 'Room has fewer than 4 cards'
    }
  }

  // Persistent 4 slots tracking
  const [persistentSlots, setPersistentSlots] = useState<SlotState[]>([
    { card: null, facedCard: null },
    { card: null, facedCard: null },
    { card: null, facedCard: null },
    { card: null, facedCard: null }
  ])

  const prevRoomRef = useRef<CardType[]>([])
  const prevRoomCountRef = useRef<number>(game.roomsCleared)

  // Synchronize 4 persistent slots with game.room
  useEffect(() => {
    // When a fresh room deals or room count changes
    if (game.cardsFacedThisRoom === 0 || game.roomsCleared !== prevRoomCountRef.current) {
      prevRoomCountRef.current = game.roomsCleared
      prevRoomRef.current = [...game.room]
      setPersistentSlots([
        { card: game.room[0] || null, facedCard: null },
        { card: game.room[1] || null, facedCard: null },
        { card: game.room[2] || null, facedCard: null },
        { card: game.room[3] || null, facedCard: null }
      ])
      return
    }

    // When cards are faced during the current room, mark faced slots
    setPersistentSlots((prev) => {
      const activeIds = new Set(game.room.map((c) => c.id))
      return prev.map((slot) => {
        if (slot.card && !activeIds.has(slot.card.id)) {
          return {
            card: null,
            facedCard: slot.card
          }
        }
        return slot
      })
    })
  }, [game.room, game.cardsFacedThisRoom, game.roomsCleared])

  // Keyboard navigation shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        setShowHowToPlay(true)
        return
      }

      if (e.key === 'Escape') {
        setMobileBladeDetailOpen(false)
        setMobileMenuOpen(false)
        return
      }

      if (isRoomClear && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        advanceToNextRoom()
        return
      }

      if (!isAwaiting) return

      if (e.key === 'a' || e.key === 'A') {
        if (isAvoidAllowed) avoidCurrentRoom()
      } else if (e.key === '1' && persistentSlots[0]?.card) {
        faceCard(persistentSlots[0].card.id)
      } else if (e.key === '2' && persistentSlots[1]?.card) {
        faceCard(persistentSlots[1].card.id)
      } else if (e.key === '3' && persistentSlots[2]?.card) {
        faceCard(persistentSlots[2].card.id)
      } else if (e.key === '4' && persistentSlots[3]?.card) {
        faceCard(persistentSlots[3].card.id)
      }
    },
    [isAwaiting, isRoomClear, isAvoidAllowed, persistentSlots, avoidCurrentRoom, faceCard, advanceToNextRoom, setShowHowToPlay]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const totalFaced = 44 - game.dungeon.length - game.room.length
  const depthFloor = Math.floor(game.roomsCleared * 1.5) + 1
  const descentNotches = Math.min(10, Math.floor((totalFaced / 44) * 10))

  return (
    <motion.div
      animate={
        screenShake && !reducedMotion
          ? {
              x: [0, -8, 8, -6, 6, -3, 3, 0],
              y: [0, 6, -6, 4, -4, 2, -2, 0]
            }
          : {}
      }
      transition={{ duration: 0.24 }}
      className="relative w-full h-screen h-[100dvh] max-h-[100dvh] overflow-hidden flex flex-col justify-between bg-[#07060A] text-[#EDE5D8] select-none"
    >
      {/* =========================================================================
          TOP BAR (56px Desktop / 64px Mobile)
          ========================================================================= */}
      <header className="w-full h-14 md:h-14 shrink-0 px-3 sm:px-6 border-b border-[#C9A227]/25 bg-[#14100D]/95 backdrop-blur-md z-30 flex items-center justify-between">
        {/* DESKTOP HEADER (>= 768px) */}
        <div className="hidden md:flex items-center justify-between w-full">
          {/* Wordmark & Subtitle */}
          <div className="flex flex-col">
            <span className="font-serif font-black text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2CC] via-[#F2D06B] to-[#C9A227]">
              SCOUNDREL
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#A39281] uppercase -mt-1">
              THE GILDED RELIQUARY
            </span>
          </div>

          {/* Room / Depth + 44-card Progress */}
          <div className="flex items-center gap-6 flex-1 max-w-md mx-6">
            <div className="flex flex-col items-center shrink-0">
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#A39281] uppercase">
                ROOM {game.roomsCleared + 1}
              </span>
              <span className="text-xs font-serif text-[#F2D06B]">
                DEPTH {depthFloor}
              </span>
            </div>
            <div className="flex-1">
              <ProgressRail cardsFacedTotal={totalFaced} roomsCleared={game.roomsCleared} />
            </div>
          </div>

          {/* Controls: Sound, Rules, Menu */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSound}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-[#161311] border border-[#C9A227]/30 text-stone-300 hover:text-[#F2D06B] hover:border-[#F2D06B]/50 transition-colors"
              aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            >
              {soundEnabled ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2">
                  <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setShowHowToPlay(true)}
              className="px-3 py-2 min-h-[40px] flex items-center justify-center rounded-lg bg-[#161311] border border-[#C9A227]/30 text-xs font-mono text-[#D4C3B3] hover:text-[#F2D06B] hover:border-[#F2D06B]/50 transition-colors"
              aria-label="How to play rules [?]"
            >
              RULES [?]
            </button>

            <button
              type="button"
              onClick={returnToMenu}
              className="px-3 py-2 min-h-[40px] flex items-center justify-center rounded-lg bg-[#161311] border border-[#C9A227]/30 text-xs font-mono text-stone-400 hover:text-stone-200 hover:border-stone-400 transition-colors"
              aria-label="Exit to title screen"
            >
              MENU
            </button>
          </div>
        </div>

        {/* MOBILE HEADER (< 768px, Strict 64px height, fits within 320-390px width without horizontal blowout) */}
        <div className="flex md:hidden items-center justify-between w-full h-16">
          {/* Left: Vitality Bar */}
          <HealthMeter health={game.health} compact />

          {/* Center: Blade Chip (Tap opens details) */}
          <button
            type="button"
            onClick={() => setMobileBladeDetailOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#161311] border border-[#C9A227]/40 text-[11px] font-mono text-[#D4C3B3] hover:border-[#F2D06B] active:scale-95 transition-all"
            aria-label="View equipped weapon details"
          >
            <span className="text-sky-400">⚔</span>
            {game.equippedWeapon ? (
              <span className="font-bold text-sky-200">
                {game.equippedWeapon.card.rank}♦{' '}
                <span className="text-[10px] text-stone-400">
                  {game.equippedWeapon.lastSlain === null ? 'FRESH' : `< ${game.equippedWeapon.lastSlain}`}
                </span>
              </span>
            ) : (
              <span className="text-[10px] text-stone-500">NO BLADE</span>
            )}
          </button>

          {/* Right: Mobile Kebab Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-[#161311] border border-[#C9A227]/30 text-[#D4C3B3] hover:text-[#F2D06B] active:scale-95"
              aria-label="Game navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {/* Mobile Kebab Dropdown Sheet */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-12 w-48 p-2 rounded-xl bg-[#14100D] border-2 border-[#C9A227]/50 shadow-2xl flex flex-col gap-1.5 z-50 font-mono text-xs"
                >
                  <button
                    type="button"
                    onClick={() => {
                      toggleSound()
                      setMobileMenuOpen(false)
                    }}
                    className="min-h-[44px] flex items-center justify-between px-3 py-2 rounded-lg bg-stone-900/60 hover:bg-stone-800 text-stone-200"
                  >
                    <span>AUDIO</span>
                    <span className={soundEnabled ? 'text-emerald-400 font-bold' : 'text-stone-500'}>
                      {soundEnabled ? 'ON' : 'MUTED'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHowToPlay(true)
                      setMobileMenuOpen(false)
                    }}
                    className="min-h-[44px] flex items-center px-3 py-2 text-left rounded-lg bg-stone-900/60 hover:bg-stone-800 text-[#F2D06B]"
                  >
                    RULES &amp; GUIDE
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      returnToMenu()
                      setMobileMenuOpen(false)
                    }}
                    className="min-h-[44px] flex items-center px-3 py-2 text-left rounded-lg bg-stone-900/60 hover:bg-stone-800 text-stone-400"
                  >
                    EXIT TO MENU
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN 3-ZONE COCKPIT (Desktop >= 1280px) / TABLET (768-1279px) / MOBILE (<768px)
          ========================================================================= */}
      <div className="flex-1 w-full max-w-[1520px] mx-auto px-2 sm:px-6 py-1 sm:py-2 overflow-hidden flex flex-col justify-between">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-[240px_1fr_240px] gap-3 sm:gap-6 items-center justify-center h-full max-h-[calc(100dvh-100px)]">
          {/* ---------------------------------------------------------------------
              LEFT RAIL (240px on Desktop): Vitality + Blade Stand + Potion Socket
              --------------------------------------------------------------------- */}
          <aside className="hidden lg:flex flex-col justify-between h-full py-1 z-10 w-[240px] shrink-0">
            {/* Top: Vitality */}
            <HealthMeter health={game.health} />

            {/* Middle: Equipped Blade Stand */}
            <div className="my-auto py-2 w-full">
              <WeaponSlot
                equipped={game.equippedWeapon}
                potionUsedThisRoom={game.potionUsedThisRoom}
              />
            </div>
          </aside>

          {/* ---------------------------------------------------------------------
              CENTER STAGE (1fr): The Candlelit Card Table with 4 Persistent Slots
              --------------------------------------------------------------------- */}
          <main className="relative flex-1 flex flex-col items-center justify-center h-full w-full py-1 z-20">
            {/* Candle pool table plate backdrop */}
            <div className="absolute inset-0 rounded-3xl table-plate pointer-events-none" />

            {/* Room Instruction Prompt */}
            <div className="mb-2 sm:mb-4 text-center z-10">
              {isRoomClear ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  <span className="font-serif font-black text-xl sm:text-2xl text-[#F2D06B]">
                    ROOM CONQUERED!
                  </span>
                  <button
                    type="button"
                    onClick={advanceToNextRoom}
                    className="min-h-[44px] px-6 py-2 rounded-xl font-serif font-black text-sm sm:text-base text-[#07060A] bg-gradient-to-r from-[#F2D06B] via-[#FFE28A] to-[#C9A227] hover:brightness-110 active:scale-95 shadow-xl transition-all cursor-pointer"
                  >
                    ADVANCE TO NEXT ROOM [ENTER]
                  </button>
                </motion.div>
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#A39281] uppercase">
                    ROOM {game.roomsCleared + 1} OF THE CRYPT
                  </span>
                  <span className="text-xs sm:text-sm font-serif text-[#EDE5D8] mt-0.5">
                    {game.cardsFacedThisRoom === 0 && 'Choose 3 cards to face. The 4th carries forward.'}
                    {game.cardsFacedThisRoom === 1 && '1 card faced. Choose 2 more.'}
                    {game.cardsFacedThisRoom === 2 && '2 cards faced. Choose 1 more.'}
                    {game.cardsFacedThisRoom >= 3 && 'Room conquered. Advance to the next room.'}
                  </span>
                </div>
              )}
            </div>

            {/* 4 PERSISTENT SLOTS (Desktop: row of 4; Mobile/Tablet: 2x2 grid) */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 xl:gap-6 items-center justify-center p-1 sm:p-2 z-10">
              {persistentSlots.map((slot, idx) => {
                const isCarryingForward = game.cardsFacedThisRoom === 3 && slot.card !== null

                return (
                  <div
                    key={`slot-${idx}`}
                    data-slot-idx={idx}
                    className="flex flex-col items-center"
                  >
                    {/* The Physical Card Slot Plate */}
                    <div className="relative w-[164px] sm:w-[185px] md:w-[205px] lg:w-[195px] xl:w-[220px] 2xl:w-[245px] h-[234px] sm:h-[265px] md:h-[295px] lg:h-[275px] xl:h-[315px] 2xl:h-[350px] rounded-xl table-slot border border-[#C9A227]/25 bg-[#120F0D]/60 flex items-center justify-center overflow-hidden">
                      {slot.card ? (
                        /* Active Card in Slot with subtle table rotation */
                        <motion.div
                          key={slot.card.id}
                          data-card-id={slot.card.id}
                          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -24, rotate: (idx % 2 === 0 ? -2.2 : 1.8) }}
                          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, rotate: (idx === 0 ? -1.8 : idx === 1 ? 1.2 : idx === 2 ? -1.2 : 2.0) }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={reducedMotion ? { duration: 0.15 } : { type: "spring", stiffness: 320, damping: 24 }}
                          className="relative w-full h-full"
                        >
                          <Card
                            card={slot.card}
                            equippedWeapon={game.equippedWeapon}
                            potionUsedThisRoom={game.potionUsedThisRoom}
                            interactive={isAwaiting && !isCarryingForward}
                            disabled={!isAwaiting || isCarryingForward}
                            className="w-full h-full"
                            onClick={(e) => faceCard(slot.card!.id, undefined, { x: e.clientX, y: e.clientY })}
                          />

                          {/* 4th Card Threshold Carry Indicator */}
                          {isCarryingForward && (
                            <div className="absolute inset-0 bg-black/60 rounded-xl flex flex-col items-center justify-center p-2 text-center pointer-events-none z-20">
                              <span className="text-xs sm:text-sm font-serif font-black text-[#F2D06B]">
                                CARRIES FORWARD →
                              </span>
                              <span className="text-[10px] font-mono text-stone-300 mt-1">
                                Slips into next room
                              </span>
                            </div>
                          )}
                        </motion.div>
                      ) : slot.facedCard ? (
                        /* Embossed Ghost Slot for Faced Card */
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-3 text-center opacity-30 select-none">
                          <span className="font-serif font-black text-3xl sm:text-4xl text-stone-500">
                            {slot.facedCard.rank}
                          </span>
                          <SuitGlyph suit={slot.facedCard.suit} className="w-6 h-6 sm:w-7 sm:h-7 text-stone-500 my-1" />
                          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-widest text-[#C9A227] uppercase">
                            FACED
                          </span>
                        </div>
                      ) : (
                        /* Empty Slot Plate Outline */
                        <div className="flex flex-col items-center justify-center opacity-25">
                          <span className="text-xs sm:text-sm font-mono text-stone-500">SLOT {idx + 1}</span>
                        </div>
                      )}
                    </div>

                    {/* Keyboard Hotkey Hint Under Slot */}
                    <span className="hidden sm:inline-block text-[10px] font-mono text-[#7A6C5D] mt-1.5">
                      [{idx + 1}]
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Avoid Room Action Bar (Desktop / Center) */}
            {isAwaiting && (
              <div className="hidden sm:flex flex-col items-center mt-3 z-10">
                <button
                  type="button"
                  disabled={!isAvoidAllowed}
                  onClick={avoidCurrentRoom}
                  title={avoidReason}
                  className={`min-h-[44px] px-6 py-2 rounded-xl font-mono text-xs font-bold tracking-wider uppercase border transition-all ${
                    isAvoidAllowed
                      ? 'bg-[#1E1713] border-[#C9A227]/60 text-[#F2D06B] hover:bg-[#2A1F19] hover:border-[#F2D06B] active:scale-95 shadow-lg cursor-pointer'
                      : 'bg-stone-900/40 border-stone-800 text-stone-600 cursor-not-allowed'
                  }`}
                >
                  <span>AVOID ROOM [A]</span>
                </button>
                {!isAvoidAllowed && avoidReason && (
                  <span className="text-[10px] text-stone-500 font-mono mt-1">
                    {avoidReason}
                  </span>
                )}
              </div>
            )}
          </main>

          {/* ---------------------------------------------------------------------
              RIGHT RAIL (240px on Desktop): Dungeon Deck + Discard + Chronicle
              --------------------------------------------------------------------- */}
          <aside className="hidden lg:flex flex-col justify-between h-full py-1 z-10 w-[240px] shrink-0">
            {/* Top: Dungeon Deck Stack */}
            <DungeonPile count={game.dungeon.length} />

            {/* Middle: Discard Pile */}
            <DiscardPile count={game.discard.length} />

            {/* Bottom: Combat Chronicle Feed */}
            <EventLog entries={game.log} />
          </aside>
        </div>

        {/* =======================================================================
            UNDER-STAGE RUN LEDGER BAR (Desktop / Tablet)
            ======================================================================= */}
        <footer className="hidden sm:flex items-center justify-between w-full h-8 px-4 py-1 rounded-lg bg-[#14100D]/80 border border-[#C9A227]/20 text-[10px] font-mono text-[#A39281] shrink-0 z-20">
          <div>
            <span>DUNGEON: </span>
            <strong className="text-[#F2D06B]">{game.dungeon.length} CARDS</strong>
          </div>

          {/* 10-Notch Descent Depth Gauge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-wider">DESCENT:</span>
            <div className="flex items-center gap-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-1.5 rounded-sm transition-colors ${
                    i < descentNotches
                      ? 'bg-[#F2D06B] shadow-[0_0_4px_rgba(242,208,107,0.8)]'
                      : 'bg-stone-800'
                  }`}
                />
              ))}
            </div>
            <span className="text-stone-400 font-bold ml-1">FLOOR {depthFloor}</span>
          </div>

          <div>
            <span>CURRENT SCORE: </span>
            <strong className="text-[#F2D06B] font-serif font-black text-xs">
              {game.health > 0 ? `+${game.health}` : 0}
            </strong>
          </div>
        </footer>

        {/* =======================================================================
            STICKY 56px BOTTOM BAR (Mobile Viewport < 768px)
            ======================================================================= */}
        <footer className="flex sm:hidden items-center justify-between w-full h-14 px-3 border-t border-[#C9A227]/25 bg-[#14100D]/95 backdrop-blur-md shrink-0 z-30">
          {/* Avoid Button */}
          <button
            type="button"
            disabled={!isAvoidAllowed}
            onClick={avoidCurrentRoom}
            className={`flex-1 min-h-[44px] mr-2 py-2 px-3 rounded-lg font-mono text-xs font-bold uppercase border transition-all ${
              isAvoidAllowed
                ? 'bg-[#1E1713] border-[#C9A227] text-[#F2D06B] active:scale-95'
                : 'bg-stone-900/50 border-stone-800 text-stone-600 cursor-not-allowed'
            }`}
          >
            AVOID
          </button>

          {/* Chronicle Trigger */}
          <EventLog entries={game.log} compact />
        </footer>
      </div>

      {/* =========================================================================
          MOBILE BLADE DETAIL MODAL / SHEET
          ========================================================================= */}
      <AnimatePresence>
        {mobileBladeDetailOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md sm:hidden">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-xs p-5 rounded-2xl bg-[#14100D] border-2 border-[#C9A227]/40 shadow-2xl flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between pb-2 border-b border-[#C9A227]/30 mb-3">
                <span className="text-xs font-mono font-bold text-[#F2D06B] uppercase tracking-wider">
                  ARMAMENT DETAILS
                </span>
                <button
                  type="button"
                  onClick={() => setMobileBladeDetailOpen(false)}
                  className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-stone-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <WeaponSlot
                equipped={game.equippedWeapon}
                potionUsedThisRoom={game.potionUsedThisRoom}
              />

              <button
                type="button"
                onClick={() => setMobileBladeDetailOpen(false)}
                className="mt-4 w-full min-h-[44px] py-2.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-mono text-stone-300"
              >
                CLOSE [ESC]
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Combat & Rules Modals */}
      <CombatModal />
      <HowToPlayModal />
    </motion.div>
  )
}
