// @vitest-environment node
import { describe, it, expect } from "vitest";
import { ref } from "vue";
import { getAllSettings, saveSettingSection, invalidateSettingsCache } from "~/server/services/settings.service";
import { useDragDropList } from "~/composables/useDragDropList";

describe("Dynamic Settings & Drag-Drop CMS Unit Tests", () => {
  it("should retrieve default settings structure cleanly", () => {
    invalidateSettingsCache();
    const settings = getAllSettings();

    expect(settings).toBeDefined();
    expect(settings.general.title.vi).toBe("Median UI v1.7");
    expect(settings.author.name).toBe("Lê Quân");
    expect(Array.isArray(settings.navigation)).toBe(true);
    expect(settings.navigation.length).toBeGreaterThan(0);
  });

  it("should persist and update a settings section in SQLite", () => {
    const updatedAnnouncement = {
      enabled: true,
      id: "ann-test-123",
      badge: { vi: "Khuyến mãi", en: "Sale" },
      text: { vi: "Nội dung kiểm thử", en: "Test Announcement" },
      link: "/test-link",
    };

    saveSettingSection("announcement", updatedAnnouncement);
    const reloaded = getAllSettings();

    expect(reloaded.announcement.id).toBe("ann-test-123");
    expect(reloaded.announcement.badge.vi).toBe("Khuyến mãi");
    expect(reloaded.announcement.text.en).toBe("Test Announcement");
  });

  it("should reorder drag-and-drop list and re-index order property properly", () => {
    const mockList = ref([
      { id: "item-0", label: "Item 0", order: 0 },
      { id: "item-1", label: "Item 1", order: 1 },
      { id: "item-2", label: "Item 2", order: 2 },
    ]);

    const { moveItem, moveUp, moveDown } = useDragDropList(mockList);

    // Move item 0 down to position 2
    moveItem(0, 2);

    expect(mockList.value[0]?.id).toBe("item-1");
    expect(mockList.value[0]?.order).toBe(0);

    expect(mockList.value[1]?.id).toBe("item-2");
    expect(mockList.value[1]?.order).toBe(1);

    expect(mockList.value[2]?.id).toBe("item-0");
    expect(mockList.value[2]?.order).toBe(2);

    // Move item 2 up to position 1
    moveUp(2);
    expect(mockList.value[1]?.id).toBe("item-0");
    expect(mockList.value[1]?.order).toBe(1);

    // Move item 0 down to position 1
    moveDown(0);
    expect(mockList.value[0]?.id).toBe("item-0");
    expect(mockList.value[1]?.id).toBe("item-1");
    expect(mockList.value[2]?.id).toBe("item-2");
  });
});
