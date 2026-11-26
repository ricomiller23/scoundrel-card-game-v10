'use client'

import React, { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { Card as CardType, EquippedWeapon } from '@/lib/types'
import { SuitGlyph } from './SuitGlyphs'
import { Pips } from './Pips'
import { MonsterArt } from './MonsterArt'
import { WeaponArt } from './WeaponArt'
import { PotionArt } from './PotionArt'
import { canUseWeapon, damageFrom } from '@/lib/rules'
import { sound } from '@/lib/audio'
import { useGameStore } from '@/lib/store'

interface CardProps {
  card: CardType
  equippedWeapon?: EquippedWeapon | null
  interactive?: boolean
  disabled?: boolean
  selected?: boolean
  potionUsedThisRoom?: boolean
  onClick?: (e: React.MouseEvent) => void
  onLongPress?: () => void
  onHover?: () => void
  className?: string
  layoutId?: string
}

export const Card: React.FC<CardProps> = ({
  card,
  equippedWeapon = null,
  interactive = true,
  disabled = false,
  selected = false,
  potionUsedThisRoom = false,
  onClick,
  onLongPress,
  onHover,
  className = '',
  layoutId
}) => {
  const cardRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = useGameStore((s) => s.reducedMotion)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)
  const longPressTimer = useRef<any>(null)

  const isMonster = card.kind === 'monster'
  const isWeapon = card.kind === 'weapon'
  const isPotion = card.kind === 'potion'

  const weaponEligible = isMonster && canUseWeapon(card, equippedWeapon)
  const weaponDmg = isMonster && equippedWeapon ? damageFrom(card, equippedWeapon, true) : null
  const barehandedDmg = isMonster ? card.value : null

  // 3D Tilt & Specular Sheen on mouse move (disabled in reduced motion)
  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current || !interactive || disabled || reducedMotion) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    setTilt({ x: rotateX, y: rotateY })
    setSheenPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100
    })
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (interactive && !disabled) {
      sound.playHover()
      onHover?.()
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTilt({ x: 0, y: 0 })
    setSheenPos({ x: 50, y: 50 })
  }

  const handleTouchStart = () => {
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        onLongPress()
      }, 450)
    }
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  // Accessibility label
  let ariaLabel = `${card.rank} of ${card.suit}, ${card.kind}, value ${card.value}. `
  if (isMonster) {
    if (weaponEligible) {
      ariaLabel += `Fight with blade for ${weaponDmg} damage, or barehanded for ${barehandedDmg} damage.`
    } else if (equippedWeapon) {
      ariaLabel += `Blade blocked by ceiling (${equippedWeapon.lastSlain ?? equippedWeapon.card.value}). Must fight barehanded for ${barehandedDmg} damage.`
    } else {
      ariaLabel += `Must fight barehanded for ${barehandedDmg} damage.`
    }
  } else if (isWeapon) {
    ariaLabel += `Equips blade of power ${card.value}. Replaces current weapon.`
  } else if (isPotion) {
    ariaLabel += potionUsedThisRoom ? `Potion already used this room. Yields 0 HP.` : `Heals up to ${card.value} health (max 20).`
  }

  // Exact type color styling per Phase 2 spec:
  // Monster: #B45245 | Weapon: #84A9C6 | Potion: #4E9A7C
  let accentColor = '#B45245'
  let accentBorder = 'border-[#B45245]/40'
  let accentBg = 'bg-[#B45245]/20 text-[#E8A598] border-[#B45245]/60'
  let chipText = `${card.value} bare`

  if (isMonster) {
    accentColor = '#B45245'
    accentBorder = 'border-[#B45245]/35'
    if (equippedWeapon) {
      if (weaponEligible) {
        chipText = `${weaponDmg} with blade · ${barehandedDmg} bare`
        accentBg = 'bg-[#181E29]/90 text-[#84A9C6] border-[#84A9C6]/60'
      } else {
        const ceiling = equippedWeapon.lastSlain ?? equippedWeapon.card.value
        chipText = `CEILING < ${ceiling}`
        accentBg = 'bg-[#2A100E]/95 text-[#B45245] border-[#B45245] font-bold shadow-[0_0_8px_rgba(180,82,69,0.4)]'
      }
    } else {
      chipText = `${barehandedDmg} bare`
      accentBg = 'bg-[#2A100E]/80 text-[#E8A598] border-[#B45245]/50'
    }
  } else if (isWeapon) {
    accentColor = '#84A9C6'
    accentBorder = 'border-[#84A9C6]/35'
    chipText = `${card.value} power`
    accentBg = 'bg-[#121E2B]/80 text-[#84A9C6] border-[#84A9C6]/50'
  } else if (isPotion) {
    accentColor = '#4E9A7C'
    accentBorder = 'border-[#4E9A7C]/35'
    chipText = potionUsedThisRoom ? 'WASTED (0)' : `+${card.value} HP`
    accentBg = potionUsedThisRoom
      ? 'bg-[#1A1816]/80 text-stone-500 border-stone-700'
      : 'bg-[#10241A]/80 text-[#68C49E] border-[#4E9A7C]/50'
  }

  const hasCustomWidth = className.includes("w-")
  const hasCustomHeight = className.includes("h-")
  const defaultSizeClasses = `${hasCustomWidth ? "" : "w-[164px] sm:w-[185px] md:w-[205px] lg:w-[195px] xl:w-[220px] 2xl:w-[245px]"} ${hasCustomHeight ? "" : "h-[234px] sm:h-[265px] md:h-[295px] lg:h-[275px] xl:h-[315px] 2xl:h-[350px]"}`

  return (
    <motion.button
      ref={cardRef}
      layoutId={layoutId}
      type="button"
      disabled={disabled}
      aria-label={ariaLabel}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onClick={(e) => {
        if (!disabled && onClick) onClick(e)
      }}
      style={{
        transformStyle: reducedMotion ? 'flat' : 'preserve-3d',
        perspective: reducedMotion ? undefined : 800
      }}
      animate={{
        rotateX: reducedMotion ? 0 : tilt.x,
        rotateY: reducedMotion ? 0 : tilt.y,
        scale: selected ? 1.04 : 1
      }}
      whileHover={interactive && !disabled && !reducedMotion ? { y: -6, scale: 1.02 } : {}}
      whileTap={interactive && !disabled ? { scale: 0.97 } : {}}
      transition={
        reducedMotion
          ? { duration: 0.15 }
          : { type: 'spring', stiffness: 350, damping: 25 }
      }
      className={`group relative ${defaultSizeClasses} rounded-xl overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2D06B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07060A] select-none shadow-[0_6px_20px_rgba(0,0,0,0.85),0_1px_0_rgba(201,162,39,0.2)] border border-[#C9A227]/30 transition-shadow ${
        disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer'
      } ${selected ? 'ring-2 ring-[#F2D06B] shadow-[0_0_25px_rgba(242,208,107,0.4)]' : ''} ${className}`}
    >
      {/* Parchment / Obsidian Base Background */}
      <div className="absolute inset-0 bg-[#14100D] bg-radial from-[#1E1814] via-[#14100D] to-[#0A0807]" />

      {/* Subtle Paper Noise & Fiber Texture */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:10px_10px] pointer-events-none" />

      {/* 1px Inner Hairline (Themed by Card Type Color) */}
      <div className={`absolute inset-1.5 rounded-lg border ${accentBorder} pointer-events-none transition-colors duration-200`} />
      <div className="absolute inset-2 rounded-md border border-[#C9A227]/15 pointer-events-none" />

      {/* Outer Bevel Highlight on Top/Left Edge */}
      <div className="absolute inset-0 rounded-xl border-t border-l border-white/15 pointer-events-none" />
      <div className="absolute inset-0 rounded-xl border-b border-r border-black/70 pointer-events-none" />

      {/* Pips Layout for 2-10 */}
      <Pips rank={card.rank} suit={card.suit} />

      {/* Top-Left Corner Index (Type Accent Color) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex flex-col items-center leading-none z-10">
        <span
          className="font-serif font-black text-xl sm:text-2xl xl:text-3xl tracking-tight drop-shadow-md"
          style={{ color: accentColor }}
        >
          {card.rank}
        </span>
        <SuitGlyph
          suit={card.suit}
          className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5.5 xl:h-5.5 mt-0.5"
          style={{ color: accentColor }}
        />
      </div>

      {/* Bottom-Right Corner Index (Rotated 180°, Type Accent Color) */}
      <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 flex flex-col items-center leading-none rotate-180 z-10">
        <span
          className="font-serif font-black text-xl sm:text-2xl xl:text-3xl tracking-tight drop-shadow-md"
          style={{ color: accentColor }}
        >
          {card.rank}
        </span>
        <SuitGlyph
          suit={card.suit}
          className="w-4 h-4 sm:w-5 sm:h-5 xl:w-5.5 xl:h-5.5 mt-0.5"
          style={{ color: accentColor }}
        />
      </div>

      {/* Central Illustration Medallion — Kept Gold & Detailed */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        {isMonster && <MonsterArt rank={card.rank} suit={card.suit} />}
        {isWeapon && <WeaponArt rank={card.rank} />}
        {isPotion && <PotionArt rank={card.rank} />}
      </div>

      {/* Dynamic Choice / Tactical Chip at Bottom (Phase 2 Spec) */}
      <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2 sm:inset-x-3 flex justify-center z-10 pointer-events-none">
        <div
          className={`px-2.5 py-1 sm:px-3 sm:py-1 rounded-md sm:rounded-lg border text-xs sm:text-sm font-mono font-bold tracking-tight shadow-md transition-all duration-150 ${accentBg}`}
        >
          {chipText}
        </div>
      </div>

      {/* Dynamic Specular Sheen (Shifts with Mouse Cursor) */}
      {!reducedMotion && (
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            background: `radial-gradient(circle 90px at ${sheenPos.x}% ${sheenPos.y}%, rgba(242, 208, 107, 0.15), transparent 70%)`
          }}
        />
      )}
    </motion.button>
  )
}
