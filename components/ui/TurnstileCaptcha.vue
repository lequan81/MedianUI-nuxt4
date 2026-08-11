<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps<{
  sitekey?: string;
  reason?: string;
}>();

const emit = defineEmits<{
  (e: "verify", token: string): void;
}>();

const config = useRuntimeConfig();
const sitekey = computed<string>(
  () => String(props.sitekey || (config.public as any).turnstileSiteKey || "1x00000000000000000000AA")
);

const widgetContainer = ref<HTMLElement | null>(null);
const isLoaded = ref(false);
let widgetId: string | null = null;

onMounted(() => {
  if (!window.turnstile) {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.onload = () => initTurnstile();
    document.head.appendChild(script);
  } else {
    initTurnstile();
  }
});

onUnmounted(() => {
  if (window.turnstile && widgetId) {
    try {
      window.turnstile.remove(widgetId);
    } catch {
      // Ignore unmount error
    }
  }
});

function initTurnstile() {
  if (window.turnstile && widgetContainer.value && !widgetId) {
    isLoaded.value = true;
    try {
      widgetId = window.turnstile.render(widgetContainer.value as HTMLElement, {
        sitekey: sitekey.value,
        theme: "auto",
        size: "normal",
        callback: (token: string) => {
          emit("verify", token);
        },
      });
    } catch {
      // Ignore double render attempt
    }
  }
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "invisible";
          callback?: (token: string) => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}
</script>

<template>
  <div class="inline-flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-200">
    <div ref="widgetContainer" class="shrink-0 flex items-center min-h-16"></div>
    <div v-if="!isLoaded" class="text-xs text-text-muted animate-pulse py-2">
      Đang nạp xác minh...
    </div>
  </div>
</template>
