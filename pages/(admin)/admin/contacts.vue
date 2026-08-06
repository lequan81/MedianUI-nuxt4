<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useSeoMeta } from "#imports";
import AppIcon from "~/components/ui/AppIcon.vue";

const route = useRoute();

if (import.meta.server) {
  useSeoMeta({
    title: "Hòm thư Liên hệ - Admin Median UI",
    description: "Quản lý hòm thư liên hệ từ độc giả Median UI v1.7",
  });
}

const contacts = ref([
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyena@example.com",
    subject: "Hợp tác dự án Nuxt 4",
    message: "Chào Lê Quân, mình rất ấn tượng với giao diện Median UI v1.7 trên Nuxt 4 của bạn. Bạn có nhận freelance hợp tác xây dựng hệ thống tương tự không?",
    date: "02/08/2026 09:15",
    read: false,
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "thib@example.com",
    subject: "Góp ý giao diện Median UI",
    message: "Hi Quân, trang blog cực kỳ tối ưu trải nghiệm đọc, tốc độ load với Bun rất mượt. Hy vọng bạn sẽ chia sẻ thêm bài viết về an toàn thông tin!",
    date: "01/08/2026 21:40",
    read: false,
  },
  {
    id: 3,
    name: "Phạm Hoàng C",
    email: "hoangc@example.com",
    subject: "Hỏi về Bun:sqlite connector",
    message: "Cho mình hỏi bạn dùng bun:sqlite trực tiếp trong server/utils của Nuxt 4 như thế nào vậy? Cảm ơn bạn nhiều!",
    date: "31/07/2026 14:10",
    read: true,
  },
]);

const selectedContact = ref<any>(null);

function openMessage(contact: any) {
  contact.read = true;
  selectedContact.value = contact;
}

onMounted(() => {
  const queryId = Number(route.query.id);
  if (queryId) {
    const found = contacts.value.find((c) => c.id === queryId);
    if (found) {
      openMessage(found);
      return;
    }
  }
  if (contacts.value.length > 0) {
    openMessage(contacts.value[0]);
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
          <span>Về Dashboard</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Contact Messages Grid & Detail View Căn Chỉnh Hàng Đều Nhau 100% -->
    <div class="grid gap-6 lg:grid-cols-12 items-start">
      <!-- List Column (5 cols) -->
      <div class="lg:col-span-5 space-y-3">
        <div class="flex items-center justify-between h-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">
            Danh sách tin nhắn ({{ contacts.length }})
          </h2>
        </div>

        <div
          class="rounded-xl border border-border-main bg-bg-alt/60 divide-y divide-border-subtle shadow-2xs overflow-hidden">
          <div v-for="item in contacts" :key="item.id" :class="[
            'p-4 cursor-pointer transition-all hover:bg-bg-sec/80',
            selectedContact?.id === item.id ? 'bg-primary-subtle/30 border-l-4 border-l-primary' : '',
          ]" @click="openMessage(item)">
            <div class="flex items-start justify-between gap-2 mb-1">
              <span class="text-xs font-bold text-text-main truncate">
                {{ item.name }}
              </span>
              <span v-if="!item.read"
                class="inline-flex items-center rounded bg-primary px-1.5 py-0.2 text-[10px] font-bold text-white shrink-0">
                Mới
              </span>
            </div>

            <p class="text-xs font-semibold text-primary truncate mb-0.5">
              {{ item.subject }}
            </p>
            <p class="text-[11.5px] text-text-alt line-clamp-1">
              {{ item.message }}
            </p>
            <span class="text-[10px] text-text-muted block mt-2">{{ item.date }}</span>
          </div>
        </div>
      </div>

      <!-- Detail View Column (7 cols) Căn Chuẩn Ngang Hàng Với Card Trái -->
      <div class="lg:col-span-7 space-y-3">
        <div class="flex items-center justify-between h-5">
          <h2 class="text-xs font-bold uppercase tracking-wider text-text-muted">
            Chi tiết tin nhắn
          </h2>
        </div>

        <div v-if="selectedContact"
          class="rounded-xl border border-border-main bg-bg-alt/80 p-6 space-y-4 shadow-sm backdrop-blur-md">
          <div class="flex items-center justify-between border-b border-border-subtle pb-3">
            <div>
              <h3 class="text-base font-bold text-text-main">
                {{ selectedContact.subject }}
              </h3>
              <p class="text-xs text-text-alt mt-0.5">
                Từ: <strong class="text-text-main">{{ selectedContact.name }}</strong> (&lt;{{ selectedContact.email
                }}&gt;)
              </p>
            </div>
            <span class="text-xs text-text-muted font-medium">{{ selectedContact.date }}</span>
          </div>

          <div class="text-xs leading-relaxed text-text-main/90 space-y-3 pt-2">
            <p>{{ selectedContact.message }}</p>
          </div>

          <div class="pt-4 border-t border-border-subtle flex items-center justify-between">
            <a :href="`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`"
              class="inline-flex items-center gap-2 rounded-lg border border-primary bg-primary px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-primary-hover transition-colors">
              <AppIcon name="mail" :size="14" />
              <span>Trả lời qua Email</span>
            </a>

            <button type="button" class="text-xs font-semibold text-red-500 hover:underline cursor-pointer"
              @click="contacts = contacts.filter(c => c.id !== selectedContact.id); selectedContact = null;">
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
