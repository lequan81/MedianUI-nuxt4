/**
 * Guest Identity Composable
 * Generates a stable guest-{short-uuid} identity per browser session (e.g. guest-987854a8).
 * Stored in sessionStorage so it resets when the tab/window is closed.
 */
export function useGuestIdentity() {
  const STORAGE_KEY = "median_guest_id";

  function generateGuestId(): string {
    const shortUuid = crypto.randomUUID().replaceAll("-", "").substring(0, 8);
    return `guest-${shortUuid}`;
  }

  function getGuestId(): string {
    if (import.meta.server) return generateGuestId();

    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) return stored;

    const id = generateGuestId();
    sessionStorage.setItem(STORAGE_KEY, id);
    return id;
  }

  const guestId = getGuestId();
  const displayName = guestId;

  return {
    guestId,
    displayName,
  };
}
