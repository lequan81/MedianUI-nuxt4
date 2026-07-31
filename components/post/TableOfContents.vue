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
const activeId = ref("");
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

let observer: IntersectionObserver | null = null;

function setInitialActiveId() {
  activeId.value = flatLinks.value[0]?.id || "";
}

function setupObserver() {
  observer?.disconnect();
  observer = null;

  if (!flatLinks.value.length || typeof window === "undefined") {
    setInitialActiveId();
    return;
  }

  const headings = flatLinks.value
    .map((link) => document.getElementById(link.id))
    .filter((heading): heading is HTMLElement => Boolean(heading));

  if (!headings.length) {
    setInitialActiveId();
    return;
  }

  const firstHeading = headings[0];
  if (!firstHeading) {
    setInitialActiveId();
    return;
  }

  const headingIds = new Set(headings.map((heading) => heading.id));
  activeId.value =
    activeId.value && headingIds.has(activeId.value)
      ? activeId.value
      : firstHeading.id;

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible[0]) {
        activeId.value = visible[0].target.id;
      }
    },
    {
      rootMargin: "-18% 0px -62% 0px",
      threshold: 0.05,
    },
  );

  for (const heading of headings) observer.observe(heading);
}

watch(flatLinks, setupObserver, { immediate: true });

onMounted(setupObserver);

onBeforeUnmount(() => {
  observer?.disconnect();
});

function toggleToc() {
  isOpen.value = !isOpen.value;
}

function closeToc() {
  isOpen.value = false;
}

function isItemActive(item: TocItem) {
  return (
    item.id === activeId.value ||
    Boolean(item.children?.some((child) => child.id === activeId.value))
  );
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
  <div v-if="props.links && props.links.length" class="relative">
    <button
      type="button"
      class="fixed right-0 top-45 z-50 inline-flex h-12 w-11 cursor-pointer items-center justify-center rounded-l-full border border-r-0 border-border-main bg-bg-base text-text-main shadow-lg transition-colors hover:border-primary hover:text-primary xl:right-[calc(var(--sidebar-width)+8px)]"
      title="Mục lục"
      aria-label="Toggle table of contents"
      @click="toggleToc"
    >
      <svg
        class="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
        />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px] xl:hidden"
      @click="closeToc"
    ></div>

    <aside
      class="fixed right-0 top-0 z-50 h-full w-72 translate-x-full border-l border-border-main bg-bg-base shadow-2xl transition-transform duration-300 ease-out xl:w-80"
      :class="isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full'"
    >
      <div
        class="flex items-center justify-between border-b border-border-main px-4 py-4 xl:rounded-t-xl"
      >
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-text-alt"
          >
            Table of Contents
          </p>
          <p class="mt-1 text-sm text-text-main">Jump to a section</p>
        </div>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-main text-text-alt transition-colors hover:border-primary hover:text-primary xl:hidden"
          aria-label="Close table of contents"
          @click="closeToc"
        >
          <svg
            class="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div
        class="max-h-[calc(100vh-var(--header-height)-2rem)] overflow-y-auto p-3"
      >
        <nav
          class="rounded-xl border border-border-main bg-bg-sec/70 p-3 shadow-sm xl:border-0 xl:bg-transparent xl:p-0 xl:shadow-none"
        >
          <ol class="space-y-1 text-sm">
            <li v-for="(link, index) in props.links" :key="link.id">
              <button
                type="button"
                :class="[
                  'flex w-full items-start gap-3 rounded-lg border-l-2 px-3 py-2 text-left transition-colors',
                  isItemActive(link)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent text-text-main hover:border-primary/40 hover:bg-bg-base/70 hover:text-primary',
                ]"
                @click="scrollToHeading(link.id)"
              >
                <span
                  class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[11px] font-semibold text-text-alt"
                >
                  {{ String(index + 1).padStart(2, "0") }}
                </span>
                <span class="min-w-0 flex-1">
                  <span class="block text-sm font-medium leading-6">{{
                    link.text
                  }}</span>
                </span>
              </button>

              <ol v-if="link.children?.length" class="mt-1 space-y-1 pl-4">
                <li v-for="child in link.children" :key="child.id">
                  <button
                    type="button"
                    :class="[
                      'flex w-full items-start gap-3 rounded-lg border-l-2 px-3 py-2 text-left transition-colors',
                      isItemActive(child)
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-transparent text-text-main/85 hover:border-primary/40 hover:bg-bg-base/70 hover:text-primary',
                    ]"
                    @click="scrollToHeading(child.id)"
                  >
                    <span
                      class="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center text-[11px] font-semibold text-text-alt"
                    >
                      •
                    </span>
                    <span class="min-w-0 flex-1 text-sm leading-6">{{
                      child.text
                    }}</span>
                  </button>
                </li>
              </ol>
            </li>
          </ol>
        </nav>
      </div>
    </aside>
  </div>
</template>
