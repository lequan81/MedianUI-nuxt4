<script setup lang="ts">
import { useLangStore, supportedLanguages } from '~/stores/useLangStore'
import AppIcon from '~/components/ui/AppIcon.vue'

const langStore = useLangStore()
</script>

<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="langStore.isLangModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs"
          @click.self="langStore.closeLangModal"
        >
          <div
            class="relative w-full max-w-[340px] sm:max-w-md overflow-hidden rounded-2xl border border-border-main bg-bg-alt p-4 sm:p-5 shadow-2xl space-y-3 sm:space-y-4 transition-all"
            role="dialog"
            aria-modal="true"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between border-b border-border-subtle pb-2.5">
              <div class="flex items-center gap-2">
                <div class="flex h-7.5 w-7.5 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                  <AppIcon name="globe" :size="16" />
                </div>
                <div>
                  <h2 class="text-xs sm:text-sm font-semibold text-text-main leading-tight">
                    Ngôn ngữ / Language
                  </h2>
                  <p class="text-[10px] sm:text-[11px] font-normal text-text-muted mt-0.5 leading-none">
                    Chọn ngôn ngữ giao diện hiển thị
                  </p>
                </div>
              </div>

              <button
                type="button"
                class="flex h-7 w-7 items-center justify-center rounded-full text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
                aria-label="Đóng modal"
                @click="langStore.closeLangModal"
              >
                <AppIcon name="x" :size="15" />
              </button>
            </div>

            <!-- Language Options Grid -->
            <div class="grid grid-cols-2 gap-2 sm:gap-2.5 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto pr-0.5">
              <button
                v-for="lang in supportedLanguages"
                :key="lang.code"
                type="button"
                :class="[
                  'group flex items-center justify-between rounded-xl p-2 sm:p-2.5 border text-left transition-all duration-150 cursor-pointer shadow-2xs',
                  langStore.currentLang === lang.code
                    ? 'border-primary bg-primary-subtle text-primary font-semibold'
                    : 'border-border-main bg-bg-sec text-text-main hover:border-primary hover:text-primary hover:bg-bg-alt'
                ]"
                @click="langStore.setLanguage(lang.code)"
              >
                <div class="flex items-center gap-2 min-w-0">
                  <!-- Real Flag Image API with gentle rounded corners -->
                  <div class="relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] border border-white/20 shadow-2xs bg-bg-sec">
                    <img
                      :src="lang.flagUrl"
                      :alt="lang.name"
                      class="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div class="min-w-0">
                    <div class="text-[11.5px] sm:text-xs font-semibold truncate leading-tight group-hover:text-primary transition-colors">
                      {{ lang.localName }}
                    </div>
                    <div class="text-[9.5px] sm:text-[10.5px] font-normal text-text-muted truncate leading-tight mt-0.5">
                      {{ lang.name }}
                    </div>
                  </div>
                </div>

                <span
                  v-if="langStore.currentLang === lang.code"
                  class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[9px] font-bold shadow-xs"
                >
                  ✓
                </span>
              </button>
            </div>

            <!-- Footer note -->
            <div class="pt-2 text-center text-[10.5px] font-normal text-text-muted border-t border-border-subtle">
              Cài đặt ngôn ngữ được tự động lưu cho các lần truy cập sau.
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>
