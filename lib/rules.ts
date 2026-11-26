import { Card, CardKind, EquippedWeapon, GameState, LogEntry, Rank, Suit } from './types'

export const SUITS: Suit[] = ['clubs', 'spades', 'diamonds', 'hearts']

export const RANKS: Rank[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

export function cardValue(rank: Rank): number {
  switch (rank) {
    case '2': return 2
    case '3': return 3
    case '4': return 4
    case '5': return 5
    case '6': return 6
    case '7': return 7
    case '8': return 8
    case '9': return 9
    case '10': return 10
    case 'J': return 11
    case 'Q': return 12
    case 'K': return 13
    case 'A': return 14
  }
}

export function buildDeck(): Card[] {
  const deck: Card[] = []

  for (const suit of SUITS) {
    for (const rank of RANKS) {
      // Rule 3.1: Remove all red face cards (J, Q, K) and red Aces (A)
      if ((suit === 'hearts' || suit === 'diamonds') && (rank === 'J' || rank === 'Q' || rank === 'K' || rank === 'A')) {
        continue
      }

      let kind: CardKind
      if (suit === 'clubs' || suit === 'spades') {
        kind = 'monster'
      } else if (suit === 'diamonds') {
        kind = 'weapon'
      } else {
        kind = 'potion'
      }

      deck.push({
        id: `${suit}-${rank}`,
        suit,
        rank,
        value: cardValue(rank),
        kind
      })
    }
  }

  // Contract Assertions
  if (deck.length !== 44) {
    throw new Error(`Invalid deck size: expected 44, got ${deck.length}`)
  }

  const redFacesOrAces = deck.filter(
    c => (c.suit === 'hearts' || c.suit === 'diamonds') && (c.rank === 'J' || c.rank === 'Q' || c.rank === 'K' || c.rank === 'A')
  )
  if (redFacesOrAces.length > 0) {
    throw new Error(`Deck contains illegal red face cards or Aces: ${JSON.stringify(redFacesOrAces)}`)
  }

  const monsterCount = deck.filter(c => c.kind === 'monster').length
  const weaponCount = deck.filter(c => c.kind === 'weapon').length
  const potionCount = deck.filter(c => c.kind === 'potion').length

  if (monsterCount !== 26 || weaponCount !== 9 || potionCount !== 9) {
    throw new Error(`Card distribution mismatch: monsters=${monsterCount}, weapons=${weaponCount}, potions=${potionCount}`)
  }

  return deck
}

export function shuffle<T>(arr: T[], rng: () => number = Math.random): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = copy[i]
    copy[i] = copy[j]
    copy[j] = temp
  }
  return copy
}

export function canUseWeapon(monster: Card, weapon: EquippedWeapon | null): boolean {
  if (!weapon || monster.kind !== 'monster') return false
  if (weapon.lastSlain === null) return true // Fresh weapon may attack any monster
  return monster.value < weapon.lastSlain // Strictly lower than last slain monster
}

export function damageFrom(monster: Card, weapon: EquippedWeapon | null, useWeapon: boolean = false): number {
  if (useWeapon && canUseWeapon(monster, weapon)) {
    return Math.max(0, monster.value - weapon!.card.value)
  }
  return monster.value
}

export function canAvoid(state: GameState): boolean {
  return (
    state.room.length === 4 &&
    !state.lastActionWasAvoid &&
    state.dungeon.length >= 4 &&
    state.cardsFacedThisRoom === 0 &&
    (state.phase === 'AWAITING_ACTION' || state.phase === 'DEALING')
  )
}

export function canFaceMore(state: GameState): boolean {
  return state.cardsFacedThisRoom < 3 && state.room.length > 0
}

export function createInitialState(deck: Card[] = buildDeck(), shouldShuffle: boolean = true): GameState {
  const dungeon = shouldShuffle ? shuffle(deck) : [...deck]
  return {
    phase: 'BOOT',
    dungeon,
    room: [],
    discard: [],
    health: 20,
    equippedWeapon: null,
    cardsFacedThisRoom: 0,
    potionUsedThisRoom: false,
    lastActionWasAvoid: false,
    lastFacedCard: null,
    outcome: null,
    score: null,
    roomsCleared: 0,
    log: [
      {
        id: 'start',
        text: 'The Gilded Dungeon awaits. Health: 20.',
        type: 'system',
        timestamp: Date.now()
      }
    ]
  }
}

