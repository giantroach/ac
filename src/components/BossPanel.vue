<template>
  <div class="boss-panel" v-if="boss.card">
    <h3 class="panel-title">Boss</h3>
    <div class="boss-info">
      <Card :card="boss.card" :face-up="true" />
      <div class="boss-stats">
        <div class="stat hp">
          <span class="stat-label">HP</span>
          <div class="stat-controls">
            <button @click="updateHP(-1)" class="btn-minus">-</button>
            <span class="stat-value">{{ boss.hp }}</span>
            <button @click="updateHP(1)" class="btn-plus">+</button>
          </div>
        </div>
        <div class="boss-tokens-section" v-if="boss.tokens && boss.tokens.length">
          <span class="stat-label">Tokens</span>
          <div
            class="boss-tokens-list"
            :class="{ 'drop-target': isTokenAreaDragOver }"
            @dragover.prevent="onTokenAreaDragOver"
            @dragleave="onTokenAreaDragLeave"
            @drop="onTokenAreaDrop"
          >
            <Token
              v-for="token in unplacedBossTokens"
              :key="token.id"
              :token="token"
              :player-id="-1"
            />
            <span v-if="unplacedBossTokens.length === 0" class="empty-message">All placed</span>
          </div>
        </div>
        <div class="boss-abilities" v-if="boss.card.abilities">
          <span class="ability" v-for="(ability, idx) in boss.card.abilities" :key="idx">
            {{ idx + 1 }}: {{ ability }}
          </span>
        </div>
        <button class="btn-reset-action" @click="resetBossActions">Reset Actions</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import Card from './Card.vue'
import Token from './Token.vue'

const gameStore = useGameStore()
const boss = computed(() => gameStore.boss)

const unplacedBossTokens = computed(() =>
  boss.value.tokens?.filter(t => !t.placed) || []
)

const isTokenAreaDragOver = ref(false)

function onTokenAreaDragOver() {
  isTokenAreaDragOver.value = true
}

function onTokenAreaDragLeave() {
  isTokenAreaDragOver.value = false
}

function onTokenAreaDrop(event) {
  isTokenAreaDragOver.value = false
  try {
    const data = JSON.parse(event.dataTransfer.getData('application/json'))
    if (data.type === 'token' && data.playerId === -1) {
      gameStore.unplaceToken(-1, data.tokenId)
    }
  } catch (e) {
    console.error('Drop error:', e)
  }
}

function updateHP(delta) {
  gameStore.updateBossHP(delta)
}

function resetBossActions() {
  gameStore.resetBossActionCards()
}
</script>

<style scoped>
.boss-panel {
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
  color: #e74c3c;
}

.boss-info {
  display: flex;
  gap: 12px;
}

.boss-stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stat-label {
  font-size: 12px;
  color: #bdc3c7;
  width: 30px;
}

.stat-controls {
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-value {
  min-width: 30px;
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.hp .stat-value {
  color: #e74c3c;
}

.btn-minus,
.btn-plus {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.btn-minus {
  background: #c0392b;
  color: white;
}

.btn-plus {
  background: #27ae60;
  color: white;
}

.btn-minus:hover,
.btn-plus:hover {
  opacity: 0.8;
}

.boss-tokens-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 4px;
}

.boss-tokens-list {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
  min-height: 28px;
}

.empty-message {
  font-size: 11px;
  color: #7f8c8d;
  font-style: italic;
}

.boss-tokens-list.drop-target {
  background: rgba(255, 255, 255, 0.1);
  outline: 2px dashed #bdc3c7;
  border-radius: 4px;
}

.boss-abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
}

.ability {
  background: #e74c3c;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
}

.btn-reset-action {
  margin-top: 8px;
  width: 100%;
  padding: 6px 0;
  background: #8e44ad;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  font-weight: bold;
  transition: opacity 0.2s;
}

.btn-reset-action:hover {
  opacity: 0.8;
}
</style>
