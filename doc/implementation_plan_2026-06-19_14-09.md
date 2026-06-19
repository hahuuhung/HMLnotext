# Kế hoạch nâng cấp tính năng: Kéo thả Timeline & Hiệu ứng FX chuyên nghiệp

Kế hoạch này đề xuất mở rộng khả năng tương tác của thanh Phân Cảnh (Timeline) đa luồng: cho phép kéo thả để sắp xếp lại thứ tự cảnh phim và tích hợp một luồng Hiệu ứng hình ảnh chuyên nghiệp (FX Track) hiển thị trực tiếp trên màn hình xem trước (Preview Screen) bằng CSS Filters.

## Giao diện & Trải nghiệm người dùng bổ sung
- **Kéo thả chỉnh sửa phân cảnh (Drag-and-Drop Edit)**:
  - Cho phép người dùng nhấn giữ một phân cảnh trên luồng Hình ảnh và kéo sang trái/phải để hoán đổi vị trí (Reorder) với cảnh khác.
  - Khi hoán đổi, toàn bộ kịch bản, âm thanh và phụ đề tương ứng sẽ được tự động cập nhật lại thời gian theo thứ tự mới.
- **Bộ hiệu ứng FX chuyên nghiệp**:
  - **FX Track mới**: Thêm một luồng riêng biệt mang tên **Hiệu ứng FX** trên Timeline.
  - **Thư viện FX (FX Library)**: Tích hợp các hiệu ứng chọn nhanh trong Inspector:
    1. **Điện ảnh (Cinematic Glow)**: Tăng tương phản và ánh sáng dịu.
    2. **Hoài cổ (Vintage Sepia)**: Hiệu ứng phim nhựa màu nâu cổ kính.
    3. **Trắng đen (Noir Grayscale)**: Video đen trắng nghệ thuật.
    4. **Nhiễu sóng (Glitch Art)**: Hiệu ứng rung nhấp nháy chuyển động.
    5. **Làm mờ (Soft Blur)**: Làm nhòe mượt mà cho các cảnh nền.
  - **Hiển thị FX Real-time**: Khi Playhead chạy qua cảnh có áp dụng hiệu ứng FX, hình ảnh trên màn hình Preview sẽ áp dụng bộ lọc CSS tương ứng (Grayscale, Blur, Sepia, Keyframe Glitch Animation) ngay lập tức.

---

## User Review Required

> [!IMPORTANT]
> **Cách áp dụng hiệu ứng FX:**
> Khi người dùng chọn một cảnh trên Timeline, bảng Inspector bên phải sẽ xuất hiện danh mục **Hiệu ứng FX**. Người dùng chọn một hiệu ứng từ danh sách, khối cảnh đó trên Timeline sẽ có huy hiệu FX (ví dụ: `[FX: Hoài cổ]`) và Preview sẽ cập nhật bộ lọc tương ứng.
>
> Vui lòng xác nhận đề xuất trên để chúng tôi tiến hành viết mã nguồn.

---

## Proposed Changes

### 1. Nâng cấp CSS cho hiệu ứng và kéo thả
- **Modify** [index.css](file:///d:/AntiGravity/HML/src/index.css):
  - Thêm hiệu ứng rung/nhiễu sóng `@keyframes glitch` phục vụ FX Glitch.
  - Thiết kế kiểu dáng khối FX Track và huy hiệu `.fx-badge` màu tím/neon nổi bật.
  - Thêm các lớp filter tương ứng cho ảnh Preview: `.fx-cinematic`, `.fx-vintage`, `.fx-noir`, `.fx-glitch`, `.fx-blur`.

### 2. Triển khai logic kéo thả & FX
- **Modify** [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx):
  - Thêm state lưu trữ hiệu ứng FX của từng cảnh trong danh sách `mockScenes` (ví dụ: `fx: 'none' | 'cinematic' | 'vintage' | 'noir' | 'glitch' | 'blur'`).
  - Thêm các handler kéo thả HTML5 (`onDragStart`, `onDragOver`, `onDrop`) trên các block cảnh phim để thực hiện hoán đổi vị trí cảnh trong mảng.
  - Thêm phần chọn hiệu ứng FX trong bảng thuộc tính của node Render hoặc khi click trực tiếp vào block Cảnh phim.
  - Cập nhật thẻ `<img>` trong Preview Screen để tự động gán class CSS filter tương ứng dựa trên hiệu ứng của cảnh hiện tại.

---

## Verification Plan

### Automated Tests
- Cập nhật `src/workflow.test.ts` để kiểm thử tính năng gán hiệu ứng FX vào cảnh phim.

### Manual Verification
- Chạy thử workflow, bấm vào Cảnh 1 và gán hiệu ứng **Noir Grayscale** (Trắng đen). Quan sát ảnh preview biến thành đen trắng.
- Bấm vào Cảnh 2 và gán hiệu ứng **Glitch Art**. Quan sát màn hình rung nhẹ nghệ thuật.
- Kéo thả khối Cảnh 2 sang vị trí Cảnh 1, kiểm tra thứ tự sắp xếp trên Timeline thay đổi và phụ đề tự động đồng bộ.
