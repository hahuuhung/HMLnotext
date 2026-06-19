# Kế hoạch nâng cấp: Quản lý nhiều Dự án (Workspace / Project Management)

Kế hoạch này đề xuất nâng cấp ứng dụng từ hỗ trợ một dự án duy nhất thành một Workspace chuyên nghiệp, cho phép tạo, xóa, chuyển đổi và lưu trữ tự động nhiều dự án video khác nhau qua LocalStorage.

## User Review Required

> [!IMPORTANT]
> **Các tính năng cốt lõi của Trình Quản lý Dự án:**
> 1. **Lưu trữ cục bộ (LocalStorage)**: Toàn bộ danh sách dự án bao gồm cấu trúc node canvas, phân cảnh timeline, cài đặt giọng đọc, phụ đề sẽ được tự động lưu trữ tại trình duyệt của người dùng.
> 2. **Thanh điều hướng dự án ở Toolbar**: Thêm dropdown lựa chọn dự án hiện tại, nút tạo nhanh dự án mới và nút xóa dự án đang mở trực tiếp trên thanh công cụ phía trên.
> 3. **Đồng bộ hóa trạng thái tức thì**: Khi chuyển đổi dự án, toàn bộ Canvas (React Flow), Timeline (Kdenlive) và màn hình Preview sẽ được cập nhật đồng bộ theo dự án được chọn.

---

## Proposed Changes

### 1. Nâng cấp giao diện dự án trong CSS
#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Thêm lớp CSS cho nút tạo dự án mới, Dropdown quản lý dự án và các bảng chọn Project List (Breeze Dark và Light).

### 2. Thiết kế cấu trúc dữ liệu và logic quản lý trong React
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Định nghĩa interface `Project` chứa toàn bộ thông số cấu hình của một dự án đơn lẻ (nodes, edges, scenes, settings, metadata).
- Quản lý danh sách dự án `projects` (lấy từ LocalStorage) và dự án hiện tại `activeProjectId`.
- Triển khai hàm:
  - `saveProjectState(projectId)`: Lưu trạng thái hiện tại của UI vào dự án tương ứng.
  - `loadProjectState(project)`: Nạp toàn bộ dữ liệu dự án lên màn hình.
  - `createNewProject()`: Tạo dự án trống hoặc theo mẫu có sẵn.
  - `deleteProject(projectId)`: Xóa dự án và chuyển sang dự án tiếp theo.
- Tích hợp giao diện quản lý dự án trên Toolbar.

---

## Verification Plan

### Automated Tests
- Đảm bảo các hàm test cũ trong `src/workflow.test.ts` vẫn hoạt động tốt, không phá vỡ cấu trúc cơ bản của workflow builder.

### Manual Verification
- Tạo 3 dự án video với các chủ đề khác nhau (ví dụ: "Du lịch Sa Pa", "Cà phê Sữa đá", "Lịch sử bánh mì").
- Thiết lập các giá trị node và timeline khác nhau cho từng dự án.
- Chuyển đổi qua lại giữa các dự án để xác nhận toàn bộ node và timeline thay đổi tương ứng.
- Tải lại trình duyệt (F5) để kiểm tra tính năng tự động lưu và khôi phục từ LocalStorage.
