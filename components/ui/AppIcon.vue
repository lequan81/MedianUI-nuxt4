<script setup lang="ts">
import { computed } from 'vue'
import { Icon } from '@iconify/vue'
import type { LucideName } from '~/app/config/site'

const props = withDefaults(defineProps<{
  name: LucideName | string
  size?: number | string
}>(), {
  size: 18,
})

const iconName = computed(() => {
  return props.name.includes(':') ? props.name : `lucide:${props.name}`
})
</script>

<template>
  <Icon :icon="iconName" :width="props.size" :height="props.size" aria-hidden="true" />
</template>
