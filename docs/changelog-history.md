# 📜 Lịch Sử Thay Đổi & Nhật Ký Fix Lỗi (Changelog & Bug Fix History)

Tổng hợp toàn bộ hành trình làm việc, lịch sử các yêu cầu, các sự cố UI/UX từng gặp và cách giải quyết chi tiết.

---

## 🚩 1. Lịch Sử Yêu Cầu & Quá Trình Phát Triển (Trajectory Log)

### 🔹 Giai Đoạn 1: Tái Thiết Kế Trang Giới Thệu (`pages/about.vue`)
- **Yêu cầu**: Đổi nội dung về chuẩn file Markdown `content/pages/about.md` nhưng phải giữ nguyên rich UI structure.
- **Thực hiện**: Phục hồi bố cục 2 cột cân bằng: Cột trái chứa Thẻ Profile Tác giả, Cột phải chứa 4 Thẻ Tech Stack, Render nội dung Markdown bên dưới và Timeline hành trình học vấn.

### 🔹 Giai Đoạn 2: Tái Thiết Kế Trang Liên Hệ (`pages/contact.vue`)
- **Yêu cầu**: Thiết kế 2 thẻ Card tách biệt side-by-side (`max-w-4xl`), loại bỏ nhãn chữ "Socials" trôi nổi, chia tách thông tin Email/Phản hồi/Vị trí thành từng khối mini-card.
- **Thực hiện**: Triển khai bố cục 2 thẻ Card nét đứt (`5 cols` vs `7 cols`), tạo dải nút Mashup Icon Bar 32x32px cho mạng xã hội và form nhắn tin có state phản hồi thành công.

### 🔹 Giai Đoạn 3: Áp Dụng Chuẩn Mực Preline UI Contact Block Architecture
- **Yêu cầu**: Đọc và tham khảo kiến trúc Contact của Preline UI.
- **Thực hiện**: Tối ưu hóa Cột 1 thành chuỗi **Icon-Blocks Preline UI** (Mỗi kênh liên hệ có khối Icon Badge Tím vuông bo góc `bg-primary-subtle text-primary` + Tiêu đề + Giá trị).

### 🔹 Giai Đoạn 4: Tích Hợp Social Icons Trực Tiếp Vào Thẻ Profile & Tối Ưu Bề Ngang
- **Yêu cầu**: Loại bỏ chữ "Mạng xã hội" và khối thẻ thứ 3 thừa thãi. Tích hợp dải nút Social Icons trực tiếp vào chân Thẻ Profile Tác giả phân tách bằng đường kẻ mờ `border-t border-border-subtle`. Mở rộng dải ngang lên `max-w-5xl` và tối ưu chiều cao vừa vặn khung màn hình (`Viewport-Fit Zero Scroll`).

### 🔹 Giai Đoạn 5: Nâng Cấp Hệ Thống Trang Tĩnh (TOS, Privacy, Disclaimer, FAQ, Sitemap)
- **Yêu cầu**:
  1. Đồng bộ Header Title và Spacing giống 100% trang About/Contact (`space-y-1.5`, `text-2xl font-bold`).
  2. Bổ sung nhãn ngày tháng chữ nghiêng nhỏ `*Cập nhật lần cuối: 01 tháng 08, 2026*`.
  3. Viết lại toàn bộ nội dung Markdown tiếng Việt phong phú cho `tos.md`, `privacy.md`, `disclaimer.md`, `faq.md`, `sitemap.md`.
  4. Tích hợp bộ công cụ **Mục lục Table of Contents (TOC)** cho tất cả các trang nội dung Markdown.
  5. Phân định rõ ràng: Giữ viền nét đứt `border-dashed` làm điểm nhấn cho các thẻ đặc tả cá nhân ở About/Contact, dùng viền liền `border border-border-main` cho các trang điều khoản pháp lý và thẻ CTA Banner.

---

## 🐛 2. Tổng Hợp Các Bug / Sự Cố UI UX Đã Gặp & Cách Fix

| ID | Bug / Sự Cố Gặp Phải | Nguyên Nhân | Cách Giải Quyết Chi Tiết |
| :--- | :--- | :--- | :--- |
| **BUG-01** | Khung bài viết Markdown bị bọc trong Card đen ngột ngạt | Wrap `<ContentRenderer>` vào thẻ `<div class="bg-bg-alt border">` | Loại bỏ thẻ bọc Card, cho prose chảy tự nhiên và chỉ dùng `border-t pt-8` |
| **BUG-02** | Nhãn chữ "Socials" trôi nổi gây mất thẩm mỹ | Để chữ label thuần đứng độc lập trên dải nút | Xóa bỏ chữ label, tích hợp thẳng 4 nút icon 32x32px vào chân thẻ Profile với vạch kẻ mỏng |
| **BUG-03** | Khung Contact Form bị ngắn hơn cột bên trái | Textarea chỉ đặt `rows="3"` và thiếu co dãn dọc | Đặt `rows="4"` và cấu trúc `flex-1 flex flex-col justify-between` |
| **BUG-04** | Nhầm lẫn giữa "Dài Ngang" và "Cao Dọc" làm cuộn trang | Tăng chiều cao dọc thay vì dải ngang | Mở rộng container lên `max-w-5xl` và tinh gọt padding `p-4.5` để fit 100% viewport |
| **BUG-05** | Tiêu đề H1 trang TOS/Privacy có đường gạch đen thô | Sử dụng `border-b pb-6 text-3xl font-bold` | Chuyển sang `space-y-1.5`, H1 `text-2xl font-bold` chuẩn khớp 100% trang About/Contact |
| **BUG-06** | Thẻ CTA Banner bị dùng viền dashed nhầm | Nhầm lẫn áp dụng `border-dashed` toàn bộ | Chuyển thẻ CTA Banner về viền liền `border border-border-main bg-bg-alt/60` |
