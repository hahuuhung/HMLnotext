# Kế hoạch Kỹ thuật: Thiết kế Giao diện Trực quan và Tối ưu trải nghiệm No-code (Nhánh "BigPjo")

Kế hoạch này tập trung vào việc biến biểu đồ Graph thành một công cụ trực quan hóa cao độ (Visual self-documenting graph) và cung cấp bảng cấu hình nhanh No-code trên thanh Sidebar để người dùng dễ dàng sử dụng mà không cần hiểu sâu về kỹ thuật.

---

## 1. Các hạng mục cải tiến chính (Main Design Upgrades)

### A. Thẻ Node Tự Tài liệu hóa (Self-documenting Custom Nodes)
Chúng ta sẽ nâng cấp giao diện của các Custom Nodes trong [CustomNodes.tsx](file:///d:/AntiGravity/HML/src/components/CustomNodes.tsx) để chúng tự động hiển thị cấu hình hiện tại ngay trên Node:
- **Trigger Node**: Hiển thị Huy hiệu phương thức kích hoạt (Thủ công / Lên lịch / Local Watch).
- **Input Node**: 
  - Hiển thị trực tiếp 3 dòng đầu của văn bản Prompt.
  - Hiển thị tên file tài liệu đính kèm (nếu chọn Doc).
  - Hiển thị URL trang blog rút gọn (nếu chọn Blog).
- **AI Script Node**: Hiển thị Model đang chạy (ví dụ: `GPT-4o`) và Huy hiệu Tone giọng (`Truyền cảm`, `Sôi động`).
- **Visual Node**: Hiển thị phong cách visual đã chọn (`Cinematic`, `Anime`) và một khung ảnh minh họa nhỏ.
- **Audio TTS Node**: Hiển thị Giọng đọc (`Vy Mai (Bắc)`, `Nam An (Nam)`) và tốc độ đọc.
- **Subtitle Node**: Hiển thị kiểu chữ chạy (`TikTok`, `Netflix`) và một chấm màu sắc đại diện cho Highlight Color.
- **Render Node**: Hiển thị Huy hiệu nền tảng tương ứng (ví dụ: `YouTube`, `TikTok`, `FB Feed`).

*Nhờ đó, người dùng nhìn vào biểu đồ là hiểu ngay toàn bộ luồng video được thiết lập như thế nào mà không cần click vào từng Node.*

### B. Bảng cấu hình nhanh No-code ở Sidebar trái (Sidebar Quick Configuration Form)
Nâng cấp [SidebarLeft.tsx](file:///d:/AntiGravity/HML/src/components/sidebar/SidebarLeft.tsx) để khi bấm chọn các Mẫu Video Nhanh (Templates), người dùng có thể nhập liệu nhanh các trường cốt lõi ngay tại đây:
- **Mẫu Tự động**: Hiển thị ô gõ Prompt nhanh.
- **Mẫu Tài liệu**: Hiển thị nút Tải file TXT/PDF nhanh.
- **Mẫu Social**: Hiển thị ô dán link bài viết.
Có nút **"Chạy Ngay (Quick Run)"** bên dưới form để kích hoạt workflow chạy ngầm, mang lại trải nghiệm 1-click tạo video đích thực cho người mới dùng.

### C. Đồng bộ trạng thái AI Agents hoạt động trên Console
Khi workflow chạy qua từng Node, Agent tương ứng trên tab cột phải sẽ đổi trạng thái nhấp nháy phát sáng:
- Khi chạy tới `aiNode` -> Biên kịch card chuyển trạng thái `thinking/active`.
- Khi chạy tới `visualNode` -> Đạo diễn card chuyển trạng thái `thinking/active`.
- Khi chạy tới `audioTTS` -> Âm thanh card chuyển trạng thái `thinking/active`.

---

## Proposed Changes

### [Component Frontend]

#### [MODIFY] [CustomNodes.tsx](file:///d:/AntiGravity/HML/src/components/CustomNodes.tsx)
- Bổ sung cấu trúc hiển thị tham số trực quan (nhận qua props `data` từ store toàn cục hoặc props node).
- Nâng cấp CSS và viền bo góc, biểu tượng màu sắc rõ ràng cho từng loại Node.

#### [MODIFY] [SidebarLeft.tsx](file:///d:/AntiGravity/HML/src/components/sidebar/SidebarLeft.tsx)
- Tích hợp các Form nhập liệu nhanh (Prompt, File, URL) bên dưới các thẻ Template.
- Bổ sung nút "Chạy Nhanh" kích hoạt `runWorkflow` trực tiếp từ sidebar.

#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Kết nối trạng thái chạy Node thực tế của BFS Engine để đồng bộ hoá trạng thái nhấp nháy phát sáng (`active`) của các thẻ nhân vật AI tương ứng ở tab điều phối.

---

## Verification Plan

### Manual Verification
1. Chuyển sang nhánh `BigPjo`.
2. Khởi chạy Electron dev server qua `npm run electron:dev`.
3. Kiểm tra xem các Node trên Canvas có hiển thị đúng các tham số đã thiết lập hay không.
4. Thay đổi tham số ở Inspector bên phải và xác nhận Node cập nhật thông tin hiển thị ngay lập tức (Real-time sync).
5. Thử nghiệm nhập liệu ở Form cấu hình nhanh ở Sidebar trái và bấm "Chạy Nhanh" xem luồng hoạt động chính xác không.
