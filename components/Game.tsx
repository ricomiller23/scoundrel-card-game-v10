'use client'

import React, { useEffect } from 'react'
import { useGameStore } from '@/lib/store'
import { MenuScreen } from './screens/MenuScreen'
import { GameScreen } from './screens/GameScreen'
import { GameOverScreen } from './screens/GameOverScreen'
import { AtmosphereCanvas } from './fx/AtmosphereCanvas'
import { DamageVignette } from './fx/DamageVignette'
import { FloatingNumbers } from './fx/FloatingNumbers'

export const Game: React.FC = () => {
  const phase = useGameStore((s) => s.game.phase)
  const boot = useGameStore((s) => s.boot)

  useEffect(() => {
    boot()
  }, [boot])

  return (
    <div className="relative h-screen h-[100dvh] max-h-[100dvh] w-full bg-[#07060A] text-[#EDE5D8] overflow-hidden">
      {/* Background Atmosphere Dust & Candle Canvas */}
      <AtmosphereCanvas />

      {/* Screen Effects & Damage Vignette */}
      <DamageVignette />
      <FloatingNumbers />

      {/* State Machine Phase Routing */}
      {phase === 'BOOT' && (
        <div className="h-full flex items-center justify-center font-serif text-lg text-[#F2D06B]">
          Lighting the candles of the crypt...
        </div>
      )}

      {phase === 'MENU' && <MenuScreen />}

      {phase === 'GAME_OVER' && <GameOverScreen />}

      {(phase === 'DEALING' ||
        phase === 'AWAITING_ACTION' ||
        phase === 'RESOLVING' ||
        phase === 'ROOM_CLEAR') && <GameScreen />}
    </div>
  )
}
