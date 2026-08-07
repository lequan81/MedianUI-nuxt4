export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const route = useRoute();
  const isPageLoading = useState("global_is_page_loading", () => false);
  const activePath = useState("global_active_path", () => route.path);

  let timer: any = null;

  router.beforeEach((to, from) => {
    if (to.path !== from.path) {
      if (typeof document !== "undefined") {
        document.body.classList.add("page-nav-loading");
      }
      isPageLoading.value = true;
    }
  });

  router.afterEach((to, from) => {
    if (timer) clearTimeout(timer);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        timer = setTimeout(() => {
          activePath.value = to.path;
          isPageLoading.value = false;
          if (typeof document !== "undefined") {
            document.body.classList.remove("page-nav-loading");
          }
        }, 320);
      });
    });
  });
});
