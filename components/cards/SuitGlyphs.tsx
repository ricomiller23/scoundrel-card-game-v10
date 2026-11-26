import React from 'react'
import { Suit } from '@/lib/types'

interface SuitGlyphProps {
  suit: Suit
  className?: string
  style?: React.CSSProperties
}

export const SuitGlyph: React.FC<SuitGlyphProps> = ({ suit, className = 'w-4 h-4', style }) => {
  switch (suit) {
    case 'spades':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
          <path d="M12 2C9.5 7 5 9.5 5 13.5C5 16 7 17.5 9.5 17.5C10.5 17.5 11.4 17.1 12 16.5C12.6 17.1 13.5 17.5 14.5 17.5C17 17.5 19 16 19 13.5C19 9.5 14.5 7 12 2Z" />
          <path d="M10 17C10.5 19.5 10 22 8 22H16C14 22 13.5 19.5 14 17H10Z" />
        </svg>
      )
    case 'clubs':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
          <circle cx="12" cy="7" r="4" />
          <circle cx="7" cy="14" r="4" />
          <circle cx="17" cy="14" r="4" />
          <path d="M11 13H13V17H11Z" />
          <path d="M10 17C10.5 19.5 10 22 8 22H16C14 22 13.5 19.5 14 17H10Z" />
        </svg>
      )
    case 'diamonds':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
          <path d="M12 2L20 12L12 22L4 12L12 2Z" />
        </svg>
      )
    case 'hearts':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} style={style} aria-hidden="true">
          <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
        </svg>
      )
  }
}
