# Kế Hoạch Tái Cấu Trúc Toàn Diện Backend & Kiến Trúc Dự Án (Clean Layered Architecture)

Bản kế hoạch chi tiết nhằm tái tổ chức toàn bộ phần Backend của Median UI Nuxt (Nitro Engine + Bun Runtime + SQLite) theo mô hình **Clean Layered Architecture (Kiến trúc phân tầng sạch)**, tối ưu hiệu năng I/O SQLite trên Bun, phân lập rõ ràng giữa Database, Business Logic (Services), Middleware bảo mật và Transport Layer (API Endpoints).

---

## 🎯 Mục Tiêu Thiết Kế & Nguyên Tắc Đặt Tên (Naming & Clean Code)
- **Tên biến & hàm chuẩn Senior**: Ngắn gọn, súc tích, đúng quy ước TypeScript/Nuxt (`db`, `createContact`, `listContacts`, `verifyCredentials`, `verifyCaptcha`, `checkRateLimit`). Tuyệt đối không đặt tên rườm rà mang phong cách AI.
- **Thin Controllers**: Các tệp API route trong `server/api/` chỉ tiếp nhận request, parse/validate schema, gọi Service và trả về kết quả chuẩn hóa.
- **Pure Domain Services**: Tách toàn bộ nghiệp vụ database và xác thực sang `server/services/` để có thể unit test độc lập mà không cần mock HTTP context.
- **Bun SQLite Performance Tuning**: Tối ưu PRAGMA cho Bun runtime SQLite (`WAL`, `synchronous = NORMAL`, `busy_timeout = 5000`, `cache_size = -64000`).

---

## 📐 Kiến Trúc Thư Mục Mục Tiêu

```text
server/
├── db/
│   ├── client.ts              # [NEW] Khởi tạo singleton Bun SQLite + Performance PRAGMAs
│   └── schema.ts              # [NEW] DDL khởi tạo bảng contacts, indexes
│
├── services/
│   ├── contact.service.ts     # [NEW] Nghiệp vụ Contact (create, list, update status, remove, stats)
│   ├── auth.service.ts        # [NEW] Nghiệp vụ Admin Auth (verify password, session sign/verify, requireAuth)
│   ├── captcha.service.ts     # [NEW] Cloudflare Turnstile token verification
│   └── rate-limit.service.ts  # [NEW] Sliding-window & Burst Rate Limiting Engine
│
├── middleware/
│   ├── 01.guest.ts            # [MODIFY] Gán cookie guest_id bằng native UUIDv7
│   └── 02.admin.ts            # [NEW] Interceptor tự động bảo vệ tất cả endpoint /api/admin/*
│
├── api/
│   ├── contact/
│   │   └── index.post.ts      # [NEW/RENAME] Endpoint gửi tin nhắn liên hệ (POST)
│   └── admin/
│       ├── auth/
│       │   ├── login.post.ts  # [MODIFY] Endpoint đăng nhập admin
│       │   └── check.get.ts   # [MODIFY] Endpoint kiểm tra phiên đăng nhập
│       ├── contacts/
│       │   ├── index.get.ts   # [MODIFY] Endpoint danh sách thư liên hệ phân trang
│       │   └── [id].post.ts   # [MODIFY] Endpoint cập nhật trạng thái/xóa thư
│       └── stats.get.ts       # [MODIFY] Endpoint thống kê admin
│
└── utils/
    ├── id.ts                  # [KEEP] Native Bun.randomUUIDv7 utility
    ├── db.ts                  # [DELETE] (Được phân tách hoàn toàn sang server/db/ và server/services/)
    ├── admin-auth.ts          # [DELETE] (Được chuyển sang server/services/auth.service.ts)
    └── rate-limit.ts          # [DELETE] (Được chuyển sang server/services/rate-limit.service.ts)
```

---

## 🛠️ Chi Tiết Thay Đổi (Proposed Changes)

### 1. Tầng Database (`server/db/`)

#### [NEW] [`server/db/client.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/db/client.ts)
- Khởi tạo kết nối `Database` từ `bun:sqlite`.
- Xác định đường dẫn DB file theo môi trường (`test` / `production`).
- Kích hoạt PRAGMA tối ưu:
  - `PRAGMA journal_mode = WAL;` (cho phép đọc/ghi song song)
  - `PRAGMA synchronous = NORMAL;` (tăng tốc độ ghi disk lên 2-3x mà vẫn an toàn)
  - `PRAGMA busy_timeout = 5000;` (tránh database lock timeout khi ghi đồng thời)
  - `PRAGMA cache_size = -64000;` (dành 64MB memory page cache)
- Cung cấp 2 hàm helper generic type-safe: `queryOne<T>()` và `queryAll<T>()`.

