<template>
  <div class="shared-play-area">
    <h3 class="area-title">Shared Play Area</h3>
    <div class="boss-action-row" v-if="bossActionCards.length">
      <Card
        v-for="(card, idx) in bossActionCards"
        :key="card.id + idx"
        :card="card"
        :face-up="card.faceUp"
        :boss-action-index="idx"
      />
    </div>
    <GameGrid :grid="sharedGrid" />
    <button class="direction-btn" @click="toggleDirection">{{ direction }}</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import GameGrid from './GameGrid.vue'
import Card from './Card.vue'

const gameStore = useGameStore()
const sharedGrid = computed(() => gameStore.sharedGrid)
const bossActionCards = computed(() => gameStore.bossActionCards)

const facingLeft = ref(true)
const direction = computed(() => facingLeft.value ? '◀' : '▶')

function toggleDirection() {
  facingLeft.value = !facingLeft.value
}
</script>

<style scoped>
.shared-play-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.area-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.boss-action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.direction-btn {
  margin-top: 12px;
  width: 40px;
  height: 40px;
  font-size: 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.direction-btn:hover {
  opacity: 0.8;
}
</style>
