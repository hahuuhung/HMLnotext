# HMLnotext - Trình Dựng Video Tự Động Hóa & Biên Tập Chuyên Nghiệp

Chào mừng bạn đến với **HMLnotext**, một nền tảng Web biên tập video tự động hóa và dựng phim chuyên nghiệp. Ứng dụng kết hợp sức mạnh của mô hình lập trình dạng dòng chảy dữ liệu (Canvas Workflow kiểu n8n) và giao diện dựng phim phi tuyến tính truyền thống (Shotcut NLE Layout).

---

## 🚀 Các Tính Năng Chính

### 1. Canvas Workflow (Kiểu n8n) Siêu Tương Tác
Trực quan hóa quy trình xử lý nội dung từ ý tưởng thô cho đến thành phẩm video thông qua sơ đồ dạng Node:
* **Thanh Công Cụ Nổi (Canvas Toolbar)**: Cho phép nhấp chọn và thêm nhanh các loại Node:
  * *Kích Hoạt* (Trigger chạy thủ công)
  * *Đầu Vào Prompt* (Ý tưởng/Prompt video)
  * *Tài Liệu* (Nạp file văn bản `.txt`/`.pdf`)
  * *Liên Kết Blog* (Trích xuất từ URL bài viết)
  * *AI Script* (Biên tập nội dung kịch bản đa phong cách)
  * *Visual Node* (Lựa chọn mỹ thuật hình ảnh Cinematic, Anime, 3D)
  * *Lồng Tiếng AI* (Thiết lập giọng đọc TTS vùng miền và tốc độ)
  * *Phụ Đề* (Kiểu dáng chữ chạy và màu sắc phụ đề)
  * *Xuất Bản* (Xuất file thành phẩm MP4 giả lập)
* **Chỉnh Sửa Trực Tiếp**: Chọn một node bất kỳ và đổi tên hiển thị (Label) ngay trên thanh thuộc tính Inspector để sắp xếp luồng trực quan.
* **Xóa Liên Kết Dễ Dàng**: Click chọn dây nối (Edge) trên canvas (dây nối được tô đậm đỏ chuyển động luồng) và nhấn nút `Xóa liên kết` để ngắt kết nối.
* **Lưu Workflow Thủ Công**: Hỗ trợ nút **Lưu Workflow** ghi đè tức thì cấu hình dự án hiện tại vào hệ thống `LocalStorage` kèm thông báo Toast đồng bộ.

### 2. Trình Biên Tập Video Shotcut NLE
Giao diện dựng phim chuyên nghiệp phong cách mã nguồn mở Shotcut:
* **Playlist (Danh Sách Phát)**: Quản lý toàn bộ danh sách các clip phân cảnh và tài nguyên đầu vào. Click vào từng phân cảnh để tua nhanh trên Monitor.
* **Filters (Bộ Lọc FX)**: Tìm kiếm và áp dụng các hiệu ứng hình ảnh (Cinematic, Vintage, Noir, Glitch, Blur) và xem trước thời gian thực trên màn hình Monitor.
* **Project Monitor & Audio Peak Meter**: Màn hình phát phân cảnh kết hợp cột đo âm lượng dọc (dB) nhấp nháy sống động đồng bộ theo tiến trình phát.
* **Timeline Đa Track**: Cắt cảnh, tùy chỉnh độ trễ, bám dính (Snap-to-grid), khóa track, và điều chỉnh âm lượng/phụ đề.
* **Jobs (Hành Trình Xuất Bản)**: Quản lý danh sách kết quả các tác vụ render video chạy ngầm theo thời gian thực.

### 3. Agent Orchestration (Tab Nhân Vật AI)
Hệ thống hiển thị cuộc hội thoại và luồng làm việc giữa các AI Agent (Biên kịch, Đạo diễn hình ảnh, AI Voiceover) hoạt động nhịp nhàng để tạo nên kịch bản phân cảnh hoàn chỉnh.

---

## 🛠️ Công Nghệ Sử Dụng

* **Core**: React 18, TypeScript, Vite
* **Styling**: HSL Tailwind-like Vanilla CSS, Breeze Dark & Glassmorphic themes
* **Workflow Engine**: `@xyflow/react` (React Flow v12)
* **Icons**: `lucide-react`
* **Testing**: Vitest

---

## 💻 Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Yêu Cầu Hệ Thống
* Đã cài đặt **Node.js** (Phiên bản v18 trở lên).

### 2. Cài Đặt Dependencies
Cài đặt toàn bộ thư viện cần thiết bằng npm:
```bash
npm install
```

### 3. Khởi Chạy Môi Trường Phát Triển (Local Dev)
Chạy dev server cục bộ:
```bash
npm run dev
```

### 4. Kiểm Thử Đơn Vị (Unit Tests)
Chạy toàn bộ các ca kiểm thử hoạt động của workflow:
```bash
npx vitest run
```

### 5. Đóng Gói Dự Án (Build)
Biên dịch dự án ra phiên bản production:
```bash
npm run build
```
Thành phẩm sau khi build sẽ được xuất ra thư mục `dist/`.

---

## 📁 Cấu Trúc Tài Liệu Sao Lưu
Tất cả các bản vẽ workflow, danh sách công việc và nghiệm thu tính năng được lưu trữ tại:
* `doc/task_*.md`: Tiến trình chi tiết của dự án.
* `doc/implementation_plan_*.md`: Thiết kế kiến trúc kỹ thuật.
* `doc/walkthrough_*.md`: Hướng dẫn nghiệm thu trực quan.
