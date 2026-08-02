<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

export interface TocItem {
  id: string;
  text: string;
  depth: number;
  children?: TocItem[];
}

const props = defineProps<{
  links: TocItem[];
}>();

const isOpen = ref(false);
const isVisible = ref(true);
const activeId = ref("");
let lastScrollY = 0;

const flatLinks = computed(() => {
  const items: TocItem[] = [];

  const walk = (links: TocItem[]) => {
    for (const link of links) {
      items.push(link);
      if (link.children?.length) walk(link.children);
    }
  };

  walk(props.links || []);
  return items;
});

function updateActiveHeading() {
  if (!flatLinks.value.length || typeof window === "undefined") return;

  const headings = flatLinks.value
    .map((link) => ({
      id: link.id,
      el: document.getElementById(link.id),
    }))
    .filter((item): item is { id: string; el: HTMLElement } =>
      Boolean(item.el),
    );

  if (!headings.length) return;

  const firstHeading = headings[0];
  if (!firstHeading) return;

  const scrollPosition = window.scrollY + window.innerHeight;
  const pageHeight = document.documentElement.scrollHeight;
  if (scrollPosition >= pageHeight - 120) {
    const lastHeading = headings[headings.length - 1];
    if (lastHeading) {
      activeId.value = lastHeading.id;
      return;
    }
  }

  const threshold = 120;
  let currentActiveId = firstHeading.id;

  for (const heading of headings) {
    const rect = heading.el.getBoundingClientRect();
    if (rect.top <= threshold) {
      currentActiveId = heading.id;
    } else {
      break;
    }
  }

  activeId.value = currentActiveId;
}

let isScrolling = false;
function onScroll() {
  if (typeof window === "undefined") return;

  const currentScrollY = window.scrollY;

  // Tự động ẩn nút TOC trên mobile khi cuộn xuống và hiện lại khi cuộn lên
  if (currentScrollY > 120 && currentScrollY > lastScrollY + 8) {
    isVisible.value = false;
    isOpen.value = false;
  } else if (currentScrollY < lastScrollY - 8 || currentScrollY <= 120) {
    isVisible.value = true;
  }
  lastScrollY = currentScrollY;

  if (!isScrolling) {
    isScrolling = true;
    requestAnimationFrame(() => {
      updateActiveHeading();
      isScrolling = false;
    });
  }
}

watch(
  flatLinks,
  () => {
    if (typeof window !== "undefined") {
      setTimeout(updateActiveHeading, 100);
    }
  },
  { immediate: true },
);

onMounted(() => {
  if (typeof window !== "undefined") {
    lastScrollY = window.scrollY;
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(updateActiveHeading, 100);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("scroll", onScroll);
  }
});

function toggleToc() {
  isOpen.value = !isOpen.value;
}

function closeToc() {
  isOpen.value = false;
}

function cleanText(text: string) {
  if (!text) return "";
  return text.replace(/^(\d+\.)+\d*\s*/, "").trim();
}

function isExactActive(id: string) {
  return activeId.value === id;
}

function isParentActive(link: TocItem) {
  if (isExactActive(link.id)) return true;
  return Boolean(link.children?.some((child) => child.id === activeId.value));
}

function scrollToHeading(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  activeId.value = id;
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  closeToc();
}
</script>

<template>
  <div v-if="props.links && props.links.length">
    <!-- Nút mở TOC: Trên mobile tự động trượt ẩn khi cuộn xuống, hiện lại khi cuộn lên -->
    <div
      class="fixed right-0 top-[calc(var(--header-height)+36px)] z-40 transition-transform duration-300 ease-out"
      :class="isVisible ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'"
    >
      <div class="relative flex items-center rounded-l-full bg-bg-sec p-1 shadow-xs">
        <!-- Top organic concave curve -->
        <div class="absolute -top-3.5 right-0 h-3.5 w-3.5 bg-bg-sec pointer-events-none">
          <div class="h-full w-full rounded-br-full bg-bg-base"></div>
        </div>

        <button type="button"
          class="flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-bg-sec text-text-main transition-colors hover:bg-primary hover:text-white focus:outline-none focus-visible:outline-none"
          title="Mục lục bài viết" aria-label="Toggle table of contents" @click="toggleToc">
          <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.75">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <!-- Bottom organic concave curve -->
        <div class="absolute -bottom-3.5 right-0 h-3.5 w-3.5 bg-bg-sec pointer-events-none">
          <div class="h-full w-full rounded-tr-full bg-bg-base"></div>
        </div>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity" @click="closeToc">
    </div>

    <aside
      class="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[calc(100vw-32px)] flex-col border-l border-border-main bg-bg-base p-5 transition-all duration-300 ease-out"
      :class="isOpen
        ? 'translate-x-0 shadow-2xl'
        : 'pointer-events-none translate-x-full shadow-none'
        ">
      <div class="flex items-center justify-between pb-3.5 border-b border-border-subtle">
        <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">Mục lục</span>
        <button type="button" class="cursor-pointer text-text-alt transition-colors hover:text-text-main"
          aria-label="Close table of contents" @click="closeToc">
          <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pt-3 space-y-1">
        <div v-for="(link, index) in props.links" :key="link.id" class="space-y-0.5">
          <button type="button" :class="[
            'group flex items-baseline gap-2 text-left text-[13px] transition-colors cursor-pointer w-full py-1.5 px-2.5 rounded',
            isExactActive(link.id)
              ? 'bg-primary-subtle font-semibold text-primary'
              : isParentActive(link)
                ? 'font-semibold text-primary'
                : 'text-text-main hover:bg-bg-sec hover:text-primary font-medium',
          ]" @click="scrollToHeading(link.id)">
            <span :class="[
              'shrink-0 font-medium text-xs',
              isParentActive(link) ? 'text-primary' : 'text-text-muted',
            ]">{{ index + 1 }}.</span>
            <span class="line-clamp-2 leading-snug">{{
              cleanText(link.text)
            }}</span>
          </button>

          <div v-if="link.children?.length" class="space-y-0.5 pl-3">
            <button v-for="(child, childIdx) in link.children" :key="child.id" type="button" :class="[
              'group flex items-baseline gap-2 text-left text-[12px] transition-colors cursor-pointer w-full py-1 px-2.5 rounded',
              isExactActive(child.id)
                ? 'bg-primary-subtle font-medium text-primary'
                : 'text-text-alt hover:bg-bg-sec hover:text-primary font-normal',
            ]" @click="scrollToHeading(child.id)">
              <span :class="[
                'shrink-0 text-[11px]',
                isExactActive(child.id)
                  ? 'font-semibold text-primary'
                  : 'opacity-70',
              ]">{{ index + 1 }}.{{ childIdx + 1 }}</span>
              <span class="line-clamp-2 leading-relaxed">{{
                cleanText(child.text)
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>
