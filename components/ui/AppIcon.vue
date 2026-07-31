<script setup lang="ts">
import { Icon } from '@iconify/vue'
import type { LucideName } from '~/app/config/site'

const props = withDefaults(defineProps<{
  name: LucideName
  size?: number | string
}>(), {
  size: 18,
})
</script>

<template>
  <Icon :icon="`lucide:${props.name}`" :width="props.size" :height="props.size" aria-hidden="true" />
</template>
