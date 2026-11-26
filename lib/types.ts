export type Suit = 'clubs' | 'spades' | 'diamonds' | 'hearts'
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K' | 'A'
export type CardKind = 'monster' | 'weapon' | 'potion'

export interface Card {
  id: string          // stable, e.g. "spades-13"
  suit: Suit
  rank: Rank
  value: number       // 2..14, Ace high
  kind: CardKind      // clubs|spades -> monster, diamonds -> weapon, hearts -> potion
}

export interface EquippedWeapon {
  card: Card
  lastSlain: number | null      // null === fresh, may attack anything
  slain: Card[]                 // ordered, for the stacked visual
}

export type Phase =
  | 'BOOT' | 'MENU' | 'DEALING' | 'AWAITING_ACTION'
  | 'RESOLVING' | 'ROOM_CLEAR' | 'GAME_OVER'

export interface LogEntry {
  id: string
  text: string
  type: 'damage' | 'heal' | 'equip' | 'avoid' | 'slay' | 'system' | 'discard'
  timestamp: number
}

export interface GameState {
  phase: Phase
  dungeon: Card[]
  room: Card[]
  discard: Card[]
  health: number                  // 0..20
  equippedWeapon: EquippedWeapon | null
  cardsFacedThisRoom: number      // 0..3
  potionUsedThisRoom: boolean
  lastActionWasAvoid: boolean
  lastFacedCard: Card | null      // for the victory-potion scoring rule
  outcome: 'death' | 'victory' | null
  score: number | null
  roomsCleared: number
  log: LogEntry[]                 // human-readable event feed
}

export interface RunHistoryItem {
  id: string
  date: string
  outcome: 'death' | 'victory'
  score: number
  roomsCleared: number
  finalHealth: number
}
