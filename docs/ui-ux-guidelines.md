# 💡 Bài Học & Quy Chuẩn Rút Ra Sau Các Lần Fix Lỗi UI/UX

Tổng hợp toàn bộ các kinh nghiệm thực chiến và quy tắc vàng được đúc kết qua các lần tinh chỉnh giao diện người dùng.

---

## 🛠️ 1. Các Bài Học Đúc Kết Thực Chiến (Debugging Lessons)

### 📌 Bài Học 1: Tuyệt Đối Không Thêm Rule Vào `main.css`
- **Sự cố từng gặp**: Thêm các quy tắc CSS thủ công làm xung đột với hệ thống màu và class tiện ích của Tailwind CSS v4.
- **Giải pháp đúc kết**: Giữ tệp `assets/css/main.css` sạch sẽ. Mọi kiểu dáng UI phải được định nghĩa bằng class Tailwind trực tiếp trong các tệp Vue Component (`.vue`).

### 📌 Bài Học 2: Cảnh Báo Không Lạm Dụng Modifier `/[number]` Opacity Trong Tailwind v4 & Thứ Tự Chọn Màu
- **Sự cố từng gặp**: Lạm dụng class màu như `bg-bg-alt/60` làm đè thuộc tính opacity lên các phần tử bên trong, khiến giao diện bị mờ đục hoặc hiển thị sai màu nền.
- **Giải pháp đúc kết**:
  - Không lạm dụng `/[number]` cho background.
  - **Luôn ưu tiên 1**: Màu chuẩn mặc định của Tailwind CSS v4 (`bg-zinc-900`, `bg-slate-900`...).
  - **Ưu tiên 2**: Mã màu HEX / OKLCH tùy biến (`bg-[#18181b]`).
  - **Ưu tiên 3**: Chỉ dùng `/[number]` khi làm hiệu ứng kính mờ (Glassmorphism).

### 📌 Bài Học 3: Tối Ưu Tốc Độ Khởi Động Dev Server (Tắt Nuxt DevTools Tránh Warning NUXT_B8014)
- **Sự cố từng gặp**: Cấu hình `devtools: { enabled: true }` gây ra warning `NUXT_B8014` làm chậm quá trình startup dev server trên Bun runtime (> 5 giây).
- **Giải pháp đúc kết**: Chuyển `devtools: { enabled: false }` trong `nuxt.config.ts` giúp server khởi động siêu tốc (< 300ms).

### 📌 Bài Học 4: Tránh Đóng Gói Toàn Bộ Bài Viết Markdown Vào Một Khung Card Đen Khổng Lồ
- **Sự cố từng gặp**: Bọc toàn bộ nội dung prose Markdown vào một thẻ Card đen kín làm giao diện bị tù túng, khó đọc.
- **Giải pháp đúc kết**: Để nội dung prose Markdown chảy tự nhiên trên nền trang (`bg-bg-base`), phân tách bằng đường kẻ mảnh `border-t border-border-subtle pt-8`.

### 📌 Bài Học 5: Kỹ Thuật Đóng Gói Thông Tin Trong Thẻ Mini-Pill (Zero Floating Text)
- **Sự cố từng gặp**: Để chữ thông tin Email, Vị trí nằm lơ lửng làm giao diện thiếu chuyên nghiệp.
- **Giải pháp đúc kết**: Enclose mỗi mục thông tin vào một khối container nhỏ (`rounded-xl border border-border-main bg-bg-alt p-3.5`).

### 📌 Bài Học 6: Kỹ Thuật Scoped Hover (`group/btn`) Trên Nút Bấm Trong Card
- **Sự cố từng gặp**: Khi rê chuột vào thẻ Card lớn bên ngoài, các nút bấm bên trong bị đổi màu đè lên nhau ngoài ý muốn.
- **Giải pháp đúc kết**: Sử dụng `group/btn` trên nút bấm và `group-hover/btn:text-white` để khoanh vùng hiệu ứng hover riêng biệt.

### 📌 Bài Học 7: Phân Biệt "Dài Ngang" (`max-w-5xl`) Và "Phình Cao" (`Viewport-Fit`)
- **Sự cố từng gặp**: Nhầm lẫn giữa kéo dài thẻ theo chiều ngang và kéo phình chiều cao dọc làm xuất hiện thanh cuộn trang vô lý.
- **Giải pháp đúc kết**:
  - Khi cần rộng rãi theo chiều ngang: Tăng `max-w-4xl` lên `max-w-5xl`.
  - Khi cần tối ưu chiều cao: Thu gọn padding (`p-4.5`), giảm `rows` của textarea xuống 3.5-4 dòng để trang hiển thị trọn vẹn 100% trong khung màn hình mà không cần cuộn.

### 📌 Bài Học 8: Chuẩn Hóa Spacing Phần Header Title
- **Sự cố từng gặp**: Sử dụng đường gạch đen dày `border-b pb-6` dưới tiêu đề H1 làm đứt gãy mạch đọc.
- **Giải pháp đúc kết**: Dùng cấu trúc `space-y-1.5` chuẩn mực với Breadcrumb nav `text-sm text-text-alt mb-3`, H1 `text-2xl font-bold text-text-main` và dòng chữ nghiêng ngày cập nhật.

---

## 📋 2. Checklist Kiểm Tra Giao Diện Trước Khi Xuất Bản (Pre-flight Checklist)

- [x] **Trang About & Contact**: Có thẻ Profile Tác giả với Avatar 38px, `@lequan81 • 23 tuổi`, Bio và Mashup Social Bar tích hợp viền mờ bên trong.
- [x] **Thẻ Showcase**: Dùng viền nét đứt `border-dashed border-border-main` làm điểm nhấn nghệ thuật.
- [x] **Thẻ CTA Banner Chân Trang**: Dùng viền liền `border border-border-main`.
- [x] **Các Trang Chính Sách (TOS, Privacy, Disclaimer, FAQ, Sitemap)**: Đã có dòng chữ nghiêng `*Cập nhật lần cuối: 01 tháng 08, 2026*` và nút Mục lục `Table of Contents`.
- [x] **Không Lạm Dụng Opacity Modifier**: Không dùng bừa bãi `/[number]` cho background; tuân thủ thứ tự ưu tiên chọn màu chuẩn của Tailwind v4 trước.
- [x] **Khởi Động Nhanh**: Tắt Nuxt DevTools trong `nuxt.config.ts` để tối ưu thời gian startup server.
- [x] **Phản Hồi Màn Hình (Responsiveness)**: Đã kiểm tra hoàn hảo trên các thiết bị Mobile, Tablet và Desktop.
