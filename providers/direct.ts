import type { ProviderGetImage } from "@nuxt/image";

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  if (typeof src === "string" && src.includes("images.unsplash.com")) {
    const baseUrl = src.split("?")[0];
    const width = modifiers.width || 1200;
    const quality = modifiers.quality || 80;
    return {
      url: `${baseUrl}?auto=format&fit=crop&w=${width}&q=${quality}`,
    };
  }
  return {
    url: src,
  };
};
