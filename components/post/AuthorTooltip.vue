<script setup lang="ts">
import { computed, ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = withDefaults(
  defineProps<{
    author?: {
      name?: string;
      avatar?: string;
      bio?: string;
      socials?: Array<{ label: string; href: string }>;
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

  // Tooltip height ~220px, width ~300px
  const spaceBelow = vh - rect.bottom;
  const spaceAbove = rect.top;
  const spaceRight = vw - rect.left;

  // Tự động chọn hướng dọc phù hợp với khoảng trống màn hình
  const vertical = spaceBelow < 240 && spaceAbove > spaceBelow ? "top" : "bottom";

  // Tự động chọn hướng ngang phù hợp để không bị đâm ra ngoài lề màn hình
  const horizontal = spaceRight < 310 ? "right" : "left";

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
const defaultBio =
  "Founder & Lead Creator tại J2TEAM. Chia sẻ kiến thức lập trình, công nghệ và bảo mật.";

const authorData = computed(() => {
  if (props.author && typeof props.author === "object") {
    return {
      name: props.author.name || "JUNO_OKYO",
      avatar: props.author.avatar || defaultAvatar,
      bio: props.author.bio || defaultBio,
    };
  }
  return {
    name: typeof props.author === "string" ? props.author : "JUNO_OKYO",
    avatar: defaultAvatar,
    bio: defaultBio,
  };
});

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

    <!-- Median UI Author Tooltip Popover Card (Tính vị trí thông minh 100% thời gian thực) -->
    <Transition name="fade-slide">
      <div
        v-if="isVisible"
        :class="[
          'absolute z-50 w-72 sm:w-80 rounded-2xl border border-border-main bg-bg-alt p-4 shadow-2xl backdrop-blur-xl text-left pointer-events-auto',
          placementClasses
        ]"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
      >
        <div class="flex items-center gap-3">
          <img
            :src="authorData.avatar"
            :alt="authorData.name"
            class="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-primary/50 shadow-md"
          />
          <div class="min-w-0 flex-1">
            <h4 class="font-bold text-sm text-text-main truncate">
              {{ authorData.name }}
            </h4>
            <span class="text-[11px] font-semibold text-primary">Tác giả Median UI</span>
          </div>
        </div>

        <p class="mt-3 text-xs leading-relaxed text-text-alt line-clamp-3">
          {{ authorData.bio }}
        </p>

        <div class="mt-3.5 pt-2.5 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-muted">
          <NuxtLink to="/" class="font-medium text-primary hover:underline flex items-center gap-1">
            <span>Xem bài viết của tác giả</span>
            <AppIcon name="chevron-right" :size="12" />
          </NuxtLink>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(4px);
}
</style>
