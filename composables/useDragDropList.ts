import { ref, computed, type Ref } from "vue";

export interface SortableItem {
  order?: number;
  [key: string]: any;
}

/**
 * Lightweight Zero-Dependency Native HTML5 Drag and Drop List Reordering Composable.
 * 0 KB bundle overhead, 100% native browser Drag & Drop API.
 */
export function useDragDropList<T extends SortableItem>(itemsRef: Ref<T[]>) {
  const draggedIndex = ref<number | null>(null);
  const dragOverIndex = ref<number | null>(null);

  const isDragging = computed(() => draggedIndex.value !== null);

  function onDragStart(index: number, event: DragEvent) {
    draggedIndex.value = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", String(index));
    }
  }

  function onDragOver(index: number, event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = "move";
    }
    if (dragOverIndex.value !== index) {
      dragOverIndex.value = index;
    }
  }

  function moveItem(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0 || fromIndex >= itemsRef.value.length || toIndex >= itemsRef.value.length) {
      return;
    }

    const updated = [...itemsRef.value];
    const [moved] = updated.splice(fromIndex, 1);
    if (moved) {
      updated.splice(toIndex, 0, moved);
    }

    // Re-assign order indices
    itemsRef.value = updated.map((item, idx) => ({
      ...item,
      order: idx,
    }));
  }

  function onDrop(targetIndex: number, event: DragEvent) {
    event.preventDefault();
    if (draggedIndex.value !== null) {
      moveItem(draggedIndex.value, targetIndex);
    }
    onDragEnd();
  }

  function onDragEnd() {
    draggedIndex.value = null;
    dragOverIndex.value = null;
  }

  function moveUp(index: number) {
    if (index > 0) {
      moveItem(index, index - 1);
    }
  }

  function moveDown(index: number) {
    if (index < itemsRef.value.length - 1) {
      moveItem(index, index + 1);
    }
  }

  return {
    draggedIndex,
    dragOverIndex,
    isDragging,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd,
    moveItem,
    moveUp,
    moveDown,
  };
}
