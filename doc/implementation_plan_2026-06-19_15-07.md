# Kế hoạch nâng cấp: Tích hợp Electron Desktop (dùng chung Core UI)

Kế hoạch này đề xuất thiết lập và cấu hình **Electron** để biến ứng dụng web HMLnotext thành một ứng dụng Desktop chính thức, chia sẻ hoàn toàn 100% giao diện Core UI (React + Vite + Tailwind CSS) hiện tại.

## User Review Required

> [!IMPORTANT]
> **Các thay đổi cấu trúc đề xuất:**
> 1. **Cấu hình CommonJS cho Electron**: Do dự án sử dụng `"type": "module"` trong `package.json`, các file script chạy dưới nền của Electron (Main Process và Preload Script) sẽ sử dụng đuôi `.cjs` (`main.cjs` và `preload.cjs`) để tránh xung đột hệ thống module của Node.js.
> 2. **Cài đặt thư viện mới**:
>    - `electron` (devDependencies): Công cụ chạy chính cho desktop.
>    - `concurrently` và `wait-on` (devDependencies): Dùng để khởi chạy song song Vite dev server và tự động kích hoạt Electron khi cổng server sẵn sàng.

---

## Proposed Changes

### 1. Thêm cấu hình chạy Electron vào package.json
#### [MODIFY] [package.json](file:///d:/AntiGravity/HML/package.json)
- Chỉ định entry point cho Electron: `"main": "electron/main.cjs"`.
- Bổ sung các lệnh script mới:
  - `"electron:dev"`: Chạy đồng thời dev server của Vite và khởi động Electron.
  - `"electron:build"`: Đóng gói code React và chuẩn bị cho Electron.
- Khai báo cài đặt thêm `electron`, `concurrently` và `wait-on` trong devDependencies.

### 2. Thiết lập Main Process và Preload cho Electron
#### [NEW] [main.cjs](file:///d:/AntiGravity/HML/electron/main.cjs)
- Tạo cửa sổ ứng dụng desktop (BrowserWindow) kích thước 1280x800.
- Phát hiện môi trường phát triển: Nếu ở chế độ dev, tải link `http://localhost:5173`. Nếu ở chế độ production, tải file tĩnh đã build `dist/index.html`.
- Tự động đóng/mở DevTools ở chế độ dev.

#### [NEW] [preload.cjs](file:///d:/AntiGravity/HML/electron/preload.cjs)
- Thiết lập IPC Bridge cơ bản phục vụ cho việc mở rộng tính năng hệ thống sau này (ví dụ như lưu tệp trực tiếp vào máy tính).

---

## Verification Plan

### Automated Tests
- Chạy `npm run lint` kiểm tra tính đúng đắn của mã nguồn.

### Manual Verification
- Chạy lệnh `npm run electron:dev` để mở ứng dụng dưới dạng cửa sổ Desktop độc lập.
- Xác nhận các chức năng như Canvas n8n, Shotcut timeline, thay đổi thuộc tính hoạt động mượt mượt như bản Web.
