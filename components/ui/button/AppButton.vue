<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";

interface Props {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "subtle" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: string;
  iconSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  type: "button",
  iconSize: 15,
});

const variantClasses = {
  primary: "bg-primary text-white border-transparent hover:bg-primary/90 shadow-2xs",
  secondary: "bg-bg-sec text-text-main border-border-main hover:bg-bg-alt shadow-2xs",
  outline: "bg-transparent text-text-main border-border-main hover:border-primary hover:text-primary",
  ghost: "bg-transparent text-text-alt border-transparent hover:bg-bg-sec hover:text-text-main",
  subtle: "bg-primary-subtle text-primary border-transparent hover:bg-primary/20",
  danger: "bg-rose-500 text-white border-transparent hover:bg-rose-600 shadow-2xs",
};

const sizeClasses = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-lg",
  md: "h-9.5 px-4 text-xs font-semibold gap-2 rounded-xl",
  lg: "h-11 px-5 text-sm font-bold gap-2.5 rounded-xl",
};
</script>

<template>
  <button
    :type="props.type"
    :disabled="props.disabled || props.loading"
    class="inline-flex items-center justify-center font-medium border transition-all duration-200 cursor-pointer select-none active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 disabled:pointer-events-none"
    :class="[
      variantClasses[props.variant],
      sizeClasses[props.size],
    ]"
  >
    <!-- Loading Spinner Icon -->
    <AppIcon
      v-if="props.loading"
      name="loader"
      :size="props.iconSize"
      class="animate-spin shrink-0"
    />

    <!-- Leading Custom Icon -->
    <AppIcon
      v-else-if="props.icon"
      :name="props.icon"
      :size="props.iconSize"
      class="shrink-0"
    />

    <slot />
  </button>
</template>
