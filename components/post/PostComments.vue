<script setup lang="ts">
import { ref, computed } from "vue";
import AppIcon from "~/components/ui/AppIcon.vue";
import WidgetTitle from "~/components/ui/WidgetTitle.vue";

interface CommentItem {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAuthor?: boolean;
  };
  date: string;
  content: string;
  likes: number;
  isAuthorLiked?: boolean;
  replyToAuthor?: string;
  replies?: CommentItem[];
}

const authorAvatar =
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png";

const isExpanded = ref(false);
const newCommentText = ref("");
const activeReplyId = ref<string | null>(null);
const replyTargetAuthor = ref<string | undefined>(undefined);
const replyText = ref("");
const likedCommentIds = ref<Set<string>>(new Set());
const visibleCount = ref(2);

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
      },
      {
        id: "c1-2",
        author: {
          name: "nhn__ii",
          avatar:
            "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
        },
        date: "3h",
        replyToAuthor: "_plm666_",
        content:
          "Hơi yếu r, dụ tí nữa là giục hộp cơm luôn.",
        likes: 13,
      },
    ],
  },
  {
    id: "c2",
    author: {
      name: "Hoàng Nguyễn",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80",
    },
    date: "16h",
    content:
      "Bài viết cực kỳ hữu ích! Mình vừa cài thử Windows Sandbox sau khi đọc bài này.",
    likes: 8,
  },
  {
    id: "c3",
    author: {
      name: "Phạm Việt Anh",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    },
    date: "17h",
    content:
      "Giờ hacker hoành hành ghê thật, làm freelancer nhận project private cũng phải hết sức cẩn thận.",
    likes: 3,
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
  if (likedCommentIds.value.has(item.id)) {
    likedCommentIds.value.delete(item.id);
    item.likes = Math.max(0, item.likes - 1);
  } else {
    likedCommentIds.value.add(item.id);
    item.likes++;
  }
}
</script>

