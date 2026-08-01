import { authorConfig, type AuthorConfig } from "~/app/config/site";

export function useAuthor(postAuthor?: any): AuthorConfig {
  if (!postAuthor) return authorConfig;

  if (typeof postAuthor === "object") {
    let name = postAuthor.name || authorConfig.name;
    if (name === "Juno_okyo" || name === "JUNO_OKYO") {
      name = "Lê Quân";
    }

    let bio = postAuthor.bio || authorConfig.bio;
    // Tự động làm sạch các chuỗi URL thô bị trùng lặp
    bio = bio.replace(/Website:\s*https?:\/\/[^\s]+/gi, "").trim();
    if (!bio || bio.length < 5) bio = authorConfig.bio;

    return {
      name,
      handle: postAuthor.handle || authorConfig.handle,
      avatar: postAuthor.avatar || authorConfig.avatar,
      roleBadge: postAuthor.roleBadge || authorConfig.roleBadge,
      bio,
      email: postAuthor.email || authorConfig.email,
      website: postAuthor.website || authorConfig.website,
      socials: postAuthor.socials || authorConfig.socials,
    };
  }

  const name = typeof postAuthor === "string" ? (postAuthor === "JUNO_OKYO" ? "Lê Quân" : postAuthor) : authorConfig.name;

  return {
    ...authorConfig,
    name,
  };
}
