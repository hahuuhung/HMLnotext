# Kế hoạch nâng cấp: Canvas Workflow n8n siêu tương tác (Soạn thảo, Lưu, Thêm Node)

Kế hoạch này đề xuất tối ưu hóa hệ thống Canvas n8n-style của dự án, bổ sung các khả năng soạn thảo nâng cao, quản lý kết nối dễ dàng, và phím lưu trữ thủ công giúp nâng tầm khả năng tương tác.

## User Review Required

> [!IMPORTANT]
> **Các tính năng tương tác n8n mới đề xuất:**
> 1. **Thêm Node trực tiếp (Quick Add)**: Bổ sung một menu lựa chọn nhanh (Dropdown) hoặc nút "+ Thêm Node" nổi trực tiếp trên Canvas để chèn Node vào tâm màn hình mà không bắt buộc phải kéo thả.
> 2. **Soạn thảo tên Node**: Cho phép người dùng chỉnh sửa trực tiếp nhãn (Label) của Node thông qua ô nhập liệu trong Bảng thuộc tính (Inspector).
> 3. **Xóa liên kết (Edge Deletion)**: Cho phép click vào đường nối giữa các Node (Edge) và nhấn phím Xóa hoặc nút xóa để gỡ liên kết trực quan.
> 4. **Trạng thái lưu trữ trực quan (Save/Auto-save Status)**: Thêm nút **[Lưu Workflow]** thủ công bên cạnh thông báo "Đã tự động lưu" để đảm bảo tính an tâm cho dữ liệu.

---

## Proposed Changes

### 1. Cập nhật CSS cho các điều khiển Canvas mới
#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Thiết kế nút nổi "+ Thêm Node nhanh" trên Canvas.
- Tạo phong cách cho nút xóa Edge và hiển thị trạng thái lưu trữ.

### 2. Triển khai logic soạn thảo & lưu Node nâng cao trong React
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Cho phép người dùng sửa tên Node bằng ô nhập `Tên Node` trong Inspector.
- Bổ sung hàm `addNodeDirectly(type)` chèn Node vào tâm vùng hiển thị của Canvas.
- Tích hợp sự kiện `onEdgeClick` của React Flow để lưu trữ Edge đang chọn, hiển thị nút xóa Edge hoặc hỗ trợ nhấn phím Delete để xóa Edge/Node.
- Thêm nút **[Lưu Workflow]** hiển thị thông báo toast màu xanh báo hiệu đã đồng bộ thành công vào LocalStorage của Dự án.

---

## Verification Plan

### Automated Tests
- Chạy `npx vitest run` kiểm tra toàn bộ luồng kiểm thử.

### Manual Verification
- Ở chế độ Workflow, nhấp vào nút **[+ Thêm Node nhanh]** ở góc trên Canvas và chọn một loại Node (ví dụ: "AI Script"). Xác nhận Node được thêm vào Canvas.
- Click chọn Node đó, thay đổi nhãn của nó trong Inspector bên phải và xác nhận nhãn trên Canvas thay đổi tức thì.
- Kết nối Node mới với một Node cũ bằng cách kéo dây chuột. Click vào dây nối (Edge) và nhấn nút xóa để ngắt kết nối.
- Nhấp **[Lưu Workflow]** và kiểm tra thông báo lưu thành công hiển thị.
