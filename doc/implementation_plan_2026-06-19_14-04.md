# Kế hoạch nâng cấp tính năng: Thanh Phân Cảnh (Timeline) đa luồng phong cách CapCut

Kế hoạch này đề xuất thiết kế lại và nâng cấp khu vực Phân Cảnh (Timeline) dưới đáy màn hình thành một trình dựng video đa luồng (Multi-track Timeline) chuyên nghiệp tương tự CapCut.

## Giao diện & Trải nghiệm người dùng bổ sung
- **Bố cục đa luồng (Multi-track Layout)**:
  - **Thước đo thời gian (Time Ruler)**: Hiển thị mốc thời gian (0s, 2s, 4s, 6s...) ở trên cùng.
  - **Con trỏ thời gian (Playhead)**: Vạch kẻ dọc màu đỏ di chuyển theo thời gian thực (real-time) khi phát preview video.
  - **Track 1: Hình ảnh / Cảnh phim (Visual Track)**: Các khối hình đại diện (thumbnail) của từng cảnh nối tiếp nhau.
  - **Track 2: Lồng tiếng AI (Audio Track)**: Hiển thị các khối âm sóng (waveform mock) của audio TTS.
  - **Track 3: Phụ đề chữ chạy (Subtitle Track)**: Các khối text phụ đề được xếp lớp tương ứng với thời lượng.
- **Tính năng tương tác**:
  - Khi click vào mốc thời gian trên Ruler, Playhead sẽ nhảy đến vị trí đó và cập nhật frame ảnh xem trước tương ứng.
  - Hiển thị tổng thời lượng video rõ ràng.
  - Thanh thu phóng (Zoom slider) để phóng to/thu nhỏ thời gian trên timeline.

---

## User Review Required

> [!IMPORTANT]
> **Phương án đồng bộ Playhead và Trình phát Video:**
> Khi bấm nút Phát (Play) trên màn hình Xem trước (Preview Screen), Playhead trên Timeline sẽ di chuyển mượt mà từ trái qua phải. Khi hết video, cả hai sẽ tự động dừng và quay về đầu.
>
> Vui lòng xác nhận đề xuất trên để chúng tôi tiến hành cập nhật mã nguồn.

---

## Proposed Changes

### 1. Nâng cấp CSS thiết kế giao diện
- **Modify** [index.css](file:///d:/AntiGravity/HML/src/index.css):
  - Thêm các lớp CSS cho cấu trúc Timeline đa luồng: `.timeline-tracks`, `.timeline-track-row`, `.timeline-track-label`, `.timeline-track-block`.
  - Thiết kế Thước đo `.time-ruler`, Con trỏ thời gian `.playhead` màu đỏ di chuyển bằng CSS transitions/transforms.
  - Thêm phong cách wave audio mock và caption block mock.

### 2. Triển khai logic trong React component
- **Modify** [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx):
  - Viết lại phần hiển thị dưới cùng của tab Timeline.
  - Sử dụng React state để theo dõi vị trí hiện tại của Playhead (`currentTime` tính bằng giây).
  - Tích hợp một vòng lặp `requestAnimationFrame` hoặc `setInterval` tần suất cao để dịch chuyển Playhead mượt mà thay vì nhảy cóc từng cảnh.
  - Khi nhấp chuột vào một khối phân cảnh trên Timeline, phát ngay phân đoạn đó.

---

## Verification Plan

### Automated Tests
- Chạy `npm run test` để đảm bảo không lỗi cú pháp.

### Manual Verification
- Chạy thử workflow để tạo video.
- Kiểm tra hiển thị 3 track (Hình ảnh, Lồng tiếng, Phụ đề) xếp lớp rõ ràng bằng Tiếng Việt.
- Bấm nút Play trên Preview, quan sát vạch đỏ chạy dọc theo các cảnh.
- Nhấp chọn điểm bất kỳ trên thước đo để tua nhanh video.
