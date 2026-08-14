import { ref, computed, onMounted } from "vue";

/**
 * Guest Identity Composable
 * Generates a stable guest-{short-uuid} identity per browser session (e.g. guest-987854a8).
 * Stored in sessionStorage so it resets when the tab/window is closed.
 */
export function useGuestIdentity() {
  const STORAGE_KEY = "median_guest_id";

  function generateGuestId(): string {
    const cleanUuid = crypto.randomUUID().replace(/-/g, "").substring(0, 8);
    return `guest-${cleanUuid}`;
  }

  const rawGuestId = ref<string>("guest-default");

  if (import.meta.client) {
    try {
      let stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) {
        stored = generateGuestId();
        sessionStorage.setItem(STORAGE_KEY, stored);
      }
      rawGuestId.value = stored;
    } catch {
      rawGuestId.value = generateGuestId();
    }
  }

  onMounted(() => {
    try {
      let stored = sessionStorage.getItem(STORAGE_KEY);
      if (!stored) {
        stored = generateGuestId();
        sessionStorage.setItem(STORAGE_KEY, stored);
      }
      rawGuestId.value = stored;
    } catch {
      // ignore fallback
    }
  });

  const guestId = computed(() => rawGuestId.value);
  const displayName = computed(() => rawGuestId.value);
  const avatar = computed(
    () => `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(rawGuestId.value)}`
  );

  return {
    guestId,
    displayName,
    avatar,
  };
}
