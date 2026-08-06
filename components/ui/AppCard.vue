<script setup lang="ts">
interface Props {
  hoverable?: boolean;
  bordered?: boolean;
  padded?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hoverable: true,
  bordered: true,
  padded: true,
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-xl bg-bg-alt/60 transition-all duration-300 shadow-2xs"
    :class="[
      props.bordered ? 'border border-border-main' : '',
      props.padded ? 'p-4 sm:p-5' : '',
      props.hoverable ? 'hover:border-primary/60 hover:bg-bg-alt hover:shadow-md' : '',
    ]"
  >
    <slot />
  </div>
</template>
