import { defineStore } from 'pinia'
import { ref } from 'vue'

export type LanguageCode = 'vi' | 'en'

export const useLangStore = defineStore('lang', () => {
  // State
  const currentLang = ref<LanguageCode>('vi')

  // Actions
  function initLang() {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('median_lang') as LanguageCode | null
      if (savedLang === 'vi' || savedLang === 'en') {
        currentLang.value = savedLang
      }
    }
  }

  function toggleLanguage() {
    currentLang.value = currentLang.value === 'vi' ? 'en' : 'vi'
    if (typeof window !== 'undefined') {
      localStorage.setItem('median_lang', currentLang.value)
    }
  }

  function setLanguage(lang: LanguageCode) {
    currentLang.value = lang
    if (typeof window !== 'undefined') {
      localStorage.setItem('median_lang', lang)
    }
  }

  return {
    currentLang,
    initLang,
    toggleLanguage,
    setLanguage
  }
})
