# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Card game prototype web application for manual game testing. Pass-and-play style (1-4 players share one screen). Most game logic is manual - minimal automation.

## Tech Stack

- Vue 3 + Vite
- State management: Pinia
- Animation: GSAP
- Drag & Drop: Vue Draggable
- Custom tooltip for card details

## Build Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server
npm run build      # Production build
npm run preview    # Preview production build
```

## Architecture

### Game Areas
- **Left panel**: Boss info (top) + Player list with HP/VP trackers
- **Center**: Shared play area with configurable grid (default 1x9)
- **Bottom**: Active player area (hand, unplaced tokens, end turn button)
- Each player has: hand, token area, play area

### Config Files (JSONC)
- `game.jsonc` - Grid size settings
- `weapons.jsonc` - Weapon definitions (attack power, range, abilities)
- `cores.jsonc` - Core definitions (HP, special moves/abilities)
- `cards-ac.jsonc` - AC cards (front: 2 weapons, back: 1 core)
- `cards-boss.jsonc` - Boss cards (blank back)
- `cards-action.jsonc` - Action cards (blank back)

### Key Mechanics
- Cards have front/back sides, toggled by double-click
- Tokens on grid are exclusive - dragging to occupied cell swaps positions
- Hand cards reorderable via drag & drop
- Player pawns placed on shared grid
- Game log with toggle visibility

### Setup Flow
1. Select player count (1-4)
2. Shuffle AC deck, deal 3 cards each
3. Shuffle boss deck, place one face-up in shared area
4. Each player receives one of each action card
5. Each player receives colored tokens
