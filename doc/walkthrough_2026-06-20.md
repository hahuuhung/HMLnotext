# Walkthrough: Backend Implementation

## Giai đoạn 1 & 2: Cấu trúc cơ bản và Xác thực
- **NestJS Boilerplate**: Khởi tạo project NestJS, cấu hình Prisma (SQLite) và Swagger UI.
- **Auth & Workspaces**: Hoàn thiện JWT Login/Register. Tạo API tạo và liệt kê không gian làm việc. Phân quyền Guard `JwtAuthGuard`.

## Giai đoạn 3: Project & Workflow CRUD
- Tạo `ProjectsModule`.
- API endpoints để lưu trữ biểu đồ React Flow thành chuỗi JSON trong CSDL (`workflowData`).
- Liên kết Project với Workspace.

## Giai đoạn 4: Node Registry & Provider Abstraction
- Cung cấp danh sách metadata tĩnh về các loại Node hợp lệ (Trigger, AI, AudioTTS...).
- Thiết lập sườn (abstraction) cho Provider kết nối AI như OpenAI/Anthropic.

## Giai đoạn 5: Render Job Queue
- Tích hợp BullMQ và Redis.
- Tạo API để đưa tiến trình xuất video vào hàng đợi ngầm.

## Giai đoạn 6: Bảo mật và Vận hành
- Cập nhật Prisma Schema: Thêm bảng `ProviderKey` (mã hóa Key) và `AuditLog` (lưu trữ lịch sử thực thi).
- Tích hợp Rate Limit (`@nestjs/throttler`) nhằm giới hạn 100 requests / phút.
- Khởi tạo tiến trình Cron dọn dẹp file tạm chạy vào lúc nửa đêm (`@nestjs/schedule`).
