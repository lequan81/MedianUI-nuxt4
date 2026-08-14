<script setup lang="ts">
import { useAutoReset } from "~/composables/useTimeout";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

const props = defineProps<{
  isOpen: boolean;
  title: string;
  url?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { state: isCopied, trigger: triggerCopied } = useAutoReset(false, false, 2000);

function getShareUrl() {
  if (props.url) return props.url;
  if (import.meta.client) return window.location.href;
  return "";
}

function handleCopy() {
  const link = getShareUrl();
  if (!link) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(link);
  } else {
    const input = document.createElement("input");
    input.value = link;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
  }

  triggerCopied(true);
}

function openShare(platform: string) {
  const currentUrl = getShareUrl();
  const shareTitle = props.title || "";
  let shareLink = "";

  switch (platform) {
    case "facebook":
      shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
      break;
    case "whatsapp":
      shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + " " + currentUrl)}`;
      break;
    case "twitter":
      shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(currentUrl)}`;
      break;
    case "telegram":
      shareLink = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareTitle)}`;
      break;
    case "pinterest":
      shareLink = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(currentUrl)}&description=${encodeURIComponent(shareTitle)}`;
      break;
    case "linkedin":
      shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
      break;
    case "line":
      shareLink = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`;
      break;
    case "email":
      shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(currentUrl)}`;
      break;
  }

  if (shareLink) {
    window.open(shareLink, "_blank", "noopener,noreferrer,width=600,height=500");
  }
}

const sharePlatforms = [
  { id: "facebook", name: "Facebook", icon: "simple-icons:facebook" },
  { id: "whatsapp", name: "WhatsApp", icon: "simple-icons:whatsapp" },
  { id: "twitter", name: "Twitter", icon: "simple-icons:x" },
  { id: "telegram", name: "Telegram", icon: "simple-icons:telegram" },
  { id: "pinterest", name: "Pinterest", icon: "simple-icons:pinterest" },
  { id: "linkedin", name: "LinkedIn", icon: "simple-icons:linkedin" },
  { id: "line", name: "Line", icon: "simple-icons:line" },
  { id: "email", name: "Email", icon: "mail" },
];
</script>

<template>
  <Teleport to="body">
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
      <!-- Fixed Modal Backdrop: z-[100] đè hoàn toàn trên MobileNav bar với lớp làm mờ đen mờ 75% -->
      <div v-if="props.isOpen"
        class="fixed inset-0 z-100 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        @click.self="emit('close')">
        <div
          class="w-full max-w-md overflow-hidden rounded-2xl border border-border-main bg-bg-base p-5 shadow-2xl sm:p-6">
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-border-subtle pb-3.5">
            <h3 class="text-sm font-bold text-text-main">
              Chia sẻ bài viết
            </h3>
            <button type="button"
              class="flex h-7 w-7 items-center justify-center rounded-full text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
              aria-label="Close modal" @click="emit('close')">
              <AppIcon name="x" :size="16" />
            </button>
          </div>

          <!-- Modal Body Grid Share Apps -->
          <div class="py-5">
            <div class="grid grid-cols-4 gap-y-4 gap-x-2">
              <button v-for="item in sharePlatforms" :key="item.id" type="button"
                class="group flex flex-col items-center justify-center text-center cursor-pointer"
                @click="openShare(item.id)">
                <div
                  class="flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle bg-bg-sec text-text-main transition-all duration-200 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md">
                  <AppIcon :name="item.icon" :size="18" />
                </div>
                <span class="mt-1.5 text-[11px] font-medium text-text-alt transition-colors group-hover:text-text-main">
                  {{ item.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Modal Copy Link Section -->
          <div class="border-t border-border-subtle pt-4">
            <p class="mb-2 text-[11px] font-medium text-text-muted uppercase tracking-wider">
              Sao chép đường dẫn
            </p>
            <div class="flex items-center gap-2 rounded-xl border border-border-main bg-bg-sec p-2">
              <AppIcon name="link" :size="15" class="shrink-0 text-text-alt ml-1" />
              <input type="text" readonly :value="getShareUrl()"
                class="min-w-0 flex-1 bg-transparent text-xs font-mono text-text-main outline-none select-all"
                @click="handleCopy" />
              <button
                type="button"
                :class="[
                  'inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 select-none group',
                  isCopied
                    ? 'border-emerald-500 bg-emerald-600 text-white font-bold ring-1 ring-emerald-500/30'
                    : 'border-primary bg-primary text-white hover:bg-primary-hover'
                ]"
                :title="isCopied ? 'Đã sao chép vào bộ nhớ tạm' : 'Sao chép đường dẫn'"
                @click="handleCopy"
              >
                <AppIcon
                  :name="isCopied ? 'check' : 'copy'"
                  :size="13"
                  :class="[
                    'transition-transform duration-200',
                    isCopied ? 'text-white scale-110' : 'text-white/90 group-hover:scale-105'
                  ]"
                />
                <span>{{ isCopied ? "Đã sao chép" : "Sao chép" }}</span>
              </button>

            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
