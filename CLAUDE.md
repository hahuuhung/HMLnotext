# HML Project Rules & AI Token-Saving Guide

Tài liệu này chứa các quy tắc và lệnh phát triển của dự án HML giúp AI Agent hoạt động hiệu quả, tiết kiệm token tối đa và đảm bảo chất lượng mã nguồn.

---

## 1. Lệnh Phát Triển & Kiểm Thử (Commands)

- **Chạy môi trường Dev**: `npm run dev`
- **Biên dịch thử nghiệm**: `npm run build`
- **Kiểm tra kiểu dữ liệu (TypeScript)**: `npx tsc --noEmit`
- **Chạy toàn bộ Unit Tests**: `npx vitest run`
- **Chạy Test ở chế độ watch**: `npx vitest`

---

## 2. Quy Tắc Tiết Kiệm Token Cho AI Agent (Token-Saving Rules)

- **Chỉnh sửa tối thiểu (Minimal Edits)**:
  - Chỉ sửa đổi đúng vùng code cần thiết. KHÔNG bao giờ viết lại hoặc thay thế toàn bộ file nếu chỉ cần thay đổi vài dòng.
  - Sử dụng các công cụ thay thế khối văn bản chính xác (`replace_file_content` hoặc `multi_replace_file_content`).
- **Giữ cấu trúc đơn giản**:
  - Không tự ý chia nhỏ file `App.tsx` hoặc tạo các components mới trừ khi được yêu cầu rõ ràng.
  - Giữ logic luồng, timeline và preview tập trung trong cùng một trạng thái React chính để tránh đồng bộ phức tạp.
- **Tránh cài đặt thư viện không cần thiết**:
  - Không tự ý cài đặt thêm các thư viện vẽ hoặc hoạt ảnh (motion, drag-drop) bên ngoài. Tận dụng CSS transitions, HSL CSS variables, và React Flow mặc định.

---

## 3. Tiêu Chuẩn Thiết Kế & Lập Trình (Coding Standards)

- **Ngôn ngữ hiển thị**: Tất cả văn bản giao diện (UI) và trải nghiệm (UX) **bắt buộc** phải là **Tiếng Việt**.
- **Đường dẫn**: KHÔNG sử dụng đường dẫn tuyệt đối (ví dụ `C:\...`). Hãy sử dụng đường dẫn tương đối.
- **Phong cách CSS**:

  - Viết tập trung vào `src/index.css` sử dụng biến CSS toàn cục và các lớp thiết kế Breeze Dark / Light.
  - Sử dụng CSS FX filters cho hiệu ứng video thời gian thực.
- **Quản lý Dòng thời gian**:

  - Sử dụng trạng thái `scenes` làm nguồn dữ liệu duy nhất (Single Source of Truth) cho hình ảnh, phụ đề, thời lượng và FX.
  - Các hàm tính offset hoặc click timeline bắt buộc phải nhân/chia theo tỉ lệ `timelineScale` để đảm bảo độ chính xác của Playhead.

  4. **Tiêu Chuẩn Thiết Kế UX UI**

  * **Tôn chỉ Core UX** : Được đưa lên phần đầu mục quan trọng nhất của tài liệu thiết kế. Mọi sự phân tách kỹ thuật ở tầng dưới bắt buộc không được làm ảnh hưởng đến tính trực quan và đơn giản của giao diện người dùng.
  * **Chi tiết hóa No-code cho từng Module** : Ghi nhận rõ ràng trải nghiệm không cần viết mã (No-code specifications) cho từng module (ví dụ: kéo thả biểu đồ trên Canvas n8n-style, chọn phong cách ảnh từ dropdown, thay đổi tốc độ và giọng nói qua thanh trượt,...).
