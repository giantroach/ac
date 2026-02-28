import { defineStore } from 'pinia'
import gameConfig from '@/config/game.jsonc'
import weaponsData from '@/config/weapons.jsonc'
import coresData from '@/config/cores.jsonc'
import acCardsData from '@/config/cards-ac.jsonc'
import bossCardsData from '@/config/cards-boss.jsonc'
import actionCardsData from '@/config/cards-action.jsonc'

export const useGameStore = defineStore('game', {
  state: () => ({
    // Game phase: 'setup' | 'playing'
    gamePhase: 'setup',

    // Players array
    players: [],

    // Active player index
    activePlayerIndex: 0,

    // Boss information
    boss: {
      card: null,
      hp: 0,
      pawn: null
    },

    // Shared grid (2D array)
    sharedGrid: [],

    // Game log
    gameLog: [],
    showLog: false,

    // Decks
    decks: {
      ac: [],
      boss: [],
      action: []
    },

    // Config references
    config: gameConfig,
    weapons: weaponsData.weapons,
    cores: coresData.cores
  }),

  getters: {
    activePlayer: (state) => state.players[state.activePlayerIndex],
    playerCount: (state) => state.players.length,
    gridRows: (state) => state.config.grid.rows,
    gridCols: (state) => state.config.grid.cols
  },

  actions: {
    // Initialize game with player count
    initGame(playerCount) {
      this.resetGame()

      // Initialize grid
      this.initGrid()

      // Initialize decks
      this.initDecks()

      // Create players
      for (let i = 0; i < playerCount; i++) {
        this.players.push({
          id: i,
          name: `Player ${i + 1}`,
          color: this.config.playerColors[i],
          hand: [],
          tokens: this.createPlayerTokens(i),
          playArea: [],
          hp: 10,
          vp: 0,
          pawnPosition: null
        })
      }

      // Deal starting cards
      this.dealStartingCards()

      // Set up boss
      this.setupBoss()

      // Give action cards to each player
      this.dealActionCards()

      // Start game
      this.gamePhase = 'playing'
      this.addLog('Game started!')
    },

    resetGame() {
      this.players = []
      this.activePlayerIndex = 0
      this.boss = { card: null, hp: 0, pawn: null }
      this.sharedGrid = []
      this.gameLog = []
      this.decks = { ac: [], boss: [], action: [] }
    },

    initGrid() {
      const { rows, cols } = this.config.grid
      this.sharedGrid = []
      for (let r = 0; r < rows; r++) {
        const row = []
        for (let c = 0; c < cols; c++) {
          row.push({ token: null, card: null })
        }
        this.sharedGrid.push(row)
      }
    },

    initDecks() {
      // Shuffle AC deck
      this.decks.ac = this.shuffle([...acCardsData.cards])
      // Shuffle boss deck
      this.decks.boss = this.shuffle([...bossCardsData.cards])
      // Action cards (not shuffled, each player gets one of each)
      this.decks.action = [...actionCardsData.cards]
    },

    createPlayerTokens(playerIndex) {
      const color = this.config.playerColors[playerIndex]
      return [
        { id: `pawn_${playerIndex}`, type: 'pawn', color, placed: false, position: null },
        { id: `marker1_${playerIndex}`, type: 'marker', color, placed: false, position: null },
        { id: `marker2_${playerIndex}`, type: 'marker', color, placed: false, position: null }
      ]
    },

    dealStartingCards() {
      const cardsPerPlayer = this.config.startingCards
      for (const player of this.players) {
        for (let i = 0; i < cardsPerPlayer; i++) {
          if (this.decks.ac.length > 0) {
            const card = this.decks.ac.pop()
            card.faceUp = true
            player.hand.push(card)
          }
        }
      }
      this.addLog(`Dealt ${cardsPerPlayer} cards to each player`)
    },

    setupBoss() {
      if (this.decks.boss.length > 0) {
        const bossCard = this.decks.boss.pop()
        this.boss = {
          card: bossCard,
          hp: bossCard.hp,
          pawn: { id: 'pawn_boss', type: 'pawn', color: '#1a1a1a', placed: false, position: null }
        }
        this.addLog(`Boss appeared: ${bossCard.name}`)
      }
    },

    dealActionCards() {
      for (const player of this.players) {
        // Give each player one of each action card
        for (const actionCard of this.decks.action) {
          player.hand.push({
            ...actionCard,
            faceUp: true,
            isAction: true
          })
        }
      }
    },

    // Shuffle array
    shuffle(array) {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    },

    // End turn
    endTurn() {
      const currentPlayer = this.players[this.activePlayerIndex]
      this.addLog(`${currentPlayer.name} ended their turn`)

      this.activePlayerIndex = (this.activePlayerIndex + 1) % this.players.length

      const nextPlayer = this.players[this.activePlayerIndex]
      this.addLog(`${nextPlayer.name}'s turn`)
    },

    // Flip card
    flipCard(playerId, cardIndex) {
      const player = this.players.find(p => p.id === playerId)
      if (player && player.hand[cardIndex]) {
        player.hand[cardIndex].faceUp = !player.hand[cardIndex].faceUp
        this.addLog(`${player.name} flipped a card`)
      }
    },

    // Update HP
    updateHP(playerId, delta) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.hp = Math.max(0, player.hp + delta)
        this.addLog(`${player.name}'s HP: ${player.hp}`)
      }
    },

    // Update VP
    updateVP(playerId, delta) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.vp = Math.max(0, player.vp + delta)
        this.addLog(`${player.name}'s VP: ${player.vp}`)
      }
    },

    // Update Boss HP
    updateBossHP(delta) {
      this.boss.hp = Math.max(0, this.boss.hp + delta)
      this.addLog(`Boss HP: ${this.boss.hp}`)
    },

    // Reorder hand
    reorderHand(playerId, newOrder) {
      const player = this.players.find(p => p.id === playerId)
      if (player) {
        player.hand = newOrder
      }
    },

    // Place token on grid
    placeToken(playerId, tokenId, row, col) {
      // Resolve token (boss or player)
      let token
      if (playerId === -1) {
        token = this.boss.pawn
      } else {
        const player = this.players.find(p => p.id === playerId)
        if (!player) return
        token = player.tokens.find(t => t.id === tokenId)
      }
      if (!token) return

      // Check if cell is occupied
      const cell = this.sharedGrid[row][col]
      if (cell.token) {
        // Swap tokens
        const existingToken = cell.token
        const existingTokenRef = existingToken.id === 'pawn_boss'
          ? this.boss.pawn
          : (() => {
              const ep = this.players.find(p => p.tokens.some(t => t.id === existingToken.id))
              return ep?.tokens.find(t => t.id === existingToken.id)
            })()
        if (existingTokenRef) {
          if (token.position) {
            this.sharedGrid[token.position.row][token.position.col].token = existingToken
            existingTokenRef.position = { row: token.position.row, col: token.position.col }
          } else {
            existingTokenRef.placed = false
            existingTokenRef.position = null
          }
        }
      }

      // Clear old position
      if (token.position) {
        this.sharedGrid[token.position.row][token.position.col].token = null
      }

      // Place token
      this.sharedGrid[row][col].token = token
      token.placed = true
      token.position = { row, col }

      const ownerName = playerId === -1 ? 'Boss' : this.players.find(p => p.id === playerId)?.name
      this.addLog(`${ownerName} placed ${token.type} at (${row}, ${col})`)
    },

    // Add log entry
    addLog(message) {
      const timestamp = new Date().toLocaleTimeString()
      this.gameLog.unshift({ timestamp, message })
    },

    // Toggle log visibility
    toggleLog() {
      this.showLog = !this.showLog
    },

    // Get weapon by ID
    getWeapon(weaponId) {
      return this.weapons.find(w => w.id === weaponId)
    },

    // Get core by ID
    getCore(coreId) {
      return this.cores.find(c => c.id === coreId)
    }
  }
})
