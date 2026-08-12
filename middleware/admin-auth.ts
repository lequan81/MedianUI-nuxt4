export default defineNuxtRouteMiddleware(async (to) => {
  // Allow access to login page without check
  if (to.path === "/admin/login") {
    return;
  }

  // Only run on admin pages
  if (to.path.startsWith("/admin")) {
    try {
      const res = await $fetch<{ authenticated: boolean }>("/api/admin/auth/check");
      if (!res?.authenticated) {
        return navigateTo("/admin/login");
      }
    } catch {
      return navigateTo("/admin/login");
    }
  }
});
