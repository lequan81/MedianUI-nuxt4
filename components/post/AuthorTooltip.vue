<script setup lang="ts">
import { computed, ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = withDefaults(
  defineProps<{
    author?: {
      name?: string;
      handle?: string;
      avatar?: string;
      bio?: string;
      email?: string;
      website?: string;
      socials?: Array<{ name?: string; label?: string; icon?: any; href?: string }>;
    } | string;
    size?: "sm" | "md";
  }>(),
  {
    size: "md",
  }
);

const isVisible = ref(false);
const triggerRef = ref<HTMLElement | null>(null);
const computedPos = ref<{ vertical: "top" | "bottom"; horizontal: "left" | "right" }>({
  vertical: "bottom",
  horizontal: "left",
});

let hideTimer: ReturnType<typeof setTimeout> | null = null;

function calculateSmartPosition() {
  if (!triggerRef.value) return;
  const rect = triggerRef.value.getBoundingClientRect();
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;
  const spaceRight = vw - rect.left;

  const vertical = spaceBelow < 180 && spaceAbove > spaceBelow ? "top" : "bottom";
  const horizontal = spaceRight < 270 ? "right" : "left";

  computedPos.value = { vertical, horizontal };
}

function showTooltip() {
  if (hideTimer) clearTimeout(hideTimer);
  calculateSmartPosition();
  isVisible.value = true;
}

function hideTooltip() {
  hideTimer = setTimeout(() => {
    isVisible.value = false;
  }, 180);
}

const defaultAvatar =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png";

const authorData = computed(() => {
  return {
    name: "Lê Quân",
    handle: "@lequan81",
    avatar: defaultAvatar,
    bio: "Chia sẻ kiến thức lập trình, công nghệ & thủ thuật cá nhân.",
  };
});

const authorSocials = [
  { name: "Facebook", icon: "facebook", href: "https://facebook.com/lequan81" },
  { name: "GitHub", icon: "github", href: "https://github.com/lequan81" },
  { name: "Website", icon: "globe", href: "https://lequan81.dev" },
  { name: "Email", icon: "mail", href: "mailto:contact@lequan81.dev" },
];

const placementClasses = computed(() => {
  const v = computedPos.value.vertical === "top" ? "bottom-full mb-2" : "top-full mt-2";
  const h = computedPos.value.horizontal === "right" ? "right-0" : "left-0";
  return `${v} ${h}`;
});
</script>

<template>
  <div
    ref="triggerRef"
    class="relative inline-flex items-center"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
  >
    <slot :author="authorData">
      <div class="flex items-center gap-2 cursor-pointer">
        <img
          :src="authorData.avatar"
          :alt="authorData.name"
          :class="[
            'rounded-full object-cover ring-1 ring-border-main transition-transform hover:scale-105',
            size === 'sm' ? 'h-5 w-5' : 'h-7 w-7'
          ]"
        />
        <span class="font-semibold uppercase tracking-wider text-text-main hover:text-primary transition-colors">
          {{ authorData.name }}
        </span>
      </div>
    </slot>

    <!-- Clean Minimalist Median UI Author Tooltip -->
    <Transition name="fade-slide">
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 w-64 rounded-xl border border-border-main bg-bg-alt p-3.5 shadow-xl text-left pointer-events-auto',
          placementClasses
        ]"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
        <!-- Header Info: Avatar (h-9 w-9), Name, Handle -->
        <div class="flex items-center gap-2.5">
          <img
            :src="authorData.avatar"
            :alt="authorData.name"
            class="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border-main"
          />
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-sm text-text-main truncate leading-tight">
              {{ authorData.name }}
            </h4>
            <!-- Handle @lequan81 dùng màu tím Primary -->
            <p class="text-xs text-primary font-semibold mt-0.5">
              {{ authorData.handle }}
            </p>
          </div>
        </div>

        <!-- Clean Bio Line -->
        <p class="mt-2.5 text-xs leading-relaxed text-text-alt">
          {{ authorData.bio }}
        </p>

        <!-- Social Icons Row (Minimalist Icons Only) -->
        <div class="mt-3 pt-2.5 border-t border-border-subtle flex items-center justify-between">
          <span class="text-[11px] font-medium text-text-muted">Liên hệ:</span>
          <div class="flex items-center gap-1.5">
            <a
              v-for="social in authorSocials"
              :key="social.name"
              :href="social.href"
              target="_blank"
              rel="noreferrer"
              :title="social.name"
              class="flex h-7 w-7 items-center justify-center rounded-lg border border-border-main bg-bg-sec text-text-alt transition-colors hover:border-primary hover:text-primary hover:bg-bg-base"
            >
              <AppIcon :name="social.icon" :size="14" />
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
