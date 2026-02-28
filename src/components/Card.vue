<template>
  <div
    class="card"
    :class="[cardTypeClass, { 'face-down': !faceUp }]"
    :style="cardStyle"
    @dblclick="handleFlip"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <div class="card-inner">
      <div class="card-front" v-if="faceUp">
        <template v-if="!isBossActionCard">
          <div class="card-header">
            <span class="card-id">{{ card.id }}</span>
            <span class="card-name">{{ card.name }}</span>
          </div>
        </template>
        <div class="card-content">
          <!-- Boss Action Card: id only -->
          <template v-if="isBossActionCard">
            <div class="boss-action-id">{{ card.id }}</div>
          </template>

          <!-- AC Card Front: weapons -->
          <template v-if="isAcCard && card.front">
            <div class="weapons">
              <div v-for="(weaponId, idx) in card.front.weapons" :key="idx" class="weapon">
                <span class="weapon-name">{{ getWeaponName(weaponId) }}</span>
                <div class="weapon-stats">
                  <span>ATK {{ getWeapon(weaponId)?.attack }}</span>
                  <span>RNG {{ getWeapon(weaponId)?.range }}</span>
                </div>
              </div>
            </div>
          </template>

          <!-- Boss Card -->
          <template v-if="isBossCard">
            <div class="boss-stats">
              <div>HP: {{ card.hp }}</div>
              <div>ATK: {{ card.attack }}</div>
            </div>
            <div class="abilities" v-if="card.abilities">
              <span v-for="(ability, idx) in card.abilities" :key="idx" class="ability">
                {{ ability }}
              </span>
            </div>
          </template>

          <!-- Action Card -->
          <template v-if="isActionCard">
            <div class="action-type">{{ card.type }}</div>
            <div class="action-desc">{{ card.description }}</div>
          </template>
        </div>
      </div>
      <div class="card-back" v-else>
        <!-- AC Card Back: core -->
        <template v-if="isAcCard && card.back">
          <div class="core-info">
            <span class="core-name">{{ getCoreName(card.back.core) }}</span>
            <div class="core-hp">HP {{ getCore(card.back.core)?.hp }}</div>
            <div class="core-move" v-if="getCore(card.back.core)?.specialMove">{{ getCore(card.back.core).specialMove }}</div>
            <div class="core-passive" v-if="getCore(card.back.core)?.specialPassive">{{ getCore(card.back.core).specialPassive }}</div>
          </div>
        </template>
        <!-- Boss/Action cards have blank back -->
        <template v-else>
          <div class="blank-back"></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'
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
  playerId: {
    type: Number,
    default: null
  },
  cardIndex: {
    type: Number,
    default: null
  },
  bossActionIndex: {
    type: Number,
    default: null
  }
})

const emit = defineEmits(['flip', 'show-tooltip', 'hide-tooltip'])

const gameStore = useGameStore()

const isAcCard = computed(() => props.card.front && props.card.back)
const isBossCard = computed(() => props.card.hp !== undefined && !props.card.isAction)
const isActionCard = computed(() => props.card.isAction === true)
const isBossActionCard = computed(() => props.card.isBossAction === true)

const cardTypeClass = computed(() => {
  if (isAcCard.value) return 'ac-card'
  if (isBossCard.value) return 'boss-card'
  if (isActionCard.value) return 'action-card'
  if (isBossActionCard.value) return 'boss-action-card'
  return ''
})

const borderColor = computed(() => {
  const colors = gameStore.cardBorderColors
  if (isAcCard.value) return colors?.ac ?? '#3498db'
  if (isBossCard.value) return colors?.boss ?? '#e74c3c'
  if (isActionCard.value) return colors?.action ?? '#2ecc71'
  if (isBossActionCard.value) return colors?.['boss-action'] ?? '#9b59b6'
  return '#2c3e50'
})

const cardStyle = computed(() => ({
  '--card-color': props.card.color || borderColor.value
}))

function getWeapon(weaponId) {
  return gameStore.getWeapon(weaponId)
}

function getWeaponName(weaponId) {
  return getWeapon(weaponId)?.name ?? weaponId
}

function getCore(coreId) {
  return gameStore.getCore(coreId)
}

function getCoreName(coreId) {
  return getCore(coreId)?.name ?? coreId
}

function handleFlip() {
  if (props.bossActionIndex !== null) {
    gameStore.flipBossActionCard(props.bossActionIndex)
  } else if (props.playerId !== null && props.cardIndex !== null) {
    gameStore.flipCard(props.playerId, props.cardIndex)
  }
  emit('flip')
}

function showTooltip(event) {
  emit('show-tooltip', { card: props.card, faceUp: props.faceUp, event })
}

function hideTooltip() {
  emit('hide-tooltip')
}
</script>

<style scoped>
.card {
  width: 100px;
  height: 140px;
  border-radius: 8px;
  background: var(--card-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  user-select: none;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.card-inner {
  width: 100%;
  height: 100%;
  padding: 6px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card-front,
.card-back {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

.card-back {
  background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.card-header {
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
  margin-bottom: 4px;
}

.card-id {
  font-size: 8px;
  color: #999;
  display: block;
}

.card-name {
  font-size: 10px;
  font-weight: bold;
  color: #333;
}

.card-content {
  flex: 1;
  font-size: 9px;
  overflow: hidden;
}

.weapon {
  background: #ecf0f1;
  padding: 2px 4px;
  border-radius: 2px;
  margin-bottom: 2px;
}

.weapon-name {
  font-weight: 500;
  display: block;
}

.weapon-stats {
  display: flex;
  gap: 4px;
  color: #555;
  font-size: 8px;
}

.boss-stats {
  font-weight: bold;
  margin-bottom: 4px;
}

.abilities {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.ability {
  background: #e74c3c;
  color: white;
  padding: 1px 4px;
  border-radius: 2px;
  font-size: 8px;
}

.action-type {
  text-transform: uppercase;
  font-size: 8px;
  color: #7f8c8d;
  margin-bottom: 4px;
}

.action-desc {
  font-size: 8px;
  color: #333;
}

.core-info {
  color: white;
  text-align: center;
  width: 100%;
  padding: 4px;
  box-sizing: border-box;
}

.core-name {
  font-size: 10px;
  font-weight: bold;
  display: block;
  margin-bottom: 3px;
}

.core-hp {
  font-size: 9px;
  color: #e74c3c;
  margin-bottom: 3px;
}

.core-move {
  font-size: 8px;
  color: #ecf0f1;
  line-height: 1.3;
  margin-bottom: 2px;
}

.core-passive {
  font-size: 8px;
  color: #bdc3c7;
  line-height: 1.3;
}

.blank-back {
  width: 60px;
  height: 80px;
  background: repeating-linear-gradient(
    45deg,
    #3a5068,
    #3a5068 10px,
    #2c3e50 10px,
    #2c3e50 20px
  );
  border-radius: 4px;
}

/* Card type specific styles */
.ac-card {
  --card-color: #3498db;
}

.boss-card {
  --card-color: #e74c3c;
}

.action-card {
  --card-color: #2ecc71;
}

.boss-action-card {
  --card-color: #9b59b6;
}

.boss-action-id {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
