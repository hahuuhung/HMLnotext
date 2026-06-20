# Kế hoạch Kỹ thuật: Nâng cấp Giao diện Đa phân vùng Resizable, Trình Dựng Phim Shotcut chuyên nghiệp & Chế độ Điều phối AI Agent Google Flow (Tích hợp Tool F&B Visual)

Kế hoạch này tập trung vào ba nâng cấp lớn cho giao diện của dự án HML Auto Video Builder:
1. **Giao diện đa phân vùng Resizable**: Hỗ trợ kéo thả thay đổi kích thước linh hoạt cho Sidebar trái, Sidebar phải, Panel dưới (Timeline/Console) và dải phân cách ngang dọc ở tất cả các chế độ xem như trong VS Code.
2. **Giao diện dựng phim Shotcut chuyên nghiệp (Shotcut NLE UI)**: Thiết kế lại toàn bộ chế độ "Dựng Phim (Shotcut)" giống 100% phần mềm Shotcut thực tế (với Player trung tâm, dải Peak Meter dọc, thanh công cụ NLE chuyên sâu, quản lý Export Jobs và Timeline track V1/V2/A1/S1).
3. **Chế độ Điều phối AI Agent Google Flow (Tích hợp Tool F&B Visual)**: Thêm chế độ xem thứ tư lấy cảm hứng từ Google Flow (Vertex AI Agent Builder) tích hợp chatbot điều phối AI và đặc biệt có **Trình sinh ảnh sản phẩm Nước chấm Hải sản** (F&B Creative Tool) tương tác trực tiếp theo yêu cầu.

---

## User Review Required

> [!IMPORTANT]
> - Các phân vùng có thể kéo thả thay đổi kích thước sẽ sử dụng sự kiện di chuột (`onMouseDown`, `mousemove`, `mouseup`) trực tiếp trong React để cập nhật width/height state thời gian thực.
> - Chế độ dựng phim Shotcut sẽ sử dụng bảng màu Charcoal đặc trưng (`#1e1e1e`, `#282828`, `#383838`) của phần mềm Shotcut gốc, mang lại cảm giác NLE nguyên bản.
> - **Tool sinh ảnh F&B Visual**: Tích hợp một mini-app trực quan cho phép người dùng tải lên ảnh chai nước chấm, nhập tên thương hiệu, chọn 1 trong 3 bối cảnh (Bàn ăn nhà hàng, Chụp từ trên xuống, Lifestyle Instagram), thực hiện quy trình xử lý tách nền + đổ bóng và xuất ra 3 biến thể ảnh sản phẩm cùng nút tải các tỷ lệ `1:1`, `4:5`, `9:16`.

---

## Mockups & Layouts

