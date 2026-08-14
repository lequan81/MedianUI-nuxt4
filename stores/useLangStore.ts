import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  SUPPORTED_LANGUAGES,
  isSupportedLocale,
  type SupportedLocale,
  type SupportedLanguage,
} from "~/app/config/languages";

export const supportedLanguages = SUPPORTED_LANGUAGES;

export const useLangStore = defineStore("lang", () => {
  const localeCookie = useCookie<SupportedLocale>("locale", {
    default: () => "vi",
    maxAge: 31536000,
    path: "/",
  });

  const currentLang = ref<SupportedLocale>(
    isSupportedLocale(localeCookie.value) ? localeCookie.value : "vi"
  );
  const isLangModalOpen = ref<boolean>(false);

  const currentLangItem = computed<SupportedLanguage>(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === currentLang.value) ||
      SUPPORTED_LANGUAGES[0]
    );
  });

  function initLang() {
    if (isSupportedLocale(localeCookie.value)) {
      currentLang.value = localeCookie.value;
    }
  }

  function openLangModal() {
    isLangModalOpen.value = true;
  }

  function closeLangModal() {
    isLangModalOpen.value = false;
  }

  function toggleLangModal() {
    isLangModalOpen.value = !isLangModalOpen.value;
  }

  function setLanguage(code: string) {
    if (isSupportedLocale(code)) {
      currentLang.value = code;
      localeCookie.value = code;
    }
    closeLangModal();
  }

  return {
    currentLang,
    isLangModalOpen,
    currentLangItem,
    supportedLanguages: SUPPORTED_LANGUAGES,
    initLang,
    openLangModal,
    closeLangModal,
    toggleLangModal,
    setLanguage,
  };
});
