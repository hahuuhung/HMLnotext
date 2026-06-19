# Kế hoạch thay thế & Nâng cấp giao diện: Trình soạn thảo video Shotcut (Shotcut NLE Editor)

Kế hoạch này đề xuất thay thế toàn bộ giao diện chế độ Dựng Phim Kdenlive cũ bằng giao diện chuyên nghiệp của phần mềm mã nguồn mở **Shotcut** (https://github.com/mltframework/shotcut), đồng thời bổ sung các tính năng cốt lõi của Shotcut để tăng tính tương tác.

## User Review Required

> [!IMPORTANT]
> **Các tính năng UI/UX nổi bật của Shotcut sẽ được triển khai:**
> 1. **Shotcut Layout**: Bố cục 3 phần tối ưu:
>    - **Bên trái**: Tab đôi giữa **Playlist (Danh sách phát)** và **Filters (Bảng bộ lọc clip)**.
>    - **Bên phải**: **Project Player (Trình xem thử)** đi kèm với cột **Audio Peak Meter (Đo âm lượng dạng cột nhảy dB dọc)** động cực kỳ đặc trưng của Shotcut.
>    - **Dưới cùng**: Multi-track Timeline với thanh công cụ Shotcut.
> 2. **Bảng Bộ lọc (Filters Panel)**: Cho phép nhấp chọn bộ lọc (Cinematic, Vintage, Noir, Glitch, Blur) bằng phím `+` của Shotcut và xem thay đổi ngay trên màn hình.
> 3. **Cột đo âm lượng (Peak Meter)**: Cột đo âm lượng dọc (từ -50dB đến 0dB) với màu xanh/vàng/đỏ tự động nhảy ngẫu nhiên và nhịp nhàng khi phát video.
> 4. **History & Jobs Panel**:
>    - **History**: Lưu lại lịch sử thao tác của người dùng.
>    - **Jobs**: Hiển thị trạng thái các tác vụ xuất bản video (Export Jobs).

---

## Proposed Changes

### 1. Nâng cấp CSS thiết kế giao diện Shotcut
#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Xây dựng các lớp CSS cho Shotcut theme (tông màu sẫm tối đặc trưng của Shotcut).
- Thiết kế giao diện cột Peak Meter dọc với các vạch phân chia dB và hiệu ứng nhấp nháy chuyển màu xanh/vàng/đỏ.
- Tạo phong cách cho Playlist, Filters, History, và Jobs.

### 2. Triển khai các tính năng Shotcut trong React
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Thay đổi nút bật tắt chế độ thành **Dựng Phim (Shotcut)**.
- Triển khai trạng thái và giao diện cho:
  - **Playlist**: Thêm/xóa tài nguyên trong danh sách phát.
  - **Filters**: Cho phép người dùng nhấp `+` để thêm bộ lọc hiệu ứng vào cảnh hiện tại, hỗ trợ tìm kiếm bộ lọc.
  - **Audio Peak Meter**: Sử dụng `requestAnimationFrame` (đồng bộ với Playhead) để tạo hiệu ứng cột âm lượng nhảy động ngẫu nhiên khi video đang `playing`.
  - **History**: Tự động push nhật ký mỗi khi người dùng thay đổi FX, trimming hoặc sắp xếp cảnh.
  - **Jobs**: Hiển thị hàng đợi xuất file MP4.
- Cập nhật các văn bản hiển thị giao diện sang Tiếng Việt.

---

## Verification Plan

### Automated Tests
- Chạy `npx vitest run` kiểm tra toàn bộ luồng kiểm thử.

### Manual Verification
- Chuyển sang chế độ **Dựng Phim (Shotcut)**.
- Bấm nút Play trên Project Player, kiểm tra cột đo âm lượng có nhảy nhịp nhàng theo nhịp phát không.
- Nhấp chọn cảnh trên Timeline, mở tab **Filters**, bấm `+` để thêm các bộ lọc hình ảnh mới và xem kết quả hiển thị trên player.
- Thực hiện một vài thao tác cắt/tỉa/FX và kiểm tra xem danh sách lịch sử (History) có cập nhật đầy đủ không.
