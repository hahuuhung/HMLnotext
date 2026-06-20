# Kế hoạch Kỹ thuật: Khai thác Shotcut-master cho Ứng dụng Desktop Video Editor Chuyên Nghiệp

Dựa trên yêu cầu của bạn, chúng ta cần xây dựng một phần mềm desktop Windows chuyên nghiệp dựa trên mã nguồn `shotcut-master`. Hiện tại, dự án `HML` của chúng ta đã có sẵn lớp vỏ **Electron** và giao diện React "Shotcut NLE chuyên sâu" tuyệt đẹp vừa được hoàn thiện. 

Do mã nguồn gốc của Shotcut được viết bằng **C++ và Qt6**, trong khi hệ sinh thái hiện tại của chúng ta là **Node.js/Electron**, tôi đề xuất 2 hướng tiếp cận để bạn lựa chọn.

---

## User Review Required & Open Questions

> [!CAUTION]
> **Câu hỏi quan trọng:** Bạn muốn đi theo hướng tiếp cận nào dưới đây để phát triển ứng dụng?

### Lựa chọn 1: Tích hợp MLT Engine (Lõi của Shotcut) vào ứng dụng Electron hiện tại (Khuyên dùng)
- **Kiến trúc:** Giao diện người dùng sẽ vẫn là giao diện React cực đẹp mà chúng ta vừa xây dựng. Backend Node.js (`render.processor.ts`) thay vì dùng FFMPEG cơ bản sẽ được nâng cấp để sinh ra file kịch bản **XML `.mlt`** (định dạng chuẩn của Shotcut) và gọi trực tiếp file thực thi lõi của Shotcut (`melt.exe` hoặc `qmelt.exe`) để render video.
- **Ưu điểm:**
  - Tận dụng lại toàn bộ giao diện đã làm (tích hợp được với AI Flow, Prompt Agent).
  - Tích hợp nhanh, không tốn hàng giờ thiết lập môi trường C++ phức tạp.
  - Vẫn sở hữu 100% sức mạnh xử lý hiệu ứng, chuyển cảnh chuyên nghiệp của Shotcut (MLT Framework).
- **Nhược điểm:** Cần đóng gói thêm `melt.exe` và các thư viện DLL đi kèm vào ứng dụng Electron.

### Lựa chọn 2: Biên dịch và tùy biến trực tiếp mã nguồn C++ Qt gốc (`shotcut-master`)
- **Kiến trúc:** Bỏ qua ứng dụng Electron hiện tại. Chúng ta sẽ thiết lập môi trường C++ (CMake, Ninja, Qt6, thư viện MLT, FFmpeg SDK) trên Windows để biên dịch thư mục `shotcut-master` thành một phần mềm độc lập hoàn toàn bằng C++.
- **Ưu điểm:** Can thiệp sâu vào nhân phần mềm, tối ưu hiệu năng tuyệt đối bằng C/C++. Tận dụng nguyên bản UI của Shotcut.
- **Nhược điểm:** 
  - Mất hoàn toàn các tính năng AI, Agent Flow, Tools Dashboard đã xây dựng trên nhánh `BigPjo`.
  - Quá trình biên dịch C++ trên Windows rất phức tạp, cần tải hàng chục GB thư viện và có thể gặp nhiều lỗi tương thích.

---

## Proposed Changes (Nếu chọn Lựa chọn 1 - Tích hợp MLT vào Electron)

### 1. [Backend Node.js] Module Trình biên dịch MLT
- **`server/src/render-queue/mlt-generator.service.ts` [NEW]**: Service chuyên tạo nội dung file XML `.mlt` dựa trên dữ liệu Timeline của giao diện (các Tracks, Clips, Fx, Transitions, Speed).
- **`server/src/render-queue/render.processor.ts` [MODIFY]**: Cập nhật hàm `handleRender` để gọi `mlt-generator.service.ts`, sau đó sử dụng `child_process.spawn` để thực thi lệnh `melt project.mlt -consumer avformat:output.mp4`.

### 2. [Electron Infrastructure] Đóng gói Engine
- Cấu hình thư mục `engine/shotcut-mlt/` chứa các file thực thi cần thiết (ffmpeg, melt, frei0r plugins) được trích xuất từ phiên bản Portable của Shotcut để đóng gói cùng ứng dụng Electron Windows.
- Sửa đổi `electron/main.cjs` để nạp chính xác đường dẫn engine.

### 3. [Frontend React] Đồng bộ hóa Timeline
- Ánh xạ cấu trúc JSON của state UI (`scenes`, `activeSceneIndex`, `fx`, `speed`, v.v.) thành một object chuẩn (Project Model) để gửi qua API `/api/render`.

---

## Verification Plan

### Automated Tests
- Viết unit test cho hàm sinh `.mlt` XML để đảm bảo tính hợp lệ của cấu trúc XML (đúng thẻ `<tractor>`, `<multitrack>`, `<playlist>`, `<producer>`).

### Manual Verification
1. Xuất thử một video từ giao diện bằng cách áp dụng bộ lọc *Cinematic*, tốc độ *Slow 0.5x* và chuyển cảnh *Fade*.
2. Backend sinh ra file `.mlt` mẫu và tự động gọi `melt`.
3. Kiểm tra video thành phẩm xem có áp dụng đúng các filter của Frei0r (lõi Shotcut) thay vì FFMPEG thuần hay không.

> [!IMPORTANT]
> **Vui lòng trả lời:** Bạn muốn chọn **Lựa chọn 1 (Tích hợp vào Electron)** hay **Lựa chọn 2 (Biên dịch lại C++ Qt)**? Nếu bạn chọn Lựa chọn 1, tôi sẽ tiến hành tạo task và bắt đầu code ngay!
