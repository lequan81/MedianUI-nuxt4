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
    <div class="flex flex-wrap items-center gap-2">
      <span class="mr-1 text-xs font-medium text-text-alt">Chia sẻ:</span>

      <button
        @click="shareOnFacebook"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2.5 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        title="Chia sẻ trên Facebook"
      >
        <AppIcon name="external-link" :size="12" />
        <span>Facebook</span>
      </button>

      <button
        @click="shareOnWhatsapp"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2.5 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        title="Chia sẻ trên WhatsApp"
      >
        <AppIcon name="send" :size="12" />
        <span>WhatsApp</span>
      </button>

      <button
        @click="shareOnTwitter"
        type="button"
        class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-base px-2.5 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        title="Chia sẻ trên X"
      >
        <AppIcon name="share-2" :size="12" />
        <span>X</span>
      </button>

      <button
        @click="copyToClipboard"
        type="button"
        class="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-3 py-1.5 text-xs font-medium text-text-main transition-colors hover:border-primary hover:text-primary"
        :title="copied ? 'Đã sao chép!' : 'Sao chép link'"
      >
        <AppIcon name="copy" :size="12" />
        <span>{{ copied ? "Copied" : "Copy link" }}</span>
      </button>
    </div>
  </div>
</template>
