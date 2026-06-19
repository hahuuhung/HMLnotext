# Kế hoạch Kỹ thuật và Lộ trình Triển khai ViệtFlow

Tài liệu này bao gồm **Lộ trình Phát triển Tổng thể** của dự án (từ Prototype đến Production) và **Kiến trúc Backend chi tiết**.

## A. Lộ trình Triển khai Cơ bản (Product Roadmap)

Lộ trình này chia dự án thành 4 giai đoạn lớn, kết hợp giữa Frontend, Backend và Desktop. Những phần có đánh dấu `(Đã xây dựng backend)` là các module API mà chúng ta vừa hoàn thiện.

### Phase 1: Prototype (Tập trung Cốt lõi)
- [ ] Canvas workflow kéo thả (React Flow Frontend).
- [x] Node registry cơ bản (Backend đã có cấu trúc, Frontend cần gọi API).
- [ ] Prompt-to-script (Tạo kịch bản từ Text).
- [ ] Scene split (Chia cảnh).
- [ ] Generate image placeholder (Sinh ảnh nháp/đại diện).
- [ ] Render MP4 đơn giản bằng FFmpeg (Chạy thử nghiệm nội bộ Worker).

### Phase 2: MVP usable (Phiên bản khả dụng đầu tiên)
- [ ] Upload asset (Frontend -> S3).
- [ ] TTS (Chuyển văn bản thành giọng nói).
- [ ] Caption (Tạo phụ đề).
- [ ] Timeline preview (Xem trước timeline tại Frontend).
- [x] Render queue (Backend đã cấu hình BullMQ).
- [ ] Template video ngắn (Frontend chọn template).
- [x] Save/load workflow (Backend Project/Workflow CRUD đã hoàn thiện).

### Phase 3: Desktop + Local render
- [ ] Đóng gói desktop app (Electron / Tauri / .NET MAUI).
- [ ] Hỗ trợ local folder watch (Tự động nạp tài nguyên).
- [ ] Render bằng FFmpeg local (Dùng sức mạnh máy trạm thay vì Cloud).
- [ ] Sync project với cloud nếu cần (Đồng bộ với DB Backend NestJS).

### Phase 4: Production
- [x] Multi-user workspace (Backend đã có Workspace/RBAC).
- [ ] Billing/quota (Thanh toán, giới hạn tài nguyên).
- [ ] Provider failover (Dự phòng nhà cung cấp AI).
- [ ] Publish social (Tự động đăng bài MXH).
- [ ] Advanced expression (Luồng xử lý Node nâng cao/Biểu thức động).
- [ ] Marketplace template/node (Chợ chia sẻ Template).

---

## B. Kiến trúc Backend / API Modules

Hệ thống backend của ViệtFlow sẽ đóng vai trò xử lý toàn bộ logic tính toán chuyên sâu, lưu trữ dữ liệu người dùng, quản lý hàng đợi kết xuất (Render Queue) và giao tiếp với các Provider bên thứ ba. Dưới đây là đề xuất chi tiết cho các module chính.

### 1. Auth & Workspace Module
- **Mục tiêu**: Xác thực người dùng và phân quyền theo không gian làm việc.
- **Tính năng**: JWT Authentication (Login/Register). Quản lý Workspace.

### 2. Project & Workflow CRUD
- **Mục tiêu**: Lưu trữ trạng thái biểu đồ React Flow của người dùng.
- **Tính năng**: Create, Read, Update, Delete dự án. Lưu JSON của Nodes & Edges.

### 3. Workflow Versioning
- **Mục tiêu**: Quản lý lịch sử thay đổi của Workflow.

### 4. Node Registry & Provider Abstraction
- **Mục tiêu**: Quản lý các loại Node hợp lệ. Abstraction cho các Provider AI.

### 5. Render Job Queue
- **Mục tiêu**: Hàng đợi kết xuất video bằng BullMQ/Redis.

### 6. Bảo mật và Vận hành (Security & Operations)
- **Mục tiêu**: Đảm bảo an toàn hệ thống, tuân thủ giới hạn tài nguyên và quản lý vòng đời dữ liệu.
- **Tính năng**: Mã hóa API Keys. RBAC. Rate Limit (`@nestjs/throttler`). Audit Log. Asset Cleanup (`@nestjs/schedule`).

### 7. Giai đoạn Triển khai (Deployment Phase)
- **Mục tiêu**: Đưa ViệtFlow vào môi trường thực tế.
- **Tính năng**: Đóng gói Dockerization. Hạ tầng mạng Hosting (Vercel/VPS). Pipeline CI/CD bằng GitHub Actions. Sentry/Logtail monitoring.

---

## User Review Required

> [!IMPORTANT]
> - Chúng ta đã hoàn thiện phần lớn Backend cho cấu trúc hạ tầng. Theo lộ trình trên, mục tiêu tiếp theo của chúng ta là hoàn tất **Phase 1: Prototype**.
> - Trong **Phase 1**, khối lượng công việc đang tập trung vào **Frontend (React)**: Xây dựng Canvas workflow kéo thả và gọi các hàm Prompt-to-script, Scene split.
> - Bạn có muốn tôi bắt đầu cập nhật `task.md` theo **Phase 1** của **Lộ trình Phát triển Tổng thể** và triển khai **Frontend Canvas Workflow** ngay bây giờ không? Hay muốn hoàn thiện các logic gọi FFmpeg trên Backend Node.js trước?

Vui lòng cho ý kiến để tôi cập nhật Task và tiến hành code!
