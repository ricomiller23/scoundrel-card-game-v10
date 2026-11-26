import { create } from 'zustand'
import { Card, GameState, RunHistoryItem } from './types'
import {
  advanceRoomClear,
  avoidRoom as rulesAvoidRoom,
  canAvoid,
  canUseWeapon,
  createInitialState,
  dealRoom as rulesDealRoom,
  resolveCard as rulesResolveCard
} from './rules'
import { sound } from './audio'
import { triggerHaptic } from './haptics'

export interface FloatingText {
  id: string
  text: string
  type: 'damage' | 'heal' | 'gold'
  x: number
  y: number
}

interface GameStore {
  // Game state
  game: GameState
  highScore: number | null
  runs: RunHistoryItem[]
  
  // UI & FX State
  screenShake: boolean
  damageFlash: boolean
  healFlash: boolean
  hitStop: boolean
  floatingTexts: FloatingText[]
  
  // Modals & Panels
  showHowToPlay: boolean
  combatChoiceCard: Card | null
  previewCard: Card | null
  
  // Settings
  soundEnabled: boolean
  hapticsEnabled: boolean
  reducedMotion: boolean

  // Actions
  boot: () => void
  startNewGame: () => void
  returnToMenu: () => void
  faceCard: (cardId: string, mode?: 'weapon' | 'barehanded', coords?: { x: number, y: number }) => void
  avoidCurrentRoom: () => void
  advanceToNextRoom: () => void
  
  // Interaction & Modals
  setCombatChoiceCard: (card: Card | null) => void
  setPreviewCard: (card: Card | null) => void
  setShowHowToPlay: (open: boolean) => void
  
  // Settings toggles
  toggleSound: () => void
  toggleHaptics: () => void
  toggleReducedMotion: () => void
  
  // FX helpers
  addFloatingText: (text: string, type: 'damage' | 'heal' | 'gold', x?: number, y?: number) => void
  removeFloatingText: (id: string) => void
}

const STORAGE_KEY_SCORE = 'scoundrel_high_score_v1'
const STORAGE_KEY_RUNS = 'scoundrel_runs_v1'
const STORAGE_KEY_SETTINGS = 'scoundrel_settings_v1'

