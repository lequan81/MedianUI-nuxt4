<script setup lang="ts">
import AppIcon from "~/components/ui/AppIcon.vue";

interface Props {
  modelValue?: string | number;
  label?: string;
  required?: boolean;
  error?: string;
  placeholder?: string;
  type?: string;
  icon?: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: "",
  required: false,
  type: "text",
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<template>
  <div class="space-y-1 w-full">
    <!-- Field Label -->
    <label v-if="props.label" class="block text-xs font-medium text-text-main/90">
      {{ props.label }}
      <span v-if="props.required" class="text-rose-500 font-bold ml-0.5">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative flex items-center w-full">
      <AppIcon
        v-if="props.icon"
        :name="props.icon"
        :size="15"
        class="absolute left-3 text-text-muted shrink-0 pointer-events-none"
      />

      <input
        :type="props.type"
        :value="props.modelValue"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="[
          'w-full rounded-lg border bg-bg-sec py-2.5 text-xs text-text-main placeholder:text-text-muted outline-none transition-all shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed',
          props.icon ? 'pl-9 pr-3' : 'px-3',
          props.error
            ? 'border-rose-500 focus:ring-1 focus:ring-rose-500'
            : 'border-border-main focus:border-primary focus:ring-1 focus:ring-primary',
        ]"
        @input="handleInput"
      />
    </div>

    <!-- Field Error Text -->
    <p v-if="props.error" class="text-[11px] font-medium text-rose-500 leading-tight">
      {{ props.error }}
    </p>
  </div>
</template>
