<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";

const props = defineProps<{
  title: string;
  url?: string;
}>();

const copied = ref(false);

function copyToClipboard() {
  const currentUrl =
    props.url || (typeof window !== "undefined" ? window.location.href : "");
  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentUrl).then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2500);
    });
  }
}

function shareOnFacebook() {
  const currentUrl = encodeURIComponent(
    props.url || (typeof window !== "undefined" ? window.location.href : ""),
  );
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
    "_blank",
  );
}

function shareOnWhatsapp() {
  const currentUrl = encodeURIComponent(
    props.url || (typeof window !== "undefined" ? window.location.href : ""),
  );
  const shareTitle = encodeURIComponent(props.title);
  window.open(
    `https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`,
    "_blank",
  );
}

function shareOnTwitter() {
  const currentUrl = encodeURIComponent(
    props.url || (typeof window !== "undefined" ? window.location.href : ""),
  );
  const shareTitle = encodeURIComponent(props.title);
  window.open(
    `https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`,
    "_blank",
  );
}
</script>

<template>
  <div class="pt-2">
    <div class="flex items-center gap-2">
      <span class="mr-1 text-xs font-medium text-text-alt">Chia sẻ:</span>

      <button
        @click="shareOnFacebook"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer"
        title="Chia sẻ trên Facebook"
      >
        <AppIcon name="external-link" :size="13" />
        <span class="hidden sm:inline">Facebook</span>
      </button>

      <button
        @click="shareOnWhatsapp"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer"
        title="Chia sẻ trên WhatsApp"
      >
        <AppIcon name="send" :size="13" />
        <span class="hidden sm:inline">WhatsApp</span>
      </button>

      <button
        @click="shareOnTwitter"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2 py-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer"
        title="Chia sẻ trên X"
      >
        <AppIcon name="share-2" :size="13" />
        <span class="hidden sm:inline">X</span>
      </button>

      <button
        @click="copyToClipboard"
        type="button"
        :class="[
          'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold transition-all cursor-pointer shadow-2xs active:scale-95 select-none',
          copied
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-bold'
            : 'border-border-main bg-bg-sec text-text-main hover:border-primary hover:text-primary'
        ]"
        :title="copied ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép đường dẫn bài viết'"
      >
        <AppIcon :name="copied ? 'check' : 'copy'" :size="13" />
        <span class="hidden sm:inline">{{ copied ? 'Đã sao chép!' : 'Copy link' }}</span>
      </button>
    </div>
  </div>
</template>
