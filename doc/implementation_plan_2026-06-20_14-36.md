# Kế hoạch Nâng cấp Giao diện & Tính năng theo Mockup Thiết kế

Kế hoạch này chi tiết hóa việc thay đổi giao diện và bổ sung các tính năng tương tác của HML Video Editor để khớp 100% với 4 bản thiết kế Mockup (SynthoFlow Workflow, NLE Professional Editor, AI Suggestions Glassmorphism và Application Settings).

---

## 1. Nâng cấp Giao diện Workflow & Canvas (Mockup 4: `sidebar_workflow_palette`)

### Thay đổi Dự kiến:
- **Tên và Logo Thương hiệu**: Đổi tiêu đề thành `SynthoFlow` và nâng cấp thiết kế header.
- **Thanh menu slim-sidebar**: Cập nhật các menu dọc: `Dashboard` (Grid), `Quy trình` (PlaySquare), `Thư viện` (Layers), `Settings` (Settings).
- **Nodes Palette (Nút & Luồng)**:
  - Thêm ô tìm kiếm Node: `Tìm kiếm nút...` để lọc nhanh danh sách.
  - Thiết kế lại các thẻ Node Palette dạng card bo góc nổi bật với màu sắc tương ứng:
    - **Kích hoạt (Trigger)**: Màu xám đen (`#334155`).
    - **AI Script (AI script)**: Màu tím (`#a855f7`).
    - **TTS lồng tiếng (TTS voiceover)**: Màu cam (`#f97316`).
    - **Xuất bản (Publish)**: Màu xanh lá (`#10b981`).
- **Canvas Thiết kế**:
  - Đổi nền sang dạng lưới ca-rô nhỏ chuyên nghiệp.
  - Thêm bộ nút điều khiển thu phóng (`+`, `-`, `Zoom-to-fit`) ở góc dưới bên trái của vùng Canvas.

---

## 2. Nâng cấp Trình dựng phim NLE chuyên nghiệp (Mockup 2: `nle_editor`)

### Thay đổi Dự kiến:
- **Danh sách Playlist**:
  - Hiển thị đầy đủ tên file, phụ chú chi tiết (ví dụ: `Khoa định: Cảnh 1 : Sản phẩm`), và nút bấm `Thêm vào timeline` màu xanh dương nổi bật cho từng item.
- **Video Player Scrubber & Controls**:
  - Thiết kế lại thanh tiến trình phát video (scrubber) bằng màu tím chuyển sắc thời thượng.
  - Thêm nút **Play/Pause lớn hình tròn màu xanh lá** nằm chính giữa các nút tua điều hướng.
- **Timeline Toolbar**:
  - Bổ sung hàng icon công cụ phía trên Timeline: Mở tệp, Quét/Camera, Tải lên, Cắt Razor (R), Tốc độ, Nhãn/Marker, Chữ, Phụ đề, Khóa/Mở khóa, Thu âm, Thùng rác (Xóa).
  - Thêm bộ lọc thu phóng dòng thời gian (`zoom-slider`) ở phía bên phải.
- **Panel Properties bên phải**:
  - Thiết kế slider điều chỉnh thời lượng tinh tế.
  - Form cấu hình đầy đủ: Tiêu đề, Phụ đề/Lời bình, Bộ lọc FX, Chuyển cảnh, Hiệu ứng nền, Tốc độ (dưới dạng các Dropdown).

---

## 3. Thẻ Gợi ý AI dạng Glassmorphism (Mockup 1: `ai_suggestions`)

### Thay đổi Dự kiến:
- Khi người dùng click nút **"🪄 Nhận Gợi ý Hiệu ứng AI"**, thay vì chỉ hiển thị text đơn giản trong thanh bộ lọc, hệ thống sẽ mở một **Popup Glassmorphism mờ cực đẹp đè lên vùng màn hình xem trước**.
- Popup sẽ hiển thị:
  - **Chuyển cảnh gợi ý**: `Glitch` (kèm hình ảnh preview nhỏ của hiệu ứng nhiễu sóng).
  - **Hiệu ứng nền gợi ý**: `Vũ trụ sao (Starfield)` (kèm hình ảnh preview dải ngân hà).
  - **Tốc độ gợi ý**: `Fast 1.5x`.
  - Nút **"🪄 Áp dụng gợi ý AI"** có hiệu ứng gradient tím/xanh dương và bóng mờ nổi bật.

---

## 4. Hộp thoại Cấu hình Settings & Xuất bản .mlt (Mockup 3: `shotcut_integration`)

### Thay đổi Dự kiến:
- Thêm nút Cài đặt (bánh răng) trên thanh công cụ NLE để mở popup **"Cài Đặt Ứng Dụng"**.
- Popup cho phép người dùng cấu hình:
  - Chọn Render Engine hiện tại: `Shotcut MLT Engine`, `FFmpeg`, `Remotion`, `Hybrid`.
  - Đường dẫn chạy `melt.exe` kèm nút "Duyệt..." chọn file.
  - Các cấu hình phụ khác (Tự động lưu, Thiết lập giao diện, Tùy chọn âm thanh).
- Thêm nút **"Xuất Dự Án (.mlt)"** nổi bật ở panel góc dưới để người dùng tải trực tiếp tệp tin XML `.mlt` dùng cho Shotcut.

---

## Kế hoạch Xác minh (Verification Plan)

### Automated Tests
- Chạy `npm run build` để kiểm tra toàn vẹn mã nguồn React/TypeScript.

### Manual Verification
1. Mở app, chọn chế độ **Workflow (n8n)** -> Kiểm tra giao diện tìm kiếm Node và kiểu dáng card Node mới.
2. Kiểm tra bộ zoom góc trái canvas hoạt động tốt.
3. Chọn chế độ **Dựng Phim (Shotcut)** -> Xem Playlist pool và nút `Thêm vào timeline`.
4. Nhấn chọn công cụ và kiểm tra Timeline Toolbar mới.
5. Click **"Nhận Gợi ý Hiệu ứng AI"** -> Xác nhận popup Glassmorphism nổi bật hiển thị đầy đủ hình ảnh minh họa và click **Áp dụng gợi ý AI** hoạt động đúng logic.
6. Click nút **Cài đặt** -> Cài đặt đường dẫn `melt.exe`, chọn `Shotcut MLT Engine` và lưu lại thành công.
7. Click **Xuất Dự Án (.mlt)** -> Xác nhận trình duyệt tải xuống tệp tin `.mlt` XML chính xác.
