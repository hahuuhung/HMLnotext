# Kế hoạch nâng cấp tính năng: AI Templates, Voiceover Pipeline & Agent Orchestration

Kế hoạch này đề xuất mở rộng ứng dụng No-code Video Workflow Builder để hỗ trợ thêm các tính năng nâng cao: các mẫu chạy tự động (Templates), luồng âm thanh phụ đề (Voiceover/Subtitle) và bảng giám sát hoạt động của các AI Agent (Agent Orchestration).

## Giao diện & Trải nghiệm người dùng bổ sung
- **Thư viện Mẫu (Templates)** ở Sidebar trái để người dùng chọn nhanh:
  1. **Prompt-to-Video**: Tạo nhanh video từ ý tưởng văn bản.
  2. **Tài liệu sang Video (Document-to-Video)**: Phân tích file tài liệu thành kịch bản phim.
  3. **Blog sang Social Video (Blog-to-social-video)**: Quét link bài viết, chuyển thể thành video ngắn tỷ lệ dọc.
- **Node mới**:
  - **Tài liệu (Document Node)**: Cho phép upload file (.txt/.pdf mock).
  - **Liên kết Web (URL Node)**: Nhận link bài viết.
  - **Lồng tiếng AI (Audio TTS Node)**: Chọn giọng đọc (Nam/Nữ, vùng miền).
  - **Phụ đề (Subtitle Node)**: Điều chỉnh kiểu chữ, màu sắc chữ cho video.
- **Bảng giám sát AI Agents (Agent Orchestration Console)**:
  - Hiển thị nhật ký hội thoại giữa các Agent (Ví dụ: Biên kịch Agent tranh luận với Đạo diễn Agent để sửa đổi và tối ưu kịch bản).

---

## User Review Required

> [!IMPORTANT]
> **Phương án thiết kế giao diện Agent Orchestration:**
> Chúng tôi đề xuất hiển thị luồng Agent Orchestration ở góc dưới bên trái màn hình hoặc tích hợp trực tiếp vào tab Console Logs dưới dạng một giao diện trò chuyện thời thực (Chat Terminal) giữa các Agent. 
> Vui lòng xác nhận bạn đồng ý với hướng thiết kế này.

---

## Proposed Changes

### 1. Nâng cấp components & custom nodes
- **Modify** [CustomNodes.tsx](file:///d:/AntiGravity/HML/src/components/CustomNodes.tsx):
  - Thêm `DocInputNode` (Node nhận tệp).
  - Thêm `UrlInputNode` (Node nhận link bài viết).
  - Thêm `AudioTTSNode` (Node lồng tiếng).
  - Thêm `SubtitleNode` (Node phụ đề).
- **Modify** [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx):
  - Thêm menu lựa chọn **Templates** tại Sidebar trái. Nhấp vào mẫu sẽ tự động cấu hình các Node và kết nối trên Canvas.
  - Thêm chức năng thiết lập giọng đọc và font chữ phụ đề trong Inspector Panel.
  - Thiết kế thêm tab **Hội thoại Agents (Agent Orchestration)** bên cạnh tab Timeline và Console Logs để hiển thị hoạt động phối hợp của các Agent.

---

## Verification Plan

### Automated Tests
- Chạy `npm run test` để xác minh các node mới và luồng hoạt động tích hợp không gây lỗi build.

### Manual Verification
- Chọn template "Blog sang Social Video" và xem canvas tự động tạo và nối các node phù hợp.
- Nhấp chạy thử và theo dõi màn hình hội thoại giữa các Agent (Script Agent, Voice Agent, Editor Agent) trao đổi ý kiến.
- Kiểm tra tính năng lồng tiếng (TTS) phát thử âm thanh mock và điều chỉnh font chữ hiển thị trực quan.
