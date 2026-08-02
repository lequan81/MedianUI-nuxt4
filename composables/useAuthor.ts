import { authorConfig, type AuthorConfig } from "~/app/config/site";

export function useAuthor(postAuthor?: any): AuthorConfig {
  if (!postAuthor) return authorConfig;

  if (typeof postAuthor === "object") {
    const name = postAuthor.name || authorConfig.name;

    let bio = postAuthor.bio || authorConfig.bio;
    // Tự động làm sạch các chuỗi URL thô bị trùng lặp
    bio = bio.replace(/Website:\s*https?:\/\/[^\s]+/gi, "").trim();
    if (!bio || bio.length < 5) bio = authorConfig.bio;

    const handle = postAuthor.handle || `@${name.toLowerCase().replace(/\s+/g, "_")}`;

    return {
      name,
      handle,
      avatar: postAuthor.avatar || authorConfig.avatar,
      roleBadge: postAuthor.roleBadge || authorConfig.roleBadge,
      bio,
      email: postAuthor.email || authorConfig.email,
      website: postAuthor.website || authorConfig.website,
      socials: postAuthor.socials || authorConfig.socials,
    };
  }

  const name = typeof postAuthor === "string" ? postAuthor : authorConfig.name;

  if (name.toLowerCase().includes("juno") || name.toLowerCase().includes("okyo")) {
    return {
      name,
      handle: "@juno_okyo",
      avatar: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhL3yrcwWnlPeCOG6T3jtIoy42wtnpAvvPmo4s77w6SqVUi9xkSQam983z330vy7o-zOD77wK3qlMNIw5VhDcBAqMyJvtkcODRCf7FXXfsoCse2BRsdTXAPByodpi3C9zI/w40-h40-p-k-no-nu/juno-okyo-logo.png",
      roleBadge: "Founder",
      bio: "Founder of J2TEAM.",
      email: "juno.okyo@j2team.dev",
      website: "https://j2team.dev",
      socials: [
        { name: "Facebook", icon: "facebook", href: "https://facebook.com/juno.okyo" },
        { name: "GitHub", icon: "github", href: "https://github.com/juno-okyo" },
        { name: "Website", icon: "globe", href: "https://j2team.dev" },
        { name: "Email", icon: "mail", href: "mailto:juno.okyo@j2team.dev" },
      ],
    };
  }

  return {
    ...authorConfig,
    name,
    handle: `@${name.toLowerCase().replace(/\s+/g, "")}`,
  };
}
