# Mockup & Trải nghiệm giao diện người dùng (UX Mockup)

Dưới đây là sơ đồ bố trí giao diện người dùng (UI layout) và phân bổ chức năng của ứng dụng:

![UI Layout Mockup](file:///C:/Users/Asus/.gemini/antigravity-ide/brain/975020c0-d0f2-4bce-aca3-ef1359ad0e98/ui_layout_mockup_1781851001255.png)

## Các phân khu chức năng chính

### 1. Panel bên trái: Node Palette & Danh sách Mẫu (Templates)
- **Danh sách mẫu (Templates)**: Giúp tạo nhanh luồng kịch bản dựng sẵn:
  - **Prompt sang Video**: Tạo nhanh từ prompt.
  - **Tài liệu sang Video**: Cung cấp trường tải lên tài liệu và phân tích.
  - **Blog sang Social Video**: Nhập URL bài viết và tự động thiết lập khung hình dọc.
- **Node Palette**: Thêm các Node mới:
  - **Tài Liệu**: Tải lên tệp đầu vào.
  - **Liên Kết Blog**: Nhập đường dẫn web.
  - **Lồng Tiếng AI**: Cấu hình âm thanh.
  - **Phụ Đề**: Thêm chữ chạy kèm.

### 2. Khu vực trung tâm: Canvas Workflow (React Flow)
Không gian làm việc chính để kéo thả các Node và kết nối chúng bằng đường truyền (Edge). Hỗ trợ các kiểu kết nối linh hoạt từ nhiều luồng đầu vào khác nhau.

### 3. Panel bên phải: Inspector Panel (Cấu hình chi tiết)
Hiển thị cấu hình cho các node mới:
- **Tài liệu (Doc Node)**: Chọn tệp tải lên (mock PDF/TXT).
- **Liên kết Blog (Url Node)**: Ô nhập địa chỉ URL của trang blog.
- **Lồng Tiếng AI (Audio TTS)**: Lựa chọn giọng đọc Nam/Nữ, vùng miền (Bắc/Trung/Nam) và tốc độ phát âm thanh.
- **Phụ Đề (Subtitle Node)**: Chọn font chữ nghệ thuật (TikTok, Vintage, Modern), cỡ chữ và màu sắc nổi bật.

### 4. Bảng điều khiển phía dưới: Timeline, Console & Agent Orchestration
Bổ sung tab theo dõi **Hội thoại Agents (Agent Orchestration)**:
- Hiển thị cửa sổ trò chuyện thời gian thực giữa **Biên Kịch Agent** và **Đạo Diễn Agent**.
- Mô phỏng quá trình các Agent phân tích kịch bản đầu vào, đóng góp ý tưởng chỉnh sửa hình ảnh, và cùng thống nhất bản cuối trước khi đưa vào render.

