<template>
  <div class="game-log" :class="{ collapsed: !showLog }">
    <div class="log-header" @click="toggleLog">
      <span class="log-title">Game Log</span>
      <span class="toggle-icon">{{ showLog ? '▼' : '▲' }}</span>
    </div>
    <div class="log-content" v-show="showLog">
      <div
        v-for="(entry, index) in gameLog"
        :key="index"
        class="log-entry"
      >
        <span class="log-time">{{ entry.timestamp }}</span>
        <span class="log-message">{{ entry.message }}</span>
      </div>
      <div v-if="gameLog.length === 0" class="log-empty">
        No events yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const gameLog = computed(() => gameStore.gameLog)
const showLog = computed(() => gameStore.showLog)

function toggleLog() {
  gameStore.toggleLog()
}
</script>

<style scoped>
.game-log {
  position: fixed;
  bottom: 0;
  right: 16px;
  width: 300px;
  background: #2c3e50;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background: #34495e;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  user-select: none;
}

.log-header:hover {
  background: #3d566e;
}

.log-title {
  font-size: 13px;
  font-weight: bold;
  color: white;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.toggle-icon {
  color: #bdc3c7;
  font-size: 10px;
}

.log-content {
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
}

.log-entry {
  padding: 6px 8px;
  border-bottom: 1px solid #34495e;
}

.log-entry:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 10px;
  color: #7f8c8d;
  margin-right: 8px;
}

.log-message {
  font-size: 12px;
  color: #ecf0f1;
}

.log-empty {
  padding: 16px;
  text-align: center;
  color: #7f8c8d;
  font-size: 12px;
  font-style: italic;
}

.collapsed .log-content {
  display: none;
}
</style>
