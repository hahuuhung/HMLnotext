# Kế hoạch nâng cấp giao diện UI/UX: Chế độ Kdenlive Full Timeline

Kế hoạch này tập trung tối ưu hóa giao diện dòng thời gian (Timeline) ở chế độ Dựng Phim Kdenlive, mô phỏng chân thực phần mềm mã nguồn mở **Kdenlive** (https://kdenlive.org/) với đầy đủ các tính năng chuyên nghiệp của một trình biên tập phi tuyến tính (NLE).

## User Review Required

> [!IMPORTANT]
> **Các điểm cải tiến cốt lõi mô phỏng Kdenlive:**
> 1. **Timecode dạng SMPTE (HH:MM:SS:FF)**: Thay đổi cách hiển thị thời gian hiện tại từ giây đơn thuần thành định dạng khung hình chuẩn điện ảnh (ví dụ: `00:00:04:12` với 25 fps).
> 2. **Công cụ thu phóng (Timeline Zoom)**: Bổ sung thanh trượt điều chỉnh mật độ hiển thị tỉ lệ pixel/giây ở cuối Timeline.
> 3. **Đầu điều khiển Track chuyên nghiệp**: Thay thế tiêu đề track cũ bằng mã hiệu `V2 FX`, `V1 Visual`, `A1 Voice`, `S1 Subs` đi kèm thanh màu phân biệt (Xanh/Đỏ/Tím) và đầy đủ các nút chức năng (Mute, Solo, Hide, Lock).
> 4. **Tương tác biên tập (Trimming/Snapping)**: Bổ sung nút tăng giảm nhanh thời lượng ngay trên block, có chế độ Snap (Bám dính) Playhead.

---

## Proposed Changes

### 1. Giao diện & CSS Kdenlive Timeline
#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Thêm biến màu sắc Breeze Dark đặc thù cho các track Video (V1, V2), Audio (A1), Subtitle (S1).
- Thiết kế thanh Ruler với các vạch chia giây nhỏ chi tiết, hiển thị playhead màu đỏ có bóng và vạch định vị.
- Tạo phong cách cho thanh điều khiển chân Timeline bao gồm: hiển thị Timecode lớn dạng LED/Monospace, bộ chọn FPS, thanh trượt Zoom tỉ lệ, và nút chuyển chế độ Snap.

### 2. Logic điều khiển & hiển thị trong React
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Viết hàm chuyển đổi thời gian sang Timecode chuyên nghiệp: `formatTimecode(seconds, fps)`.
- Thêm trạng thái `timelineZoom` (từ 20px/s đến 120px/s, mặc định 60px/s) để người dùng zoom timeline bằng thanh trượt.
- Tích hợp nút Snap-to-Grid trên Timeline giúp playhead bám dính khi kéo thả.
- Nâng cấp khối hiển thị cảnh (Track Block) cho phép click điều chỉnh thời lượng nhanh (`+` / `-` 1 giây) trực tiếp trên block mà không cần mở bảng thuộc tính.
- Bổ sung nút giả lập "Thêm Track" (Add Track V3/A2) để mang lại cảm giác NLE chân thực của Kdenlive.

---

## Verification Plan

### Automated Tests
- Chạy thử nghiệm Vitest: `npx vitest run` hoặc kiểm tra build dự án để chắc chắn không lỗi TypeScript.

### Manual Verification
- Chuyển sang **Dựng Phim (Kdenlive)**, kiểm tra bố cục Timeline tràn màn hình ở phía dưới.
- Kéo thanh trượt Zoom và quan sát sự co giãn của các phân cảnh trên ruler.
- Nhấp tăng/giảm thời lượng trực tiếp trên block cảnh và theo dõi sự đồng bộ của Time ruler và Playhead.
- Kiểm tra hiển thị timecode LED chạy đồng bộ khi bấm Play.
