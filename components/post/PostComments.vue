<script setup lang="ts">
import { ref, computed, provide, inject, type Ref } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";
import type { CommentItem } from "~/types/comment";

defineOptions({
  name: "CommentSection",
});


interface CommentContext {
  activeReplyId: Ref<string | null>;
  replyTargetAuthor: Ref<string | undefined>;
  replyText: Ref<string>;
  likedCommentIds: Ref<Set<string>>;
  reportedCommentIds: Ref<Set<string>>;
  hiddenCommentIds: Ref<Set<string>>;
  authorAvatar: string;
  toggleLike: (item: CommentItem) => void;
  openReportModal: (comment: CommentItem) => void;
  toggleHideComment: (id: string) => void;
  openReplyForm: (id: string, name?: string) => void;
  submitReply: (target: CommentItem) => void;
}

const props = defineProps<{
  comment?: CommentItem;
}>();

const authorAvatar =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png";

// State quản lý chung ở Root
const isExpanded = ref(false);
const newCommentText = ref("");
const activeReplyId = ref<string | null>(null);
const replyTargetAuthor = ref<string | undefined>(undefined);
const replyText = ref("");
const likedCommentIds = ref<Set<string>>(new Set());
const reportedCommentIds = ref<Set<string>>(new Set());
const hiddenCommentIds = ref<Set<string>>(new Set());
const visibleCount = ref(2);

// State cho Modal Báo Cáo
const reportingComment = ref<CommentItem | null>(null);
const reportReason = ref("spam");
const reportCustomText = ref("");
const shouldHideComment = ref(false);
const isReportSubmitted = ref(false);

