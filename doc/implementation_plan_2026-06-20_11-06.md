# Kế hoạch Kỹ thuật: Tích hợp Trợ lý Dựng phim AI - Gợi ý Hiệu ứng Chuyển cảnh, Hiệu ứng Nền & Tốc độ Thông minh

Kế hoạch này nhằm bổ sung tính năng **Trợ lý Dựng phim AI (AI Video Editing Assistant)** vào thẻ **Bộ lọc (Filters)** của chế độ xem Dựng phim (Shotcut). Tính năng này tự động phân tích nội dung phân cảnh đang chọn và gợi ý các cấu hình tối ưu về bộ lọc màu, chuyển cảnh, hiệu ứng nền và tốc độ phát, giúp người dùng dựng video nhanh chóng và chuyên nghiệp nhất.

---

## User Review Required

> [!IMPORTANT]
> - **Gợi ý tự động (Contextual Suggestions)**: Hệ thống sẽ tự động quét văn bản kịch bản của phân cảnh (`scene.text`) hoặc prompt chung của dự án để đưa ra các đề xuất hiệu ứng phù hợp nhất (ví dụ: phát hiện từ khóa "chậm rãi", "tí tách" -> gợi ý Slow Motion 0.5x & Vintage sepia).
> - **Giao diện Trợ lý Glassmorphism**: Một vùng riêng biệt được thiết kế cao cấp ở vị trí đầu thẻ "Bộ lọc", trang bị nút ma thuật "🪄 Nhận Gợi ý Hiệu ứng AI" với hiệu ứng chuyển màu neon.
> - **Nút áp dụng nhanh**: Cho phép người dùng áp dụng riêng lẻ từng gợi ý hoặc click "Áp dụng tất cả gợi ý" để thiết lập đồng thời cả 4 hiệu ứng cho cảnh.
> - **Nhập yêu cầu tùy chỉnh**: Người dùng có thể tự viết yêu cầu (ví dụ: "làm cảnh này giống phim ma", "tiết tấu nhanh gay cấn") để AI tính toán lại các hiệu ứng gợi ý phù hợp.

---

## Mockups & Layouts

Bản thiết kế giao diện gợi ý AI đã được tạo và lưu trữ tại thư mục [doc/](file:///d:/AntiGravity/HML/doc):
- **Mockup Trợ lý Gợi ý AI**: [ai_suggestions_mockup.png](file:///d:/AntiGravity/HML/doc/ai_suggestions_mockup.png)

---

## Proposed Changes

### [Component Frontend]

#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Thêm state phục vụ tính năng gợi ý AI:
  - `aiStyleGenre`: Phong cách thể loại video được chọn (e.g. `'cinematic' | 'tiktok' | 'ambient' | 'action'`).
  - `customAiRequest`: Trường văn bản cho phép người dùng nhập yêu cầu tùy biến.
  - `isGeneratingSuggestions`: Trạng thái tải hiệu ứng khi nhấn nút gợi ý.
  - `aiSuggestions`: Đối tượng lưu trữ các gợi ý được tính toán gồm:
    - `fx`: gợi ý bộ lọc màu.
    - `transition`: gợi ý hiệu ứng chuyển cảnh.
    - `bgFx`: gợi ý hiệu ứng nền.
    - `speed`: gợi ý tốc độ.
    - `reason`: lý do gợi ý (giải thích từ AI).
- Thêm hàm `generateAiSuggestions(sceneText: string, genre: string, customPrompt: string)`:
  - Phân tích từ khóa trong `sceneText` hoặc `customPrompt` để suy ra các cấu hình hiệu ứng phù hợp.
  - Cập nhật state `aiSuggestions` với các gợi ý trực quan và sinh động.
- Thêm hàm `applyAllAiSuggestions()`:
  - Gọi đồng thời các hàm `handleSceneFxChange`, `handleSceneTransitionChange`, `handleSceneBgFxChange`, `handleSceneSpeedChange` để cập nhật trạng thái phân cảnh.
- Cập nhật JSX trong thẻ `leftTab === 'filters'`:
  - Thêm container **Trợ lý Dựng phim AI (AI Editing Assistant)** thiết kế premium glassmorphism.
  - Hiển thị các ô chọn Thể loại (Genre), ô nhập Yêu cầu tùy chọn (Custom Prompt), nút bấm "🪄 Nhận Gợi ý Hiệu ứng AI".
  - Hiển thị kết quả gợi ý trực quan với các tag màu sắc tương ứng cho từng loại hiệu ứng và nút bấm Áp dụng nhanh.

#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Bổ sung style cho các container trợ lý AI:
  - `.ai-assistant-container`: Khung kính mờ (glassmorphism), viền neon mỏng.
  - `.ai-suggestion-box`: Hộp chứa kết quả gợi ý với nền tối mượt mà và chữ phản quang nhẹ.
  - `.ai-assistant-btn-magic`: Nút bấm ma thuật tích hợp hiệu ứng gradient lấp lánh và hiệu ứng pulse nhẹ khi hover.
  - Thêm hoạt ảnh và màu sắc bắt mắt cho các tag gợi ý.

---

## Verification Plan

### Automated Tests
- Chạy `npm run build` để kiểm tra toàn bộ mã nguồn frontend, đảm bảo không có lỗi cú pháp TypeScript hoặc JSX.

### Manual Verification
1. Mở giao diện dựng phim Shotcut.
2. Chọn thẻ **Bộ lọc (Filters)** ở thanh bên trái.
3. Trải nghiệm Trợ lý Dựng phim AI: chọn phong cách "Cinematic Sâu lắng", nhấn **Nhận Gợi ý Hiệu ứng AI**.
4. Kiểm tra xem các gợi ý (Bộ lọc, Chuyển cảnh, Hiệu ứng nền, Tốc độ) cùng lý do gợi ý có hiển thị bằng tiếng Việt trực quan hay không.
5. Thử nhấn nút **Áp dụng tất cả** hoặc nhấn nút **Áp dụng** bên cạnh từng hiệu ứng và quan sát xem trạng thái "Hiệu ứng đang chọn" có thay đổi đồng bộ.
6. Thử nhập một prompt tùy chọn như "năng động vui tươi" và nhấn gợi ý để kiểm tra tính linh hoạt của thuật toán đề xuất.
