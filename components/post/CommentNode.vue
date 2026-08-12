<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import type { CommentItem } from "~/types/comment";

defineOptions({
  name: "CommentNode",
});


const props = withDefaults(
  defineProps<{
    node: CommentItem;
    depth?: number;
    activeReplyId: string | null;
    replyTargetAuthor?: string;
    replyText: string;
    likedCommentIds: Set<string>;
    reportedCommentIds?: Set<string>;
  }>(),
  {
    depth: 0,
    replyTargetAuthor: undefined,
  },
);

const emit = defineEmits<{
  (event: "like", item: CommentItem): void;
  (event: "report", id: string): void;
  (event: "open-reply", id: string, targetAuthorName?: string): void;
  (event: "submit-reply", item: CommentItem): void;
  (event: "update:replyText", value: string): void;
  (event: "cancel-reply"): void;
}>();

const isNested = props.depth > 0;

function isLiked(id: string) {
  return props.likedCommentIds.has(id);
}

function isReported(id: string) {
  return Boolean(props.reportedCommentIds?.has(id));
}
</script>

<template>
  <div
    :class="
      isNested
        ? 'relative pl-8 border-l-2 border-border-subtle space-y-4 pt-1'
        : 'space-y-4'
    "
  >
    <div
      v-if="isNested"
      class="absolute left-0 top-0 bottom-6 w-px bg-border-subtle"
    ></div>

    <div class="relative flex items-start gap-3.5">
      <NuxtImg
        :src="node.author?.avatar || node.author_avatar"
        :alt="node.author?.name || node.author_name || 'Avatar'"
        class="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-border-main shadow-2xs relative z-10 bg-bg-base"
        format="webp"
        loading="lazy"
      />

      <div class="min-w-0 flex-1 space-y-1.5">
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center gap-2 min-w-0">
            <span class="text-sm font-semibold text-text-main truncate">{{
              node.author?.name || node.author_name
            }}</span>
            <span
              v-if="node.author?.isAuthor"
              class="shrink-0 rounded bg-primary-subtle text-primary border border-primary-subtle px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide"
            >
              Author
            </span>
            <span class="shrink-0 text-xs text-text-muted">{{
              node.date || node.created_at
            }}</span>
          </div>

          <div v-if="node.isAuthorLiked" class="relative shrink-0 h-8 w-7">
            <AppIcon
              name="mdi:heart"
              :size="14"
              class="absolute left-1 top-0 text-red-500"
            />
            <NuxtImg
              :src="node.author?.avatar || node.author_avatar"
              alt="Tác giả"
              class="absolute bottom-0 right-0 h-5 w-5 rounded-full object-cover ring-1 ring-border-main ring-offset-2 ring-offset-bg-base"
              format="webp"
              loading="lazy"
            />
          </div>
        </div>

        <p class="text-sm leading-relaxed text-text-main">
          <span
            v-if="node.replyToAuthor"
            class="font-semibold text-primary mr-1"
            >@{{ node.replyToAuthor }}</span
          >
          <span>{{ node.content }}</span>
        </p>

        <div class="flex items-center gap-5 pt-1.5 text-xs text-text-alt">
          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
              isLiked(node.id)
                ? 'text-red-500 font-bold'
                : 'hover:text-red-500',
            ]"
            @click="emit('like', node)"
          >
            <AppIcon
              :name="isLiked(node.id) ? 'mdi:heart' : 'heart'"
              :size="17"
              :class="isLiked(node.id) ? 'text-red-500' : ''"
            />
            <span>{{ node.likes }}</span>
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-primary cursor-pointer"
            @click="emit('open-reply', node.id, node.author?.name || node.author_name)"
          >
            <AppIcon name="message-circle" :size="17" />
            <span v-if="node.replies?.length">{{ node.replies.length }}</span>
          </button>

          <button
            type="button"
            :class="[
              'inline-flex items-center gap-1 font-medium transition-colors cursor-pointer',
              isReported(node.id) ? 'text-amber-500 font-semibold' : 'hover:text-amber-500 text-text-muted',
            ]"
            :title="isReported(node.id) ? 'Đã báo cáo bình luận này' : 'Báo cáo bình luận'"
            @click="emit('report', node.id)"
          >
            <AppIcon name="flag" :size="14" />
            <span>{{ isReported(node.id) ? 'Đã báo cáo' : 'Báo cáo' }}</span>
          </button>
        </div>

        <div
          v-if="activeReplyId === node.id"
          class="mt-3.5 flex items-start gap-3 rounded-xl border border-border-main bg-bg-base p-3 shadow-xs"
        >
          <NuxtImg
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
            alt="Avatar"
            class="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-border-main"
            format="webp"
            loading="lazy"
          />
          <div class="flex-1 space-y-2">
            <div
              v-if="replyTargetAuthor"
              class="text-xs text-text-alt flex items-center gap-1"
            >
              <span>Phản hồi đến</span>
              <span class="font-semibold text-primary"
                >@{{ replyTargetAuthor }}</span
              >
            </div>
            <textarea
              :value="replyText"
              rows="2"
              placeholder="Viết câu trả lời..."
              class="w-full rounded-lg border border-border-main bg-bg-sec p-2.5 text-xs text-text-main placeholder-text-muted transition-colors focus:border-primary focus:outline-none leading-relaxed"
              @input="
                emit(
                  'update:replyText',
                  ($event.target as HTMLTextAreaElement).value,
                )
              "
            ></textarea>
            <div class="flex justify-end gap-2">
              <button
                type="button"
                class="rounded-md border border-border-main px-3 py-1 text-xs font-medium text-text-alt transition-colors hover:text-text-main cursor-pointer"
                @click="emit('cancel-reply')"
              >
                Hủy
              </button>
              <button
                type="button"
                class="rounded-md bg-primary px-3.5 py-1 text-xs font-semibold text-white transition-colors hover:bg-primary/90 cursor-pointer shadow-2xs"
                @click="emit('submit-reply', node)"
              >
                Gửi phản hồi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="node.replies?.length"
      :class="isNested ? 'space-y-4 pt-1' : 'ml-4.5 space-y-5 pt-1'"
    >
      <CommentNode
        v-for="reply in node.replies"
        :key="reply.id"
        :node="reply"
        :depth="depth + 1"
        :active-reply-id="activeReplyId"
        :reply-target-author="replyTargetAuthor"
        :reply-text="replyText"
        :liked-comment-ids="likedCommentIds"
        :reported-comment-ids="reportedCommentIds"
        @like="(item) => emit('like', item)"
        @report="(id) => emit('report', id)"
        @open-reply="
          (id, targetAuthorName) => emit('open-reply', id, targetAuthorName)
        "
        @submit-reply="(item) => emit('submit-reply', item)"
        @update:replyText="(value) => emit('update:replyText', value)"
        @cancel-reply="() => emit('cancel-reply')"
      />
    </div>
  </div>
</template>