const commentsList = ref<CommentItem[]>([
  {
    id: "c1",
    author: {
      name: "duvik.graytencist",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    },
    date: "10h",
    content:
      "Mọi người lưu ý luôn kiểm tra kỹ các file script tự động trong package.json hoặc Makefile trước khi chạy npm install / npm run dev nhé!",
    likes: 680,
    isAuthorLiked: true,
    replies: [
      {
        id: "c1-1",
        author: {
          name: "_plm666_",
          avatar: authorAvatar,
          isAuthor: true,
        },
        date: "10h",
        replyToAuthor: "duvik.graytencist",
        content:
          "Cảm ơn anh Okyo đã chia sẻ bài phân tích rất chi tiết! Thói quen chạy code Sandbox thật sự rất quan trọng.",
        likes: 98,
        replies: [
          {
            id: "c1-2",
            author: {
              name: "nhn__ii",
              avatar:
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
            },
            date: "3h",
            replyToAuthor: "_plm666_",
            content: "Hơi yếu r, dụ tí nữa là giục hộp cơm luôn.",
            likes: 13,
            isAuthorLiked: true,
          },
        ],
      },
      {
        id: "c1-3",
        author: {
          name: "Hoàng Nguyễn",
          avatar:
            "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
        },
        date: "2h",
        replyToAuthor: "duvik.graytencist",
        content:
          "Chuẩn luôn bác ơi, anh em dev giờ chạy tool private là phải mở Sandbox trước cho lành.",
        likes: 5,
      },
    ],
  },
  {
    id: "c2",
    author: {
      name: "Phạm Việt Anh",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
    date: "17h",
    content:
      "Giờ hacker hoành hành ghê thật, làm freelancer nhận project private cũng phải hết sức cẩn thận.",
    likes: 24,
    replies: [
      {
        id: "c2-1",
        author: {
          name: "Juno_okyo",
          avatar: authorAvatar,
          isAuthor: true,
        },
        date: "15h",
        replyToAuthor: "Phạm Việt Anh",
        content:
          "Đúng rồi bạn, bài viết này mình tổng hợp từ một case study có thật đăng trong J2TEAM Community đấy.",
        likes: 42,
        isAuthorLiked: true,
      },
    ],
  },
]);

const visibleComments = computed(() => {
  return commentsList.value.slice(0, visibleCount.value);
});

const hasMoreComments = computed(() => {
  return visibleCount.value < commentsList.value.length;
});

function loadMoreComments() {
  visibleCount.value += 3;
}

function handleAddComment() {
  if (!newCommentText.value.trim()) return;
  commentsList.value.unshift({
    id: `c-${Date.now()}`,
    author: {
      name: "Bạn (Guest)",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    },
    date: "Vừa xong",
    content: newCommentText.value.trim(),
    likes: 0,
  });
  newCommentText.value = "";
}

function openReplyForm(id: string, targetAuthorName?: string) {
  if (activeReplyId.value === id) {
    activeReplyId.value = null;
    replyTargetAuthor.value = undefined;
  } else {
    activeReplyId.value = id;
    replyTargetAuthor.value = targetAuthorName;
    replyText.value = "";
  }
}

function submitReply(targetComment: CommentItem) {
  if (!replyText.value.trim()) return;
  if (!targetComment.replies) {
    targetComment.replies = [];
  }
  targetComment.replies.push({
    id: `r-${Date.now()}`,
    author: {
      name: "Bạn (Guest)",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    },
    date: "Vừa xong",
    replyToAuthor: replyTargetAuthor.value,
    content: replyText.value.trim(),
    likes: 0,
  });
  replyText.value = "";
  replyTargetAuthor.value = undefined;
  activeReplyId.value = null;
}

function toggleLike(item: CommentItem) {
  const next = new Set(likedCommentIds.value);
  if (next.has(item.id)) {
    next.delete(item.id);
    item.likes = Math.max(0, (item.likes ?? 0) - 1);
  } else {
    next.add(item.id);
    item.likes = (item.likes ?? 0) + 1;
  }
  likedCommentIds.value = next;

}

function toggleHideComment(id: string) {
  const next = new Set(hiddenCommentIds.value);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  hiddenCommentIds.value = next;
}

function openReportModal(comment: CommentItem) {
  reportingComment.value = comment;
  reportReason.value = "spam";
  reportCustomText.value = "";
  shouldHideComment.value = false;
  isReportSubmitted.value = false;
}

function closeReportModal() {
  reportingComment.value = null;
}

function submitReportModal() {
  if (reportingComment.value) {
    const nextReported = new Set(reportedCommentIds.value);
    nextReported.add(reportingComment.value.id);
    reportedCommentIds.value = nextReported;

    if (shouldHideComment.value) {
      toggleHideComment(reportingComment.value.id);
    }

    isReportSubmitted.value = true;
    setTimeout(() => {
      closeReportModal();
    }, 1200);
  }
}

// Chia sẻ Context cho cây đệ quy
if (!props.comment) {
  provide("commentContext", {
    activeReplyId,
    replyTargetAuthor,
    replyText,
    likedCommentIds,
    reportedCommentIds,
    hiddenCommentIds,
    authorAvatar,
    toggleLike,
    openReportModal,
    toggleHideComment,
    openReplyForm,
    submitReply,
  });
}

const ctx = inject<CommentContext>("commentContext", {
  activeReplyId,
  replyTargetAuthor,
  replyText,
  likedCommentIds,
  reportedCommentIds,
  hiddenCommentIds,
  authorAvatar,
  toggleLike,
  openReportModal,
  toggleHideComment,
  openReplyForm,
  submitReply,
});
</script>

<template>
  <!-- ROOT SECTION (Render khi không truyền prop :comment) -->
  <section v-if="!props.comment" class="mt-8 space-y-4">
    <WidgetTitle title="Thảo Luận" />

    <!-- Collapsed State: Join Discussion Button -->
    <div v-if="!isExpanded" class="text-center pt-1">
      <button type="button"
        class="inline-flex items-center justify-center gap-2 rounded-lg border border-border-main bg-bg-subtle px-6 py-2.5 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
        @click="isExpanded = true">
        <span>Join the discussion ({{ commentsList.length }})</span>
      </button>
    </div>

    <!-- Expanded Comments Section Card -->
    <div v-else class="rounded-lg border border-border-main bg-bg-subtle p-4 sm:p-6 space-y-6">
      <div class="flex items-center justify-end">
        <button type="button"
          class="text-xs font-medium text-text-alt transition-colors hover:text-primary cursor-pointer"
          @click="isExpanded = false">
          Ẩn thảo luận
        </button>
      </div>

      <!-- Form gửi bình luận mới -->
      <div class="flex items-start gap-3">
        <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
          alt="Avatar" class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border-main shadow-2xs" />
        <div class="flex-1 space-y-2.5">
          <textarea v-model="newCommentText" rows="3" placeholder="Viết bình luận của bạn..."
            class="w-full rounded-lg border border-border-main bg-bg-base p-3.5 text-sm text-text-main placeholder-text-muted transition-colors focus:border-primary focus:outline-none leading-relaxed"></textarea>
          <div class="flex justify-end">
            <button type="button"
              class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
              @click="handleAddComment">
              Gửi bình luận
            </button>
          </div>
        </div>
      </div>

      <!-- Root Comments List: Spacing 32px giữa các nhóm thảo luận -->
      <div class="space-y-8 pt-2">
        <div v-for="item in visibleComments" :key="item.id"
          class="pb-8 border-b border-border-subtle last:border-b-0 last:pb-0">
          <CommentSection :comment="item" />
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMoreComments" class="text-center pt-2">
        <button type="button"
          class="inline-flex items-center justify-center gap-2 rounded-lg border border-border-main bg-bg-base px-5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
          @click="loadMoreComments">
          <span>Xem thêm bình luận ({{ commentsList.length - visibleCount }})</span>
          <AppIcon name="chevron-down" :size="14" />
        </button>
      </div>
    </div>

    <!-- MODAL BÁO CÁO BÌNH LUẬN -->
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
          v-if="reportingComment"
          class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm"
          @click.self="closeReportModal"
        >
          <div
            class="w-full max-w-md overflow-hidden rounded-2xl border border-border-main bg-bg-base p-6 shadow-2xl space-y-5"
          >
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-border-subtle pb-3.5">
              <div class="flex items-center gap-2">
                <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
                  <AppIcon name="flag" :size="18" />
                </div>
                <h3 class="text-sm font-bold text-text-main">Báo cáo bình luận</h3>
              </div>
              <button
                type="button"
                class="rounded-full p-1 text-text-alt transition-colors hover:bg-bg-sec hover:text-text-main cursor-pointer"
                @click="closeReportModal"
              >
                <AppIcon name="x" :size="18" />
              </button>
            </div>

            <!-- Content snippet being reported -->
            <div v-if="reportingComment" class="rounded-xl border border-border-subtle bg-bg-subtle p-3 space-y-1 text-xs">
              <div class="font-semibold text-text-main">
                {{ reportingComment.author?.name || reportingComment.author_name }}
              </div>
              <p class="line-clamp-2 text-text-muted italic">
                "{{ reportingComment.content }}"
              </p>
            </div>


            <!-- Success message -->
            <div v-if="isReportSubmitted" class="py-4 text-center space-y-2">
              <div class="inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                <AppIcon name="check" :size="24" />
              </div>
              <h4 class="text-sm font-bold text-text-main">Đã gửi báo cáo thành công!</h4>
              <p class="text-xs text-text-muted">Cảm ơn bạn đã đóng góp giữ gìn cộng đồng văn minh.</p>
            </div>

            <!-- Form Reasons -->
            <div v-else class="space-y-4">
              <label class="block text-xs font-semibold text-text-main">
                Vui lòng chọn lý do báo cáo:
              </label>

              <div class="space-y-2 text-xs">
                <label class="flex items-center gap-3 rounded-xl border border-border-subtle p-3 transition-colors cursor-pointer hover:border-primary/50" :class="reportReason === 'spam' ? 'bg-primary-subtle border-primary text-primary font-semibold' : 'bg-bg-subtle text-text-main'">
                  <input type="radio" v-model="reportReason" value="spam" class="accent-primary" />
                  <span>🚫 Spam / Quảng cáo rác</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border-subtle p-3 transition-colors cursor-pointer hover:border-primary/50" :class="reportReason === 'harassment' ? 'bg-primary-subtle border-primary text-primary font-semibold' : 'bg-bg-subtle text-text-main'">
                  <input type="radio" v-model="reportReason" value="harassment" class="accent-primary" />
                  <span>🤬 Ngôn từ xúc phạm / Thù hận</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border-subtle p-3 transition-colors cursor-pointer hover:border-primary/50" :class="reportReason === 'misinformation' ? 'bg-primary-subtle border-primary text-primary font-semibold' : 'bg-bg-subtle text-text-main'">
                  <input type="radio" v-model="reportReason" value="misinformation" class="accent-primary" />
                  <span>⚠️ Thông tin sai sự thật / Độc hại</span>
                </label>

                <label class="flex items-center gap-3 rounded-xl border border-border-subtle p-3 transition-colors cursor-pointer hover:border-primary/50" :class="reportReason === 'other' ? 'bg-primary-subtle border-primary text-primary font-semibold' : 'bg-bg-subtle text-text-main'">
                  <input type="radio" v-model="reportReason" value="other" class="accent-primary" />
                  <span>📝 Lý do khác</span>
                </label>
              </div>

              <!-- Custom text area for detail -->
              <div v-if="reportReason === 'other'" class="space-y-1.5 pt-1">
                <textarea
                  v-model="reportCustomText"
                  rows="2"
                  placeholder="Nhập chi tiết lý do..."
                  class="w-full rounded-xl border border-border-main bg-bg-sec p-3 text-xs text-text-main placeholder-text-muted focus:border-primary focus:outline-none"
                ></textarea>
              </div>

              <!-- Tùy chọn Ẩn comment -->
              <div class="pt-2 border-t border-border-subtle">
                <label class="flex items-center gap-2 text-xs text-text-main font-medium cursor-pointer">
                  <input type="checkbox" v-model="shouldHideComment" class="accent-primary h-3.5 w-3.5 rounded" />
                  <span>🙈 Ẩn bình luận này khỏi trang của tôi</span>
                </label>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  class="rounded-xl border border-border-main px-4 py-2 text-xs font-semibold text-text-muted transition-colors hover:text-text-main cursor-pointer"
                  @click="closeReportModal"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-amber-500 px-5 py-2 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-amber-600 cursor-pointer"
                  @click="submitReportModal"
                >
                  Gửi báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>

  <!-- RECURSIVE ITEM (Render khi có prop :comment) -->
  <div v-else class="space-y-3">
    <!-- Trường hợp Comment Bị Ẩn bởi User -->
    <div v-if="props.comment && ctx.hiddenCommentIds.value.has(props.comment.id)"
      class="rounded-xl border border-border-subtle bg-bg-subtle px-4 py-2.5 text-xs text-text-muted flex items-center justify-between shadow-2xs">
      <div class="flex items-center gap-2">
        <AppIcon name="eye-off" :size="15" class="text-text-alt" />
        <span>Bình luận này đã bị bạn ẩn.</span>
      </div>
      <button type="button" class="font-semibold text-primary hover:underline cursor-pointer"
        @click="ctx.toggleHideComment(props.comment.id)">
        Hiện lại
      </button>
    </div>

    <!-- Comment Item Row Container A -->
    <div v-else class="flex items-start gap-3 relative">
      <!-- Đường kẻ dọc bài gốc dùng Solid Token border-border-subtle -->
      <span v-if="props.comment.replies?.length"
        class="absolute left-3.5 top-7 bottom-0 border-l-2 border-border-subtle pointer-events-none"></span>

      <!-- Avatar nhỏ nhắn: h-7 w-7 (28px x 28px, tâm Y = 14px) -->
      <img :src="props.comment.author?.avatar || props.comment.author_avatar" :alt="props.comment.author?.name || props.comment.author_name || 'Avatar'"
        class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border-main shadow-2xs bg-bg-base relative z-10" />

      <div class="min-w-0 flex-1 space-y-1">
        <!-- Header Row -->
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-sm font-semibold text-text-main truncate">
              {{ props.comment.author?.name || props.comment.author_name }}
            </span>
            <span v-if="props.comment.author?.isAuthor"
              class="shrink-0 rounded bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5 text-[10.5px] font-semibold">
              Author
            </span>
            <span class="shrink-0 text-xs text-text-muted">• {{ props.comment.date || props.comment.created_at }}</span>
          </div>

          <!-- Author Liked Badge -->
          <div v-if="props.comment.isAuthorLiked" class="relative inline-flex items-center shrink-0"
            title="Đã được tác giả bài viết thả tim">
            <img :src="ctx.authorAvatar" alt="Tác giả"
              class="h-4.5 w-4.5 rounded-full object-cover ring-1 ring-border-main shadow-2xs" />
            <AppIcon name="ph:heart-fill" :size="9" class="absolute -bottom-0.5 -left-1 text-red-500 drop-shadow-xs" />
          </div>
        </div>

        <!-- Nội dung Comment -->
        <p class="text-sm leading-relaxed text-text-main">
          <span v-if="props.comment.replyToAuthor" class="font-semibold text-primary mr-1">
            @{{ props.comment.replyToAuthor }}
          </span>
          <span>{{ props.comment.content }}</span>
        </p>

        <!-- Action Bar: Like, Reply, Report & Hide -->
        <div class="flex items-center gap-x-4 pt-1 text-xs text-text-alt">
          <button type="button" :class="[
            'inline-flex items-center gap-x-0.5 font-medium transition-colors cursor-pointer',
            ctx.likedCommentIds.value.has(props.comment.id) ? 'text-red-500 font-bold' : 'hover:text-red-500',
          ]" @click="ctx.toggleLike(props.comment)">
            <AppIcon :name="ctx.likedCommentIds.value.has(props.comment.id) ? 'ph:heart-fill' : 'heart'" :size="15"
              :class="ctx.likedCommentIds.value.has(props.comment.id) ? 'text-red-500' : ''" />
            <span>{{ props.comment.likes ?? 0 }}</span>
          </button>

          <button type="button"
            class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary cursor-pointer"
            @click="ctx.openReplyForm(props.comment.id, props.comment.author?.name || props.comment.author_name || '')">
            <AppIcon name="message-circle" :size="15" />
            <span v-if="props.comment.replies?.length">{{ props.comment.replies.length }}</span>
          </button>


          <!-- Nút Report Comment ➔ Mở Modal chọn lý do -->
          <button type="button" :class="[
            'inline-flex items-center gap-1 font-medium transition-colors cursor-pointer',
            ctx.reportedCommentIds.value.has(props.comment.id) ? 'text-amber-500 font-semibold' : 'hover:text-amber-500 text-text-muted',
          ]" :title="ctx.reportedCommentIds.value.has(props.comment.id) ? 'Đã báo cáo bình luận này' : 'Báo cáo bình luận'"
            @click="ctx.openReportModal(props.comment)">
            <AppIcon name="flag" :size="14" />
            <span>{{ ctx.reportedCommentIds.value.has(props.comment.id) ? 'Đã báo cáo' : 'Báo cáo' }}</span>
          </button>

          <!-- Nút Ẩn Bình Luận Nhanh -->
          <button type="button"
            class="inline-flex items-center gap-1 font-medium text-text-muted transition-colors hover:text-text-main cursor-pointer"
            title="Ẩn bình luận này" @click="ctx.toggleHideComment(props.comment.id)">
            <AppIcon name="eye-off" :size="14" />
            <span>Ẩn</span>
          </button>
        </div>

        <!-- Inline Reply Form -->
        <div v-if="ctx.activeReplyId.value === props.comment.id"
          class="mt-2.5 flex items-start gap-3 rounded-lg border border-border-main bg-bg-base p-3 shadow-xs">
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="Avatar" class="h-6.5 w-6.5 shrink-0 rounded-full object-cover ring-1 ring-border-main" />
          <div class="flex-1 space-y-2">
            <div v-if="ctx.replyTargetAuthor.value" class="text-xs text-text-alt flex items-center gap-1">
              <span>Phản hồi đến</span>
              <span class="font-semibold text-primary">@{{ ctx.replyTargetAuthor.value }}</span>
            </div>
            <textarea v-model="ctx.replyText.value" rows="2" placeholder="Viết câu trả lời..."
              class="w-full rounded-lg border border-border-main bg-bg-sec p-2.5 text-xs text-text-main placeholder-text-muted transition-colors focus:border-primary focus:outline-none leading-relaxed"></textarea>
            <div class="flex justify-end gap-2">
              <button type="button"
                class="rounded-md border border-border-main px-3 py-1 text-xs font-medium text-text-alt transition-colors hover:text-text-main cursor-pointer"
                @click="ctx.activeReplyId.value = null">
                Hủy
              </button>
              <button type="button"
                class="rounded-md bg-primary px-3.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
                @click="ctx.submitReply(props.comment)">
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-Replies Container: dùng Solid Token border-border-subtle -->
    <div v-if="props.comment.replies?.length" class="ml-3.5 space-y-4 mt-2 pt-0 relative">
      <div v-for="(reply, index) in props.comment.replies" :key="reply.id" class="relative pl-5.5">
        <!-- Nét uốn L dùng border-border-subtle -->
        <span :class="[
          'absolute left-0 w-6 border-b-2 border-l-2 border-border-subtle rounded-bl-xl pointer-events-none',
          index === 0 ? '-top-3 h-6.5' : '-top-6 h-9.5',
        ]"></span>

        <!-- Vạch kẻ dọc THẲNG nối xuống comment sau dùng border-border-subtle -->
        <span v-if="index < props.comment.replies.length - 1"
          class="absolute left-0 top-0.5 bottom-0 border-l-2 border-border-subtle pointer-events-none"></span>

        <!-- Component Đệ quy -->
        <CommentSection :comment="reply" />
      </div>
    </div>
  </div>
</template>