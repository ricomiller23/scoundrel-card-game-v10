// Procedural Web Audio API Synthesizer for Scoundrel
// Zero sound files, zero dependencies, instant load.

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true
  private ambientGain: GainNode | null = null
  private ambientOsc1: OscillatorNode | null = null
  private ambientOsc2: OscillatorNode | null = null
  private ambientDripTimer: any = null

  constructor() {
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          if (this.ctx && this.ctx.state === "running") {
            this.ctx.suspend()
          }
        } else {
          if (this.ctx && this.ctx.state === "suspended" && this.enabled) {
            this.ctx.resume()
          }
        }
      })
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val
    if (!val) {
      this.stopAmbient()
    } else {
      this.startAmbient()
    }
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  // --- Sound Effects ---

  // Card Deal: short filtered noise burst + soft click
  public playDeal() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.05
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(1400, now)
    filter.Q.setValueAtTime(3, now)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.08, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)

    noise.start(now)
  }

  // Card Hover: extremely quiet high sine tick
  public playHover() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(1800, now)
    gain.gain.setValueAtTime(0.015, now)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.02)
  }

  // Slay with Weapon: Metallic FM Clang (two detuned oscillators, fast decay)
  public playSlayWeapon() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Carrier
    const carrier = this.ctx.createOscillator()
    carrier.type = 'triangle'
    carrier.frequency.setValueAtTime(320, now)

    // Modulator
    const mod = this.ctx.createOscillator()
    mod.type = 'sine'
    mod.frequency.setValueAtTime(840, now)

    const modGain = this.ctx.createGain()
    modGain.gain.setValueAtTime(450, now)
    modGain.gain.exponentialRampToValueAtTime(1, now + 0.25)

    mod.connect(modGain)
    modGain.connect(carrier.frequency)

    const masterGain = this.ctx.createGain()
    masterGain.gain.setValueAtTime(0.2, now)
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    carrier.connect(masterGain)
    masterGain.connect(this.ctx.destination)

    carrier.start(now)
    mod.start(now)
    carrier.stop(now + 0.35)
    mod.stop(now + 0.35)
  }

  // Barehanded Hit: Low thud (filtered noise + 60Hz sine thump)
  public playBarehandedHit() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // 60Hz thump
    const osc = this.ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(90, now)
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.18)

    const oscGain = this.ctx.createGain()
    oscGain.gain.setValueAtTime(0.25, now)
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18)

    osc.connect(oscGain)
    oscGain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.18)

    // Impact noise
    const bufferSize = this.ctx.sampleRate * 0.08
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer
    const filter = this.ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(300, now)

    const noiseGain = this.ctx.createGain()
    noiseGain.gain.setValueAtTime(0.18, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)

    noise.connect(filter)
    filter.connect(noiseGain)
    noiseGain.connect(this.ctx.destination)
    noise.start(now)
  }

  // Take Damage: Descending minor-third dyad (Eb down to C)
  public playDamage() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const freqs = [311.13, 261.63] // Eb4, C4

    freqs.forEach((f, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(f, now + idx * 0.07)

      gain.gain.setValueAtTime(0.12, now + idx * 0.07)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.22)

      const filter = this.ctx!.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(800, now)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.07)
      osc.stop(now + idx * 0.07 + 0.22)
    })
  }

  // Heal: Rising major arpeggio, sine with soft decay
  public playHeal() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [329.63, 415.30, 493.88, 659.25] // E4, G#4, B4, E5

    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + i * 0.06)

      gain.gain.setValueAtTime(0.12, now + i * 0.06)
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + i * 0.06)
      osc.stop(now + i * 0.06 + 0.3)
    })
  }

  // Equip Weapon: Sword-draw metallic swish
  public playEquip() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(500, now)
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.15)
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.25)

    gain.gain.setValueAtTime(0.1, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)
    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Avoid Room: Whoosh bandpass-swept noise
  public playAvoid() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const bufferSize = this.ctx.sampleRate * 0.35
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1

    const noise = this.ctx.createBufferSource()
    noise.buffer = buffer

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(250, now)
    filter.frequency.exponentialRampToValueAtTime(1600, now + 0.18)
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.35)

    const gain = this.ctx.createGain()
    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.ctx.destination)
    noise.start(now)
  }

  // Death: Low minor drone, slow dark decay
  public playDeath() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [110, 130.81, 164.81] // A2, C3, E3 minor triad

    notes.forEach((freq) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(freq, now)

      const filter = this.ctx!.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(400, now)
      filter.frequency.exponentialRampToValueAtTime(100, now + 1.8)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0)

      osc.connect(filter)
      filter.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now)
      osc.stop(now + 2.0)
    })
  }

  // Victory: Ascending major triad with sparkling bell
  public playVictory() {
    if (!this.enabled) return
    this.initCtx()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const triad = [261.63, 329.63, 392.00, 523.25] // C4, E4, G4, C5

    triad.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator()
      const gain = this.ctx!.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now + idx * 0.12)

      gain.gain.setValueAtTime(0.18, now + idx * 0.12)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 1.2)

      osc.connect(gain)
      gain.connect(this.ctx!.destination)

      osc.start(now + idx * 0.12)
      osc.stop(now + idx * 0.12 + 1.2)
    })
  }

  // Ambient Drone & Distant Dungeon Drip
  public startAmbient() {
    if (!this.enabled || this.ambientOsc1) return
    this.initCtx()
    if (!this.ctx) return

    try {
      const now = this.ctx.currentTime

      this.ambientGain = this.ctx.createGain()
      this.ambientGain.gain.setValueAtTime(0.025, now)

      this.ambientOsc1 = this.ctx.createOscillator()
      this.ambientOsc1.type = 'sine'
      this.ambientOsc1.frequency.setValueAtTime(55, now) // A1 drone

      this.ambientOsc2 = this.ctx.createOscillator()
      this.ambientOsc2.type = 'sine'
      this.ambientOsc2.frequency.setValueAtTime(82.4, now) // E2 subtle fifth

      this.ambientOsc1.connect(this.ambientGain)
      this.ambientOsc2.connect(this.ambientGain)
      this.ambientGain.connect(this.ctx.destination)

      this.ambientOsc1.start(now)
      this.ambientOsc2.start(now)

      // Random dungeon water drops
      this.scheduleDrip()
    } catch {
      // Audio autoplay policy
    }
  }

  private scheduleDrip() {
    if (!this.enabled) return
    const delay = 4000 + Math.random() * 8000
    this.ambientDripTimer = setTimeout(() => {
      this.playWaterDrip()
      this.scheduleDrip()
    }, delay)
  }

  private playWaterDrip() {
    if (!this.enabled || !this.ctx) return
    try {
      const now = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      const freq = 1200 + Math.random() * 600
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08)

      gain.gain.setValueAtTime(0.015, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now)
      osc.stop(now + 0.12)
    } catch {}
  }

  public stopAmbient() {
    if (this.ambientOsc1) {
      try {
        this.ambientOsc1.stop()
        this.ambientOsc1.disconnect()
        this.ambientOsc2?.stop()
        this.ambientOsc2?.disconnect()
      } catch {}
      this.ambientOsc1 = null
      this.ambientOsc2 = null
      this.ambientGain = null
    }
    if (this.ambientDripTimer) {
      clearTimeout(this.ambientDripTimer)
      this.ambientDripTimer = null
    }
  }
}

export const sound = new SoundEngine()
