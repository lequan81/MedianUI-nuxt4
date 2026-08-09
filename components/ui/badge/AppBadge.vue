<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "subtle" | "outline" | "warning";
  size?: "sm" | "md";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "sm",
});

const variantClasses = {
  primary: "bg-primary text-white shadow-2xs border-transparent",
  secondary: "bg-bg-sec text-text-main border-border-main",
  subtle: "bg-primary-subtle/80 text-primary border-transparent",
  outline: "bg-transparent text-primary border-primary",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-transparent",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded",
  md: "px-2.5 py-1 text-xs font-semibold rounded-md",
};
</script>

<template>
  <span
    class="inline-flex items-center justify-center border font-mono select-none transition-colors"
    :class="[variantClasses[props.variant], sizeClasses[props.size]]"
  >
    <slot />
  </span>
</template>
