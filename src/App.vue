<template>
  <div id="app">
    <!-- Setup Phase -->
    <PlayerSetup v-if="gamePhase === 'setup'" @start-game="onGameStart" />

    <!-- Playing Phase -->
    <div v-else class="game-layout">
      <!-- Left Panel -->
      <aside class="left-panel">
        <BossPanel />
        <PlayerPanel />
      </aside>

      <!-- Center Area -->
      <main class="center-area">
        <SharedPlayArea />
      </main>

      <!-- Bottom Area: Active Player -->
      <footer class="bottom-area">
        <ActivePlayerArea />
      </footer>

      <!-- Game Log -->
      <GameLog />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import PlayerSetup from './components/PlayerSetup.vue'
import BossPanel from './components/BossPanel.vue'
import PlayerPanel from './components/PlayerPanel.vue'
import SharedPlayArea from './components/SharedPlayArea.vue'
import ActivePlayerArea from './components/ActivePlayerArea.vue'
import GameLog from './components/GameLog.vue'

const gameStore = useGameStore()

const gamePhase = computed(() => gameStore.gamePhase)

function onGameStart() {
  // Game has started via store action
}
</script>

<style>
#app {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.game-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
  background: #bdc3c7;
}

.left-panel {
  grid-column: 1;
  grid-row: 1 / 3;
  background: #2c3e50;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;
}

.center-area {
  grid-column: 2;
  grid-row: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  padding-bottom: 0;
}

.bottom-area {
  grid-column: 2;
  grid-row: 2;
}
</style>
