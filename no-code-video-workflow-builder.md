# Kế hoạch thiết kế ứng dụng tạo video auto no-code giao diện n8n

## 1. Mục tiêu sản phẩm

Xây dựng ứng dụng cho phép người dùng không biết code tạo video tự động bằng workflow dạng node, tương tự n8n. Ứng dụng hỗ trợ cả desktop và web, cho phép kéo thả các node để tạo kịch bản, chọn/generate tài sản, dựng timeline, render video và xuất bản.

## 2. Phạm vi MVP

### Người dùng mục tiêu
- Creator cá nhân cần làm video ngắn từ prompt/bài viết/sản phẩm.
- Team marketing cần sản xuất video hàng loạt từ template.
- Agency cần quy trình video có thể tái sử dụng, lưu version và render nền.

### MVP cần có
1. Workspace/project để quản lý video.
2. Canvas workflow dạng node như n8n.
3. Node palette phân loại: Trigger, Input, AI, Asset, Audio, Edit, Render, Publish.
4. Inspector bên phải để cấu hình node không cần code.
5. Timeline preview bên dưới canvas.
6. Thư viện template video ngắn.
7. Render queue chạy nền.
8. Preview frame/thumbnail trước khi render full video.
9. Export MP4 chất lượng cơ bản.
10. Lưu workflow versioning.

## 3. Kiến trúc đề xuất

### Frontend
- Web: Next.js + React + TypeScript.
- Desktop: Tauri hoặc Electron dùng chung core UI với web.
- Canvas: React Flow hoặc LiteGraph.js.
- State: Zustand/Redux Toolkit.
- Timeline preview: custom React component hoặc Remotion preview nếu dùng Remotion.

### Backend
- API: NestJS hoặc Fastify + TypeScript.
- Workflow engine: engine riêng chạy DAG, có validate dependency, retry, logging.
- Queue: Redis + BullMQ.
- Database: PostgreSQL.
- Storage: S3-compatible object storage cho asset/video output.
- Worker render: Node worker hoặc Python worker tùy engine render.

### Render engine
Ưu tiên MVP:
- FFmpeg làm core render: ghép ảnh/video, voice-over, subtitle, transition, watermark, resize.
- Remotion nếu cần template phức tạp, animation dựa trên React component.
- Có thể kết hợp: Remotion tạo scene phức tạp, FFmpeg assemble final video.

## 4. Mô hình workflow

Workflow là DAG gồm:
- Node: một bước xử lý, ví dụ generate script, search stock, generate voice.
- Edge: kết nối output của node này sang input node khác.
- Execution: mỗi lần chạy workflow.
- RenderJob: job render video.
- Asset: ảnh, video, audio, subtitle, thumbnail.
- Template: cấu hình workflow + tham số mặc định.

## 5. Node catalog MVP

### Trigger
- Manual run.
- Schedule.
- Webhook.
- Watch folder trên desktop.
- Import từ CSV/Google Sheet.

### Input
- Text prompt.
- URL bài viết/blog.
- Product data.
- Upload ảnh/video/audio.
- Stock library.

### AI Script
- Generate outline.
- Generate hook 3 giây đầu.
- Expand prompt thành kịch bản.
- Split script thành scene.
- Generate caption/subtitle.
- Translate/localize script.

### Visual
- AI image generation.
- Stock image/video search.
- Scene planner.
- Background generator.
- Avatar/character nếu có provider.
- Brand kit: logo, màu, font.

### Audio
- Text-to-speech.
- Voice clone nếu được phép.
- Background music.
- Sound effect.
- Audio normalization.

### Editing
- Timeline builder.
- Trim/cut.
- Transition.
- Caption style.
- Watermark.
- Aspect ratio: 9:16, 1:1, 16:9.
- Template áp dụng cho nhiều video.

### Render & Export
- Preview render.
- Full render.
- Export MP4.
- Upload output.
- Publish social nếu có API sau này.

## 6. Trải nghiệm giao diện

### Layout chính
- Bên trái: node palette và template.
- Giữa: workflow canvas kéo thả.
- Bên phải: inspector cấu hình node.
- Dưới cùng: timeline preview, asset list, log execution.
- Trên cùng: run workflow, preview, export, save, version.

### UX no-code
- Mỗi node có preset đơn giản.
- Input dạng form, dropdown, upload, prompt box.
- Có chế độ advanced expression cho người dùng nâng cao nhưng không bắt buộc.
- Node bị lỗi hiển thị rõ nguyên nhân và gợi ý sửa.
- Có nút “Test this node” để chạy từng bước.

## 7. Luồng tạo video tiêu biểu

1. Người dùng chọn template “Short-form AI video”.
2. Nhập prompt hoặc URL bài viết.
3. Node AI tạo outline.
4. Node AI tạo kịch bản ngắn.
5. Node split script thành 5-8 scenes.
6. Node visual chọn/generate hình ảnh cho từng scene.
7. Node TTS tạo voice-over.
8. Node caption tạo subtitle.
9. Node editor dựng timeline.
10. Node render tạo MP4.
11. Người dùng preview, chỉnh sửa, export.

## 8. API/backend modules

- Auth & workspace.
- Project & workflow CRUD.
- Workflow versioning.
- Workflow execution API.
- Node registry.
- Asset upload/storage.
- Render job queue.
- Template system.
- Provider abstraction cho AI/image/audio/stock.
- Billing/quota nếu cần monetization.

## 9. Bảo mật và vận hành

- API keys của provider được mã hóa.
- Phân quyền workspace/project.
- Rate limit theo user/workspace.
- Job timeout, retry, cancellation.
- Audit log cho execution.
- Content moderation cho AI-generated media.
- Asset cleanup theo retention policy.

## 10. Lộ trình triển khai

### Phase 1: Prototype
- Canvas workflow kéo thả.
- Node registry cơ bản.
- Prompt-to-script.
- Scene split.
- Generate image placeholder.
- Render MP4 đơn giản bằng FFmpeg.

### Phase 2: MVP usable
- Upload asset.
- TTS.
- Caption.
- Timeline preview.
- Render queue.
- Template video ngắn.
- Save/load workflow.

### Phase 3: Desktop + local render
- Đóng gói desktop app.
- Hỗ trợ local folder watch.
- Render bằng FFmpeg local.
- Sync project với cloud nếu cần.

### Phase 4: Production
- Multi-user workspace.
- Billing/quota.
- Provider failover.
- Publish social.
- Advanced expression.
- Marketplace template/node.

## 11. Rủi ro chính

- Render video trên web có thể tốn tài nguyên; nên dùng queue và worker riêng.
- Giao diện no-code dễ bị phức tạp nếu node quá nhiều; cần nhóm node và template rõ.
- AI providers thay đổi API/cost; cần abstraction layer.
- Preview full timeline có thể chậm; nên dùng low-res proxy và cache frame.
- Desktop và web cần thống nhất data model để tránh fork logic.

## 12. Khuyến nghị stack cho MVP

- Frontend: Next.js + React Flow + Tailwind.
- Backend: NestJS + PostgreSQL + Redis + BullMQ.
- Render: FFmpeg + Remotion optional.
- Desktop: Tauri nếu ưu tiên nhẹ, Electron nếu cần ecosystem plugin rộng.
- Storage: S3-compatible.
- AI providers: thiết kế qua adapter để đổi model/provider dễ dàng.
