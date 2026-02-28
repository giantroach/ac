<template>
  <div class="player-setup">
    <div class="setup-container">
      <h1 class="title">Card Game Prototype</h1>
      <h2 class="subtitle">Select Number of Players</h2>

      <div class="player-options">
        <button
          v-for="count in playerOptions"
          :key="count"
          class="player-btn"
          :style="{ '--btn-color': playerColors[count - 1] }"
          @click="selectPlayers(count)"
        >
          <span class="count">{{ count }}</span>
          <span class="label">{{ count === 1 ? 'Player' : 'Players' }}</span>
        </button>
      </div>

      <p class="hint">Pass-and-play style game</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const emit = defineEmits(['start-game'])

const gameStore = useGameStore()

const playerOptions = computed(() => {
  const options = []
  for (let i = gameStore.config.minPlayers; i <= gameStore.config.maxPlayers; i++) {
    options.push(i)
  }
  return options
})

const playerColors = computed(() => gameStore.config.playerColors)

function selectPlayers(count) {
  gameStore.initGame(count)
  emit('start-game')
}
</script>

<style scoped>
.player-setup {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
}

.setup-container {
  text-align: center;
  padding: 40px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 36px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  margin: 0 0 40px 0;
  font-size: 18px;
  color: #bdc3c7;
  font-weight: normal;
}

.player-options {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.player-btn {
  width: 100px;
  height: 100px;
  border: none;
  border-radius: 12px;
  background: var(--btn-color);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.player-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.player-btn:active {
  transform: translateY(0);
}

.count {
  font-size: 36px;
  font-weight: bold;
  color: white;
  line-height: 1;
}

.label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.hint {
  margin: 0;
  font-size: 14px;
  color: #7f8c8d;
}
</style>
