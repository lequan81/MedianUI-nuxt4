# 👑 Project Vibe Manifesto — Median UI v1.7 x Preline UI

> **Triết lý cốt lõi**: *"Một sản phẩm tốt không chỉ chạy nhanh và an toàn, mà phải mang lại trải nghiệm đọc bài tối giản, mượt mà, đẳng cấp và giàu tính thẩm mỹ nhất cho người dùng."*

---

## 🎨 1. Định Định Danh Giao Diện & Vibe (Core Aesthetic Identity)

Website được xây dựng trên sự giao thoa hoàn hảo giữa hai ngôn ngữ thiết kế hàng đầu:
- **Median UI v1.7**: Phong cách thiết kế Blog cá nhân tối giản, tập trung vào Typography chuẩn mực, bố cục 2 cột cân bằng, hệ thống icon gọn gàng và trải nghiệm đọc tuyệt đối không giật lag.
- **Preline UI Best Practices**: Cấu trúc khối **Icon-Blocks** hiện đại, các thẻ Card có viền phân tách rõ ràng, các chi tiết viền nét đứt (`border-dashed`) làm điểm nhấn nghệ thuật và bố cục co dãn linh hoạt (`flex-1`).

---

## 💎 2. Các Tuyên Ngôn Bắt Buộc Tuân Thủ (Strict Design Rules)

### 🚫 Quy Tắc 1: Không Viết CSS Tùy Biến Vào `main.css`
- **TỔNG LỆNH**: Tuyệt đối **KHÔNG** thêm các quy tắc CSS tùy biến thủ công vào tệp `assets/css/main.css`.
- **Thực thi**: Sử dụng 100% class tiện ích của **Tailwind CSS v4** trực tiếp trên thẻ HTML / Vue Template để duy trì tính nhất quán và dễ bảo trì.

### ⚠️ Quy Tắc 2: Không Lạm Dụng Modifier `/[number]` Opacity Trong Tailwind CSS v4 & Ưu Tiên Chuẩn Màu
- **CẢNH BÁO NGUY HIỂM**: Tuyệt đối **không lạm dụng modifier `/[number]`** cho background (Ví dụ: `bg-bg-alt/60`, `bg-primary/20`), vì nó sẽ vô tình áp dụng thuộc tính Opacity/Alpha channel không mong muốn lên các phần tử con, gây ra lỗi hiển thị hoặc xuyên thấu màu nền kém sang.
- **Thứ Tự Ưu Tiên Chọn Màu (Color Selection Order)**:
  1. **Ưu tiên 1**: Màu chuẩn có sẵn của Tailwind CSS v4 (`bg-zinc-900`, `bg-slate-900`, `bg-purple-950`...).
  2. **Ưu tiên 2**: Mã HEX / OKLCH chuẩn tùy biến (`bg-[#18181b]`, `bg-[oklch(...)]`).
  3. **Ưu tiên 3**: Chỉ dùng `/[number]` khi thực sự làm hiệu ứng kính mờ (Glassmorphism / Backdrop Blur).

### 📦 Quy Tắc 3: Không Để Văn Bản Trôi Nổi (Zero Naked Floating Text)
- Tất cả các khối thông tin (Email, Vị trí, Thời gian phản hồi, Mạng xã hội, Tác giả, v.v.) phải được đóng gói gọn gàng bên trong các **thẻ container mini** (`rounded-xl border bg-bg-alt p-4`).
- Tuyệt đối không để chữ nằm trôi nổi tự do không có khung viền bảo vệ.

### 🧭 Quy Tắc 4: Tiêu Đề & Khung Chứa Đồng Bộ 100% (`max-w-4xl` & `max-w-5xl`)
- Các trang nội dung bài viết và trang chính sách (`about.vue`, `tos.vue`, `privacy.vue`, `disclaimer.vue`, `faq.vue`, `sitemap.vue`) tuân thủ nghiêm ngặt chiều rộng `max-w-4xl`.
- Riêng trang Liên hệ (`contact.vue`) sử dụng `max-w-5xl` để 2 cột duỗi dài ngang rộng rãi, không bị phình to chiều cao.

### 🖼️ Quy Tắc 5: Quản Lý Đường Viền Điểm Nhấn (`Border Logic`)
- **Viền Nét Đứt (`border-dashed border-border-main`)**: Dùng làm **điểm nhấn nghệ thuật (Artistic Highlight)** cho các thẻ Showcase đặc biệt trên trang `about.vue` và `contact.vue` (Thẻ Tác giả, Thẻ Tech Stack, Thẻ Form tin nhắn, Khối Icon-Blocks).
- **Viền Liền Solid (`border border-border-main`)**: Dùng cho các trang điều khoản pháp lý chính thống (`tos`, `privacy`, `disclaimer`, `faq`, `sitemap`) và thẻ Banner CTA chân trang để tạo sự trang trọng, minh bạch.

### ⏱️ Quy Tắc 6: Dòng Ghi Chú Thời Gian Cập Nhật (`Last Updated Note`)
- Tất cả các trang chính sách và nội dung quan trọng phải có dòng chữ nghiêng nhỏ màu xám kèm icon đồng hồ màu tím:
  ```html
  <div class="flex items-center gap-1.5 pt-0.5 text-xs text-text-muted italic">
    <AppIcon name="clock" :size="13" class="text-primary shrink-0" />
    <span>Cập nhật lần cuối: 01 tháng 08, 2026</span>
  </div>
  ```

---

## 🎯 3. Mục Tiêu Trải Nghiệm Người Dùng (UX Goals)

1. **Hiển Thị Vừa Vặn Khung Màn Hình (`Viewport-Fit Zero Scroll`)**: Trang Liên hệ phải hiển thị trọn vẹn 100% trên màn hình desktop/laptop mà không xuất hiện thanh cuộn dọc không cần thiết.
2. **Thao Tác Nhanh & Trực Quan**: Tất cả các nút bấm, liên kết mạng xã hội (Icon-Only Mashup Bar 32x32px), ô nhập liệu đều có hiệu ứng phản hồi hover mượt mà (`hover:scale-105 hover:border-primary`).
3. **Mục Lục Tự Động (`Table of Contents`)**: Mọi trang bài viết & nội dung dài đều được trang bị nút xem Mục lục nhanh giúp người đọc điều hướng tức thì.
