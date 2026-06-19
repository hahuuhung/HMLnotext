# Kế hoạch nâng cấp: Tùy chọn Bộ dựng (Render Engine) chuyên sâu (FFmpeg, Remotion & Hybrid)

Kế hoạch này đề xuất nâng cấp tùy chọn Render Engine tại **Render Node** để cung cấp cho người dùng các lựa chọn cấu hình kết xuất chi tiết sử dụng FFmpeg làm nhân lõi, Remotion cho hoạt ảnh React, hoặc cơ chế Hybrid kết hợp cả hai.

## User Review Required

> [!IMPORTANT]
> **Các chế độ Render Engine mới được đề xuất tích hợp:**
> 1. **FFmpeg Core Engine**: Ghép ảnh/video, lồng giọng đọc (voice-over), phụ đề cứng/mềm (subtitle), hiệu ứng chuyển cảnh (transition), chèn logo mờ (watermark) và thay đổi kích thước tỷ lệ (resize).
> 2. **Remotion Engine**: Tạo hoạt cảnh phức tạp, chuyển động động mượt mà dựa trên React Component.
> 3. **Hybrid Engine (Kết hợp)**: Sử dụng Remotion để sinh và kết xuất các phân cảnh (scene) phức tạp riêng lẻ, sau đó dùng FFmpeg ghép nối (assemble) và nén thành tệp video hoàn chỉnh để đạt hiệu năng tối ưu.

---

## Proposed Changes

### 1. Cập nhật Giao diện cấu hình Render Node (Inspector)
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Định nghĩa các state quản lý cấu hình Render Engine trong dự án (lưu vào LocalStorage):
  - `renderEngine`: `'ffmpeg' | 'remotion' | 'hybrid'`
  - **FFmpeg Options**:
    - `ffmpegVideoCodec`: `'libx264' | 'libx265' | 'prores'`
    - `ffmpegCrf`: Giá trị nén CRF (18 - 28)
    - `ffmpegWatermarkText`: Nội dung watermark
    - `ffmpegWatermarkPos`: Vị trí (`top-left`, `top-right`, `bottom-left`, `bottom-right`)
    - `ffmpegResizeMode`: Cách thức resize (`stretch`, `letterbox`, `crop`)
    - `ffmpegTransitionType`: Kiểu chuyển cảnh (`fade`, `slide`, `wipe`)
    - `ffmpegAudioMixBg`: Âm lượng nhạc nền (%)
  - **Remotion Options**:
    - `remotionTemplate`: Tên React Component Template
    - `remotionFps`: Khung hình (`24` | `30` | `60` fps)
    - `remotionConcurrency`: Số luồng render song song (1 - 8)
- Vẽ lại form thuộc tính của **Xuất Bản (Render Node)** trong sidebar Inspector với các trường nhập liệu tương thích theo từng loại Engine được chọn.

### 2. Tinh chỉnh logic Mô phỏng và Logs Hệ thống
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Cập nhật hàm chạy thử `runWorkflow` để sinh ra các thông báo log tùy biến theo từng loại Engine được người dùng cấu hình:
  - *FFmpeg*: Logs về quá trình gộp audio, ghép sub, đặt vị trí logo mờ và codec sử dụng.
  - *Remotion*: Logs về quá trình kết xuất các component React thành các khung hình ảnh.
  - *Hybrid*: Logs về việc phân chia tác vụ sinh scene bằng Remotion và đóng gói cuối cùng bằng FFmpeg.

---

## Verification Plan

### Automated Tests
- Chạy `npx vitest run` kiểm tra toàn bộ luồng xử lý kịch bản.

### Manual Verification
1. Trong màn hình Canvas Workflow, nhấp chọn Node **Xuất Bản (Render Node)**.
2. Kiểm tra xem Bảng thuộc tính bên phải đã hiển thị hộp chọn **Công cụ Render (Engine)** chưa.
3. Chọn lần lượt **FFmpeg**, **Remotion**, **Hybrid** và xác nhận các form cấu hình nâng cao tương ứng hiển thị đúng:
   - Khi chọn *FFmpeg*: Xuất hiện ô nhập Watermark, chọn Codec, Resize, Transition.
   - Khi chọn *Remotion*: Xuất hiện chọn Template, FPS, Số luồng render.
4. Nhấp nút **Chạy thử (Run)** và quan sát log hệ thống chạy các bước giả lập theo đúng thuật toán Render Engine đã thiết lập.
