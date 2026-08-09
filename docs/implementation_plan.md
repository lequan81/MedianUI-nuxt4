# 🚀 Kế Hoạch Triển Khai (Implementation Plan) - Median UI v1.7 Nuxt 4

Dựa trên kết quả phân tích file [analysis_results.md](file:///C:/Users/DELL/.gemini/antigravity-ide/brain/d93cb427-2ac0-4940-aee4-7c6a7ff7d2b6/analysis_results.md), kế hoạch triển khai được chia thành **6 Giai Đoạn Độc Lập**. Bạn có thể thực hiện bất kỳ giai đoạn nào trước hoặc độc lập với các giai đoạn khác.

---

## ⚠️ User Review Required

> [!IMPORTANT]
> - **Giai đoạn 2 (Security & Backend):** Sẽ xóa file trùng `server/api/contact.ts` và chuyển sang dùng chuẩn `server/api/contact/index.ts`.
> - **Giai đoạn 5 (Admin Auth):** Sử dụng hệ thống **JWT Token / Session Cookie tự phát triển (ưu tiên dùng Bun native crypto/Jose)** cho Admin Auth nhẹ mượt, có cấu trúc sẵn sàng mở rộng OAuth2 (Google/GitHub). Khi truy cập `/admin` chưa đăng nhập sẽ bị chuyển hướng về `/admin/login`.
> - **Giai đoạn 1 & Image CDN:** Hiện tại dùng Free CDN Image Services (Unsplash, DiceBear, Google Blogger CDN, Passthrough Provider), thiết kế sẵn provider để dễ dàng chuyển đổi sang S3 / MinIO tự host trong tương lai.

---

## ✅ Quy Định Kỹ Thuật Đã Thống Nhất

- **Admin Auth (Giai đoạn 5):** Ưu tiên giải pháp đơn giản (JWT Token / Session Cookie tự phát triển qua Bun native / Jose / H3) cho nhẹ mượt, chuẩn bị sẵn mô-đun mở rộng OAuth2 (Google/GitHub/OAuth Provider) nếu muốn.
- **S3 / Image Cloud (Giai đoạn 1):** Tương lai sẽ dùng dịch vụ S3 / MinIO tự host. Hiện tại tiếp tục duy trì và tối ưu Free CDN Image Services chuẩn (`direct` provider, Unsplash, DiceBear, Google Blogger).

---

## 📋 Các Giai Đoạn Triển Khai (Phases)

---

### ⚡ Phase 1: Tối Ưu Hiệu Năng & Điểm Số Lighthouse (Performance Focus) `[ĐÃ HOÀN THÀNH]`
> *Mục tiêu: Đạt 95+ Lighthouse Performance, giảm tối đa LCP & CLS, tối ưu Free CDN Image hiện tại & chuẩn bị cho MinIO/S3.*

#### [MODIFY] [nuxt.config.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/nuxt.config.ts)
- Bổ sung `routeRules` cho ISR (Trang chủ: `isr: 60`, Blog: `isr: 300`, Static pages: `prerender: true`).
- Bổ sung DNS prefetch (`images.unsplash.com`, `flagcdn.com`, `blogger.googleusercontent.com`, `api.dicebear.com`).
- Thêm `inlineStyles: true` và `asyncContext: true` trong `experimental`.

#### [MODIFY] [assets/css/main.css](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/assets/css/main.css)
- Xóa dòng `@import url("https://fonts.googleapis.com/...")` dòng 1 để tránh load font trùng lặp render-blocking.

#### [MODIFY] [pages/(public)/index.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/index.vue) & [pages/(public)/blog/[slug].vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(public)/blog/[slug].vue)
- Bổ sung thuộc tính `width`, `height`, `sizes` và `fetchpriority="high"` cho `<NuxtImg>` của các ảnh Hero/Pinned bài viết.
- Giữ vững kiến trúc Provider `direct` để dễ dàng chuyển sang S3/MinIO tự host trong tương lai.

---

### 🛡️ Phase 2: Bảo Mật, Dọn Dẹp Backend & Rate Limiting `[SẴN SÀNG TRIỂN KHÀI]`
> *Mục tiêu: Loại bỏ code trùng lặp, bảo vệ API khỏi Spam/XSS, gia cố Cookie Security.*

#### [DELETE] [server/api/contact.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/contact.ts)
- Xóa file trùng lặp (chỉ giữ lại [server/api/contact/index.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/contact/index.ts)).

#### [MODIFY] [server/api/comments/index.post.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/comments/index.post.ts)
- Tích hợp Rate Limiting (tối đa 5 comments / 5 phút per IP) và làm sạch HTML content tránh XSS.

#### [MODIFY] [server/middleware/guest-id.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/middleware/guest-id.ts)
- Bổ sung `httpOnly: true` và `secure: process.env.NODE_ENV === 'production'`.

#### [NEW] `server/middleware/security-headers.ts`
- Bổ sung Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Content-Security-Policy`).

---

### 🎨 Phase 3: Tái Sử Dụng UI Components & Tách Nhỏ Layouts `[ĐÃ HOÀN THÀNH]`
> *Mục tiêu: Triệt tiêu các lớp CSS Tailwind lặp lại 10-15 lần, tận dụng các component đã có.*

#### [NEW] [components/ui/AppBreadcrumb.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/AppBreadcrumb.vue)
- Tạo component Breadcrumb dùng chung cho `index.vue`, `[slug].vue`, `blog/[slug].vue` và `admin`.

#### [NEW] [components/ui/AppEmptyState.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/AppEmptyState.vue) & [NotFoundBlock.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/components/ui/NotFoundBlock.vue)
- Gom các block empty/404 lặp lại trong `error.vue` và `blog/[slug].vue` sử dụng 100% Tailwind CSS utility classes.

#### [MODIFY] Refactor các trang sử dụng Component sẵn có
- Áp dụng `AppButton`, `AppBadge`, `AppCard`, `PostCardGrid`, `PostCardList` vào `pages/(public)/index.vue` và `RightSidebar.vue`.

---

### 🗄️ Phase 4: Database & Hoàn Thiện API Thực Cho Admin `[SẴN SÀNG TRIỂN KHÀI]`
> *Mục tiêu: Chuyển toàn bộ Admin Dashboard từ Data giả (Hardcoded) sang SQLite Database.*

#### [MODIFY] [server/utils/db.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/utils/db.ts)
- Bổ sung bảng `contacts` vào SQLite DB.
- Bổ sung các helper CRUD comments (approve, reject, delete) & contacts (get, mark as read, delete).

#### [NEW] API Endpoints mới cho Admin
- `server/api/admin/stats.get.ts` (Lấy tổng số bài viết, bình luận chờ, liên hệ)
- `server/api/admin/comments.get.ts` & `server/api/admin/comments.post.ts` (Duyệt/Xóa comment)
- `server/api/admin/contacts.get.ts` & `server/api/admin/contacts.post.ts` (Xem/Xóa tin nhắn liên hệ)

#### [MODIFY] [pages/(admin)/admin/index.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(admin)/admin/index.vue) & [comments.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(admin)/admin/comments.vue)
- Fetch dữ liệu từ API thực tế thay vì mảng ref tĩnh.

---

### 🔐 Phase 5: Hệ Thống Authentication (JWT/Cookie + OAuth2 Ready) & Layout Admin `[SẴN SÀNG TRIỂN KHÀI]`
> *Mục tiêu: Đăng nhập Admin bảo mật thực sự bằng JWT/Session Cookie nhẹ mượt (dùng Bun/Jose), phân tách giao diện Admin và Public, chuẩn bị sẵn OAuth2.*

#### [NEW] `layouts/admin.vue`
- Tạo Layout riêng cho Admin Dashboard (Sidebar Admin + Topbar Admin độc lập).

#### [NEW] `server/api/auth/login.post.ts` & `server/api/auth/logout.post.ts`
- Xử lý xác thực tài khoản Admin & tạo JWT Token / Session Cookie tự phát triển (sử dụng `Bun.password` / `Jose`).
- Thiết kế mô-đun Auth để có thể tích hợp OAuth2 (Google / GitHub) dễ dàng.

#### [NEW] `server/middleware/admin-auth.ts` & `middleware/admin-auth.ts`
- Bảo vệ các đường dẫn `/admin/**` và `/api/admin/**`. Nếu chưa Auth sẽ redirect tới `/admin/login`.

#### [MODIFY] [pages/(admin)/admin/login.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/pages/(admin)/admin/login.vue)
- Gọi API login thực tế và lưu HttpOnly cookie xác thực.

---

### 📁 Phase 6: Dọn Dẹp Cấu Trúc Codebase & TypeScript Types `[ĐÃ HOÀN THÀNH]`
> *Mục tiêu: Làm sạch dự án, định nghĩa Type rõ ràng trong types/*.ts, xóa code thừa.*

#### [NEW] [types/post.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/types/post.ts), [types/comment.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/types/comment.ts), [types/author.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/types/author.ts), [types/navigation.ts](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/types/navigation.ts)
- Định nghĩa rõ ràng Interface cho Post, Comment, Author, Navigation thay vì dùng `any` tràn lan.

#### [MODIFY] [layouts/default.vue](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/layouts/default.vue)
- Xóa `console.log` debug overlay và class binding thừa.

#### [DELETE] Unused Files
- Xóa `pnpm-workspace.yaml` (dự án đơn không phải monorepo).

---

## 🧪 Verification Plan

### 1. Automated Tests
```bash
# Thử nghiệm chạy bộ test Vitest hiện có
bun run test
```

### 2. Manual Verification
- **Lighthouse Performance Test:** Chạy `bun run build` && `bun run .output/server/index.mjs`, đo điểm Lighthouse trên Chrome DevTools.
- **Admin Auth Test:** Mở tab ẩn danh truy cập `/admin` → Phải bị chặn và chuyển hướng về `/admin/login`.
- **Comment Rate Limit Test:** Gửi liên tiếp 6 bình luận → Bình luận thứ 6 phải báo lỗi 429 Too Many Requests.
- **UI Responsiveness:** Kiểm tra hiển thị trang chủ và bài viết trên Desktop & Mobile.
