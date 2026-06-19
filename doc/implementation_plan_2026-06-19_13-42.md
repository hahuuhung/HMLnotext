# Kế hoạch triển khai Phase 1: Prototype - No-code Video Workflow Builder

Dự án này nhằm xây dựng một ứng dụng cho phép người dùng tạo video tự động thông qua giao diện workflow dạng node kéo thả (tương tự n8n). Phase 1 tập trung vào Prototype giao diện Canvas, Node Registry cơ bản, cấu hình node và mô phỏng (mock) quá trình chạy workflow để sinh kịch bản & tạo video.

## Giao diện & Trải nghiệm người dùng (UI/UX)
- Giao diện sử dụng tiếng Việt hoàn toàn.
- Ngôn ngữ thiết kế hiện đại, cao cấp với White/Light Theme chủ đạo.
- Cấu trúc layout chính:
  - **Bên trái**: Node Palette (Danh sách các node có thể kéo thả).
  - **Giữa**: Canvas Workflow sử dụng **React Flow**.
  - **Bên phải**: Inspector Panel để cấu hình tham số cho node đang chọn.
  - **Dưới cùng**: Timeline Preview & Console Logs hiển thị lịch sử chạy của workflow.
  - **Trên cùng**: Toolbar (Run, Export, Save, Load, Preview).

## User Review Required

> [!IMPORTANT]
> **Lựa chọn Công nghệ & Thư viện:**
> - Chúng tôi đề xuất sử dụng **Vite + React (TypeScript)** để có hiệu năng nhanh nhất cho prototype.
> - Canvas kéo thả sử dụng thư viện **React Flow**.
> - Styling sử dụng CSS tùy biến kết hợp với Tailwind CSS (nếu được chấp thuận).
> - Để phục vụ việc render video mockup client-side trong phase 1, ta sẽ sử dụng Canvas API hoặc FFmpeg.wasm (mock) tạo ra file MP4 tải về.
>
> Vui lòng xác nhận đề xuất trên để chúng tôi tiến hành tạo ứng dụng.

## Open Questions

> [!NOTE]
> 1. Bạn muốn chạy thử dưới dạng ứng dụng Web chạy qua trình duyệt trước đúng không?
> 2. Có cần tích hợp thư viện vẽ diagram nào cụ thể hay tôi sẽ tự thiết kế sơ đồ workflow xử lý bằng SVG/Canvas/Mermaid trong tài liệu?

## Proposed Changes

### 1. Khởi tạo & Cấu trúc Dự án
Tạo cấu trúc dự án và thư mục tài liệu:
- **`doc/`**: Lưu trữ các file mockup UI/UX, workflow diagram và bản copy các tài liệu dự án (`task.md`, `implementation_plan.md`, `walkthrough.md`).
- **`src/`**: Mã nguồn React.
  - `components/Canvas.tsx`: Canvas của React Flow.
  - `components/NodePalette.tsx`: Danh sách các node để kéo thả.
  - `components/Inspector.tsx`: Bảng thuộc tính điều chỉnh cấu hình node.
  - `components/Timeline.tsx`: Trình hiển thị timeline video mockup & logs.
  - `components/CustomNodes/`: Định nghĩa các node tùy biến (TriggerNode, AINode, VisualNode, RenderNode...).

---

### 2. Chi tiết các Node trong Prototype (Phase 1)
- **Trigger Node**: Khởi động workflow thủ công (Manual Button).
- **Input/Prompt Node**: Nhập prompt/chủ đề video (ví dụ: "Giới thiệu về cà phê Việt Nam").
- **AI Script Node**: Nhận prompt, tách thành các scene (ví dụ: Scene 1: Lịch sử, Scene 2: Cách pha, Scene 3: Thưởng thức).
- **Visual Node**: Mock tạo image/video assets cho mỗi scene (sử dụng placeholder đẹp/AI image mock).
- **Render Node**: Tổng hợp kịch bản, hình ảnh, tạo ra video preview & cho phép download file video MP4 demo.

---

## Verification Plan

### Automated Tests
- Kiểm tra quá trình build và khởi chạy dev server của Vite.

### Manual Verification
- Kiểm tra tính năng kéo thả node từ Palette vào Canvas.
- Kết nối các node (Trigger -> Input -> AI Script -> Visual -> Render).
- Nhấp chọn từng node để hiển thị cấu hình bên Inspector Panel bằng Tiếng Việt.
- Bấm nút **Chạy thử (Run)** để xem trạng thái chạy lần lượt của từng node sáng lên.
- Xem kết quả video mockup được sinh ra ở bảng Timeline dưới cùng và tải về thành công.
