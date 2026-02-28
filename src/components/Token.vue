<template>
  <div
    class="token"
    :class="[tokenTypeClass, { placed: token.placed }]"
    :style="tokenStyle"
    :draggable="draggable"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <span class="token-icon">{{ tokenIcon }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  token: {
    type: Object,
    required: true
  },
  playerId: {
    type: Number,
    required: true
  },
  draggable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['drag-start', 'drag-end'])

const tokenTypeClass = computed(() => `token-${props.token.type}`)

const tokenStyle = computed(() => ({
  '--token-color': props.token.color
}))

const tokenIcon = computed(() => {
  switch (props.token.type) {
    case 'pawn':
      return '♟'
    case 'marker':
      return '●'
    default:
      return '○'
  }
})

function onDragStart(event) {
  event.dataTransfer.setData('application/json', JSON.stringify({
    type: 'token',
    tokenId: props.token.id,
    playerId: props.playerId
  }))
  event.dataTransfer.effectAllowed = 'move'
  emit('drag-start', props.token)
}

function onDragEnd(event) {
  emit('drag-end', props.token)
}
</script>

<style scoped>
.token {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--token-color);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s, box-shadow 0.2s;
  user-select: none;
}

.token:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.token:active {
  cursor: grabbing;
}

.token-icon {
  font-size: 18px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.token-pawn {
  width: 36px;
  height: 36px;
}

.token-pawn .token-icon {
  font-size: 24px;
}

.token-marker {
  width: 24px;
  height: 24px;
}

.token-marker .token-icon {
  font-size: 14px;
}

.placed {
  opacity: 0.8;
}
</style>