export const useGameStore = create<GameStore>((set, get) => ({
  game: createInitialState(),
  highScore: null,
  runs: [],

  screenShake: false,
  damageFlash: false,
  healFlash: false,
  hitStop: false,
  floatingTexts: [],

  showHowToPlay: false,
  combatChoiceCard: null,
  previewCard: null,

  soundEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,

  boot: () => {
    let savedScore: number | null = null
    let savedRuns: RunHistoryItem[] = []
    let soundSetting = true
    let hapticSetting = true
    let motionSetting = false

    if (typeof window !== 'undefined') {
      try {
        const rawScore = localStorage.getItem(STORAGE_KEY_SCORE)
        if (rawScore) savedScore = parseInt(rawScore, 10)

        const rawRuns = localStorage.getItem(STORAGE_KEY_RUNS)
        if (rawRuns) savedRuns = JSON.parse(rawRuns)

        const rawSettings = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (rawSettings) {
          const parsed = JSON.parse(rawSettings)
          soundSetting = parsed.sound ?? true
          hapticSetting = parsed.haptics ?? true
          motionSetting = parsed.reducedMotion ?? false
        }
      } catch {}
    }

    sound.setEnabled(soundSetting)

    set((state) => ({
      highScore: savedScore,
      runs: savedRuns,
      soundEnabled: soundSetting,
      hapticsEnabled: hapticSetting,
      reducedMotion: motionSetting,
      game: {
        ...state.game,
        phase: 'MENU'
      }
    }))
  },

  startNewGame: () => {
    sound.startAmbient()
    sound.playDeal()
    triggerHaptic('medium')

    const initial = createInitialState()
    const dealt = rulesDealRoom({
      ...initial,
      phase: 'AWAITING_ACTION'
    })

    set({
      game: dealt,
      combatChoiceCard: null,
      previewCard: null,
      floatingTexts: []
    })
  },

  returnToMenu: () => {
    set((state) => ({
      game: {
        ...state.game,
        phase: 'MENU'
      }
    }))
  },

  faceCard: (cardId: string, mode?: 'weapon' | 'barehanded', coords?: { x: number, y: number }) => {
    const { game, reducedMotion, hapticsEnabled } = get()
    if (game.phase !== 'AWAITING_ACTION') return

    const card = game.room.find((c) => c.id === cardId)
    if (!card) return

    // If card is a monster and player has a usable weapon, but didn't pass mode, prompt choice
    if (card.kind === 'monster' && !mode) {
      if (canUseWeapon(card, game.equippedWeapon)) {
        set({ combatChoiceCard: card })
        return
      } else {
        mode = 'barehanded'
      }
    }

    // Clear modal
    set({ combatChoiceCard: null })

    const prevHealth = game.health
    const prevWeapon = game.equippedWeapon

    // Compute resolution using pure rules engine
    const nextGame = rulesResolveCard(game, cardId, mode)
    const healthDiff = nextGame.health - prevHealth

    const posX = coords?.x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200)
    const posY = coords?.y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 200)

    // Trigger visual and audio effects
    if (card.kind === 'weapon') {
      sound.playEquip()
      if (hapticsEnabled) triggerHaptic('light')
    } else if (card.kind === 'potion') {
      if (healthDiff > 0) {
        sound.playHeal()
        if (hapticsEnabled) triggerHaptic('medium')
        get().addFloatingText(`+${healthDiff} HP`, 'heal', posX, posY)
        if (!reducedMotion) {
          set({ healFlash: true })
          setTimeout(() => set({ healFlash: false }), 450)
        }
      } else {
        sound.playHover()
      }
    } else if (card.kind === 'monster') {
      if (mode === 'weapon' && prevWeapon) {
        sound.playSlayWeapon()
      } else {
        sound.playBarehandedHit()
      }

      if (healthDiff < 0) {
        sound.playDamage()
        const damage = Math.abs(healthDiff)
        if (hapticsEnabled) triggerHaptic('heavy')
        get().addFloatingText(`-${damage}`, 'damage', posX, posY)

        if (!reducedMotion) {
          set({ screenShake: true, damageFlash: true, hitStop: true })
          setTimeout(() => set({ hitStop: false }), 60)
          setTimeout(() => set({ screenShake: false }), 240)
          setTimeout(() => set({ damageFlash: false }), 400)
        }
      }
    }

    // Persist scores on Game Over
    if (nextGame.phase === 'GAME_OVER') {
      if (nextGame.outcome === 'victory') {
        sound.playVictory()
      } else {
        sound.playDeath()
      }

      const score = nextGame.score ?? 0
      const currentHigh = get().highScore
      const newHigh = currentHigh === null ? score : Math.max(currentHigh, score)

      const newRun: RunHistoryItem = {
        id: `run-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        outcome: nextGame.outcome ?? 'death',
        score,
        roomsCleared: nextGame.roomsCleared,
        finalHealth: nextGame.health
      }

      const updatedRuns = [newRun, ...get().runs].slice(0, 20)

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(STORAGE_KEY_SCORE, newHigh.toString())
          localStorage.setItem(STORAGE_KEY_RUNS, JSON.stringify(updatedRuns))
        } catch {}
      }

      set({
        game: nextGame,
        highScore: newHigh,
        runs: updatedRuns
      })
      return
    }

    set({ game: nextGame })
  },

  avoidCurrentRoom: () => {
    const { game, hapticsEnabled } = get()
    if (!canAvoid(game)) return

    sound.playAvoid()
    if (hapticsEnabled) triggerHaptic('medium')

    const nextGame = rulesAvoidRoom(game)
    set({
      game: nextGame,
      combatChoiceCard: null,
      previewCard: null
    })
  },

  advanceToNextRoom: () => {
    const { game } = get()
    sound.playDeal()
    const nextGame = advanceRoomClear(game)
    set({
      game: nextGame,
      combatChoiceCard: null,
      previewCard: null
    })
  },

  setCombatChoiceCard: (card: Card | null) => set({ combatChoiceCard: card }),
  setPreviewCard: (card: Card | null) => set({ previewCard: card }),
  setShowHowToPlay: (open: boolean) => set({ showHowToPlay: open }),

  toggleSound: () => {
    const newVal = !get().soundEnabled
    sound.setEnabled(newVal)
    set({ soundEnabled: newVal })
    if (typeof window !== 'undefined') {
      try {
        const settings = {
          sound: newVal,
          haptics: get().hapticsEnabled,
          reducedMotion: get().reducedMotion
        }
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
      } catch {}
    }
  },

  toggleHaptics: () => {
    const newVal = !get().hapticsEnabled
    set({ hapticsEnabled: newVal })
    if (typeof window !== 'undefined') {
      try {
        const settings = {
          sound: get().soundEnabled,
          haptics: newVal,
          reducedMotion: get().reducedMotion
        }
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
      } catch {}
    }
  },

  toggleReducedMotion: () => {
    const newVal = !get().reducedMotion
    set({ reducedMotion: newVal })
    if (typeof window !== 'undefined') {
      try {
        const settings = {
          sound: get().soundEnabled,
          haptics: get().hapticsEnabled,
          reducedMotion: newVal
        }
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
      } catch {}
    }
  },

  addFloatingText: (text: string, type: 'damage' | 'heal' | 'gold', x = 0, y = 0) => {
    const id = `float-${Date.now()}-${Math.random()}`
    const item: FloatingText = { id, text, type, x, y }
    set((state) => ({ floatingTexts: [...state.floatingTexts, item] }))
    setTimeout(() => {
      get().removeFloatingText(id)
    }, 1100)
  },

  removeFloatingText: (id: string) => {
    set((state) => ({ floatingTexts: state.floatingTexts.filter((t) => t.id !== id) }))
  }
}))
