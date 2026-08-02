# 📐 Tài Liệu Thiết Kế (Design System Architecture)

Tài liệu chi tiết về hệ thống thiết kế **Median UI v1.7 x Preline UI** áp dụng cho toàn bộ ứng dụng Nuxt 4.

---

## 🎨 1. Bảng Màu & Color Tokens (Color System)

| Token Name | Tailwind Utility | Mục Sử Dụng |
| :--- | :--- | :--- |
| **Primary** | `text-primary`, `bg-primary`, `border-primary` | Màu tím thương hiệu chủ đạo (Accent Violet) |
| **Primary Subtle** | `bg-primary-subtle` | Nền mờ tím nhẹ cho Badge, Icon container |
| **Background Base** | `bg-bg-base` | Màu nền chính toàn trang |
| **Background Alt** | `bg-bg-alt` | Nền thẻ Card chính (Card background) |
| **Background Secondary**| `bg-bg-sec` | Nền của ô input, button, mini pill |
| **Border Main** | `border-border-main` | Viền khung thẻ Card chính |
| **Border Subtle** | `border-border-subtle` | Đường gạch phân cách con bên trong thẻ |
| **Text Main** | `text-text-main` | Chữ tiêu đề, văn bản chính (Độ tương phản cao) |
| **Text Alt** | `text-text-alt` | Chữ đoạn văn, mô tả phụ |
| **Text Muted** | `text-text-muted` | Chữ ghi chú nhỏ, ngày tháng, breadcrumb |

### ⚠️ 1.1 Quy Tắc Chọn Màu & Cảnh Báo Modifier `/[number]` Opacity Trong Tailwind CSS v4

- **Cảnh báo về `/[number]`**: Không lạm dụng cú pháp `bg-color/[number]` (như `bg-bg-alt/60`, `bg-primary/20`) vì nó làm thay đổi thuộc tính Opacity/Alpha của màu nền, có thể dẫn tới việc làm mờ luôn các phần tử con hoặc gây lỗi render đè màu không mong muốn.
- **Thứ Tự Ưu Tiên Màu Nhất Định Phải Tuân Thủ**:
  1. **Ưu tiên 1**: Sử dụng **màu chuẩn sẵn có của Tailwind CSS v4** (`bg-zinc-900`, `bg-slate-900`, `bg-purple-950`...).
  2. **Ưu tiên 2**: Sử dụng **mã màu tùy biến chuẩn HEX / OKLCH** (`bg-[#18181b]`, `bg-[oklch(...)]`).
  3. **Ưu tiên 3**: Chỉ sử dụng modifier `/[number]` khi tạo hiệu ứng kính mờ đặc thù (Glassmorphism / Glow Blur).

---

## 🔤 2. Hệ Thống Font Chữ & Typography (Typography System)

- **Trang chủ & Bài viết**: Sử dụng font chữ hiện đại (Inter / Outfit / Roboto).
- **H1 (Page Title)**: `text-2xl font-bold text-text-main` (Chuẩn mực khoảng thở `space-y-1.5`, không dùng gạch viền đen thô).
- **H2 (Section Header)**: `text-sm sm:text-base font-bold text-text-main`.
- **Paragraph (Thân bài)**: `text-xs sm:text-sm leading-relaxed text-text-main/90`.
- **Last Updated Note**: `text-xs text-text-muted italic flex items-center gap-1.5`.

---

## 📐 3. Bố Cục & Layout Boundaries (Grid & Container System)

1. **Max Width Container**:
   - `max-w-4xl` (~896px): Dành cho các trang đọc bài và trang tĩnh chính sách (`about.vue`, `tos.vue`, `privacy.vue`, `disclaimer.vue`, `faq.vue`, `sitemap.vue`).
   - `max-w-5xl` (~1024px): Dành riêng cho trang Liên hệ (`contact.vue`) giúp form duỗi dài ngang thoáng đãng.
2. **Cấu Trúc 2 Cột Sóng Đôi (`lg:grid-cols-12`)**:
   - **Cột Trái (5 Cột - `lg:col-span-5`)**: Chứa Thẻ Profile Tác Giả & Khối Thông Tin Liên Hệ Icon-Blocks.
   - **Cột Phải (7 Cột - `lg:col-span-7`)**: Chứa Thẻ Form Tin Nhắn Hoặc Khối Nội Dung Kỹ Năng Tech Stack.
   - **Chiều cao cân bằng 100%**: Sử dụng `items-stretch` ở Grid và `flex-1 flex flex-col justify-between` ở Child Divs.

---

## 🧩 4. Quy Chuẩn Components (Component Standards)

### 👤 A. Thẻ Tác Giả Integrated Profile Card
- **Cấu trúc**: Avatar 38px (`h-9.5 w-9.5 rounded-full ring-2 ring-primary/20`), Tên `Lê Quân`, nhãn `@lequan81 • 23 tuổi`, Bio ngắn.
- **Tích hợp Social Bar**: Dải 4 nút Icon-Only Social Buttons (`32x32px rounded-lg`) được tích hợp trực tiếp ở chân thẻ, phân tách bằng vạch kẻ mỏng `pt-3.5 border-t border-border-subtle` (Không chứa chữ "Mạng xã hội" trôi nổi).

### ✉️ B. Khối Preline UI Icon-Blocks (Contact Info)
- **Cấu trúc**: Mỗi kênh liên hệ sở hữu 1 khối Icon Badge Tím vuông bo góc (`h-8.5 w-8.5 rounded-lg bg-primary-subtle text-primary`) đặt cạnh Tiêu đề (`text-xs font-bold`) và Giá trị liên hệ (`text-xs text-text-alt`).

### 📝 C. Form Tin Nhắn Contact Form
- **Trường nhập liệu**: Ô `input` và `textarea` màu nền `bg-bg-sec`, viền `border-border-main`, focus đổi màu tím `focus:border-primary focus:ring-1 focus:ring-primary`.
- **Nút Gửi Tin Nhắn**: Sử dụng Scoped Hover `group/btn` để đổi màu nền và icon mượt mà không bị ảnh hưởng bởi thẻ hover ngoài.

### ❓ D. Khối Accordion FAQ
- **Cấu trúc**: Các thẻ Accordion với số thứ tự Badge tím `1, 2, 3, 4` bo góc, icon mũi tên quay 180 độ khi mở (`rotate-180 text-primary`).
