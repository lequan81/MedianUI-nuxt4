<script setup lang="ts">
import { reactive, watch, onMounted } from "vue";
import { useSeoMeta } from "#imports";

definePageMeta({
  middleware: ["admin-auth"] as any,
});

if (import.meta.server) {
  useSeoMeta({
    title: "Quản lý Bình Luận - Admin Median UI",
    description: "Quản lý và duyệt bình luận từ độc giả trên blog cá nhân",
  });
}

const state = reactive({
  filterStatus: "all",
  comments: [] as any[],
  counts: {
    all: 0,
    pending: 0,
    flagged: 0,
    approved: 0,
  },
  isLoading: true,
});

async function fetchComments() {
  state.isLoading = true;
  try {
    const res = await $fetch<any>(`/api/admin/comments?status=${state.filterStatus}`);
    if (res && Array.isArray(res.comments)) {
      state.comments = res.comments;
    }
    if (res?.counts) {
      state.counts = res.counts;
    }
  } catch {
    // Keep list
  } finally {
    state.isLoading = false;
  }
}

onMounted(() => {
  fetchComments();
});

watch(() => state.filterStatus, () => {
  fetchComments();
});

async function approveComment(id: string) {
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: "POST", body: { action: "approve" } });
    fetchComments();
  } catch {
    // Ignore error
  }
}

