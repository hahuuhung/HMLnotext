# Kế hoạch nâng cấp: Danh mục Node Catalog Đa Tính Năng (7 Nhóm chính & 35 Tính năng)

Kế hoạch này đề xuất tái cấu trúc hệ thống Node trên Canvas thành **7 nhóm lớn chuyên biệt** (Trigger, Input, AI Script, Visual, Audio, Editing, Render & Export), mỗi nhóm chứa nhiều **tùy chọn chức năng (Sub-types)** có thể cấu hình động qua Bảng thuộc tính Inspector, mô phỏng thiết kế chuyên nghiệp của n8n.

## User Review Required

> [!IMPORTANT]
> **Phân nhóm và các chức năng con đề xuất tích hợp:**
>
> 1. **Trigger (Kích Hoạt)**: Chạy thủ công, Lên lịch (Schedule), Webhook, Theo dõi thư mục (Watch folder), Nhập CSV/Google Sheet.
> 2. **Input (Đầu Vào)**: Nhập text prompt, Nhập URL blog, Dữ liệu sản phẩm, Tải lên media, Thư viện stock.
> 3. **AI Script (Kịch Bản AI)**: Tạo Outline, Tạo Hook 3s đầu, Phát triển Prompt thành kịch bản, Phân tách Cảnh, Tạo Caption/Phụ đề, Dịch/Bản địa hóa.
> 4. **Visual (Hình Ảnh/Mỹ Thuật)**: Sinh ảnh AI, Tìm stock media, Phân cảnh hình ảnh, Tạo ảnh nền, Nhân vật AI (Avatar), Brand kit.
> 5. **Audio (Âm Thanh)**: Text-to-speech, Nhái giọng, Nhạc nền, Hiệu ứng âm thanh (SFX), Chuẩn hóa âm thanh.
> 6. **Editing (Dựng Phim)**: Dựng Timeline, Cắt ghép (Trim/Cut), Chuyển cảnh, Kiểu phụ đề (Caption style), Watermark, Tỷ lệ khung hình, Áp dụng mẫu (Template).
> 7. **Render & Export (Kết Xuất)**: Render Preview, Render Full, Xuất bản MP4, Tải video lên, Đăng mạng xã hội.

---

## Proposed Changes

### 1. Nâng cấp Thư viện Node (`CustomNodes.tsx`)
#### [MODIFY] [CustomNodes.tsx](file:///d:/AntiGravity/HML/src/components/CustomNodes.tsx)
- Cập nhật 7 React component đại diện cho 7 nhóm chính.
- Mỗi component sẽ đọc trường `data.subtype` để tự động đổi tiêu đề, màu sắc, icon tương ứng và mô tả trạng thái phù hợp.

### 2. Định nghĩa các cấu hình State và Dự án (`App.tsx`)
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Thêm trường `subtype` vào cấu trúc Node khởi tạo của dự án.
- Thiết lập các state tương thích với các tùy chọn cấu hình con của từng nhóm.
- Cập nhật hàm `addNodeDirectly` và `onDrop` để gán `subtype` mặc định cho từng nhóm chính khi chèn mới.

### 3. Cập nhật Bảng thuộc tính Inspector theo cấu hình Sub-type
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Ở bảng thuộc tính bên phải, hiển thị menu chọn **Chức năng con (Sub-type)** cho từng loại Node được chọn.
- Thay đổi các trường nhập liệu tương ứng theo chức năng con được chọn (ví dụ: đối với *Trigger - Lên lịch* hiển thị giờ hẹn; đối với *Visual - Brand kit* hiển thị chọn logo, mã màu).

### 4. Logic giả lập chạy Workflow
#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Đồng bộ log mô phỏng chạy thử tương ứng với từng chức năng con được thiết lập trong luồng Canvas.

---

## Verification Plan

### Automated Tests
- Chạy `npx vitest run` kiểm tra tính tương thích.

### Manual Verification
1. Trong màn hình Canvas, kiểm tra xem Node Palette bên trái và dropdown nổi đã sắp xếp thành 7 nhóm chính chưa.
2. Thêm một node **Trigger** lên Canvas, nhấp chọn nó.
3. Trong Inspector bên phải, đổi Chức năng con từ **Chạy thủ công** thành **Lên lịch (Schedule)**. Xác nhận tiêu đề và nội dung node trên Canvas cập nhật lập tức.
4. Đổi cấu hình của các node khác và nhấp chạy thử để kiểm tra hiển thị log chính xác.
