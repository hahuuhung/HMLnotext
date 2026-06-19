# Kế hoạch Thiết kế Kiến trúc Backend / API Modules

Hệ thống backend của ViệtFlow sẽ đóng vai trò xử lý toàn bộ logic tính toán chuyên sâu, lưu trữ dữ liệu người dùng, quản lý hàng đợi kết xuất (Render Queue) và giao tiếp với các Provider bên thứ ba. Dưới đây là đề xuất chi tiết cho 10 module chính.

## 1. Lựa chọn Công nghệ (Tech Stack Proposed)
- **Backend Framework**: Node.js (NestJS / Express) hoặc .NET 8 (C#) *(Cần người dùng quyết định)*.
- **Database**: PostgreSQL (Relational Data) + Redis (Caching & Job Queue).
- **Storage**: AWS S3 / Cloudflare R2 / Firebase Storage.
- **Message Broker**: RabbitMQ hoặc Redis BullMQ (cho Render Job Queue).

## 2. Các Module Cốt Lõi (Core Modules)

### 2.1. Auth & Workspace Module
- **Mục tiêu**: Xác thực người dùng và phân quyền theo không gian làm việc.
- **Tính năng**: 
  - JWT Authentication (Login/Register/OAuth2 với Google, Github).
  - Quản lý Workspace: Cho phép mời thành viên, phân quyền (Owner, Editor, Viewer).

### 2.2. Project & Workflow CRUD
- **Mục tiêu**: Lưu trữ trạng thái biểu đồ React Flow của người dùng.
- **Tính năng**: 
  - Create, Read, Update, Delete dự án.
  - Lưu JSON của Nodes & Edges từ Frontend.

### 2.3. Workflow Versioning
- **Mục tiêu**: Quản lý lịch sử thay đổi của Workflow để dễ dàng phục hồi.
- **Tính năng**: 
  - Mỗi lần bấm "Áp dụng" / "Save", tạo một bản snapshot version mới.
  - Hỗ trợ Rollback về phiên bản cũ.

### 2.4. Workflow Execution API
- **Mục tiêu**: Dịch (compile) từ biểu đồ JSON sang dạng luồng thực thi (DAG - Directed Acyclic Graph).
- **Tính năng**: 
  - Engine điều phối quá trình chạy từng Node theo thứ tự phụ thuộc.
  - Cập nhật Real-time trạng thái chạy thông qua WebSockets.

### 2.5. Node Registry
- **Mục tiêu**: Quản lý các loại Node hợp lệ mà hệ thống hỗ trợ.
- **Tính năng**: 
  - Đăng ký metadata của Node (Tên, Icons, Inputs/Outputs schema).
  - Validation: Đảm bảo dữ liệu gửi từ Frontend khớp với Schema của Node.

### 2.6. Asset Upload/Storage
- **Mục tiêu**: Lưu trữ tài nguyên media (Ảnh, Video, Audio).
- **Tính năng**: 
  - Presigned URLs để upload trực tiếp từ Frontend lên S3/R2.
  - Quản lý vòng đời tài nguyên (tự động dọn dẹp file nháp).

### 2.7. Render Job Queue
- **Mục tiêu**: Hàng đợi kết xuất video tốn nhiều tài nguyên không đồng bộ.
- **Tính năng**: 
  - Đẩy Job vào Queue khi Node Render kích hoạt.
  - Worker Servers kéo Job để chạy FFmpeg / Remotion.
  - Webhooks báo trạng thái thành công/thất bại.

### 2.8. Template System
- **Mục tiêu**: Kho chứa các Workflow mẫu (như Short-form AI, Blog to Social).
- **Tính năng**: 
  - API trả về danh sách mẫu.
  - Clone template thành Project mới cho người dùng.

### 2.9. Provider Abstraction cho AI/Image/Audio/Stock
- **Mục tiêu**: Cổng giao tiếp trung gian (Gateway) che giấu API keys thật.
- **Tính năng**: 
  - Cấu trúc Interface chung: `GenerateImage()`, `TextToSpeech()`, `CompletePrompt()`.
  - Hỗ trợ nhiều nhà cung cấp (OpenAI, Anthropic, ElevenLabs, Pexels) và dễ dàng chuyển đổi (Fallback).

### 2.10. Billing/Quota (Monetization)
- **Mục tiêu**: Giới hạn tài nguyên nếu cần thu phí.
- **Tính năng**: 
  - Tính điểm Credit cho mỗi tác vụ AI/Render.
  - Stripe/Paypal Webhook để nạp Credit hoặc đăng ký Subscription.

## 2.11. Bảo mật và Vận hành (Security & Operations)
- **Mục tiêu**: Đảm bảo an toàn hệ thống, tuân thủ giới hạn tài nguyên và quản lý vòng đời dữ liệu.
- **Tính năng**:
  - **Mã hóa API Keys**: Các API Key của user/workspace cung cấp (OpenAI, Anthropic...) sẽ được mã hóa bằng AES-256 trước khi lưu vào DB, giải mã khi gọi Provider.
  - **Phân quyền (RBAC)**: Tạo Guard cho `Workspace` và `Project` (Role: `owner`, `editor`, `viewer`).
  - **Rate Limit**: Sử dụng `@nestjs/throttler` để giới hạn số lượng request API theo User/Workspace.
  - **Quản trị Job**: Thiết lập BullMQ với cấu hình Timeout, Retry Strategy (Exponential Backoff), và logic Cancel Job.
  - **Audit Log**: Ghi log mọi thao tác Execution (chạy Node, lỗi xảy ra) vào DB để dễ theo dõi.
  - **Content Moderation**: Gọi API kiểm duyệt nội dung của nhà cung cấp trước khi xử lý (vd: OpenAI Moderation API) cho media AI sinh ra.
  - **Asset Cleanup**: Thiết lập CronJob (Retention Policy) tự động dọn dẹp file lưu tạm (S3/R2) sau khoảng thời gian nhất định (vd: 7 ngày).

## User Review Required
> [!IMPORTANT]
> - Đối với **Mã hóa API Keys**, bạn có đồng ý sử dụng biến môi trường `ENCRYPTION_KEY` để làm chìa khóa mã hóa đối xứng (AES-256) không?
> - Đối với **Rate Limit** và **Audit Log**, tôi sẽ tiến hành cập nhật trực tiếp cấu trúc DB (Prisma Schema). Bạn có đồng ý triển khai luôn các tính năng này không?

Vui lòng xem lại và phê duyệt để tôi cập nhật danh sách công việc (`task.md`) và tiến hành code!
