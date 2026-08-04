import { defineContentConfig, defineCollection, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    posts: defineCollection({
      type: "page",
      source: "blog/*.md",
      schema: z.object({
        title: z.string(),
        snippet: z.string(),
        category: z.string(),
        tags: z.array(z.string()).optional(),
        date: z.string(),
        author: z.object({
          name: z.string(),
          avatar: z.string(),
          bio: z.string().optional(),
          socials: z.array(z.object({
            label: z.string(),
            href: z.string(),
          })).optional(),
        }),
        readTime: z.string().optional(),
        comments: z.number().optional(),
        image: z.string(),
        pinned: z.boolean().optional(),
        price: z.object({
          original: z.string(),
          sale: z.string(),
        }).optional(),
        discount: z.string().optional(),
        isProduct: z.boolean().optional(),
      }),
    }),
    pages: defineCollection({
      type: "page",
      source: "pages/*.md",
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        slug: z.string().optional(),
        updatedAt: z.string().optional(),
        date: z.string().optional(),
      }),
    }),
  },
});

