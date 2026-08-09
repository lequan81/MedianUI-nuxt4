# 🔍 Phân Tích Toàn Diện Median UI v1.7 - Nuxt 4 Blog

> Đã đọc xong **toàn bộ** 60+ file source code, cấu hình, composable, store, API, component, và page.
> Dưới đây là phân tích chi tiết theo từng mục bạn yêu cầu.

---

## 1. Điểm Có Thể Cải Thiện Chung

### 🔴 Critical Issues

| # | Vấn đề | File | Chi tiết |
|---|--------|------|----------|
| 1 | **Duplicate Contact API** | [contact.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/contact.ts) + [contact/index.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/contact/index.ts) | Hai file có logic gần giống nhau, 2 rate limiter hoạt động song song → lãng phí bộ nhớ & gây nhầm lẫn route |
| 2 | **Admin Dashboard dùng data giả cứng (hardcoded)** | [admin/index.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(admin)/admin/index.vue) | `stats`, `pendingComments`, `recentContacts` đều là data giả tĩnh, không fetch từ API/Database |
| 3 | **Login bypass không có auth thật** | [admin/login.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(admin)/admin/login.vue#L21-L28) | `handleLogin()` chỉ `navigateTo("/admin")` không kiểm tra gì, bất kỳ ai cũng vào được `/admin` |
| 4 | **Comments POST API thiếu rate-limit** | [comments/index.post.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/comments/index.post.ts) | Không có rate-limit nào, attacker có thể spam hàng triệu comments |
| 5 | **`console.log` còn sót trong production** | [default.vue:15](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/layouts/default.vue#L15) | `console.log("[DOM OVERLAY DEBUG] 💡...")` |

### 🟡 Important Issues

| # | Vấn đề | Chi tiết |
|---|--------|----------|
| 6 | **Import trùng lặp từ `~/app/config/site`** | [useAuthor.ts:1](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/composables/useAuthor.ts#L1) import `authorConfig` từ `site.ts` (re-export), nhưng [AppSidebar.vue:9](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/layout/AppSidebar.vue#L9) cũng import từ `site.ts`. Nên import nhất quán từ nguồn gốc |
| 7 | **Font Google load 2 lần** | Cả [main.css:1](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/assets/css/main.css#L1) (`@import url(...)`) VÀ [nuxt.config.ts:88-90](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/nuxt.config.ts#L88-L90) (head link) đều load font Google → render-blocking x2 |
| 8 | **`window` check rải rác** | `typeof window !== "undefined"` xuất hiện ở rất nhiều nơi, nên dùng `import.meta.client` hoặc `process.client` thay thế |
| 9 | **Dark mode scrollbar không dùng CSS variable** | [main.css:130-148](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/assets/css/main.css#L130-L148) dùng hardcoded hex cho scrollbar thumb dark mode thay vì dùng token |
| 10 | **`any` type tràn lan** | Hầu hết composable và page đều dùng `any` cho post objects thay vì typed interfaces |

### 🟢 Minor Issues

| # | Vấn đề | Chi tiết |
|---|--------|----------|
| 11 | **Dead class binding** | [default.vue:81](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/layouts/default.vue#L81): `appStore.isSidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'` → cả 2 nhánh giống nhau |
| 12 | **Hardcoded "juno_okyo" trong composable** | [useAuthor.ts:30-46](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/composables/useAuthor.ts#L30-L46) có logic hardcoded cho tác giả "juno" / "okyo" |
| 13 | **idle-prefetch hardcoded URLs** | [idle-prefetch.client.ts:18-22](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/plugins/idle-prefetch.client.ts#L18-L22) hardcode 3 URL ảnh unsplash |
| 14 | **`pnpm-workspace.yaml` tồn tại nhưng chỉ có 1 package** | Không cần thiết cho monorepo single-package |
| 15 | **Thiếu `og-banner.png` trong `/public`** | SEO composable reference `og-banner.png` nhưng thư mục `public/` chỉ có `favicon.ico` + `sw.js` |

---

## 2. NuxtImg - Dùng Đúng Chuẩn Không Cần Sharp / S3 Bucket

### Tình trạng hiện tại

Bạn đang dùng custom provider `direct` ([providers/direct.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/providers/direct.ts)) - chỉ đơn giản passthrough URL gốc, **không xử lý ảnh gì cả**. Điều này có nghĩa `<NuxtImg>` hoạt động giống hệt `<img>` thông thường.

### Cách dùng NuxtImg đúng chuẩn KHÔNG cần Sharp

```ts
// nuxt.config.ts
image: {
  // Option A: Dùng provider "none" (passthrough) - tương tự hiện tại nhưng chuẩn hơn
  provider: 'none', // Nuxt Image built-in, không cần custom provider

  // Option B: Dùng IPX provider từ CDN (tối ưu ảnh server-side miễn phí)
  // provider: 'ipx', // Yêu cầu runtime nhưng KHÔNG cần sharp

  // Chung: Format & Quality mặc định cho mọi ảnh
  format: ['webp', 'avif'],
  quality: 80,

  // Presets cho các kích thước thường dùng
  presets: {
    thumbnail: { modifiers: { width: 400, height: 225, fit: 'cover' } },
    card: { modifiers: { width: 600, height: 338, fit: 'cover' } },
    hero: { modifiers: { width: 1200, height: 525, fit: 'cover' } },
    avatar: { modifiers: { width: 80, height: 80, fit: 'cover' } },
  },

  // Screens cho responsive srcset
  screens: {
    xs: 320,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  },
}
```

### Cấu hình cho S3 Bucket

```ts
// nuxt.config.ts
image: {
  // Option 1: Dùng S3 trực tiếp (passthrough, không optimize)
  domains: ['your-bucket.s3.ap-southeast-1.amazonaws.com'],
  provider: 'none',

  // Option 2: Dùng CloudFront + S3 (recommended - có image optimization)
  providers: {
    s3: {
      provider: 'cloudflare', // hoặc 'cloudinary', 'imgix'
      options: {
        baseURL: 'https://d123abc.cloudfront.net',
      },
    },
  },

  // Option 3: Dùng Cloudflare Images (rẻ nhất, dễ nhất)
  providers: {
    cf: {
      provider: 'cloudflare',
      options: {
        baseURL: 'https://imagedelivery.net/<account-hash>',
      },
    },
  },
}
```

### Template sử dụng đúng chuẩn

```vue
<!-- ❌ Hiện tại bạn đang dùng thế này -->
<NuxtImg :src="getPostImage(post)" :alt="post.title"
  class="h-full w-full object-cover" loading="lazy" />

<!-- ✅ Nên dùng thế này (có sizes, width, height, format, preset) -->
<NuxtImg
  :src="getPostImage(post)"
  :alt="post.title"
  preset="card"
  sizes="sm:100vw md:50vw lg:33vw"
  :width="600"
  :height="338"
  format="webp"
  :loading="index < 3 ? 'eager' : 'lazy'"
  :placeholder="[16, 9, 30, 5]"
  class="h-full w-full object-cover"
/>
```

> [!IMPORTANT]
> Nếu không dùng image CDN nào (chỉ external URL), bạn có thể xóa `@nuxt/image` khỏi modules và dùng `<img>` thường. `<NuxtImg>` chỉ thực sự hữu ích khi có backend xử lý ảnh (IPX/Cloudinary/Imgix/Cloudflare Images).

---

## 3. Cấu Hình Hiệu Năng Nuxt 4 Còn Thiếu

### Hiện tại bạn có:
- ✅ `componentIslands: true`
- ✅ `nitro.preset: "bun"`
- ✅ `sitemap.zeroRuntime: true`
- ✅ `vite.optimizeDeps.include`
- ✅ `.server.vue` skeleton components

### Đang thiếu (cần bổ sung):

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  // === PERFORMANCE: Các option quan trọng đang thiếu ===

  experimental: {
    componentIslands: true,
    // ⭐ Bật inline styles thay vì external CSS files (giảm request)
    inlineStyles: true,
    // ⭐ View Transition API (native browser transitions, smooth hơn)
    viewTransition: true,
    // ⭐ Async context cho Nitro (tránh context lost trong async operations)
    asyncContext: true,
  },

  // ⭐ Route rules - ISR/SWR cho các trang tĩnh
  routeRules: {
    // Trang chủ: ISR 60 giây
    '/': { isr: 60 },
    // Blog posts: ISR 5 phút
    '/blog/**': { isr: 300 },
    // Static pages: Prerender luôn
    '/about': { prerender: true },
    '/contact': { prerender: true },
    '/faq': { prerender: true },
    '/privacy': { prerender: true },
    '/tos': { prerender: true },
    '/disclaimer': { prerender: true },
    // API: CORS + cache headers
    '/api/**': {
      cors: true,
      headers: { 'cache-control': 'no-cache' },
    },
    // Admin: Không cache, không index
    '/admin/**': {
      ssr: false,                // Client-side only (SPA mode)
      headers: { 'x-robots-tag': 'noindex' },
    },
  },

  // ⭐ Nitro optimization
  nitro: {
    preset: "bun",
    compressPublicAssets: { gzip: true, brotli: true },
    minify: true,
    // Storage cho KV caching
    storage: {
      cache: { driver: 'memory' },
    },
  },

  // ⭐ Vite optimization bổ sung
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@iconify/vue", "@floating-ui/dom", "valibot", "pinia"],
    },
    build: {
      // CSS code splitting
      cssCodeSplit: true,
      // Chunk splitting strategy
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-vue': ['vue', 'vue-router', 'pinia'],
            'vendor-content': ['@nuxt/content'],
            'vendor-icons': ['@iconify/vue'],
          },
        },
      },
    },
  },

  // ⭐ Features optimization
  features: {
    // Tắt inline styles nếu dùng Tailwind (tránh conflict)
    inlineStyles: false,
  },

  // ⭐ Head optimization
  app: {
    // ... existing config ...
    head: {
      // Thêm DNS prefetch
      link: [
        // ...existing links...
        { rel: 'dns-prefetch', href: 'https://images.unsplash.com' },
        { rel: 'dns-prefetch', href: 'https://api.dicebear.com' },
        { rel: 'dns-prefetch', href: 'https://flagcdn.com' },
        { rel: 'dns-prefetch', href: 'https://blogger.googleusercontent.com' },
      ],
    },
  },
});
```

---

## 4. Cải Thiện Backend, Frontend, Security, OAuth2

### 🔐 Security (Nghiêm trọng nhất)

#### A. Auth/OAuth2 - Hiện tại KHÔNG CÓ

```
Trạng thái: Admin login bypass hoàn toàn
File: pages/(admin)/admin/login.vue
Rủi ro: Bất kỳ ai truy cập /admin đều vào được dashboard
```

**Đề xuất triển khai:**

```ts
// server/utils/auth.ts - JWT-based auth (đơn giản nhất)
import { sign, verify } from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'change-this-in-production'

export function createToken(payload: { userId: string; role: string }) {
  return sign(payload, SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  return verify(token, SECRET) as { userId: string; role: string }
}

// server/api/auth/login.post.ts
export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)
  // Hash check with bcrypt/argon2
  // Return JWT token in httpOnly cookie
})

