<script setup lang="ts">
import AppIcon from "~/components/ui/icon/AppIcon.vue";
import type { NavigationItem } from "~/types/settings";

const props = defineProps<{
    navList: NavigationItem[];
    draggedIndex: number | null;
    dragOverIndex: number | null;
}>();

const emit = defineEmits<{
    (e: "addNavItem"): void;
    (e: "removeNavItem", index: number): void;
    (e: "moveUp", index: number): void;
    (e: "moveDown", index: number): void;
    (e: "dragStart", index: number, event: DragEvent): void;
    (e: "dragOver", index: number, event: DragEvent): void;
    (e: "drop", index: number, event: DragEvent): void;
    (e: "dragEnd"): void;
}>();

function addSubItem(parentItem: NavigationItem) {
    if (!parentItem.children) {
        parentItem.children = [];
    }
    parentItem.children.push({
        label: { vi: "Mục con mới", en: "New Sub-item" },
        to: "/",
        isExternal: false,
    });
    parentItem.type = "dropdown";
}

function removeSubItem(parentItem: NavigationItem, childIndex: number) {
    if (parentItem.children) {
        parentItem.children.splice(childIndex, 1);
        if (parentItem.children.length === 0 && parentItem.type === "dropdown") {
            parentItem.type = "link";
        }
    }
}

function moveSubItemUp(parentItem: NavigationItem, childIndex: number) {
    if (!parentItem.children || childIndex <= 0) return;
    const list = parentItem.children;
    const prev = list[childIndex - 1];
    const curr = list[childIndex];
    if (prev && curr) {
        list[childIndex - 1] = curr;
        list[childIndex] = prev;
    }
}

function moveSubItemDown(parentItem: NavigationItem, childIndex: number) {
    if (!parentItem.children || childIndex >= parentItem.children.length - 1) return;
    const list = parentItem.children;
    const next = list[childIndex + 1];
    const curr = list[childIndex];
    if (next && curr) {
        list[childIndex + 1] = curr;
        list[childIndex] = next;
    }
}
</script>

