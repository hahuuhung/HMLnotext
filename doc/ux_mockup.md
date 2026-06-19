# Mockup & Trải nghiệm giao diện người dùng (UX Mockup)

Dưới đây là sơ đồ bố trí giao diện người dùng (UI layout) và phân bổ chức năng của ứng dụng:

![UI Layout Mockup](file:///C:/Users/Asus/.gemini/antigravity-ide/brain/975020c0-d0f2-4bce-aca3-ef1359ad0e98/ui_layout_mockup_1781851001255.png)

## Các phân khu chức năng chính

### 1. Panel bên trái: Node Palette (Danh sách Node)
Cho phép người dùng kéo thả các node vào Canvas:
- **Kích hoạt (Trigger)**: Node bắt đầu chạy.
- **Đầu vào (Input)**: Prompt chủ đề, tài liệu text.
- **Xử lý AI (AI Script)**: Node phân tích kịch bản.
- **Hình ảnh (Visual)**: Chọn hoặc tạo ảnh minh họa.
- **Render (Xuất bản)**: Cấu hình xuất video MP4.

### 2. Khu vực trung tâm: Canvas Workflow (React Flow)
Không gian làm việc chính để kéo thả các Node và kết nối chúng bằng đường truyền (Edge). Mỗi Node có các trạng thái trực quan:
- **Đang chờ (Idle)**: Màu xám/viền nhạt.
- **Đang chạy (Running)**: Viền xanh lá xoay nhẹ.
- **Hoàn thành (Success)**: Nền xanh lá nhạt, có dấu tích xanh.
- **Lỗi (Error)**: Nền đỏ nhạt, có dấu cảnh báo.

### 3. Panel bên phải: Inspector Panel (Cấu hình chi tiết)
Khi nhấp chọn một Node, Panel bên phải hiển thị cấu hình tương ứng hoàn toàn bằng **Tiếng Việt**:
- Ví dụ với AI Script Node: Lựa chọn độ dài kịch bản, giọng điệu (vui vẻ, nghiêm túc, truyền cảm), prompt bổ sung.
- Nút "Chạy thử Node này" để debug riêng lẻ.

### 4. Bảng điều khiển phía dưới: Timeline Preview & Trình theo dõi
Hiển thị timeline video sau khi chạy thành công:
- **Timeline**: Các Scene được xếp theo thứ tự thời gian kèm text phụ đề.
- **Trình phát Video (Preview Player)**: Xem trước hình ảnh/video mockup.
- **Bảng điều khiển console**: Hiển thị nhật ký log chạy chi tiết theo thời gian thực (real-time).
