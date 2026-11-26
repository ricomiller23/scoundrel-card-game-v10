import React from 'react'
import { Rank, Suit } from '@/lib/types'
import { SuitGlyph } from './SuitGlyphs'

interface PipsProps {
  rank: Rank
  suit: Suit
}

interface PipCoord {
  x: number // percent 0..100
  y: number // percent 0..100
  rotate?: boolean
}

function getPipCoords(rank: Rank): PipCoord[] {
  switch (rank) {
    case '2':
      return [
        { x: 50, y: 18 },
        { x: 50, y: 82, rotate: true }
      ]
    case '3':
      return [
        { x: 50, y: 18 },
        { x: 50, y: 50 },
        { x: 50, y: 82, rotate: true }
      ]
    case '4':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '5':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 50, y: 50 },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '6':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 26, y: 50 },
        { x: 74, y: 50 },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '7':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 50, y: 34 },
        { x: 26, y: 50 },
        { x: 74, y: 50 },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '8':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 50, y: 34 },
        { x: 26, y: 50 },
        { x: 74, y: 50 },
        { x: 50, y: 66, rotate: true },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '9':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 26, y: 39 },
        { x: 74, y: 39 },
        { x: 50, y: 50 },
        { x: 26, y: 61, rotate: true },
        { x: 74, y: 61, rotate: true },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    case '10':
      return [
        { x: 26, y: 18 },
        { x: 74, y: 18 },
        { x: 50, y: 28 },
        { x: 26, y: 40 },
        { x: 74, y: 40 },
        { x: 26, y: 60, rotate: true },
        { x: 74, y: 60, rotate: true },
        { x: 50, y: 72, rotate: true },
        { x: 26, y: 82, rotate: true },
        { x: 74, y: 82, rotate: true }
      ]
    default:
      return []
  }
}

export const Pips: React.FC<PipsProps> = ({ rank, suit }) => {
  const coords = getPipCoords(rank)
  if (coords.length === 0) return null

  return (
    <div className="absolute inset-x-5 inset-y-6 pointer-events-none opacity-40 select-none">
      {coords.map((c, i) => (
        <div
          key={i}
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${c.x}%`,
            top: `${c.y}%`,
            transform: `translate(-50%, -50%) ${c.rotate ? 'rotate(180deg)' : ''}`
          }}
        >
          <SuitGlyph suit={suit} className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400/80" />
        </div>
      ))}
    </div>
  )
}