export function dealRoom(state: GameState): GameState {
  if (state.dungeon.length === 0 && state.room.length === 0) {
    const victoryScore = computeScore({ ...state, outcome: 'victory' })
    return {
      ...state,
      phase: 'GAME_OVER',
      outcome: 'victory',
      score: victoryScore,
      log: [
        ...state.log,
        {
          id: `victory-${Date.now()}`,
          text: `Dungeon conquered! Final Score: ${victoryScore}`,
          type: 'system',
          timestamp: Date.now()
        }
      ]
    }
  }

  const needed = 4 - state.room.length
  const toDraw = Math.min(needed, state.dungeon.length)
  const drawn = state.dungeon.slice(0, toDraw)
  const newDungeon = state.dungeon.slice(toDraw)
  const newRoom = [...state.room, ...drawn]

  return {
    ...state,
    phase: 'AWAITING_ACTION',
    dungeon: newDungeon,
    room: newRoom,
    cardsFacedThisRoom: 0,
    potionUsedThisRoom: false,
    lastActionWasAvoid: false
  }
}

export function avoidRoom(state: GameState): GameState {
  if (!canAvoid(state)) {
    throw new Error('Cannot avoid this room: must have 4 cards, not avoided last turn, and at least 4 dungeon cards remaining.')
  }

  // All 4 cards go to the BOTTOM of the Dungeon
  const newDungeon = [...state.dungeon, ...state.room]
  const logEntry: LogEntry = {
    id: `avoid-${Date.now()}`,
    text: 'You avoid the room, sweeping all 4 cards to the dungeon depths.',
    type: 'avoid',
    timestamp: Date.now()
  }

  // Deal fresh 4 cards with no carryover
  const drawn = newDungeon.slice(0, 4)
  const remainingDungeon = newDungeon.slice(4)

  return {
    ...state,
    phase: 'AWAITING_ACTION',
    dungeon: remainingDungeon,
    room: drawn,
    cardsFacedThisRoom: 0,
    potionUsedThisRoom: false,
    lastActionWasAvoid: true,
    log: [...state.log, logEntry]
  }
}

export function computeScore(state: GameState): number {
  if (state.outcome === 'death' || state.health <= 0) {
    // Find all remaining monsters in Dungeon and unfaced in Room
    const remainingMonsters = [...state.dungeon, ...state.room].filter(c => c.kind === 'monster')
    const remainingMonsterSum = remainingMonsters.reduce((acc, c) => acc + c.value, 0)
    return state.health - remainingMonsterSum
  }

  // Victory score = positive health (+ potion value if health was 20 and final card was potion)
  let score = state.health
  if (state.health === 20 && state.lastFacedCard && state.lastFacedCard.kind === 'potion') {
    score += state.lastFacedCard.value
  }
  return score
}