<template>
  <section class="mt-8 space-y-5">
    <!-- Collapsed State: Join Discussion Button -->
    <div v-if="!isExpanded" class="text-center pt-2">
      <button
        type="button"
        class="inline-flex items-center justify-center gap-2 rounded-xl border border-border-main/80 bg-transparent px-6 py-2.5 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
        @click="isExpanded = true"
      >
        <span>Join the discussion ({{ commentsList.length }})</span>
      </button>
    </div>

    <!-- Expanded Comments Section -->
    <div v-else class="space-y-5">
      <!-- Header Title styled like Related Posts -->
      <div class="flex items-center justify-between">
        <WidgetTitle title="BÌNH LUẬN & THẢO LUẬN" class="mb-0" />
        <button
          type="button"
          class="text-xs font-medium text-text-alt transition-colors hover:text-primary cursor-pointer"
          @click="isExpanded = false"
        >
          Thu gọn
        </button>
      </div>

      <!-- Main Container Card like Related Posts -->
      <div class="rounded-xl border border-border-main/70 bg-bg-sec/40 p-4 sm:p-6 space-y-6">
        <!-- Add New Comment Box -->
        <div class="flex items-start gap-3.5">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="Avatar"
            class="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-border-main shadow-2xs"
          />
          <div class="flex-1 space-y-2.5">
            <textarea
              v-model="newCommentText"
              rows="3"
              placeholder="Viết bình luận của bạn..."
              class="w-full rounded-xl border border-border-main bg-bg-base p-3.5 text-sm text-text-main placeholder-text-alt/60 transition-colors focus:border-primary focus:outline-none leading-relaxed"
            ></textarea>
            <div class="flex justify-end">
              <button
                type="button"
                class="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
                @click="handleAddComment"
              >
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>

        <!-- Threads App Style Comments List -->
        <div class="space-y-7 pt-2">
          <div
            v-for="comment in visibleComments"
            :key="comment.id"
            class="relative space-y-4"
          >
            <!-- Main Comment Item -->
            <div class="relative flex items-start gap-3.5">
              <img
                :src="comment.author.avatar"
                :alt="comment.author.name"
                class="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border-main shadow-2xs relative z-10 bg-bg-base"
              />

              <div class="min-w-0 flex-1 space-y-1.5">
                <div class="flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-sm font-semibold text-text-main truncate">
                      {{ comment.author.name }}
                    </span>
                    <span
                      v-if="comment.author.isAuthor"
                      class="shrink-0 rounded bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
                    >
                      Author
                    </span>
                    <span class="shrink-0 text-xs text-text-alt/70">{{ comment.date }}</span>
                  </div>

                  <!-- Threads App Top-Right Author Heart Liked Badge (Matching Sample Image 2) -->
                  <div
                    v-if="comment.isAuthorLiked"
                    class="relative inline-flex items-center shrink-0 cursor-help"
                    title="Đã được tác giả bài viết thả tim"
                  >
                    <img :src="authorAvatar" alt="Tác giả" class="h-5 w-5 rounded-full object-cover ring-1 ring-border-main" />
                    <span class="absolute -top-1 -left-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white shadow-2xs">
                      <AppIcon name="heart" :size="7" class="fill-white text-white" />
                    </span>
                  </div>
                </div>

                <p class="text-sm leading-relaxed text-text-main/90">
                  <span v-if="comment.replyToAuthor" class="font-semibold text-primary mr-1">
                    @{{ comment.replyToAuthor }}
                  </span>
                  <span>{{ comment.content }}</span>
                </p>

                <!-- Threads Action Bar: Heart & Comment Bubble -->
                <div class="flex items-center gap-5 pt-1.5 text-xs text-text-alt">
                  <!-- Heart Like Button -->
                  <button
                    type="button"
                    :class="[
                      'inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
                      likedCommentIds.has(comment.id) ? 'text-red-500 font-bold' : 'hover:text-red-500',
                    ]"
                    @click="toggleLike(comment)"
                  >
                    <AppIcon
                      name="heart"
                      :size="17"
                      :class="likedCommentIds.has(comment.id) ? 'text-red-500 fill-red-500' : ''"
                    />
                    <span>{{ comment.likes }}</span>
                  </button>

                  <!-- Reply Comment Bubble Button -->
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary cursor-pointer"
                    @click="openReplyForm(comment.id, comment.author.name)"
                  >
                    <AppIcon name="message-circle" :size="17" />
                    <span v-if="comment.replies?.length">{{ comment.replies.length }}</span>
                  </button>
                </div>

                <!-- Inline Reply Input Form for Main Comment -->
                <div
                  v-if="activeReplyId === comment.id"
                  class="mt-3.5 flex items-start gap-3 rounded-xl border border-border-main/80 bg-bg-base p-3 shadow-xs"
                >
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                    alt="Avatar"
                    class="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border-main"
                  />
                  <div class="flex-1 space-y-2">
                    <div v-if="replyTargetAuthor" class="text-xs text-text-alt flex items-center gap-1">
                      <span>Phản hồi đến</span>
                      <span class="font-semibold text-primary">@{{ replyTargetAuthor }}</span>
                    </div>
                    <textarea
                      v-model="replyText"
                      rows="2"
                      placeholder="Viết câu trả lời..."
                      class="w-full rounded-lg border border-border-main bg-bg-sec p-2.5 text-xs text-text-main placeholder-text-alt/60 transition-colors focus:border-primary focus:outline-none leading-relaxed"
                    ></textarea>
                    <div class="flex justify-end gap-2">
                      <button
                        type="button"
                        class="rounded-md border border-border-main px-3 py-1 text-xs font-medium text-text-alt transition-colors hover:text-text-main cursor-pointer"
                        @click="activeReplyId = null"
                      >
                        Hủy
                      </button>
                      <button
                        type="button"
                        class="rounded-md bg-primary px-3.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
                        @click="submitReply(comment)"
                      >
                        Gửi phản hồi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Threads App Style Indented Tree Container (Matching Sample Image 2 100%) -->
            <div
              v-if="comment.replies?.length"
              class="relative ml-4.5 pl-9 space-y-5 pt-1"
            >
              <!-- Continuous Vertical Thread Line aligned 100% with parent avatar center (18px from left) -->
              <div class="absolute left-0 top-0 bottom-6 w-[2px] bg-border-main/60"></div>

              <div
                v-for="reply in comment.replies"
                :key="reply.id"
                class="relative space-y-3"
              >
                <!-- Pixel-Perfect Curved L-branch line connecting vertical line directly into child avatar center -->
                <div class="absolute -left-9 top-0 h-[20px] w-[20px] rounded-bl-xl border-b-2 border-l-2 border-border-main/60 pointer-events-none"></div>

                <div class="flex items-start gap-3">
                  <img
                    :src="reply.author.avatar"
                    :alt="reply.author.name"
                    class="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-border-main relative z-10 bg-bg-base"
                  />

                  <div class="min-w-0 flex-1 space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 min-w-0">
                        <span class="text-sm font-semibold text-text-main truncate">
                          {{ reply.author.name }}
                        </span>
                        <span
                          v-if="reply.author.isAuthor"
                          class="shrink-0 rounded bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
                        >
                          Author
                        </span>
                        <span class="shrink-0 text-xs text-text-alt/70">{{ reply.date }}</span>
                      </div>

                      <!-- Threads App Top-Right Author Heart Liked Badge -->
                      <div
                        v-if="reply.isAuthorLiked"
                        class="relative inline-flex items-center shrink-0 cursor-help"
                        title="Đã được tác giả bài viết thả tim"
                      >
                        <img :src="authorAvatar" alt="Tác giả" class="h-5 w-5 rounded-full object-cover ring-1 ring-border-main" />
                        <span class="absolute -top-1 -left-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white shadow-2xs">
                          <AppIcon name="heart" :size="7" class="fill-white text-white" />
                        </span>
                      </div>
                    </div>

                    <p class="text-sm leading-relaxed text-text-main/90">
                      <span v-if="reply.replyToAuthor" class="font-semibold text-primary mr-1">
                        @{{ reply.replyToAuthor }}
                      </span>
                      <span>{{ reply.content }}</span>
                    </p>

                    <!-- Threads Action Bar: Heart & Comment Bubble -->
                    <div class="flex items-center gap-5 pt-1.5 text-xs text-text-alt">
                      <button
                        type="button"
                        :class="[
                          'inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
                          likedCommentIds.has(reply.id) ? 'text-red-500 font-bold' : 'hover:text-red-500',
                        ]"
                        @click="toggleLike(reply)"
                      >
                        <AppIcon
                          name="heart"
                          :size="16"
                          :class="likedCommentIds.has(reply.id) ? 'text-red-500 fill-red-500' : ''"
                        />
                        <span>{{ reply.likes }}</span>
                      </button>

                      <button
                        type="button"
                        class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary cursor-pointer"
                        @click="openReplyForm(reply.id, reply.author.name)"
                      >
                        <AppIcon name="message-circle" :size="16" />
                        <span v-if="reply.replies?.length">{{ reply.replies.length }}</span>
                      </button>
                    </div>

                    <!-- Inline Reply Input Form for Nested Reply -->
                    <div
                      v-if="activeReplyId === reply.id"
                      class="mt-3.5 flex items-start gap-3 rounded-xl border border-border-main/80 bg-bg-base p-3 shadow-xs"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
                        alt="Avatar"
                        class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border-main"
                      />
                      <div class="flex-1 space-y-2">
                        <div v-if="replyTargetAuthor" class="text-xs text-text-alt flex items-center gap-1">
                          <span>Phản hồi đến</span>
                          <span class="font-semibold text-primary">@{{ replyTargetAuthor }}</span>
                        </div>
                        <textarea
                          v-model="replyText"
                          rows="2"
                          placeholder="Viết câu trả lời..."
                          class="w-full rounded-lg border border-border-main bg-bg-sec p-2.5 text-xs text-text-main placeholder-text-alt/60 transition-colors focus:border-primary focus:outline-none leading-relaxed"
                        ></textarea>
                        <div class="flex justify-end gap-2">
                          <button
                            type="button"
                            class="rounded-md border border-border-main px-3 py-1 text-xs font-medium text-text-alt transition-colors hover:text-text-main cursor-pointer"
                            @click="activeReplyId = null"
                          >
                            Hủy
                          </button>
                          <button
                            type="button"
                            class="rounded-md bg-primary px-3.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
                            @click="submitReply(reply)"
                          >
                            Gửi phản hồi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sub-nested Replies List (Level 2 Indented Threads under reply) -->
                <div
                  v-if="reply.replies?.length"
                  class="relative ml-4 pl-7 space-y-3 pt-2"
                >
                  <!-- Vertical Line for Level 2 -->
                  <div class="absolute left-0 top-0 bottom-4 w-[2px] bg-border-main/50"></div>

                  <div
                    v-for="subReply in reply.replies"
                    :key="subReply.id"
                    class="relative flex items-start gap-3"
                  >
                    <!-- Curved L-branch line for Level 2 -->
                    <div class="absolute -left-7 top-0 h-[18px] w-[18px] rounded-bl-xl border-b-2 border-l-2 border-border-main/50 pointer-events-none"></div>

                    <img
                      :src="subReply.author.avatar"
                      :alt="subReply.author.name"
                      class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border-main relative z-10 bg-bg-base"
                    />

                    <div class="min-w-0 flex-1 space-y-1">
                      <div class="flex items-center justify-between gap-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="text-sm font-semibold text-text-main truncate">
                            {{ subReply.author.name }}
                          </span>
                          <span
                            v-if="subReply.author.isAuthor"
                            class="shrink-0 rounded bg-primary/15 text-primary border border-primary/20 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
                          >
                            Author
                          </span>
                          <span class="shrink-0 text-xs text-text-alt/70">{{ subReply.date }}</span>
                        </div>

                        <!-- Threads App Top-Right Author Heart Liked Badge -->
                        <div
                          v-if="subReply.isAuthorLiked"
                          class="relative inline-flex items-center shrink-0 cursor-help"
                          title="Đã được tác giả bài viết thả tim"
                        >
                          <img :src="authorAvatar" alt="Tác giả" class="h-5 w-5 rounded-full object-cover ring-1 ring-border-main" />
                          <span class="absolute -top-1 -left-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-white shadow-2xs">
                            <AppIcon name="heart" :size="7" class="fill-white text-white" />
                          </span>
                        </div>
                      </div>

                      <p class="text-sm leading-relaxed text-text-main/90">
                        <span v-if="subReply.replyToAuthor" class="font-semibold text-primary mr-1">
                          @{{ subReply.replyToAuthor }}
                        </span>
                        <span>{{ subReply.content }}</span>
                      </p>

                      <div class="flex items-center gap-5 pt-1 text-xs text-text-alt">
                        <button
                          type="button"
                          :class="[
                            'inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
                            likedCommentIds.has(subReply.id) ? 'text-red-500 font-bold' : 'hover:text-red-500',
                          ]"
                          @click="toggleLike(subReply)"
                        >
                          <AppIcon
                            name="heart"
                            :size="15"
                            :class="likedCommentIds.has(subReply.id) ? 'text-red-500 fill-red-500' : ''"
                          />
                          <span>{{ subReply.likes }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button if comments > 2 -->
        <div v-if="hasMoreComments" class="text-center pt-2">
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl border border-border-main bg-bg-base/80 px-5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary cursor-pointer shadow-2xs"
            @click="loadMoreComments"
          >
            <span>Xem thêm bình luận ({{ commentsList.length - visibleCount }})</span>
            <AppIcon name="chevron-down" :size="14" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