async function deleteComment(id: string) {
  try {
    await $fetch(`/api/admin/comments/${id}`, { method: "POST", body: { action: "delete" } });
    state.comments = state.comments.filter((c) => c.id !== id);
    fetchComments();
  } catch {
    // Ignore error
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case "approved":
      return { label: "Đã duyệt", class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    case "flagged":
      return { label: "Bị gắn cờ", class: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    default:
      return { label: "Chờ duyệt", class: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  }
}

function getPrelineTabBadge(tabId: string, isActive: boolean) {
  if (isActive) {
    return "bg-white/20 text-white font-bold";
  }
  switch (tabId) {
    case "pending":
      return "bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold";
    case "flagged":
      return "bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold";
    case "approved":
      return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold";
    default:
      return "bg-primary/10 text-primary border border-primary/20 font-bold";
  }
}

/**
 * Decode compact hex code in mod_reason (e.g., "0x09", "0x81", "0x40")
 */
function decodeModReason(reasonHex?: string, modFlags?: number) {
  const flags = modFlags ?? (reasonHex ? parseInt(reasonHex, 16) : 0);
  if (!flags) return { label: "Nội dung an toàn", code: "0x00", type: "clean" };

  if (flags & 0x40) return { label: "Turnstile Captcha", code: "0x40", type: "turnstile" };
  if (flags & 0x80) return { label: "AI Gemini Checked", code: `0x${flags.toString(16)}`, type: "ai" };
  if (flags & 0x08) return { label: "NSFW / Đồi trụy", code: `0x${flags.toString(16)}`, type: "flagged" };
  if (flags & 0x10) return { label: "Profanity / Ngôn từ độc hại", code: `0x${flags.toString(16)}`, type: "flagged" };
  if (flags & 0x02) return { label: "Spam Link / URL", code: `0x${flags.toString(16)}`, type: "pending" };
  if (flags & 0x20 || reasonHex === "0x20") return { label: "Độc giả báo cáo", code: "0x20", type: "flagged" };
  if (flags & 0x01) return { label: "Nội dung vi phạm", code: `0x${flags.toString(16)}`, type: "flagged" };

  return { label: `Mã kiểm duyệt: 0x${flags.toString(16)}`, code: `0x${flags.toString(16)}`, type: "info" };
}
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
      <div>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-text-alt mb-1.5">
          <NuxtLink to="/admin" class="shrink-0 text-text-muted transition-colors hover:text-primary">Admin</NuxtLink>
          <span class="text-text-muted">/</span>
          <span class="font-semibold text-text-main">Quản lý bình luận</span>
        </nav>
        <h1 class="text-xl sm:text-2xl font-bold text-text-main">
          Duyệt & Quản lý bình luận
        </h1>
      </div>

      <div class="flex items-center gap-2">
        <NuxtLink to="/admin"
          class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs">
          <AppIcon name="arrow-left" :size="14" />
          <span>Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Single Container Filter Bar (Preline UI Badge Style) -->
    <div class="flex flex-wrap items-center justify-between gap-3 bg-bg-alt/80 p-1.5 rounded-xl border border-border-main shadow-2xs">
      <div class="flex items-center gap-1.5 overflow-x-auto">
        <button v-for="tab in [
          { id: 'all', label: 'Tất cả', count: state.counts.all },
          { id: 'pending', label: 'Chờ duyệt', count: state.counts.pending },
          { id: 'flagged', label: 'Bị gắn cờ', count: state.counts.flagged },
          { id: 'approved', label: 'Đã duyệt', count: state.counts.approved }
        ]" :key="tab.id" type="button"
          :class="[
            'inline-flex items-center gap-2 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer select-none',
            state.filterStatus === tab.id
              ? 'bg-primary text-white shadow-2xs font-bold'
              : 'text-text-alt hover:text-text-main hover:bg-bg-sec/60'
          ]"
          @click="state.filterStatus = tab.id">
          <span>{{ tab.label }}</span>
          <span :class="[
            'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10.5px] font-mono transition-colors',
            getPrelineTabBadge(tab.id, state.filterStatus === tab.id)
          ]">
            {{ tab.count }}
          </span>
        </button>
      </div>

      <span v-if="state.counts.pending > 0" class="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20 mr-1">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <span>{{ state.counts.pending }} bình luận cần duyệt</span>
      </span>
      <span v-else class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 mr-1">
        <span>✓ Tất cả bình luận đã được xử lý</span>
      </span>
    </div>

    <!-- Comments Moderation List with Zebra Striping (Soccer Pitch Pattern) -->
    <div class="space-y-4">
      <div v-if="state.isLoading" class="p-8 text-center text-xs text-text-muted">
        Đang tải danh sách bình luận...
      </div>

      <div v-else-if="state.comments.length === 0" class="rounded-xl border border-border-main bg-bg-alt/40 p-12 text-center space-y-2">
        <AppIcon name="message-square" :size="32" class="mx-auto text-text-muted" />
        <h3 class="text-sm font-bold text-text-main">Không có bình luận nào</h3>
        <p class="text-xs text-text-alt">Chưa có bình luận nào khớp với danh mục lọc hiện tại.</p>
      </div>

      <!-- Zebra Striped Container (xen kẽ Odd / Even màu nền như sân bóng đá) -->
      <div class="rounded-xl border border-border-main shadow-2xs overflow-hidden divide-y divide-border-subtle/80">
        <div v-for="(item, idx) in state.comments" :key="item.id"
          :class="[
            'p-5 space-y-3.5 transition-colors duration-150',
            idx % 2 === 0 ? 'bg-[#0e1424]/90 hover:bg-[#121a2e]' : 'bg-[#141b2d]/90 hover:bg-[#192238]'
          ]">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div class="flex items-center gap-3 min-w-0">
              <NuxtImg :src="item.author.avatar" :alt="item.author.name"
                class="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20 bg-bg-base" format="webp" loading="lazy" />
              <div class="min-w-0 flex-1">
                <h3 class="text-xs font-bold text-text-main flex items-center gap-2 truncate">
                  <span>{{ item.author.name }}</span>
                  <span class="text-[11px] font-normal text-text-muted">({{ item.author_email }})</span>
                </h3>
                <p class="text-[11.5px] text-text-muted truncate max-w-md">
                  Bài viết: <NuxtLink :to="`/blog/${item.post_slug}`" target="_blank" class="font-semibold text-text-main hover:text-primary hover:underline">{{ item.post_slug }}</NuxtLink>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <!-- Compact Hex Code Audit Badge -->
              <span :title="decodeModReason(item.mod_reason, item.mod_flags).label"
                class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10.5px] font-mono font-semibold bg-bg-base/80 text-text-alt border border-border-subtle">
                <span class="text-primary font-bold">{{ item.mod_reason || decodeModReason(item.mod_reason, item.mod_flags).code }}</span>
                <span class="text-text-muted">({{ decodeModReason(item.mod_reason, item.mod_flags).label }})</span>
              </span>

              <span :class="['inline-flex items-center rounded-md px-2.5 py-0.5 text-[10.5px] font-bold border', getStatusBadge(item.status).class]">
                {{ getStatusBadge(item.status).label }}
              </span>
              <span class="text-[11px] text-text-muted">{{ item.date || item.created_at }}</span>
            </div>
          </div>

          <!-- Nội dung bình luận -->
          <div class="rounded-lg bg-bg-base/80 p-3.5 text-xs text-text-main border border-border-subtle/80 leading-relaxed shadow-2xs">
            "{{ item.content }}"
          </div>

          <!-- Quản lý Hành động -->
          <div class="flex items-center justify-end gap-2 pt-1">
            <button v-if="item.status !== 'approved'" type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
              @click="approveComment(item.id)">
              <AppIcon name="check" :size="13" />
              <span>Duyệt bình luận này</span>
            </button>

            <button type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
              @click="deleteComment(item.id)">
              <AppIcon name="x" :size="13" />
              <span>Xóa</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
