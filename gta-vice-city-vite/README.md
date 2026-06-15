# 🌴 GTA Vice City — Browser Game (React)

A top-down GTA Vice City–inspired browser game built entirely with React and HTML5 Canvas.

## 🎮 Features

- **Open World** — Explore a neon-lit Vice City map with buildings, roads, beach, and water
- **Combat System** — Shoot enemies with 5 weapons: Fist, Pistol, Shotgun, AK-47, RPG
- **Enemy AI** — Gang members and police with patrol/chase states
- **Vehicle System** — Enter and drive cars around the city (press F)
- **Mission System** — 3 story missions with objectives and rewards
- **Pickups** — Health packs, armor, money bags, and weapons scattered around the map
- **Wanted System** — Up to 5 stars wanted level
- **Minimap** — Real-time radar showing enemies, pickups, and mission targets
- **HUD** — Health/armor bars, weapon slots, money counter, score, kill count
- **Pause Menu** — Stats and mission overview
- **Wasted Screen** — Shows final stats on death

## 🕹️ Controls

| Key | Action |
|-----|--------|
| `WASD` / `Arrow Keys` | Move |
| `Mouse` | Aim |
| `Left Click` | Shoot |
| `Shift` | Sprint |
| `F` | Enter / Exit Vehicle |
| `1` | Fist |
| `2` | Pistol |
| `3` | Shotgun |
| `4` | AK-47 |
| `5` | RPG |
| `M` | Mission Panel |
| `Esc` | Pause |

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
npm install
npm start
```

The game will open automatically at `http://localhost:3000`

> **Note:** This project uses **Vite** (not Create React App).  
> `npm install` will download `vite` and `@vitejs/plugin-react` — no issues on Windows.

### Build for Production

```bash
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── GameCanvas.jsx     # Main canvas renderer
│   ├── HUD.jsx            # Heads-up display
│   ├── MainMenu.jsx       # Animated main menu
│   ├── PauseMenu.jsx      # Pause overlay
│   ├── DeadScreen.jsx     # Wasted screen
│   ├── MissionPanel.jsx   # Mission selection
│   └── Minimap.jsx        # Radar minimap
├── hooks/
│   └── useGameEngine.js   # Core game loop & state
├── utils/
│   └── gameConfig.js      # Constants, weapons, map data
├── App.jsx
└── index.js
```

## 🎨 Tech Stack

- **React 18** — UI and game state
- **HTML5 Canvas** — Game world rendering
- **requestAnimationFrame** — 60fps game loop
- **CSS** — Neon Vice City UI aesthetic

## 🌟 Tips

- Collect yellow pickups for money and score bonuses
- Green pickups restore health, blue restores armor
- Enter cars with `F` for faster movement
- Start missions from the Mission Panel (M key)
- Wanted level decays over time if you avoid combat
- Higher wanted = more police spawns

---

*Built with ❤️ and neon lights — Welcome to Vice City!*
