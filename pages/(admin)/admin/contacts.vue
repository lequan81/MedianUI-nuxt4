<script setup lang="ts">
import { reactive, onMounted } from "vue";
import { useRoute, useSeoMeta } from "#imports";

definePageMeta({
  middleware: ["admin-auth"] as any,
});

const route = useRoute();

if (import.meta.server) {
  useSeoMeta({
    title: "Hòm thư Liên hệ - Admin Median UI",
    description: "Quản lý hòm thư liên hệ từ độc giả Median UI v1.7",
  });
}

const state = reactive({
  contacts: [] as any[],
  selectedContact: null as any,
  isLoading: true,
});

async function fetchContacts() {
  state.isLoading = true;
  try {
    const res = await $fetch<any>("/api/admin/contacts");
    if (res && Array.isArray(res.contacts)) {
      state.contacts = res.contacts;
    }
  } catch {
    // Keep list
  } finally {
    state.isLoading = false;
  }
}

async function selectMessage(contact: any) {
  state.selectedContact = contact;
  if (contact && contact.status === "unread") {
    contact.status = "read";
    try {
      await $fetch(`/api/admin/contacts/${contact.id}`, { method: "POST", body: { action: "read" } });
    } catch {
      // Ignore
    }
  }
}

async function deleteMessage(id: string) {
  try {
    await $fetch(`/api/admin/contacts/${id}`, { method: "POST", body: { action: "delete" } });
    state.contacts = state.contacts.filter((c) => c.id !== id);
    if (state.selectedContact?.id === id) {
      state.selectedContact = state.contacts[0] || null;
    }
  } catch {
    // Ignore
  }
}

onMounted(async () => {
  await fetchContacts();
  const queryId = String(route.query.id || "");
  if (queryId) {
    const found = state.contacts.find((c) => c.id === queryId);
    if (found) {
      selectMessage(found);
      return;
    }
  }
  if (state.contacts.length > 0) {
    state.selectedContact = state.contacts[0];
  }
});
</script>

<template>
  <div class="space-y-6">
    <!-- Admin Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-subtle pb-4">
      <div>
        <nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-text-alt mb-1.5">
          <NuxtLink to="/admin" class="shrink-0 text-text-muted transition-colors hover:text-primary">Admin</NuxtLink>
          <span class="text-text-muted">/</span>
          <span class="font-semibold text-text-main">Hòm thư liên hệ</span>
        </nav>
        <h1 class="text-xl sm:text-2xl font-bold text-text-main">
          Hòm thư liên hệ
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

    <!-- Contact Messages Grid & Detail View -->
    <div class="grid gap-6 lg:grid-cols-12 items-start">
      <!-- List Column (5 cols) -->
      <div class="lg:col-span-5 space-y-3">
        <div class="flex items-center justify-between h-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">
            Danh sách tin nhắn ({{ state.contacts.length }})
          </h2>
          <span v-if="state.contacts.filter(c => c.status === 'unread').length > 0"
            class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-400">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ state.contacts.filter(c => c.status === 'unread').length }} chưa đọc
          </span>
        </div>

        <div v-if="state.isLoading" class="p-8 text-center text-xs text-text-muted">
          Đang tải tin nhắn...
        </div>

        <div v-else-if="state.contacts.length === 0"
          class="rounded-xl border border-border-main bg-bg-alt/40 p-8 text-center text-text-muted space-y-1">
          <p class="text-xs font-medium">Chưa có tin nhắn liên hệ nào</p>
        </div>

        <!-- Zebra Striped Message List -->
        <div v-else
          class="rounded-xl border border-border-main shadow-2xs overflow-hidden divide-y divide-border-subtle/80">
          <div v-for="(item, idx) in state.contacts" :key="item.id" :class="[
            'p-4 cursor-pointer transition-all duration-150',
            idx % 2 === 0 ? 'bg-[#0e1424]/90 hover:bg-[#121a2e]' : 'bg-[#141b2d]/90 hover:bg-[#192238]',
            state.selectedContact?.id === item.id ? 'border-l-4 border-l-primary bg-primary-subtle/20' : '',
          ]" @click="selectMessage(item)">
            <div class="flex items-center justify-between gap-2 mb-1">
              <span class="text-xs font-bold text-text-main truncate">
                {{ item.name }}
              </span>
              <!-- Badge Mới Style Preline UI (Nổi bật & Tự động biến mất khi click xem) -->
              <span v-if="item.status === 'unread'"
                class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shrink-0 shadow-2xs">
                <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Mới
              </span>
            </div>

            <p class="text-xs font-semibold text-primary truncate mb-0.5">
              {{ item.subject || 'Không có tiêu đề' }}
            </p>
            <p class="text-[11.5px] text-text-alt line-clamp-1">
              {{ item.message }}
            </p>
            <span class="text-[10px] text-text-muted block mt-2">{{ item.created_at }}</span>
          </div>
        </div>
      </div>

      <!-- Detail View Column (7 cols) -->
      <div class="lg:col-span-7 space-y-3">
        <div class="flex items-center justify-between h-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">
            Chi tiết tin nhắn
          </h2>
        </div>

        <div v-if="state.selectedContact"
          class="rounded-xl border border-border-main bg-bg-alt/80 p-6 space-y-4 shadow-sm backdrop-blur-md">
          <div class="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 class="text-base font-bold text-text-main flex items-center gap-2">
                <span>{{ state.selectedContact.subject || 'Không có tiêu đề' }}</span>
                <span v-if="state.selectedContact.status === 'unread'"
                  class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Mới
                </span>
              </h3>
              <p class="text-xs text-text-alt mt-0.5">
                Từ: <strong class="text-text-main">{{ state.selectedContact.name }}</strong> (&lt;{{ state.selectedContact.email }}&gt;)
              </p>
            </div>
            <span class="text-xs text-text-muted font-medium">{{ state.selectedContact.created_at }}</span>
          </div>

          <div class="text-xs leading-relaxed text-text-main/90 space-y-3 pt-2">
            <p>{{ state.selectedContact.message }}</p>
          </div>

          <div class="pt-4 border-t border-border-subtle flex items-center justify-between">
            <a :href="`mailto:${state.selectedContact.email}?subject=Re: ${encodeURIComponent(state.selectedContact.subject || '')}`"
              class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors">
              <AppIcon name="mail" :size="14" />
              <span>Trả lời qua Email</span>
            </a>

            <button type="button" class="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
              @click="deleteMessage(state.selectedContact.id)">
              Xóa tin nhắn
            </button>
          </div>
        </div>

        <div v-else
          class="rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-12 text-center text-text-muted space-y-2">
          <AppIcon name="mail" :size="28" class="mx-auto text-text-muted" />
          <p class="text-xs font-medium">Chọn một tin nhắn ở danh sách bên trái để đọc chi tiết</p>
        </div>
      </div>
    </div>
  </div>
</template>