export function resolveCard(state: GameState, cardId: string, mode?: 'weapon' | 'barehanded'): GameState {
  const cardIndex = state.room.findIndex(c => c.id === cardId)
  if (cardIndex === -1) {
    throw new Error(`Card ${cardId} is not in the room`)
  }

  const card = state.room[cardIndex]
  const newRoom = state.room.filter((_, idx) => idx !== cardIndex)
  let newDiscard = [...state.discard]
  let newHealth = state.health
  let newEquipped = state.equippedWeapon ? { ...state.equippedWeapon } : null
  let newPotionUsed = state.potionUsedThisRoom
  const logEntries: LogEntry[] = []

  if (card.kind === 'weapon') {
    // Weapons are binding: if picked up, must equip
    if (newEquipped) {
      // Discard previous weapon and all monsters stacked on it
      newDiscard.push(newEquipped.card, ...newEquipped.slain)
      logEntries.push({
        id: `replace-weapon-${Date.now()}`,
        text: `Discarded ${newEquipped.card.rank}♦ and ${newEquipped.slain.length} slain monster(s).`,
        type: 'discard',
        timestamp: Date.now()
      })
    }
    newEquipped = {
      card,
      lastSlain: null,
      slain: []
    }
    logEntries.push({
      id: `equip-${Date.now()}`,
      text: `Equipped ${card.rank}♦ (Attack power: ${card.value}).`,
      type: 'equip',
      timestamp: Date.now()
    })
  } else if (card.kind === 'potion') {
    if (!newPotionUsed) {
      const prevHealth = newHealth
      newHealth = Math.min(20, newHealth + card.value)
      const healed = newHealth - prevHealth
      newPotionUsed = true
      logEntries.push({
        id: `heal-${Date.now()}`,
        text: `Quaffed ${card.rank}♥ potion. Restored ${healed} HP (now ${newHealth}/20).`,
        type: 'heal',
        timestamp: Date.now()
      })
    } else {
      logEntries.push({
        id: `potion-wasted-${Date.now()}`,
        text: `Second potion ${card.rank}♥ in room ignored. Discarded with 0 healing.`,
        type: 'discard',
        timestamp: Date.now()
      })
    }
    newDiscard.push(card)
  } else if (card.kind === 'monster') {
    const isWeaponEligible = canUseWeapon(card, newEquipped)
    const fightWithWeapon = mode === 'weapon' && isWeaponEligible

    if (mode === 'weapon' && !isWeaponEligible) {
      throw new Error(`Cannot attack ${card.rank}${card.suit === 'clubs' ? '♣' : '♠'} with current weapon: degraded ceiling is ${newEquipped?.lastSlain}.`)
    }

    if (fightWithWeapon && newEquipped) {
      const dmg = Math.max(0, card.value - newEquipped.card.value)
      newHealth -= dmg
      newEquipped = {
        card: newEquipped.card,
        lastSlain: card.value,
        slain: [...newEquipped.slain, card]
      }
      logEntries.push({
        id: `slay-weapon-${Date.now()}`,
        text: `Slew ${card.rank}${card.suit === 'clubs' ? '♣' : '♠'} (${card.value}) with weapon ${newEquipped.card.value}. Took ${dmg} damage.`,
        type: 'slay',
        timestamp: Date.now()
      })
    } else {
      // Barehanded combat
      const dmg = card.value
      newHealth -= dmg
      newDiscard.push(card)
      logEntries.push({
        id: `barehanded-${Date.now()}`,
        text: `Fought ${card.rank}${card.suit === 'clubs' ? '♣' : '♠'} (${card.value}) barehanded. Took ${dmg} damage.`,
        type: 'damage',
        timestamp: Date.now()
      })
    }
  }

  const newCardsFaced = state.cardsFacedThisRoom + 1

  let updatedState: GameState = {
    ...state,
    health: newHealth,
    room: newRoom,
    discard: newDiscard,
    equippedWeapon: newEquipped,
    cardsFacedThisRoom: newCardsFaced,
    potionUsedThisRoom: newPotionUsed,
    lastFacedCard: card,
    log: [...state.log, ...logEntries]
  }

  // End of resolution evaluation (order matters §4.4)
  if (newHealth <= 0) {
    const deathScore = computeScore({ ...updatedState, outcome: 'death' })
    return {
      ...updatedState,
      phase: 'GAME_OVER',
      outcome: 'death',
      score: deathScore,
      log: [
        ...updatedState.log,
        {
          id: `death-${Date.now()}`,
          text: `You have fallen in the dungeon. Final Score: ${deathScore}`,
          type: 'system',
          timestamp: Date.now()
        }
      ]
    }
  }

  // 2. if (cardsFacedThisRoom >= 3 || room.length === 0)
  if (newCardsFaced >= 3 || newRoom.length === 0) {
    if (updatedState.dungeon.length === 0 && newRoom.length === 0) {
      const victoryScore = computeScore({ ...updatedState, outcome: 'victory' })
      return {
        ...updatedState,
        phase: 'GAME_OVER',
        outcome: 'victory',
        score: victoryScore,
        log: [
          ...updatedState.log,
          {
            id: `victory-${Date.now()}`,
            text: `Victory! All 44 cards faced! Final Score: ${victoryScore}`,
            type: 'system',
            timestamp: Date.now()
          }
        ]
      }
    }

    return {
      ...updatedState,
      phase: 'ROOM_CLEAR',
      roomsCleared: updatedState.roomsCleared + 1
    }
  }

  return {
    ...updatedState,
    phase: 'AWAITING_ACTION'
  }
}

export function advanceRoomClear(state: GameState): GameState {
  if (state.phase !== 'ROOM_CLEAR') {
    return state
  }

  if (state.dungeon.length === 0 && state.room.length === 0) {
    const victoryScore = computeScore({ ...state, outcome: 'victory' })
    return {
      ...state,
      phase: 'GAME_OVER',
      outcome: 'victory',
      score: victoryScore
    }
  }

  // Leftover card carries forward, deal fresh up to 4
  return dealRoom({
    ...state,
    phase: 'DEALING',
    potionUsedThisRoom: false,
    lastActionWasAvoid: false
  })
}
