# Kế hoạch Kỹ thuật: Bảng điều khiển Tools (Dashboard Flow) & Trợ lý Prompt AI

Kế hoạch này tích hợp thêm một chế độ xem thứ ba (Mode Tools Dashboard) tương tự như Google Flow (Vertex AI Agent Builder) để quản lý các công cụ bổ trợ (Tools) cho AI Agents, hỗ trợ sinh Prompt/Mô tả công cụ bằng Trợ lý AI và khu vực chạy thử nghiệm Playground.

---

## User Review Required

> [!IMPORTANT]
> Tất cả các văn bản hiển thị trên giao diện sẽ tuân thủ nghiêm ngặt quy tắc Tiếng Việt và phong cách thiết kế Breeze Light/Breeze Dark cao cấp của dự án.
> Tính năng này sẽ được kích hoạt thông qua nút **"Bảng Điều Khiển Tools"** trên thanh công cụ header chính.

---

## Proposed Changes

### [Component Frontend]

#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Cập nhật kiểu dữ liệu `editorMode` để hỗ trợ thêm giá trị `'tools'`.
- Khai báo state lưu trữ danh sách các công cụ `tools` (được đồng bộ hóa với LocalStorage) và công cụ đang được chọn để cấu hình `selectedTool`.
- Khởi tạo danh sách các công cụ mặc định:
  - **Google Search**: Tra cứu thông tin thời gian thực.
  - **LLM Scriptwriter**: Biên soạn kịch bản từ dàn ý.
  - **Stable Diffusion Visual**: Sinh ảnh minh họa AI.
  - **TTS Voice Synthesizer**: Lồng tiếng AI từ lời thoại.
  - **Social Auto-Publish**: Đăng video tự động qua Webhook API.
- Bổ sung giao diện Dashboard của Tools ở chế độ `editorMode === 'tools'`:
  - **Cột Trái (Danh sách Tools)**: Hiển thị danh sách card các công cụ, trạng thái kích hoạt (Active/Inactive), loại công cụ (Search/AI/API/Code) và nút tạo mới `+ Tạo Công Cụ Mới`.
  - **Cột Phải (Cấu hình Chi tiết & Playground)**:
    - Form chỉnh sửa: Tên, Mô tả, Endpoint URL, Các tham số đầu vào.
    - **Trợ Lý Sinh Prompt AI (Prompt Generator Helper)**: Một hộp nhập ý tưởng hoạt động của Tool (ví dụ: *"Tôi muốn tạo một tool để kiểm tra xem một sản phẩm thương mại có còn hàng trên Shopee hay không"*) và nút **"🤖 Sinh Prompt/Mô tả Công Cụ bằng AI"**. Khi click, hệ thống mô phỏng LLM viết ra mô tả hệ thống chi tiết cho tool (System Prompt/Description).
    - **Playground (Khu vực Chạy Thử)**: Cho phép nhập giá trị test và bấm **"▶️ Chạy thử Công cụ"** để hiển thị kết quả đầu ra JSON giả lập.

#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Bổ sung các lớp CSS hỗ trợ giao diện Dashboard Tools:
  - Bố cục lưới chia cột (`.tools-dashboard-layout`).
  - Lớp hiển thị danh sách thẻ công cụ (`.tool-item-card`, `.tool-item-card.active`).
  - Giao diện hộp chat Trợ lý AI và khung kết quả thử nghiệm Playground (`.playground-output-console`).
  - Thiết kế các nút chức năng kích hoạt, hiệu ứng di chuột (hover micro-interactions) mượt mà.

---

## Verification Plan

### Manual Verification
1. Chuyển sang nhánh `BigPjo`.
2. Khởi chạy Electron dev server qua `npm run electron:dev`.
3. Bấm vào nút **"Bảng Điều Khiển Tools"** trên header để chuyển sang chế độ Tools Dashboard.
4. Xem danh sách công cụ mặc định, thử click vào từng công cụ để hiển thị cấu hình bên phải.
5. Thử bấm nút **"+ Tạo Công Cụ Mới"** để thêm một tool tùy chỉnh.
6. Thử nhập ý tưởng vào hộp **Trợ lý Prompt AI** và bấm **"Sinh Prompt/Mô tả Công Cụ bằng AI"** để kiểm tra tính năng sinh tự động.
7. Thử nhập tham số test vào **Playground** và bấm **"Chạy thử Công cụ"** xem log JSON hiển thị chính xác không.
8. Chuyển đổi qua lại giữa Workflow và Tools Dashboard để kiểm tra tính ổn định, không bị mất dữ liệu.
