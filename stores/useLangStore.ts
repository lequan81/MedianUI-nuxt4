import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { LanguageItem } from '~/types/lang'

export const supportedLanguages: LanguageItem[] = [
  { code: 'vi', countryCode: 'vn', name: 'Vietnamese', localName: 'Tiếng Việt', flag: '🇻🇳', flagUrl: 'https://flagcdn.com/w40/vn.png' },
  { code: 'en', countryCode: 'us', name: 'English', localName: 'English', flag: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png' },
  { code: 'ja', countryCode: 'jp', name: 'Japanese', localName: '日本語', flag: '🇯🇵', flagUrl: 'https://flagcdn.com/w40/jp.png' },
  { code: 'zh', countryCode: 'cn', name: 'Chinese', localName: '中文', flag: '🇨🇳', flagUrl: 'https://flagcdn.com/w40/cn.png' },
  { code: 'ko', countryCode: 'kr', name: 'Korean', localName: '한국어', flag: '🇰🇷', flagUrl: 'https://flagcdn.com/w40/kr.png' },
  { code: 'es', countryCode: 'es', name: 'Spanish', localName: 'Español', flag: '🇪🇸', flagUrl: 'https://flagcdn.com/w40/es.png' },
  { code: 'fr', countryCode: 'fr', name: 'French', localName: 'Français', flag: '🇫🇷', flagUrl: 'https://flagcdn.com/w40/fr.png' },
  { code: 'de', countryCode: 'de', name: 'German', localName: 'Deutsch', flag: '🇩🇪', flagUrl: 'https://flagcdn.com/w40/de.png' },
]

export const useLangStore = defineStore('lang', () => {
  // State
  const currentLang = ref<string>('vi')
  const isLangModalOpen = ref<boolean>(false)

  // Getters
  const currentLangItem = computed(() => {
    return supportedLanguages.find(l => l.code === currentLang.value) || supportedLanguages[0]
  })

  // Actions
  function initLang() {
    if (import.meta.client) {
      const savedLang = localStorage.getItem('median_lang')
      if (savedLang && supportedLanguages.some(l => l.code === savedLang)) {
        currentLang.value = savedLang
      }
    }
  }

  function openLangModal() {
    isLangModalOpen.value = true
  }

  function closeLangModal() {
    isLangModalOpen.value = false
  }

  function toggleLangModal() {
    isLangModalOpen.value = !isLangModalOpen.value
  }

  function setLanguage(code: string) {
    if (supportedLanguages.some(l => l.code === code)) {
      currentLang.value = code
      if (import.meta.client) {
        localStorage.setItem('median_lang', code)
      }
    }
    closeLangModal()
  }


  return {
    currentLang,
    isLangModalOpen,
    currentLangItem,
    supportedLanguages,
    initLang,
    openLangModal,
    closeLangModal,
    toggleLangModal,
    setLanguage
  }
})