// server/middleware/admin-auth.ts
export default defineEventHandler((event) => {
  if (event.path.startsWith('/api/admin') || event.path.startsWith('/admin')) {
    const token = getCookie(event, 'auth_token')
    if (!token) throw createError({ statusCode: 401 })
    try { verifyToken(token) } catch { throw createError({ statusCode: 401 }) }
  }
})
```

**Hoặc dùng `nuxt-auth-utils` (recommended cho Nuxt 4):**

```bash
bun add nuxt-auth-utils
```

```ts
// nuxt.config.ts
modules: ['nuxt-auth-utils']

// Tự động có OAuth2 flows: GitHub, Google, Discord, etc.
```

#### B. Server Security Headers

```ts
// server/middleware/security-headers.ts
export default defineEventHandler((event) => {
  setHeaders(event, {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; img-src 'self' https: data:; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  })
})
```

#### C. Comment API cần Rate Limit

```ts
// server/api/comments/index.post.ts - Thêm rate limit giống contact API
const commentRateLimitStore = new Map<string, number[]>();

// Limit: 5 comments / 5 phút per IP
export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || '127.0.0.1'
  const now = Date.now()
  const logs = commentRateLimitStore.get(ip) || []
  const recent = logs.filter(ts => now - ts < 300_000) // 5 minutes

  if (recent.length >= 5) {
    throw createError({ statusCode: 429, statusMessage: 'Too Many Comments' })
  }

  commentRateLimitStore.set(ip, [...recent, now])
  // ... existing validation & insert logic
})
```

#### D. XSS Protection cho Comments

```ts
// server/utils/sanitize.ts
export function sanitizeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Dùng trong insertComment trước khi lưu vào DB
```

#### E. Cookie Security

```ts
// server/middleware/guest-id.ts - Cần thêm secure flag
setCookie(event, "guest_id", guestId, {
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
  httpOnly: true,   // ⚠️ Đang là false!
  sameSite: "lax",
  secure: process.env.NODE_ENV === 'production', // ⚠️ Thiếu!
});
```

### 🔧 Backend Improvements

| # | Cải thiện | Chi tiết |
|---|-----------|----------|
| 1 | **Xóa file contact.ts duplicate** | Giữ `server/api/contact/index.ts`, xóa `server/api/contact.ts` |
| 2 | **SQLite PRAGMA optimization** | Thêm `PRAGMA synchronous = NORMAL;` và `PRAGMA cache_size = -64000;` |
| 3 | **Prepared statements caching** | Cache các prepared statements thay vì tạo lại mỗi request |
| 4 | **Contact form chưa lưu DB** | Hiện tại chỉ `console.log`, cần bảng `contacts` trong SQLite |
| 5 | **Error handling thiếu try-catch** | Các API handler thiếu global try-catch |

### 🎨 Frontend Improvements

| # | Cải thiện | Chi tiết |
|---|-----------|----------|
| 1 | **Xóa `console.log` debug** | [default.vue:15](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/layouts/default.vue#L15) |
| 2 | **Accessibility (a11y)** | Thiếu `aria-label` cho nhiều interactive elements, thiếu `alt` text dynamically |
| 3 | **Form validation UX** | Contact form và Comment form nên show inline errors ngay khi blur, không chỉ khi submit |
| 4 | **Skeleton loading** | Có skeleton nhưng không dùng `<Suspense>` pattern mới của Nuxt 4 |
| 5 | **Image lazy loading** | Nên dùng `IntersectionObserver` native thay vì `loading="lazy"` cho browser cũ |

---

## 5. Frontend Component Reuse - Phân Tích Lớp CSS Trùng Lặp

### Các pattern UI lặp lại nhiều nhất:

#### A. **Button Pattern** (lặp **15+ lần**)

```html
<!-- Pattern này xuất hiện ở: index.vue, [slug].vue, admin/index.vue, error.vue, login.vue, etc. -->
class="inline-flex items-center gap-2 rounded-lg border border-border-main bg-bg-sec px-3.5 py-2 text-xs font-semibold text-text-main transition-colors hover:border-primary hover:text-primary shadow-2xs"
```

→ **Nên extract thành `<AppButton>` variants** (bạn đã có [AppButton.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/AppButton.vue) nhưng chưa dùng nhất quán!)

#### B. **Category/Tag Pill** (lặp **8+ lần**)

```html
class="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary-subtle px-2.5 py-1 text-xs font-semibold text-primary shadow-2xs"
```

→ **Nên tách thành `<AppBadge variant="category">`** (đã có [AppBadge.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/AppBadge.vue) nhưng chưa dùng!)

#### C. **Card Container** (lặp **10+ lần**)

```html
class="rounded-xl border border-border-main bg-bg-alt/60 shadow-2xs"
class="rounded-xl border border-dashed border-border-main bg-bg-alt/60 p-4.5 shadow-2xs"
```

→ **Nên dùng `<AppCard>` nhất quán** (đã có [AppCard.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/AppCard.vue) nhưng gần như không ai import!)

#### D. **Post Article Card** (lặp **4 lần**)

Cấu trúc `<article>` với image + title + snippet + meta lặp lại ở:
- [index.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/index.vue) — Pinned posts, Story posts
- [blog/[slug].vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/blog/[slug].vue) — Related posts mobile + desktop
- [RightSidebar.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/layout/RightSidebar.vue) — Popular posts

→ **Bạn đã có [PostCardGrid.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/post/PostCardGrid.vue) và [PostCardList.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/post/PostCardList.vue) nhưng KHÔNG SỬ DỤNG!**

#### E. **Breadcrumb** (lặp **4 lần**)

```html
<nav class="flex min-w-0 items-center gap-1.5 overflow-hidden text-xs text-text-alt">
  <NuxtLink to="/">Trang chủ</NuxtLink>
  <span class="text-text-muted">/</span>
  ...
