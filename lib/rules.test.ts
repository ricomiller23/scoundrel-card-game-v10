import { describe, it, expect } from 'vitest'
import {
  buildDeck,
  cardValue,
  canUseWeapon,
  damageFrom,
  canAvoid,
  dealRoom,
  avoidRoom,
  resolveCard,
  advanceRoomClear,
  computeScore,
  createInitialState
} from './rules'
import { Card, GameState } from './types'

describe('Scoundrel Rules Engine (§12 Acceptance Tests)', () => {
  describe('Deck Specifications (Tests 1-5)', () => {
    it('1. buildDeck() returns exactly 44 cards', () => {
      const deck = buildDeck()
      expect(deck.length).toBe(44)
    })

    it('2. No card in the deck is a red face card or red Ace', () => {
      const deck = buildDeck()
      const illegal = deck.filter(
        c => (c.suit === 'hearts' || c.suit === 'diamonds') &&
             (c.rank === 'J' || c.rank === 'Q' || c.rank === 'K' || c.rank === 'A')
      )
      expect(illegal.length).toBe(0)
    })

    it('3. No diamond or heart has a rank of J, Q, K, or A', () => {
      const deck = buildDeck()
      const redCards = deck.filter(c => c.suit === 'hearts' || c.suit === 'diamonds')
      for (const card of redCards) {
        expect(['2', '3', '4', '5', '6', '7', '8', '9', '10']).toContain(card.rank)
      }
    })

    it('4. Clubs and spades total 26; diamonds 9; hearts 9', () => {
      const deck = buildDeck()
      const clubs = deck.filter(c => c.suit === 'clubs')
      const spades = deck.filter(c => c.suit === 'spades')
      const diamonds = deck.filter(c => c.suit === 'diamonds')
      const hearts = deck.filter(c => c.suit === 'hearts')

      expect(clubs.length + spades.length).toBe(26)
      expect(diamonds.length).toBe(9)
      expect(hearts.length).toBe(9)
    })

    it('5. cardValue("A") === 14, cardValue("K") === 13, cardValue("2") === 2', () => {
      expect(cardValue('A')).toBe(14)
      expect(cardValue('K')).toBe(13)
      expect(cardValue('Q')).toBe(12)
      expect(cardValue('J')).toBe(11)
      expect(cardValue('10')).toBe(10)
      expect(cardValue('2')).toBe(2)
    })
  })

  describe('Combat Specifications (Tests 6-14)', () => {
    const weapon5: Card = { id: 'diamonds-5', suit: 'diamonds', rank: '5', value: 5, kind: 'weapon' }
    const monster3: Card = { id: 'clubs-3', suit: 'clubs', rank: '3', value: 3, kind: 'monster' }
    const monsterJ: Card = { id: 'spades-J', suit: 'spades', rank: 'J', value: 11, kind: 'monster' }
    const monsterQ: Card = { id: 'spades-Q', suit: 'spades', rank: 'Q', value: 12, kind: 'monster' }
    const monster6: Card = { id: 'clubs-6', suit: 'clubs', rank: '6', value: 6, kind: 'monster' }
    const monsterA: Card = { id: 'clubs-A', suit: 'clubs', rank: 'A', value: 14, kind: 'monster' }

    it('6. Weapon 5 vs Monster 3 -> damage 0', () => {
      const weaponState = { card: weapon5, lastSlain: null, slain: [] }
      expect(canUseWeapon(monster3, weaponState)).toBe(true)
      expect(damageFrom(monster3, weaponState, true)).toBe(0)
    })

    it('7. Weapon 5 vs Monster J (11) -> damage 6 (original rules worked example)', () => {
      const weaponState = { card: weapon5, lastSlain: null, slain: [] }
      expect(canUseWeapon(monsterJ, weaponState)).toBe(true)
      expect(damageFrom(monsterJ, weaponState, true)).toBe(6)
    })

    it('8. Barehanded vs Monster 11 -> damage 11', () => {
      const weaponState = { card: weapon5, lastSlain: null, slain: [] }
      expect(damageFrom(monsterJ, weaponState, false)).toBe(11)
    })

    it('9. Fresh weapon may attack any value, including 14', () => {
      const freshWeapon = { card: weapon5, lastSlain: null, slain: [] }
      expect(canUseWeapon(monsterA, freshWeapon)).toBe(true)
    })

    it('10. Weapon that slew a 12 may attack a 6 (original rules example)', () => {
      const usedWeapon = { card: weapon5, lastSlain: 12, slain: [monsterQ] }
      expect(canUseWeapon(monster6, usedWeapon)).toBe(true)
    })

    it('11. Weapon that slew a 6 may not attack a 12 (barehanded is forced)', () => {
      const usedWeapon = { card: weapon5, lastSlain: 6, slain: [monster6] }
      expect(canUseWeapon(monsterQ, usedWeapon)).toBe(false)
    })

    it('12. Weapon that slew a 6 may not attack another 6 (strictly lower only)', () => {
      const usedWeapon = { card: weapon5, lastSlain: 6, slain: [monster6] }
      const another6: Card = { id: 'spades-6', suit: 'spades', rank: '6', value: 6, kind: 'monster' }
      expect(canUseWeapon(another6, usedWeapon)).toBe(false)
    })

    it('13. A weapon blocked from attacking is NOT discarded and remains usable against lower monsters', () => {
      let state = createInitialState([], false)
      state.health = 20
      state.equippedWeapon = { card: weapon5, lastSlain: 6, slain: [monster6] }
      state.room = [monsterQ, monster3]
      state.phase = 'AWAITING_ACTION'

      // Attacking Queen barehanded
      state = resolveCard(state, monsterQ.id, 'barehanded')

      // Weapon is still equipped with its original ceiling of 6
      expect(state.equippedWeapon).not.toBeNull()
      expect(state.equippedWeapon?.card.id).toBe(weapon5.id)
      expect(state.equippedWeapon?.lastSlain).toBe(6)
      // And can still attack the monster 3
      expect(canUseWeapon(monster3, state.equippedWeapon)).toBe(true)
    })

    it('14. Player may always choose barehanded even when a weapon attack is legal', () => {
      let state = createInitialState([], false)
      state.health = 20
      state.equippedWeapon = { card: weapon5, lastSlain: null, slain: [] }
      state.room = [monster3]
      state.phase = 'AWAITING_ACTION'

      // Choose barehanded explicitly
      state = resolveCard(state, monster3.id, 'barehanded')
      // Barehanded takes full 3 damage
      expect(state.health).toBe(17)
      // Weapon did not degrade because it was fought barehanded
      expect(state.equippedWeapon?.lastSlain).toBeNull()
      expect(state.equippedWeapon?.slain.length).toBe(0)
    })
  })

  describe('Potions Specifications (Tests 15-18)', () => {
    const potion5: Card = { id: 'hearts-5', suit: 'hearts', rank: '5', value: 5, kind: 'potion' }
    const potion8: Card = { id: 'hearts-8', suit: 'hearts', rank: '8', value: 8, kind: 'potion' }

    it('15. First potion heals; a second potion in the same Room adds nothing', () => {
      let state = createInitialState([], false)
      state.health = 10
      state.room = [potion5, potion8]
      state.phase = 'AWAITING_ACTION'

      // First potion
      state = resolveCard(state, potion5.id)
      expect(state.health).toBe(15)
      expect(state.potionUsedThisRoom).toBe(true)

      // Second potion in same room
      state = resolveCard(state, potion8.id)
      expect(state.health).toBe(15) // Did not increase
      expect(state.discard).toContainEqual(potion8)
    })

    it('16. Health is clamped at 20', () => {
      let state = createInitialState([], false)
      state.health = 18
      state.room = [potion5]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, potion5.id)
      expect(state.health).toBe(20)
    })

    it('17. Potion allowance resets on a new Room', () => {
      let state = createInitialState([], false)
      state.health = 10
      state.room = [potion5]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, potion5.id)
      expect(state.potionUsedThisRoom).toBe(true)

      // Room clears and deals next
      state.phase = 'ROOM_CLEAR'
      state.dungeon = [potion8]
      state = advanceRoomClear(state)
      expect(state.potionUsedThisRoom).toBe(false)
    })

    it('18. A potion taken at full health is consumed but the allowance is still used', () => {
      let state = createInitialState([], false)
      state.health = 20
      state.room = [potion5, potion8]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, potion5.id)
      expect(state.health).toBe(20)
      expect(state.potionUsedThisRoom).toBe(true)

      // Next potion in same room is wasted
      state = resolveCard(state, potion8.id)
      expect(state.health).toBe(20)
    })
  })

  describe('Rooms Specifications (Tests 19-25)', () => {
    const deck = buildDeck()

    it('19. A Room deals exactly 4 cards when >= 4 remain', () => {
      const state = createInitialState(deck, false)
      const afterDeal = dealRoom(state)
      expect(afterDeal.room.length).toBe(4)
      expect(afterDeal.dungeon.length).toBe(40)
    })

    it('20. After facing 3 cards, exactly 1 remains and carries into the next Room', () => {
      let state = createInitialState(deck, false)
      state = dealRoom(state)
      expect(state.room.length).toBe(4)

      const card1 = state.room[0]
      state = resolveCard(state, card1.id, 'barehanded')
      const card2 = state.room[0]
      state = resolveCard(state, card2.id, 'barehanded')
      const card3 = state.room[0]
      state = resolveCard(state, card3.id, 'barehanded')

      expect(state.cardsFacedThisRoom).toBe(3)
      expect(state.room.length).toBe(1)
      const leftover = state.room[0]

      // Advance to next room
      state = advanceRoomClear(state)
      expect(state.room.length).toBe(4)
      expect(state.room[0].id).toBe(leftover.id)
      expect(state.dungeon.length).toBe(37) // Drew 3 more cards to make 4
    })

    it('21. The final Room deals only the remaining cards (2 in a standard game) - never more than exist', () => {
      let state = createInitialState([], false)
      const cardA: Card = { id: 'clubs-2', suit: 'clubs', rank: '2', value: 2, kind: 'monster' }
      const cardB: Card = { id: 'clubs-3', suit: 'clubs', rank: '3', value: 3, kind: 'monster' }
      state.dungeon = [cardA, cardB]
      state.room = []

      state = dealRoom(state)
      expect(state.room.length).toBe(2)
      expect(state.dungeon.length).toBe(0)
    })

    it('22. Avoiding moves all 4 cards to the bottom of the Dungeon', () => {
      let state = createInitialState(deck, false)
      state = dealRoom(state)
      const avoidedRoom = [...state.room]
      const originalDungeonLength = state.dungeon.length

      state = avoidRoom(state)
      // New room has 4 cards
      expect(state.room.length).toBe(4)
      // Dungeon length remains originalDungeonLength (drew 4, put 4 at bottom)
      expect(state.dungeon.length).toBe(originalDungeonLength)
      // Bottom 4 of dungeon are the avoided cards
      const bottom4 = state.dungeon.slice(-4)
      expect(bottom4.map(c => c.id)).toEqual(avoidedRoom.map(c => c.id))
      expect(state.lastActionWasAvoid).toBe(true)
    })

    it('23. Two consecutive Avoids are rejected', () => {
      let state = createInitialState(deck, false)
      state = dealRoom(state)
      state = avoidRoom(state)
      expect(canAvoid(state)).toBe(false)
      expect(() => avoidRoom(state)).toThrow()
    })

    it('24. Avoid is disabled when fewer than 4 cards remain to redeal', () => {
      let state = createInitialState([], false)
      state.room = deck.slice(0, 4)
      state.dungeon = deck.slice(4, 7) // Only 3 cards left
      state.phase = 'AWAITING_ACTION'
      expect(canAvoid(state)).toBe(false)
    })

    it('25. An Avoid produces no leftover carryover', () => {
      let state = createInitialState(deck, false)
      state = dealRoom(state)
      const firstRoomCards = state.room.map(c => c.id)
      state = avoidRoom(state)
      // All cards in new room are newly dealt from top of dungeon, none left over on table
      expect(state.room.length).toBe(4)
      for (const card of state.room) {
        expect(firstRoomCards).not.toContain(card.id)
      }
    })
  })

  describe('Weapons Lifecycle (Tests 26-28)', () => {
    const weapon5: Card = { id: 'diamonds-5', suit: 'diamonds', rank: '5', value: 5, kind: 'weapon' }
    const weapon8: Card = { id: 'diamonds-8', suit: 'diamonds', rank: '8', value: 8, kind: 'weapon' }
    const monster3: Card = { id: 'clubs-3', suit: 'clubs', rank: '3', value: 3, kind: 'monster' }

    it('26. Equipping a new weapon discards the old weapon and its stacked monsters', () => {
      let state = createInitialState([], false)
      state.equippedWeapon = { card: weapon5, lastSlain: 3, slain: [monster3] }
      state.room = [weapon8]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, weapon8.id)
      expect(state.discard).toContainEqual(weapon5)
      expect(state.discard).toContainEqual(monster3)
      expect(state.equippedWeapon?.card.id).toBe(weapon8.id)
    })

    it('27. The newly equipped weapon is fresh (lastSlain === null)', () => {
      let state = createInitialState([], false)
      state.equippedWeapon = { card: weapon5, lastSlain: 3, slain: [monster3] }
      state.room = [weapon8]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, weapon8.id)
      expect(state.equippedWeapon?.lastSlain).toBeNull()
      expect(state.equippedWeapon?.slain.length).toBe(0)
    })

    it('28. lastSlain persists across Room boundaries', () => {
      let state = createInitialState([], false)
      state.equippedWeapon = { card: weapon5, lastSlain: 6, slain: [] }
      state.room = [monster3]
      state.phase = 'ROOM_CLEAR'
      state.dungeon = [weapon8]

      state = advanceRoomClear(state)
      expect(state.equippedWeapon?.lastSlain).toBe(6)
    })
  })

  describe('End & Scoring Specifications (Tests 29-34)', () => {
    const dragon: Card = { id: 'spades-A', suit: 'spades', rank: 'A', value: 14, kind: 'monster' }
    const troll: Card = { id: 'clubs-10', suit: 'clubs', rank: '10', value: 10, kind: 'monster' }
    const potion10: Card = { id: 'hearts-10', suit: 'hearts', rank: '10', value: 10, kind: 'potion' }

    it('29. Health <= 0 ends the game immediately, mid-Room', () => {
      let state = createInitialState([], false)
      state.health = 5
      state.room = [dragon, troll]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, dragon.id, 'barehanded')
      expect(state.health).toBe(-9)
      expect(state.phase).toBe('GAME_OVER')
      expect(state.outcome).toBe('death')
    })

    it('30. Death score = health - sum(values of all remaining Monsters) and is negative', () => {
      let state = createInitialState([], false)
      state.health = 4
      state.room = [dragon, troll]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, dragon.id, 'barehanded')
      // Health is -10. Remaining monster in room is troll (10).
      // Score = -10 - 10 = -20.
      expect(state.score).toBe(-20)
    })

    it('31. Unfaced Room cards plus all Dungeon cards count toward the death score', () => {
      let state = createInitialState([], false)
      state.health = 10
      state.room = [dragon, troll] // dragon deals 14 barehanded -> health -4
      const dungeonMonster: Card = { id: 'spades-K', suit: 'spades', rank: 'K', value: 13, kind: 'monster' }
      state.dungeon = [dungeonMonster]

      state = resolveCard(state, dragon.id, 'barehanded')
      // Health is -4. Unfaced monsters: troll (10) + dungeonMonster (13) = 23.
      // Score = -4 - 23 = -27.
      expect(state.score).toBe(-27)
    })

    it('32. Exhausting the Dungeon is a victory', () => {
      let state = createInitialState([], false)
      state.health = 15
      state.dungeon = []
      state.room = [potion10]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, potion10.id)
      expect(state.phase).toBe('GAME_OVER')
      expect(state.outcome).toBe('victory')
    })

    it('33. Victory score = positive health', () => {
      let state = createInitialState([], false)
      state.health = 15
      state.dungeon = []
      const card2: Card = { id: 'diamonds-2', suit: 'diamonds', rank: '2', value: 2, kind: 'weapon' }
      state.room = [card2]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, card2.id)
      expect(state.score).toBe(15)
    })

    it('34. Victory at exactly 20 health with a Potion as the final card adds that potion value', () => {
      let state = createInitialState([], false)
      state.health = 20
      state.dungeon = []
      state.room = [potion10]
      state.phase = 'AWAITING_ACTION'

      state = resolveCard(state, potion10.id)
      // Score = 20 + 10 = 30
      expect(state.score).toBe(30)
    })
  })

  describe('Invariants & Property Tests (Tests 35-37 across 1,000 random games)', () => {
    it('35-37. Property tests across 1,000 random games', () => {
      const NUM_GAMES = 1000

      for (let g = 0; g < NUM_GAMES; g++) {
        let state = createInitialState()
        state = dealRoom(state)

        let stepCount = 0
        const maxSteps = 200

        while (state.phase !== 'GAME_OVER' && stepCount < maxSteps) {
          stepCount++

          // Invariant 35: card count conservation
          const weaponCount = state.equippedWeapon ? 1 + state.equippedWeapon.slain.length : 0
          const totalCards = state.dungeon.length + state.room.length + state.discard.length + weaponCount
          expect(totalCards).toBe(44)

          // Invariant 37: no card appears twice
          const allCards: Card[] = [
            ...state.dungeon,
            ...state.room,
            ...state.discard,
            ...(state.equippedWeapon ? [state.equippedWeapon.card, ...state.equippedWeapon.slain] : [])
          ]
          const idSet = new Set(allCards.map(c => c.id))
          expect(idSet.size).toBe(44)

          // Invariant 36: Health never exceeds 20
          expect(state.health).toBeLessThanOrEqual(20)

          if (state.phase === 'ROOM_CLEAR') {
            state = advanceRoomClear(state)
            continue
          }

          if (state.phase === 'AWAITING_ACTION') {
            if (state.room.length === 0) {
              if (state.dungeon.length === 0) {
                state = {
                  ...state,
                  phase: 'GAME_OVER',
                  outcome: 'victory',
                  score: computeScore(state)
                }
                break
              } else {
                state = advanceRoomClear(state)
                continue
              }
            }

            // Randomly choose avoid if allowed (10% chance)
            if (canAvoid(state) && Math.random() < 0.1) {
              state = avoidRoom(state)
              continue
            }

            // Pick a random card from room
            const card = state.room[Math.floor(Math.random() * state.room.length)]
            if (card.kind === 'monster') {
              const eligibleWeapon = canUseWeapon(card, state.equippedWeapon)
              const useWeapon = eligibleWeapon ? Math.random() > 0.2 : false
              state = resolveCard(state, card.id, useWeapon ? 'weapon' : 'barehanded')
            } else {
              state = resolveCard(state, card.id)
            }
          }
        }

        // Final assertion on game completion
        expect(state.phase).toBe('GAME_OVER')
        expect(['victory', 'death']).toContain(state.outcome)
        expect(state.score).not.toBeNull()
      }
    })
  })
})
