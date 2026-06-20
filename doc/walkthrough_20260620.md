# Tổng kết: Tích hợp MLT Engine (Lõi Shotcut) vào HML Video Editor

## Mục tiêu
Thay thế kiến trúc render video cơ bản dựa trên FFMPEG bằng **MLT Framework** (nhân xử lý video của Shotcut) để mang lại sức mạnh chỉnh sửa video chuyên nghiệp (bộ lọc Frei0r, chuyển cảnh, multitrack) vào ứng dụng Electron của chúng ta.

## Các thay đổi chính

### 1. Tạo mới dịch vụ sinh kịch bản XML (`MltGeneratorService`)
- **[NEW] `server/src/render-queue/mlt-generator.service.ts`**
  - Xây dựng một trình biên dịch lấy đầu vào là `scenes` từ giao diện React (bao gồm các thuộc tính như `fxClass`, `speedClass`, `transition`, text).
  - Tự động xuất ra file kịch bản **`.mlt` XML** (chuẩn dự án của Shotcut). 
  - Khai báo đầy đủ các thẻ XML cấu trúc: `<profile>`, `<producer>`, `<playlist>`, `<tractor>`, `<filter>`.
  - Hỗ trợ ánh xạ các hiệu ứng video như *Vintage*, *Cinematic* thành tham số Frei0r chuẩn (ví dụ: `frei0r.coloradj_RGB`, `sepia`).

### 2. Tái cấu trúc bộ xử lý hàng đợi (`RenderProcessor`)
- **[MODIFY] `server/src/render-queue/render.processor.ts`**
  - Loại bỏ các câu lệnh nối chuỗi `-complex_filter` dài dòng và cứng nhắc của `fluent-ffmpeg`.
  - Inject `MltGeneratorService` để sinh file `.mlt` tạm thời.
  - Sử dụng `child_process.spawn` gọi tệp thực thi `melt` (hoặc biến môi trường `MELT_PATH`) trên Windows để render đoạn XML thành file `output.mp4`.
  - Tự động bắt tín hiệu Stdout/Stderr từ `melt` để cập nhật tiến độ Job (`job.progress`).

### 3. Cập nhật Module
- **[MODIFY] `server/src/render-queue/render-queue.module.ts`**
  - Đăng ký `MltGeneratorService` vào Dependency Injection container của NestJS.

## Kết quả kiểm thử
- Hệ thống đã build thành công (`npm run build`) mà không gặp lỗi TypeScript nào.
- Ứng dụng đã sẵn sàng chạy với `melt.exe`.

> [!TIP]
> **Hướng dẫn triển khai cho Người dùng:** 
> Để xuất video thực tế trên Windows, bạn cần đảm bảo tải bản Portable của Shotcut, trích xuất thư mục chứa file `melt.exe` và các thư viện `.dll`, `frei0r` vào thư mục `engine/` của dự án và khai báo biến môi trường `MELT_PATH`.