</nav>
```

Xuất hiện ở: `index.vue`, `[slug].vue` (dynamic page), `blog/[slug].vue`, `admin/index.vue`

→ **Nên tách thành `<AppBreadcrumb :items="[...]">`**

#### F. **Empty State** (lặp **3 lần**)

```html
class="rounded-xl border border-dashed border-border-main bg-bg-alt/40 p-8 text-center text-text-muted text-xs font-medium"
```

→ **Nên tách thành `<AppEmptyState message="..." />`**

#### G. **404 Not Found Block** (lặp **2 lần**)

Code CSS 404 giống nhau ở [error.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/error.vue) và [blog/[slug].vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/blog/[slug].vue#L395-L498) — ~100 lines CSS trùng.

→ **Nên tách thành `<NotFoundPage :statusCode="404">`**

### Tóm tắt tính khả thi

| Component mới | Số nơi sẽ reuse | Ưu tiên | Effort |
|----------------|-----------------|---------|--------|
| **`<AppBreadcrumb>`** | 4+ | 🔴 Cao | Thấp |
| **Sử dụng `<PostCardGrid>` / `<PostCardList>`** | 4+ | 🔴 Cao | Trung bình |
| **Sử dụng `<AppButton>` nhất quán** | 15+ | 🔴 Cao | Trung bình |
| **Sử dụng `<AppBadge>` nhất quán** | 8+ | 🟡 TB | Thấp |
| **Sử dụng `<AppCard>` nhất quán** | 10+ | 🟡 TB | Trung bình |
| **`<AppEmptyState>`** | 3+ | 🟢 Thấp | Thấp |
| **`<NotFoundBlock>`** | 2 | 🟢 Thấp | Thấp |

---

## 6. Trang Chưa Cập Nhật Comment Database

### Hiện trạng hệ thống Comment

- ✅ SQLite database đang hoạt động: [server/db/comments.sqlite](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/db/comments.sqlite)
- ✅ API GET + POST comments đã có
- ✅ Component [PostComments.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/post/PostComments.vue) (26KB, đầy đủ)
- ✅ Component [CommentNode.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/post/CommentNode.vue)

### Các trang CHƯA tích hợp comment:

| Trang | Status | Lý do |
|-------|--------|-------|
| [about.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/about.vue) | ❌ Chưa có | Trang tĩnh, có thể thêm comment section |
| [contact.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/contact.vue) | ❌ Không cần | Đã có form liên hệ riêng |
| [faq.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/faq.vue) | ❌ Chưa có | Có thể thêm bình luận cho FAQ |
| [[slug].vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/[slug].vue) (dynamic pages) | ❌ Chưa có | Content pages cần tích hợp comment |
| [blog/[slug].vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/blog/[slug].vue) | ✅ Đã có | `<PostComments />` ở line 366 |

### Thiếu sót Database Schema:

- ❌ Bảng `contacts` chưa tồn tại (form contact chỉ `console.log`)
- ❌ Không có bảng `users` / `admins` cho auth
- ❌ Chưa có bảng `page_views` cho analytics thực
- ❌ Chưa có migration system (schema changes thủ công)

---

## 7. Thiếu Tính Năng Admin Dashboard

### Đã có (Demo mode):
- ✅ Dashboard tổng quan (data giả)
- ✅ Duyệt bình luận page
- ✅ Hòm thư liên hệ page
- ✅ Login page (bypass)

### Đang thiếu:

| Tính năng | Mức độ | Chi tiết |
|-----------|--------|----------|
| **Authentication thật** | 🔴 Critical | JWT/Session auth, middleware bảo vệ route |
| **CRUD Comments từ API** | 🔴 Critical | Admin approve/delete/edit comment qua API, không chỉ `ref` filter |
| **CRUD Contacts từ API** | 🔴 Critical | Xem/đánh dấu đã đọc/xóa liên hệ |
| **Quản lý bài viết** | 🟡 High | Danh sách, tạo/sửa/xóa bài viết (editor Markdown) |
| **Analytics thực** | 🟡 High | Page views, unique visitors, popular posts từ DB |
| **Settings page** | 🟡 High | Thay đổi site config, author info, theme settings |
| **Media manager** | 🟢 Nice | Upload/quản lý ảnh (S3/local) |
| **User management** | 🟢 Nice | Quản lý admin users |
| **Activity log** | 🟢 Nice | Lịch sử hoạt động admin |
| **SEO management** | 🟢 Nice | Meta tags, OG images cho từng bài |
| **Admin layout riêng** | 🟡 High | Hiện dùng chung `default.vue`, nên có `admin.vue` layout |

---

## 8. Cấu Trúc Codebase - Đề Xuất Tối Ưu

### Hiện tại:

```
median-ui-nuxt/
├── app/config/          ← 5 config files
├── assets/css/          ← 1 file (main.css)
├── components/
│   ├── content/         ← 14 Prose components ✅
│   ├── home/            ← 1 file (SliderWidget)
│   ├── layout/          ← 6 layout components ✅
│   ├── post/            ← 9 post components ✅
│   └── ui/              ← 15 UI components ✅
├── composables/         ← 6 composables
├── content/             ← Blog markdown
├── layouts/             ← 1 layout
├── middleware/           ← empty ❌
├── pages/
│   ├── (admin)/admin/   ← 4 admin pages
│   └── (public)/        ← 8 public pages + blog/
├── plugins/             ← 2 plugins
├── providers/           ← 2 image providers
├── server/
│   ├── api/             ← contact + comments
│   ├── db/              ← SQLite files
│   ├── middleware/       ← 1 middleware
│   └── utils/           ← 1 util (db.ts)
├── stores/              ← 2 stores
└── tests/unit/          ← 4 test files
```

### Đề xuất tối ưu:

```
median-ui-nuxt/
├── app/
│   ├── app.vue
│   └── config/
│       ├── author.ts
│       ├── contact.ts
│       ├── navigation.ts
│       ├── post.ts
│       └── site.ts
├── assets/
│   └── css/
│       ├── main.css
│       ├── scrollbar.css         ← Tách ra
│       ├── transitions.css       ← Tách ra
│       └── loading.css           ← Tách ra
├── components/
│   ├── content/                  ← Giữ nguyên
│   ├── layout/                   ← Giữ nguyên
│   ├── post/                     ← Giữ nguyên
│   └── ui/
│       ├── AppBreadcrumb.vue     ← MỚI
│       ├── AppEmptyState.vue     ← MỚI
│       ├── NotFoundBlock.vue     ← MỚI
│       └── ... (existing)
├── composables/                  ← Giữ nguyên
├── layouts/
│   ├── default.vue
│   └── admin.vue                 ← MỚI: Layout riêng cho admin
├── middleware/
│   └── admin-auth.ts             ← MỚI: Auth guard cho admin routes
├── pages/
│   ├── (admin)/admin/
│   │   ├── index.vue
│   │   ├── comments.vue
│   │   ├── contacts.vue
│   │   ├── login.vue
│   │   ├── posts/                ← MỚI: CRUD bài viết
│   │   │   ├── index.vue
│   │   │   └── [id].vue
│   │   └── settings.vue          ← MỚI
│   └── (public)/                 ← Giữ nguyên
├── server/
│   ├── api/
│   │   ├── auth/                 ← MỚI
│   │   │   ├── login.post.ts
│   │   │   └── logout.post.ts
│   │   ├── admin/                ← MỚI
│   │   │   ├── comments/
│   │   │   ├── contacts/
│   │   │   └── stats.get.ts
│   │   ├── comments/
│   │   └── contact/
│   ├── db/
│   │   └── migrations/           ← MỚI: Schema migrations
│   ├── middleware/
│   │   ├── admin-auth.ts         ← MỚI
│   │   ├── guest-id.ts
│   │   └── security-headers.ts   ← MỚI
│   └── utils/
│       ├── auth.ts               ← MỚI
│       ├── db.ts
│       └── sanitize.ts           ← MỚI
├── stores/
├── tests/
│   ├── unit/
│   └── e2e/                      ← MỚI
└── types/                        ← MỚI: Shared types thay vì `any`
    ├── post.ts
    ├── comment.ts
    └── author.ts
