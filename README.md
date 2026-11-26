# SCOUNDREL — Roguelike Card Game

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ricomiller23/scoundrel-card-game)

An atmospheric, handcrafted web implementation of **Scoundrel**, the single-player roguelike dungeon crawler card game designed by **Zach Gage & Kurt Bieg** (Scoundrel v1.0, 15 August 2011).

Built for Google Antigravity with exceptional visual polish, procedural Web Audio synthesis, and 100% rules fidelity.

---

## The Gilded Dungeon Experience

- **"The Gilded Dungeon" Aesthetic:** Candle-lit gold-on-black copperplate etching, 19th-century playing-card lithography, 3D card tilt with dynamic specular sheen.
- **Handcrafted Card Art:** All 44 card faces individually authored with SVG engravings:
  - **Monsters (♣ & ♠):** Scale from Sewer Rat (2), Dire Wolf (5), Troll (10), Knight (J), Sorceress (Q), Tyrant King (K), to the apex terror Ancient Dragon (A=14).
  - **Weapons (♦):** Tier from Iron Dagger (2) up to Legendary Runed Sun Blade (10).
  - **Potions (♥):** Volume and luminescence grow from tiny apothecary vial (2) to ornate overflowing royal carafe (10).
- **Tactile Combat Feedback:** Screen shake, red vignette pulse, floating damage/heal numbers, and hit-stop impact timing.
- **Zero Sound Files:** 100% procedurally synthesized audio via the Web Audio API — metallic weapon clangs, barehanded impacts, damage dyads, healing arpeggios, card whooshes, and an ambient dungeon drone.
- **Accessibility & Responsive:** Fully playable via mouse, touch (with long-press previews and haptic vibration), and keyboard hotkeys (`A` to avoid, `1`-`4` to face cards, `Enter`/`Space`).

---

## Canonical Rules (Scoundrel v1.0)

1. **Deck (44 Cards):**
   - Standard 52-card deck with Jokers, red face cards (J, Q, K), and red Aces removed permanently.
   - 26 Monsters (♣ Clubs & ♠ Spades, values 2–14, Ace high).
   - 9 Weapons (♦ Diamonds, values 2–10 only).
   - 9 Health Potions (♥ Hearts, values 2–10 only).
2. **Health:** Starts at 20, capped at 20. Reaching 0 or below is death.
3. **Rooms:** Deal 4 cards. Face 3 in any order you choose. The 4th card carries over into the next room.
4. **Avoid Room:** Sweep all 4 cards to the bottom of the dungeon. Banned back-to-back (cannot avoid two rooms in a row), and requires ≥ 4 cards remaining in the dungeon.
5. **Weapons:** Binding when picked up. Deals damage equal to its value (`damage = max(0, monster - weapon)`).
6. **The Degradation Rule:** A weapon that has slain a monster can thereafter only attack monsters with a value **strictly lower** than the last monster it slew. Blocked weapons are *never discarded* and remain usable against weaker foes.
7. **Potions:** Only 1 potion heals per room. Any subsequent potions chosen in the same room are discarded with 0 healing.
8. **Scoring:**
   - **Death:** `Health - Sum(all remaining monsters in Dungeon + unfaced in Room)` (negative score).
   - **Victory:** Positive health remaining (+ potion value if health was 20 and final card was a potion).

---

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (`strict: true`)
- **Styling:** Tailwind CSS + CSS Design Tokens
- **Motion:** `motion/react` (Framer Motion v11+)
- **State Management:** Zustand + LocalStorage Persistence
- **Audio:** Web Audio API (procedural synthesis)
- **Atmosphere:** Canvas 2D Particle Motes
- **Testing:** Vitest (unit tests & 1,000 game Monte Carlo property tests)

---

## Local Development & Testing

```bash
# Install dependencies
npm install

# Run unit tests & rules verification (37 unit tests + 1,000 game simulation)
npm test

# Run local development server
npm run dev

# Build production bundle
npm run build
```

---

## Production Deployment

One-click deployment via Vercel CLI:

```bash
npx vercel --prod
```

---

## Credits & License

- **Original Game Design:** Zach Gage & Kurt Bieg (2011). [Original Rules PDF](http://stfj.net/art/2011/Scoundrel.pdf).
- This project is a non-commercial digital homage.