<template>
    <div class="space-y-6 max-w-5xl">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
                <h3 class="text-sm font-bold text-text-main">
                    Danh sách Menu Điều hướng
                </h3>
                <p class="text-xs text-text-muted">
                    Kéo thả hoặc dùng mũi tên để đổi thứ tự. Hỗ trợ menu con lồng nhau (Dropdown) và vạch phân cách ngăn
                    nhóm (Divider).
                </p>
            </div>
            <button type="button"
                class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary hover:text-white transition-all cursor-pointer shadow-xs"
                @click="emit('addNavItem')">
                <AppIcon name="plus" :size="13" />
                <span>Thêm mục menu</span>
            </button>
        </div>

        <!-- Drag and Drop List Container -->
        <div class="space-y-3.5">
            <div v-for="(item, index) in navList" :key="item.id" draggable="true" :class="[
                'group relative flex flex-col gap-3 rounded-xl border p-4 transition-all shadow-xs select-none',
                draggedIndex === index
                    ? 'opacity-40 border-dashed border-primary bg-primary/5'
                    : dragOverIndex === index
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border-main bg-bg-sec hover:border-primary/50 hover:bg-bg-alt',
            ]" @dragstart="emit('dragStart', index, $event)" @dragover="emit('dragOver', index, $event)"
                @drop="emit('drop', index, $event)" @dragend="emit('dragEnd')">
                <!-- Primary Row -->
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <!-- Drag Handle & Order Controls -->
                    <div class="flex items-center gap-2 shrink-0">
                        <div
                            class="cursor-grab active:cursor-grabbing p-1 text-text-muted hover:text-primary transition-colors">
                            <AppIcon name="grid" :size="16" />
                        </div>

                        <div class="flex flex-col gap-0.5">
                            <button type="button" :disabled="index === 0"
                                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                                @click="emit('moveUp', index)">
                                <AppIcon name="arrow-up" :size="12" />
                            </button>
                            <button type="button" :disabled="index === navList.length - 1"
                                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                                @click="emit('moveDown', index)">
                                <AppIcon name="chevron-down" :size="12" />
                            </button>
                        </div>

                        <span class="text-xs font-mono font-bold text-text-muted w-5 text-center">
                            #{{ index + 1 }}
                        </span>
                    </div>

                    <!-- Form Fields Grid -->
                    <div class="grid flex-1 gap-2.5 sm:grid-cols-12 items-center">
                        <!-- Label VI (3 cols) -->
                        <div class="sm:col-span-3">
                            <label class="flex items-center gap-1 text-[10px] font-semibold text-text-main mb-1">
                                <span class="text-primary font-bold">VI</span>
                                <span>Tên hiển thị</span>
                            </label>
                            <input v-model="item.label.vi" type="text" placeholder="Trang chủ"
                                class="w-full rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs" />
                        </div>

                        <!-- Label EN (3 cols) -->
                        <div class="sm:col-span-3">
                            <label class="flex items-center gap-1 text-[10px] font-semibold text-text-main mb-1">
                                <span class="text-indigo-500 font-bold">EN</span>
                                <span>Label</span>
                            </label>
                            <input v-model="item.label.en" type="text" placeholder="Home"
                                class="w-full rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs" />
                        </div>

                        <!-- Path URL (3 cols) -->
                        <div class="sm:col-span-3">
                            <label class="block text-[10px] font-semibold text-text-main mb-1">Đường dẫn / URL</label>
                            <input v-model="item.to" type="text" placeholder="/"
                                class="w-full rounded-md border border-border-main bg-bg-base px-2.5 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs" />
                        </div>

                        <!-- Icon Lucide with Seamless Alignment (3 cols) -->
                        <div class="sm:col-span-3">
                            <label class="block text-[10px] font-semibold text-text-main mb-1">Icon Lucide</label>
                            <div class="relative flex items-center">
                                <div
                                    class="absolute left-2 flex h-4 w-4 items-center justify-center text-primary pointer-events-none">
                                    <AppIcon :name="item.icon || 'link'" :size="13" />
                                </div>
                                <input v-model="item.icon" type="text" placeholder="home"
                                    class="w-full rounded-md border border-border-main bg-bg-base pl-7 pr-2.5 py-1.5 text-xs text-text-main placeholder:text-text-muted outline-none focus:border-primary shadow-2xs" />
                            </div>
                        </div>
                    </div>

                    <!-- Delete Button -->
                    <button type="button"
                        class="shrink-0 p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Xóa mục menu" @click="emit('removeNavItem', index)">
                        <AppIcon name="trash-2" :size="15" />
                    </button>
                </div>

                <!-- Options Sub-bar: Type Selector, Open Tab Toggle, Divider Toggle, Add Sub-item -->
                <div
                    class="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t border-border-subtle text-xs">
                    <div class="flex flex-wrap items-center gap-4">
                        <!-- Type Selector -->
                        <div class="flex items-center gap-1.5">
                            <span class="text-[11px] font-semibold text-text-muted">Loại:</span>
                            <select v-model="item.type"
                                class="rounded-md border border-border-main bg-bg-base px-2 py-1 text-[11px] font-medium text-text-main outline-none focus:border-primary">
                                <option value="link">Trang nội bộ</option>
                                <option value="category">Chuyên mục bài viết</option>
                                <option value="external">Liên kết ngoài</option>
                                <option value="dropdown">Menu con xổ xuống (Dropdown)</option>
                            </select>
                        </div>

                        <!-- External Toggle -->
                        <label
                            class="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-text-alt hover:text-text-main">
                            <input v-model="item.isExternal" type="checkbox"
                                class="h-3.5 w-3.5 rounded border-border-main text-primary focus:ring-primary cursor-pointer" />
                            <span>Mở tab mới (target="_blank")</span>
                        </label>

                        <!-- DividerAfter Toggle -->
                        <label
                            class="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-text-alt hover:text-text-main">
                            <input v-model="item.dividerAfter" type="checkbox"
                                class="h-3.5 w-3.5 rounded border-border-main text-primary focus:ring-primary cursor-pointer" />
                            <span>Vạch phân cách dưới (Divider)</span>
                        </label>
                    </div>

                    <!-- Add Sub-item Button -->
                    <button type="button"
                        class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                        @click="addSubItem(item)">
                        <AppIcon name="plus" :size="12" />
                        <span>Thêm mục con ({{ (item.children || []).length }})</span>
                    </button>
                </div>

                <!-- Nested Sub-items List (Dropdown Children with Full Reorder & External Support) -->
                <div v-if="item.children && item.children.length > 0"
                    class="ml-6 space-y-2 pt-2 border border-border-subtle border-l-4 border-l-primary pl-3.5 bg-bg-sec p-3 rounded-lg">
                    <div class="flex items-center justify-between pb-1">
                        <div
                            class="text-[10.5px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                            <AppIcon name="corner-down-right" :size="12" class="text-primary" />
                            <span>Danh sách Menu con xổ xuống (Dropdown Sub-items)</span>
                        </div>

                        <button type="button"
                            class="text-[10.5px] font-semibold text-primary hover:underline cursor-pointer"
                            @click="addSubItem(item)">
                            + Thêm mục con
                        </button>
                    </div>

                    <div v-for="(child, childIdx) in item.children" :key="childIdx"
                        class="flex items-center gap-2 bg-bg-base p-2 rounded-md border border-border-main">
                        <!-- Sub-item Reorder arrows -->
                        <div class="flex flex-col gap-0.5 shrink-0">
                            <button type="button" :disabled="childIdx === 0"
                                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                                @click="moveSubItemUp(item, childIdx)">
                                <AppIcon name="arrow-up" :size="10" />
                            </button>
                            <button type="button" :disabled="childIdx === (item.children || []).length - 1"
                                class="p-0.5 text-text-muted hover:text-primary disabled:opacity-20 cursor-pointer"
                                @click="moveSubItemDown(item, childIdx)">
                                <AppIcon name="chevron-down" :size="10" />
                            </button>
                        </div>

                        <span class="text-[10px] font-mono font-bold text-text-muted w-4">
                            #{{ childIdx + 1 }}
                        </span>

                        <!-- Child Fields Grid -->
                        <div class="grid flex-1 gap-2 sm:grid-cols-12 items-center">
                            <div class="sm:col-span-4">
                                <input v-model="child.label.vi" type="text" placeholder="Tên mục con (VI)"
                                    class="w-full rounded border border-border-main bg-bg-sec px-2 py-1 text-[11px] text-text-main outline-none focus:border-primary" />
                            </div>
                            <div class="sm:col-span-3">
                                <input v-model="child.label.en" type="text" placeholder="Sub-item Label (EN)"
                                    class="w-full rounded border border-border-main bg-bg-sec px-2 py-1 text-[11px] text-text-main outline-none focus:border-primary" />
                            </div>
                            <div class="sm:col-span-3">
                                <input v-model="child.to" type="text" placeholder="/path hoặc https://..."
                                    class="w-full rounded border border-border-main bg-bg-sec px-2 py-1 text-[11px] text-text-main outline-none focus:border-primary font-mono" />
                            </div>
                            <div class="sm:col-span-2 flex items-center">
                                <label class="flex items-center gap-1 text-[10px] text-text-alt cursor-pointer">
                                    <input v-model="child.isExternal" type="checkbox"
                                        class="h-3 w-3 rounded border-border-main text-primary focus:ring-primary cursor-pointer" />
                                    <span>Tab mới</span>
                                </label>
                            </div>
                        </div>

                        <!-- Delete Sub-item -->
                        <button type="button" class="p-1 text-rose-500 hover:bg-rose-500/10 rounded cursor-pointer"
                            title="Xóa mục con này" @click="removeSubItem(item, childIdx)">
                            <AppIcon name="x" :size="13" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