```

> [!TIP]
> **Quan trọng nhất:** Xóa `server/api/contact.ts` (duplicate) và di chuyển middleware folder rỗng sang có auth guard.

---

## 9. Cải Thiện Điểm Lighthouse (Preview Mode)

### Các vấn đề ảnh hưởng Lighthouse Score lớn nhất:

#### 🔴 Performance (Score thấp nhất)

| Issue | Impact | Fix |
|-------|--------|-----|
| **Font Google render-blocking** | Rất cao | Xóa `@import url(...)` trong CSS, chỉ giữ `<link>` trong head với `display=swap` + `media="print" onload="..."` pattern |
| **Font load 2 lần** | Cao | Xóa 1 trong 2 nơi load font (CSS hoặc head) |
| **Thiếu `width` + `height` trên `<NuxtImg>`** | Cao | CLS (Cumulative Layout Shift) tăng vì browser không biết kích thước ảnh |
| **Thiếu image `sizes` attribute** | Cao | Browser tải ảnh full-size thay vì responsive |
| **Không có `font-display: swap`** | Trung bình | Đã có `display=swap` trong URL nhưng cần verify |
| **Loading overlay backdrop-filter** | Trung bình | `backdrop-filter: blur(20px)` rất nặng, cân nhắc giảm hoặc dùng semi-transparent background thay thế |

#### 🟡 Accessibility

| Issue | Fix |
|-------|-----|
| Thiếu `alt` text cho avatar images | Thêm `alt` cho tất cả `<NuxtImg>` |
| Thiếu `aria-label` cho icon-only buttons | Đã có một số, cần kiểm tra toàn bộ |
| Color contrast ratio | Kiểm tra `text-text-muted` trên `bg-bg-base` |
| Thiếu `<main>` landmark rõ ràng | Đã có `<main>` trong layout ✅ |

#### 🟡 SEO

| Issue | Fix |
|-------|-----|
| Thiếu `og-banner.png` | Tạo file `public/og-banner.png` (1200x630px) |
| Thiếu `robots.txt` thực | Hiện phụ thuộc `@nuxtjs/robots` module, verify output |
| Meta description trùng trên nhiều trang | Mỗi page cần unique description |

#### 🟢 Best Practices

| Issue | Fix |
|-------|-----|
| `console.log` trong production | Xóa tất cả debug logs |
| HTTPS mixed content | Verify tất cả external URLs dùng HTTPS |
| Service Worker scope | Giới hạn SW scope thay vì catch-all |

### Quick Wins cho Lighthouse (làm ngay):

```ts
// 1. Xóa font duplicate trong main.css dòng 1
// ❌ @import url("https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro...");
// Chỉ giữ <link> trong nuxt.config.ts head

