<template>
  <div class="game-grid">
    <div
      v-for="(row, rowIdx) in grid"
      :key="rowIdx"
      class="grid-row"
    >
      <div
        v-for="(cell, colIdx) in row"
        :key="colIdx"
        class="grid-cell"
        :class="{ 'has-token': cell.token, 'drag-over': isDragOver(rowIdx, colIdx) }"
        @dragover.prevent="onDragOver($event, rowIdx, colIdx)"
        @dragleave="onDragLeave"
        @drop="onDrop($event, rowIdx, colIdx)"
      >
        <span class="cell-coords">{{ rowIdx }},{{ colIdx }}</span>
        <Token
          v-if="cell.token"
          :token="cell.token"
          :player-id="getTokenPlayerId(cell.token)"
          @drag-start="onTokenDragStart"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import Token from './Token.vue'

const props = defineProps({
  grid: {
    type: Array,
    required: true
  }
})

const gameStore = useGameStore()
const dragOverCell = ref(null)

function isDragOver(row, col) {
  return dragOverCell.value?.row === row && dragOverCell.value?.col === col
}

function onDragOver(event, row, col) {
  event.dataTransfer.dropEffect = 'move'
  dragOverCell.value = { row, col }
}

function onDragLeave() {
  dragOverCell.value = null
}

function onDrop(event, row, col) {
  dragOverCell.value = null
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.type === 'token') {
      gameStore.placeToken(data.playerId, data.tokenId, row, col)
    }
  } catch (e) {
    console.error('Drop error:', e)
  }
}

function getTokenPlayerId(token) {
  if (gameStore.boss.tokens?.some(t => t.id === token.id)) return -1
  for (const player of gameStore.players) {
    if (player.tokens.some(t => t.id === token.id)) {
      return player.id
    }
  }
  return 0
}

function onTokenDragStart(token) {
  // Could add visual feedback here
}
</script>

<style scoped>
.game-grid {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 16px;
  background: #34495e;
  border-radius: 8px;
}

.grid-row {
  display: flex;
  gap: 4px;
}

.grid-cell {
  width: 60px;
  height: 60px;
  background: #ecf0f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.2s;
}

.grid-cell:hover {
  background: #bdc3c7;
}

.grid-cell.drag-over {
  background: #3498db;
  box-shadow: inset 0 0 0 3px #2980b9;
}

.grid-cell.has-token {
  background: #95a5a6;
}

.cell-coords {
  position: absolute;
  bottom: 2px;
  right: 4px;
  font-size: 8px;
  color: #7f8c8d;
}
</style>
