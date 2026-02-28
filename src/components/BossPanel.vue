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
        <div class="boss-pawn-section" v-if="boss.pawn">
          <span class="stat-label">Pawn</span>
          <Token :token="boss.pawn" :player-id="-1" />
        </div>
        <div class="boss-abilities" v-if="boss.card.abilities">
          <span class="ability" v-for="(ability, idx) in boss.card.abilities" :key="idx">
            {{ idx + 1 }}: {{ ability }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
import Card from './Card.vue'
import Token from './Token.vue'

const gameStore = useGameStore()
const boss = computed(() => gameStore.boss)

function updateHP(delta) {
  gameStore.updateBossHP(delta)
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

.boss-pawn-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
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
</style>
