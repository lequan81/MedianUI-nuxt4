<script setup lang="ts">
import { ref, watch } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = defineProps<{
  isOpen: boolean;
  title: string;
  url?: string;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const isCopied = ref(false);

function getShareUrl() {
  if (props.url) return props.url;
  if (typeof window !== "undefined") return window.location.href;
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

  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 2000);
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
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="props.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
        @click.self="emit('close')"
      >
        <div
          class="w-full max-w-lg overflow-hidden rounded-xl border border-border-main bg-bg-base p-6 shadow-2xl sm:p-7"
        >
          <!-- Modal Header -->
          <div class="flex items-center justify-between border-b border-border-main/70 pb-4">
            <h3 class="text-sm font-semibold text-text-main">
              Chia sẻ với ứng dụng khác
            </h3>
            <button
              type="button"
              class="rounded-full p-1 text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
              aria-label="Close modal"
              @click="emit('close')"
            >
              <AppIcon name="x" :size="18" />
            </button>
          </div>

          <!-- Modal Body Grid -->
          <div class="py-6">
            <div class="grid grid-cols-4 gap-y-5 gap-x-3 sm:grid-cols-5">
              <button
                v-for="item in sharePlatforms"
                :key="item.id"
                type="button"
                class="group flex flex-col items-center justify-center text-center cursor-pointer"
                @click="openShare(item.id)"
              >
                <div
                  class="flex h-13 w-13 items-center justify-center rounded-full border border-border-main/60 bg-bg-sec text-text-main transition-all duration-200 group-hover:scale-105 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-md"
                >
                  <AppIcon :name="item.icon" :size="20" />
                </div>
                <span
                  class="mt-2 text-xs font-medium text-text-alt transition-colors group-hover:text-text-main"
                >
                  {{ item.name }}
                </span>
              </button>
            </div>
          </div>

          <!-- Modal Copy Link Section -->
          <div class="border-t border-border-main/70 pt-4">
            <p class="mb-2 text-xs font-medium text-text-alt">
              or copy link
            </p>
            <div
              class="flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec p-2.5"
            >
              <AppIcon name="link" :size="16" class="shrink-0 text-text-alt ml-1" />
              <input
                type="text"
                readonly
                :value="getShareUrl()"
                class="min-w-0 flex-1 bg-transparent text-xs font-mono text-text-main outline-none select-all"
                @click="handleCopy"
              />
              <button
                type="button"
                class="shrink-0 rounded-md border border-border-main bg-bg-base px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary hover:text-white"
                @click="handleCopy"
              >
                {{ isCopied ? "Đã sao chép! ✓" : "Sao chép" }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