Chúng ta đã tạo các bản thiết kế mockup trực quan cho giao diện mới và lưu trữ tại thư mục [doc/](file:///d:/AntiGravity/HML/doc):
1. **Mockup Giao diện Dựng Phim Shotcut**: [shotcut_ui_mockup.png](file:///d:/AntiGravity/HML/doc/shotcut_ui_mockup.png)
2. **Mockup Điều phối AI Agent Google Flow**: [google_flow_mockup.png](file:///d:/AntiGravity/HML/doc/google_flow_mockup.png)

---

## Proposed Changes

### [Component Frontend]

#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Cập nhật kiểu dữ liệu `editorMode` hỗ trợ 4 chế độ: `'workflow' | 'kdenlive' | 'tools' | 'agent-flow'`.
- Khai báo các state kích thước mới:
  - `bottomPanelHeight` (mặc định `260px` cho timeline bên dưới ở chế độ Workflow).
  - `shotcutLeftWidth` (mặc định `320px` cho playlist/filters ở Shotcut).
  - `shotcutRightWidth` (mặc định `320px` cho peak meter/jobs ở Shotcut).
  - `shotcutTimelineHeight` (mặc định `280px` cho timeline ở Shotcut).
- Thêm các state phục vụ Tool Tạo Visual Nước chấm Hải sản:
  - `fbBrandName` (tên thương hiệu, vd: "Hải Sản Xanh")
  - `fbBenefit` (lợi ích sản phẩm, vd: "Chua cay đậm đà, chuẩn vị biển")
  - `fbStyle` (phong cách bối cảnh: `'restaurant' | 'flatlay' | 'instagram'`)
  - `fbPhoto` (ảnh sản phẩm tải lên)
  - `fbStatus` (trạng thái xử lý: `'idle' | 'cleaning' | 'placing' | 'lighting' | 'done'`)
  - `fbGeneratedImages` (danh sách 3 url ảnh sản phẩm kết quả sau khi ghép cảnh)
- Viết các hàm helper kéo thả resizer:
  - `startResizingBottom` cho panel dưới của Workflow.
  - `startResizingShotcutLeft`, `startResizingShotcutRight`, `startResizingShotcutTimeline` cho các phân vùng của Shotcut.
- **Tái cấu trúc chế độ xem Shotcut (`editorMode === 'kdenlive'`)**:
  - Tích hợp thanh Menu bar hàng đầu (File, Edit, View, Settings...) và thanh công cụ Shotcut chuyên nghiệp (Open File, Save, Undo, Redo, Peak Meter, Properties, Recent, Playlist, Filters, Timeline, Export).
  - Thiết kế màn hình Preview trung tâm (Player) với khung viền sắc nét, hiển thị Timecode SMPTE liên tục nhảy số, bộ điều hướng phát video đầy đủ (Rewind, Play/Pause, Fast Forward, Loop, Mute, Fullscreen).
  - Cột phải hiển thị **Audio Peak Meter** dạng cột kép dọc nhảy dB xanh-vàng-đỏ cực sinh động khi phát preview, đi kèm khung xem thuộc tính clip nguồn (Properties) và hàng đợi tác vụ xuất bản (Jobs/Export tasks).
  - Bố trí phân vùng timeline tracks chuyên nghiệp với thanh resizer kéo thả chiều cao độc lập.
- **Xây dựng giao diện Điều phối AI Agent Google Flow (`editorMode === 'agent-flow'`)**:
  - Giao diện sử dụng phong cách sáng (Breeze White/Light Theme) cao cấp.
  - Cột Trái: Chatbot tương tác tự động mô tả ý tưởng và xem cuộc trò chuyện giữa các AI Agent.
  - Cột Giữa: Sơ đồ luồng (Flowchart) kết nối trực tiếp 3 nhân vật AI và **Khu vực thiết kế Tool Visual F&B**:
    - Khu vực tải lên (Upload zone) lớn ở trên cùng.
    - Khung xem trước kết quả (Preview canvas) ở trung tâm.
    - Cột chọn bối cảnh bên phải với 3 tùy chọn:
      1. Bàn ăn nhà hàng (restaurant table setting)
      2. Chụp đồ ăn từ trên xuống (flat lay food photography)
      3. Phong cách Instagram (lifestyle Instagram aesthetic)
    - Nút kích hoạt quy trình tự động: *Tách nền -> Lồng bối cảnh -> Cân chỉnh ánh sáng & Đổ bóng*.
    - Đầu ra: Hiển thị 3 biến thể ảnh sản phẩm và nút tải về các tỷ lệ `1:1`, `4:5`, `9:16`.
  - Cột Phải: Trình cấu hình nhanh tham số Agent (Temperature, Model routing) và khung xem thử Video kết quả (Preview Monitor).

#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Bổ sung các class CSS cho bộ resizer nằm ngang `.panel-resizer-horizontal` và resizer dọc `.sidebar-resizer`.
- Định nghĩa phong cách màu tối chuyên dụng của Shotcut (`.shotcut-nle-wrapper`, `.shotcut-toolbar`, `.shotcut-player`, `.shotcut-peak-meter`).
- Viết class CSS cho luồng Agent Flow sáng (`.agent-flow-light-theme`, `.agent-flowchart-card`, `.flow-arrow-animation`).
- Thiết kế riêng cho **Tool Visual F&B**: `.fb-upload-zone`, `.fb-preview-canvas`, `.fb-sidebar-style`, `.fb-output-variant`.

---

## Verification Plan

### Automated Tests
- Chạy `npm run build` để kiểm tra lỗi cú pháp TypeScript và cấu trúc JSX.

### Manual Verification
1. Chạy Electron dev server và chuyển sang chế độ **Dựng Phim (Shotcut)**.
2. Thử kéo thả các resizer để thay đổi chiều rộng Playlist, chiều rộng Peak Meter, và chiều cao Timeline bên dưới. Xác nhận giao diện co giãn mượt mà.
3. Bấm Play trên trình phát Preview, kiểm tra xem chỉ số dB trên cột Peak Meter có nhảy động đồng bộ không.
4. Chuyển sang chế độ **Điều phối Agent AI**, trải nghiệm giao diện Light theme.
5. Thử nghiệm **Tool Tạo Visual Nước chấm Hải sản**: Tải lên ảnh sản phẩm, nhập tên thương hiệu, chọn bối cảnh và bấm "Tạo Visual". Theo dõi quy trình chạy hoạt ảnh tự động và kiểm tra 3 ảnh đầu ra kèm các nút tải tỷ lệ.
