<template>
  <div class="player-panel">
    <h3 class="panel-title">Players</h3>
    <div class="player-list">
      <div
        v-for="player in players"
        :key="player.id"
        class="player-item"
        :class="{ active: player.id === activePlayerId }"
        :style="{ '--player-color': player.color }"
      >
        <div class="player-header" @click="setActivePlayer(player.id)">
          <span class="player-indicator"></span>
          <span class="player-name">{{ player.name }}</span>
        </div>
        <div class="player-stats">
          <div class="stat hp">
            <span class="stat-label">HP</span>
            <div class="stat-controls">
              <button @click="updateHP(player.id, -1)" class="btn-minus">-</button>
              <span class="stat-value">{{ player.hp }}</span>
              <button @click="updateHP(player.id, 1)" class="btn-plus">+</button>
            </div>
          </div>
          <div class="stat vp">
            <span class="stat-label">VP</span>
            <div class="stat-controls">
              <button @click="updateVP(player.id, -1)" class="btn-minus">-</button>
              <span class="stat-value">{{ player.vp }}</span>
              <button @click="updateVP(player.id, 1)" class="btn-plus">+</button>
            </div>
          </div>
        </div>
        <div class="player-cards-count">
          <span>Hand: {{ player.hand.length }} cards</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const gameStore = useGameStore()

const players = computed(() => gameStore.players)
const activePlayerId = computed(() => gameStore.activePlayerIndex)

function updateHP(playerId, delta) {
  gameStore.updateHP(playerId, delta)
}

function updateVP(playerId, delta) {
  gameStore.updateVP(playerId, delta)
}

function setActivePlayer(playerId) {
  gameStore.setActivePlayer(playerId)
}
</script>

<style scoped>
.player-panel {
  background: #2c3e50;
  border-radius: 8px;
  padding: 12px;
  color: white;
}

.panel-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #3498db;
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.player-item {
  background: #34495e;
  border-radius: 6px;
  padding: 10px;
  border-left: 4px solid var(--player-color);
  transition: background 0.2s;
}

.player-item.active {
  background: #3d566e;
  box-shadow: 0 0 0 2px var(--player-color);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}

.player-header:hover .player-name {
  color: #ecf0f1;
}

.player-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--player-color);
}

.player-name {
  font-weight: bold;
  font-size: 13px;
}

.player-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-label {
  font-size: 10px;
  color: #bdc3c7;
  width: 20px;
}

.stat-controls {
  display: flex;
  align-items: center;
  gap: 2px;
}

.stat-value {
  min-width: 24px;
  text-align: center;
  font-size: 14px;
  font-weight: bold;
}

.hp .stat-value {
  color: #e74c3c;
}

.vp .stat-value {
  color: #f1c40f;
}

.btn-minus,
.btn-plus {
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  font-size: 12px;
}

.btn-minus {
  background: #7f8c8d;
  color: white;
}

.btn-plus {
  background: #7f8c8d;
  color: white;
}

.btn-minus:hover {
  background: #c0392b;
}

.btn-plus:hover {
  background: #27ae60;
}

.player-cards-count {
  font-size: 10px;
  color: #95a5a6;
}
</style>
