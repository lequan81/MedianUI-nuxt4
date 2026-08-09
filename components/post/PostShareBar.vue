<script setup lang="ts">
import { ref } from "vue";
import AppIcon from "~/components/ui/icon/AppIcon.vue";

const props = defineProps<{
  title: string;
  url?: string;
}>();

const copied = ref(false);

function copyToClipboard() {
  const currentUrl =
    props.url || (import.meta.client ? window.location.href : "");

  if (navigator.clipboard) {
    navigator.clipboard.writeText(currentUrl).then(() => {
      copied.value = true;
      setTimeout(() => {
        copied.value = false;
      }, 2000);
    });
  }
}

function shareOnFacebook() {
  const currentUrl = encodeURIComponent(
    props.url || (import.meta.client ? window.location.href : "")
  );
  if (import.meta.client) {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
      "_blank"
    );
  }
}

function shareOnWhatsapp() {
  const currentUrl = encodeURIComponent(
    props.url || (import.meta.client ? window.location.href : "")
  );
  const shareTitle = encodeURIComponent(props.title);
  if (import.meta.client) {
    window.open(
      `https://api.whatsapp.com/send?text=${shareTitle}%20${currentUrl}`,
      "_blank"
    );
  }
}

function shareOnTwitter() {
  const currentUrl = encodeURIComponent(
    props.url || (import.meta.client ? window.location.href : "")
  );
  const shareTitle = encodeURIComponent(props.title);
  if (import.meta.client) {
    window.open(
      `https://twitter.com/intent/tweet?text=${shareTitle}&url=${currentUrl}`,
      "_blank"
    );
  }
}
</script>

<template>
  <div class="pt-2 w-full">
    <div class="flex items-center justify-between gap-2 w-full">
      <div class="flex items-center gap-2">
        <span class="mr-1 text-xs font-medium text-text-alt">Chia sẻ:</span>

        <button @click="shareOnFacebook" type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-2.5 py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer shadow-2xs"
          title="Chia sẻ trên Facebook">
          <AppIcon name="external-link" :size="13" />
          <span class="hidden sm:inline">Facebook</span>
        </button>

        <button @click="shareOnWhatsapp" type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-2.5 py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer shadow-2xs"
          title="Chia sẻ trên WhatsApp">
          <AppIcon name="send" :size="13" />
          <span class="hidden sm:inline">WhatsApp</span>
        </button>

        <button @click="shareOnTwitter" type="button"
          class="inline-flex items-center gap-1.5 rounded-lg border border-border-main bg-bg-sec px-2.5 py-1.5 text-xs font-medium text-text-main transition-all hover:border-primary hover:text-primary active:scale-95 select-none cursor-pointer shadow-2xs"
          title="Chia sẻ trên X">
          <AppIcon name="share-2" :size="13" />
          <span class="hidden sm:inline">X</span>
        </button>
      </div>

      <!-- GitHub-Style Copy Link Button (Pushed to far right) -->
      <button @click="copyToClipboard" type="button" :class="[
        'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-2xs active:scale-95 select-none ml-auto group',
        copied
          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-500 font-bold ring-1 ring-emerald-500/30'
          : 'border-border-main bg-bg-sec text-text-main hover:border-primary/50 hover:bg-bg-subtle hover:text-primary'
      ]" :title="copied ? 'Đã sao chép vào bộ nhớ tạm' : 'Sao chép đường dẫn bài viết'">
        <AppIcon :name="copied ? 'check' : 'copy'" :size="13" :class="[
          'transition-transform duration-200',
          copied ? 'text-emerald-500 scale-110' : 'text-text-alt group-hover:text-primary'
        ]" />
        <span>{{ copied ? 'Đã sao chép' : 'Copy link' }}</span>
      </button>
    </div>
  </div>
</template>
