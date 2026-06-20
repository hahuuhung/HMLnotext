# Kế hoạch Kỹ thuật: Tích hợp Gợi ý Hiệu ứng Chuyển cảnh, Hiệu ứng Nền & Bộ chỉnh Tốc độ (Speed FX)

Kế hoạch này tích hợp các tùy chọn gợi ý hiệu ứng điện ảnh vào trình biên tập phân cảnh của HML, bao gồm chuyển cảnh (Transitions), hiệu ứng nền (Background FX) và tốc độ phát (Speed FX).

---

## Proposed Changes

### [Component Frontend]

#### [MODIFY] [App.tsx](file:///d:/AntiGravity/HML/src/App.tsx)
- Bổ sung các trường dữ liệu tùy chọn `transition`, `bgFx`, `speed` vào kiểu `Scene`.
- Viết 3 hàm xử lý lưu trữ thuộc tính phân cảnh và phát log thông báo:
  - `handleSceneTransitionChange`
  - `handleSceneBgFxChange`
  - `handleSceneSpeedChange`
- **Sidebar phải (Scene Configs)**: Thêm 3 thẻ `select` chọn lựa hiệu ứng chuyển cảnh, hiệu ứng nền, tốc độ phát.
- **Sidebar trái Shotcut Mode (Filters tab)**: Phân tách danh mục bộ lọc ra thành 4 nhóm hiệu ứng có phân cấp rõ ràng (Bộ lọc màu sắc, Chuyển cảnh gợi ý, Hiệu ứng nền gợi ý, Tốc độ gợi ý) kèm nút bấm áp dụng nhanh `+`.
- **getFxClass helper**: Cho phép ghép nối các class visual mô phỏng để áp dụng đồng thời bộ lọc màu sắc, hiệu ứng nền, và tốc độ lên thẻ preview.

#### [MODIFY] [index.css](file:///d:/AntiGravity/HML/src/index.css)
- Bổ sung các hiệu ứng visual mô phỏng bằng CSS thuần:
  - `.bgfx-particles` (hạt chuyển động)
  - `.bgfx-bokeh` (đèn lấp lánh pulsating)
  - `.bgfx-smoke` (làn khói cinematic di chuyển)
  - `.bgfx-gradient` (dải màu wave động)
  - `.bgfx-grid` (lưới retro scanlines)
  - `.bgfx-starfield` (hiệu ứng phóng to tinh tú)
  - `.speed-slow_05` / `.speed-slow_025` (viền mờ tối slow-motion)
  - `.speed-fast_15` / `.speed-fast_20` (rung chấn camera lắc động mô phỏng tua nhanh)
  - `.speed-timelapse` (chớp sáng chu kỳ tua nhanh)

---

## Verification Plan

### Automated Tests
- Chạy `npm run build` để kiểm tra lỗi cú pháp TypeScript và cấu trúc JSX.