#### [NEW] [`server/db/schema.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/db/schema.ts)
- Hàm `initSchema()` tạo bảng `contacts` và các indexes (`idx_contacts_created_at`, `idx_contacts_status`).
- Tự động gọi khi `client.ts` khởi tạo database.

---

### 2. Tầng Business Services (`server/services/`)

#### [NEW] [`server/services/contact.service.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/services/contact.service.ts)
- `createContact(data: ContactInput, ip?: string): ContactMessage`
- `listContacts(page?: number, pageSize?: number): PaginatedContacts`
- `setContactStatus(id: string, status: "unread" | "read" | "archived"): void`
- `removeContact(id: string): void`
- `getContactStats(): { totalContacts: number; unreadContacts: number }`

#### [NEW] [`server/services/auth.service.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/services/auth.service.ts)
- `verifyCredentials(password: string): Promise<boolean>` (Argon2id qua `Bun.password.verify` hoặc timingSafeEqual cho secret)
- `signSessionToken(sessionId: string, expiresAt: number, secret?: string): string`
- `verifySessionToken(token: string, secret?: string): boolean`
- `createAdminSession(event: H3Event, password: string): Promise<boolean>`
- `verifyAdminSession(event: H3Event): boolean`
- `requireAdminAuth(event: H3Event): void`

#### [NEW] [`server/services/captcha.service.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/services/captcha.service.ts)
- `verifyCaptcha(token?: string, ip?: string, secretKey?: string, verifyUrl?: string): Promise<boolean>`

#### [NEW] [`server/services/rate-limit.service.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/services/rate-limit.service.ts)
- Quản lý sliding window in-memory store với auto-cleanup mỗi 60 giây.
- `checkRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; retryAfter: number }`
- `enforceContactRateLimit(event: H3Event, ip: string): void` (kiểm tra đồng thời cả Burst 3 req / 30s và Window 5 req / 10m)

---

### 3. Tầng Middleware (`server/middleware/`)

#### [MODIFY] [`server/middleware/01.guest.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/middleware/01.guest.ts)
- Tự động gán cookie `guest_id` với UUIDv7 nếu client chưa có cookie.

#### [NEW] [`server/middleware/02.admin.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/middleware/02.admin.ts)
- Tự động kiểm tra authentication cho tất cả request đến `/api/admin/*` (bỏ qua route `/api/admin/auth/login`).

---

### 4. Tầng API Handlers (`server/api/`)

#### [NEW] [`server/api/contact/index.post.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/contact/index.post.ts)
- Thay thế cho `server/api/contact/index.ts` (đặt tên file chuẩn REST method `.post.ts`).
- Thin controller:
  1. `enforceContactRateLimit(event, ip)`
  2. Honeypot check & timing check (< 1.5s)
  3. Validate Valibot schema
  4. `verifyCaptcha(body.captcha_token, ip, config.turnstileSecretKey, config.turnstileVerifyUrl)`
  5. `createContact(result.output, ip)`
  6. Return `{ success: true, code: "SUCCESS", contact }`

#### [MODIFY] [`server/api/admin/auth/login.post.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/admin/auth/login.post.ts)
- Gọi `createAdminSession(event, password)`.

#### [MODIFY] [`server/api/admin/auth/check.get.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/admin/auth/check.get.ts)
- Gọi `verifyAdminSession(event)`.

#### [MODIFY] [`server/api/admin/contacts/index.get.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/admin/contacts/index.get.ts)
- Gọi `listContacts(page, pageSize)`.

#### [MODIFY] [`server/api/admin/contacts/[id].post.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/admin/contacts/%5Bid%5D.post.ts)
- Gọi `setContactStatus(id, action)` hoặc `removeContact(id)`.

#### [MODIFY] [`server/api/admin/stats.get.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/server/api/admin/stats.get.ts)
- Gọi `getContactStats()`.

---

### 5. Cập Nhật Unit Tests

#### [MODIFY] [`tests/unit/contacts-db.test.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/tests/unit/contacts-db.test.ts)
- Import từ `server/services/contact.service.ts`.

#### [MODIFY] [`tests/unit/auth-security.test.ts`](file:///c:/Users/DELL/Desktop/Median%20UI%20v1.7/median-ui-nuxt/tests/unit/auth-security.test.ts)
- Import từ `server/services/auth.service.ts`.

---

## 🧪 Kế Hoạch Xác Minh (Verification Plan)

### Kiểm Thử Tự Động (Automated Tests)
1. **Chạy toàn bộ test suite**:
   ```bash
   bun run test
   ```
   *Yêu cầu*: 100% test files (17 suites, 43+ tests) PASS mà không có lỗi compile hay runtime.

2. **Chạy build production để đảm bảo Nitro server bundle hoàn hảo**:
   ```bash
   bun run build
   ```
   *Yêu cầu*: Nitro build bundle thành công với 0 warnings/errors.
