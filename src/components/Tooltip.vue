<template>
  <div class="tooltip" :style="tooltipStyle">
    <div class="tooltip-header">
      <span class="tooltip-name">{{ card.name }}</span>
      <span class="tooltip-id">{{ card.id }}</span>
    </div>

    <!-- AC Card Details -->
    <template v-if="isAcCard">
      <!-- Front: show weapons only -->
      <div class="tooltip-section" v-if="faceUp">
        <div v-for="weaponId in card.front.weapons" :key="weaponId" class="weapon-detail">
          <div class="weapon-name">{{ getWeapon(weaponId)?.name || weaponId }}</div>
          <div class="weapon-stats" v-if="getWeapon(weaponId)">
            <span>ATK: {{ getWeapon(weaponId).attack }}</span>
            <span>Range: {{ getWeapon(weaponId).range }}</span>
          </div>
          <div class="weapon-abilities" v-if="getWeapon(weaponId)?.abilities?.length">
            <span v-for="(ability, idx) in getWeapon(weaponId).abilities" :key="idx" class="ability">
              {{ ability }}
            </span>
          </div>
        </div>
      </div>
      <!-- Back: show core only -->
      <div class="tooltip-section" v-else>
        <div class="core-detail" v-if="getCore(card.back.core)">
          <div class="core-name">{{ getCore(card.back.core).name }}</div>
          <div class="core-hp">HP: {{ getCore(card.back.core).hp }}</div>
          <div class="core-special" v-if="getCore(card.back.core).specialMove">
            {{ getCore(card.back.core).specialMove }}
          </div>
          <div class="core-passive" v-if="getCore(card.back.core).specialPassive">
            <strong>Passive:</strong>
            {{ getCore(card.back.core).specialPassive }}
          </div>
        </div>
      </div>
    </template>

    <!-- Boss Card Details -->
    <template v-else-if="isBossCard">
      <div class="tooltip-section">
        <div class="boss-stats">
          <span>HP: {{ card.hp }}</span>
          <span>ATK: {{ card.attack }}</span>
        </div>
        <div class="boss-description" v-if="card.description">
          {{ card.description }}
        </div>
        <div class="boss-abilities" v-if="card.abilities?.length">
          <span v-for="(ability, idx) in card.abilities" :key="idx" class="ability">
            {{ ability }}
          </span>
        </div>
      </div>
    </template>

    <!-- Action Card Details -->
    <template v-else-if="isActionCard">
      <div class="tooltip-section">
        <div class="action-type">Type: {{ card.type }}</div>
        <div class="action-description">{{ card.description }}</div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'

const props = defineProps({
  card: {
    type: Object,
    required: true
  },
  faceUp: {
    type: Boolean,
    default: true
  },
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  }
})

const gameStore = useGameStore()

const isAcCard = computed(() => props.card.front && props.card.back)
const isBossCard = computed(() => props.card.hp !== undefined && !props.card.isAction)
const isActionCard = computed(() => props.card.isAction === true)

const tooltipStyle = computed(() => ({
  left: `${props.position.x}px`,
  top: `${props.position.y}px`
}))

function getWeapon(weaponId) {
  return gameStore.getWeapon(weaponId)
}

function getCore(coreId) {
  return gameStore.getCore(coreId)
}
</script>

<style scoped>
.tooltip {
  position: fixed;
  z-index: 1000;
  min-width: 200px;
  max-width: 280px;
  background: #2c3e50;
  color: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
  pointer-events: none;
}

.tooltip-header {
  border-bottom: 1px solid #34495e;
  padding-bottom: 8px;
  margin-bottom: 8px;
}

.tooltip-name {
  font-size: 14px;
  font-weight: bold;
  display: block;
}

.tooltip-id {
  font-size: 10px;
  color: #7f8c8d;
}

.tooltip-section {
  margin-bottom: 8px;
}

.tooltip-section:last-child {
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 6px 0;
  font-size: 11px;
  text-transform: uppercase;
  color: #bdc3c7;
  letter-spacing: 1px;
}

.weapon-detail,
.core-detail {
  background: #34495e;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 6px;
}

.weapon-detail:last-child,
.core-detail:last-child {
  margin-bottom: 0;
}

.weapon-name,
.core-name {
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 4px;
}

.weapon-stats,
.boss-stats {
  font-size: 11px;
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.core-hp {
  font-size: 11px;
  color: #e74c3c;
  margin-bottom: 4px;
}

.core-special {
  font-size: 10px;
  color: #ecf0f1;
  line-height: 1.4;
}

.core-passive {
  font-size: 10px;
  color: #bdc3c7;
  line-height: 1.4;
  margin-top: 4px;
}

.weapon-abilities,
.boss-abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.ability {
  background: #e74c3c;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
}

.boss-description {
  font-size: 11px;
  color: #bdc3c7;
  margin-bottom: 6px;
  line-height: 1.4;
}

.action-type {
  font-size: 10px;
  text-transform: uppercase;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.action-description {
  font-size: 11px;
  color: #ecf0f1;
}
</style>