// 2. Preload font thay vì stylesheet
// nuxt.config.ts → app.head.link
{
  rel: 'preload',
  href: 'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Fira+Mono:wght@400;500&display=swap',
  as: 'style',
  onload: "this.onload=null;this.rel='stylesheet'",
},

// 3. Thêm width/height cho tất cả NuxtImg
<NuxtImg :src="..." :alt="..." :width="600" :height="338" ... />

// 4. Thêm fetchpriority cho hero images
<NuxtImg :src="..." loading="eager" fetchpriority="high" ... />

// 5. Thêm routeRules ISR (đã nêu ở mục 3)
```

---

## 📊 Tổng Kết Ưu Tiên Hành Động

| Ưu tiên | Hạng mục | Effort | Impact |
|---------|----------|--------|--------|
| 🔴 P0 | Xóa duplicate contact API | 5 phút | Giảm confusion + memory |
| 🔴 P0 | Xóa `console.log` debug | 2 phút | Clean production |
| 🔴 P0 | Font load chỉ 1 lần + preload | 15 phút | +15-20 Lighthouse Performance |
| 🔴 P0 | Thêm width/height cho NuxtImg | 30 phút | Giảm CLS score |
| 🔴 P1 | Auth middleware cho admin | 2 giờ | Security critical |
| 🔴 P1 | Rate-limit cho comments API | 30 phút | Chống spam |
| 🟡 P2 | routeRules ISR/prerender | 30 phút | Performance significant |
| 🟡 P2 | Component reuse (Breadcrumb, PostCard) | 3 giờ | Maintainability |
| 🟡 P2 | Contact form lưu DB | 1 giờ | Feature completion |
| 🟡 P2 | Admin layout riêng | 2 giờ | UX improvement |
| 🟢 P3 | Type system (xóa `any`) | 4 giờ | DX + Safety |
| 🟢 P3 | CSS tách file nhỏ hơn | 1 giờ | Maintainability |
| 🟢 P3 | OAuth2 implementation | 1 ngày | Full auth system |
