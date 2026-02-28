<template>
  <div class="active-player-area" v-if="activePlayer" :style="{ '--player-color': activePlayer.color }">
    <div class="area-header">
      <div class="player-info">
        <span class="player-indicator"></span>
        <span class="player-name">{{ activePlayer.name }}'s Turn</span>
      </div>
      <button class="end-turn-btn" @click="endTurn">End Turn</button>
    </div>

    <div class="area-content">
      <!-- Unplaced Tokens -->
      <div class="tokens-section">
        <h4 class="section-title">Tokens</h4>
        <div class="tokens-list">
          <Token
            v-for="token in unplacedTokens"
            :key="token.id"
            :token="token"
            :player-id="activePlayer.id"
          />
          <span v-if="unplacedTokens.length === 0" class="empty-message">
            All tokens placed
          </span>
        </div>
      </div>

      <!-- Hand -->
      <div class="hand-section">
        <h4 class="section-title">Hand ({{ activePlayer.hand.length }} cards)</h4>
        <draggable
          v-model="handCards"
          item-key="id"
          class="hand-cards"
          :animation="200"
        >
          <template #item="{ element, index }">
            <Card
              :card="element"
              :face-up="element.faceUp"
              :player-id="activePlayer.id"
              :card-index="index"
              @show-tooltip="showTooltip"
              @hide-tooltip="hideTooltip"
            />
          </template>
        </draggable>
      </div>
    </div>

    <Tooltip
      v-if="tooltipVisible"
      :card="tooltipCard"
      :face-up="tooltipFaceUp"
      :position="tooltipPosition"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import draggable from 'vuedraggable'
import Card from './Card.vue'
import Token from './Token.vue'
import Tooltip from './Tooltip.vue'

const gameStore = useGameStore()

const activePlayer = computed(() => gameStore.activePlayer)

const unplacedTokens = computed(() => {
  if (!activePlayer.value) return []
  return activePlayer.value.tokens.filter(t => !t.placed)
})

const handCards = computed({
  get: () => activePlayer.value?.hand || [],
  set: (newOrder) => {
    if (activePlayer.value) {
      gameStore.reorderHand(activePlayer.value.id, newOrder)
    }
  }
})

// Tooltip state
const tooltipVisible = ref(false)
const tooltipCard = ref(null)
const tooltipFaceUp = ref(true)
const tooltipPosition = ref({ x: 0, y: 0 })

function endTurn() {
  gameStore.endTurn()
}

function showTooltip({ card, faceUp, event }) {
  tooltipCard.value = card
  tooltipFaceUp.value = faceUp
  tooltipPosition.value = {
    x: event.clientX + 10,
    y: event.clientY + 10
  }
  tooltipVisible.value = true
}

function hideTooltip() {
  tooltipVisible.value = false
}
</script>

<style scoped>
.active-player-area {
  background: #ecf0f1;
  border-top: 4px solid var(--player-color);
  padding: 16px;
}

.area-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--player-color);
}

.player-name {
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.end-turn-btn {
  padding: 10px 24px;
  background: var(--player-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.end-turn-btn:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

.area-content {
  display: flex;
  gap: 24px;
}

.tokens-section {
  min-width: 120px;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 12px;
  text-transform: uppercase;
  color: #7f8c8d;
  letter-spacing: 1px;
}

.tokens-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 40px;
  align-items: center;
}

.empty-message {
  font-size: 11px;
  color: #95a5a6;
  font-style: italic;
}

.hand-section {
  flex: 1;
}

.hand-cards {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 150px;
  padding: 8px;
  background: #dfe6e9;
  border-radius: 8px;
}
</style>
