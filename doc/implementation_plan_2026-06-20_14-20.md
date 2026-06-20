# Kế hoạch Cân chỉnh Sidebar Trái: Tách Nút Quy trình (Nodes Palette) thành Tab riêng

## Bối cảnh
Trong chế độ Workflow (`editorMode === 'workflow'`), thanh bên trái (`sidebar-left`) hiện đang chứa cả **Mẫu Video Nhanh (Templates)**, **Cấu hình nhanh (Quick Config)** và **Nút Quy trình (Nodes Palette)**. Việc dồn quá nhiều trường nhập liệu và nút bấm vào một cột dọc duy nhất khiến phần Nút Quy trình ở phía dưới bị đẩy xuống dưới và bị che lấp trên các màn hình có chiều cao giới hạn.

## Giải pháp Đề xuất
Tách biệt hai khu vực này thành các Tab độc lập trên thanh công cụ mỏng ngoài cùng bên trái (`slim-sidebar`):
1. **Tab Mẫu & Cấu hình (Templates & Config):** Sử dụng icon `Grid`. Khi kích hoạt, hiển thị các mẫu video nhanh và form cấu hình nhanh.
2. **Tab Nút Quy trình (Nodes Palette):** Thêm icon `Cpu` (hoặc `Sliders`). Khi kích hoạt, hiển thị danh sách các Node để kéo thả vào canvas, kèm theo cài đặt local watch folder.
3. **Bật/Tắt (Toggle sidebar):** Khi nhấp vào tab đang hoạt động, thanh bên trái sẽ đóng/mở (thu gọn về 0px hoặc ẩn đi), tương tự như cơ chế Sidebar của VS Code.

---

## Mockup Thiết kế UX
![Mockup Sidebar mới](file:///C:/Users/Asus/.gemini/antigravity-ide/brain/975020c0-d0f2-4bce-aca3-ef1359ad0e98/sidebar_workflow_palette_mockup_1781931755771.png)

---

## Thay đổi Dự kiến

### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)

- Khai báo state mới:
  - `activeWorkflowTab: 'templates' | 'palette'` (mặc định `'templates'`).
  - `isWorkflowLeftSidebarOpen: boolean` (mặc định `true`).
- Cập nhật phần JSX của `.slim-sidebar`:
  - Thêm icon `Cpu` cho Tab Quy trình.
  - Áp dụng class `active` và sự kiện click để điều phối `activeWorkflowTab` và `isWorkflowLeftSidebarOpen`.
- Cập nhật phần JSX của `.sidebar-left`:
  - Ẩn/Hiện dựa trên `isWorkflowLeftSidebarOpen`.
  - Conditional rendering:
    - Nếu `activeWorkflowTab === 'templates'`: hiển thị "Mẫu Video Nhanh" + "Cấu hình nhanh".
    - Nếu `activeWorkflowTab === 'palette'`: hiển thị "Nút Quy trình (Nodes Palette)" + "Thư mục Local Watch" + "Tải lên tài nguyên".
- Ẩn/Hiện `sidebar-resizer` đồng bộ với `isWorkflowLeftSidebarOpen`.

---

## Kế hoạch Xác minh (Verification Plan)

### Xác minh Thủ công
1. Mở giao diện HML, chọn chế độ **Workflow (n8n)**.
2. Nhấp vào icon **Mẫu Thiết Kế (Grid)** ở slim-sidebar trái: kiểm tra sidebar hiển thị form Cấu hình nhanh. Nhấp lại lần nữa xem sidebar có ẩn đi không.
3. Nhấp vào icon **Quy trình (Cpu/Sliders)** ở slim-sidebar trái: kiểm tra sidebar hiển thị danh sách các Node kéo thả (Trigger, Đầu vào, Xử lý, v.v.).
4. Kiểm tra xem việc kéo thả các Node từ sidebar vào Canvas hoạt động bình thường ở cả hai chế độ.
5. Kiểm tra tính năng "Đổi bên" (Hoán đổi vị trí trái/phải) hoạt động bình thường khi ẩn/hiện sidebar.
