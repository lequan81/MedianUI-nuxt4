<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import type { TurnstileObject } from "~/types/turnstile";

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

const state = reactive({
  isLoaded: false,
  isVerified: false,
  hasError: false,
  widgetId: null as string | null,
});

let loadTimer: ReturnType<typeof setTimeout> | null = null;

function getTurnstile(): TurnstileObject | undefined {
  return (window as any).turnstile as TurnstileObject | undefined;
}

let checkRetryTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
  // Set 10s timeout guard
  loadTimer = setTimeout(() => {
    if (!state.isLoaded && !state.isVerified) {
      state.hasError = true;
    }
  }, 10000);

  const checkAndInit = () => {
    const ts = getTurnstile();
    if (ts) {
      initTurnstile();
    } else if (!state.hasError) {
      checkRetryTimer = setTimeout(checkAndInit, 100);
    }
  };

  checkAndInit();
});

onUnmounted(() => {
  if (loadTimer) clearTimeout(loadTimer);
  if (checkRetryTimer) clearTimeout(checkRetryTimer);
  const ts = getTurnstile();
  if (ts && state.widgetId) {
    try {
      ts.remove(state.widgetId);
    } catch {
      // Ignore unmount error
    }
  }
});

function initTurnstile() {
  const ts = getTurnstile();
  if (ts && widgetContainer.value && !state.widgetId) {
    state.isLoaded = true;
    try {
      state.widgetId = ts.render(widgetContainer.value as unknown as HTMLElement, {
        sitekey: sitekey.value,
        theme: "auto",
        size: "normal",
        callback: (token: string) => {
          state.isVerified = true;
          emit("verify", token);
        },
        "error-callback": () => {
          state.hasError = true;
        },
        "expired-callback": () => {
          state.isVerified = false;
        },
      });
    } catch {
      state.hasError = true;
    }
  }
}
</script>

<template>
  <div v-if="state.hasError" class="inline-flex items-center gap-1.5 text-xs text-rose-500 font-semibold py-1 animate-in fade-in duration-200">
    <AppIcon name="alert-triangle" :size="14" />
    <span>captcha lỗi</span>
  </div>
  <div v-else-if="!state.isVerified" class="inline-flex items-center gap-2.5 animate-in fade-in slide-in-from-left-2 duration-200">
    <div ref="widgetContainer" class="shrink-0 flex items-center min-h-16"></div>
    <div v-if="!state.isLoaded" class="text-xs text-text-muted animate-pulse py-2">
      Đang load captcha...
    </div>
  </div>
  <div v-else class="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-semibold py-1 animate-in fade-in duration-200">
    <AppIcon name="check-circle-2" :size="14" />
    <span>Đã xác minh an toàn</span>
  </div>
</template>
