# Sơ đồ quy trình xử lý Workflow (Workflow Diagram)

Sơ đồ dưới đây thể hiện luồng chạy dữ liệu của DAG từ khi kích hoạt đến khi render video thành công:

```mermaid
graph TD
    A[Trigger Node: Chạy thủ công / Manual] -->|Kích hoạt| B[Input Node: Nhập prompt đề tài]
    B -->|Dữ liệu Prompt: 'Học tiếng Anh cơ bản'| C[AI Script Node: Tách cảnh / Scene Split]
    C -->|Danh sách các Cảnh + Văn bản đọc / Subtitle| D[Visual Node: Sinh ảnh cho từng Cảnh]
    D -->|Ảnh placeholder + Text kịch bản| E[Render Node: Lắp ghép Video]
    E -->|Tổng hợp & Tạo URL file video| F[Kết quả: Xem thử & Tải về MP4]
    
    style A fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style B fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style C fill:#9C27B0,stroke:#7B1FA2,stroke-width:2px,color:#fff
    style D fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    style E fill:#E91E63,stroke:#C2185B,stroke-width:2px,color:#fff
    style F fill:#009688,stroke:#00796B,stroke-width:2px,color:#fff
```

## Giải thích luồng hoạt động
1. **Trigger Node**: Phát ra tín hiệu bắt đầu (Start signal).
2. **Input Node**: Nhận cấu hình chủ đề hoặc prompt từ người dùng và đẩy sang cho node tiếp theo.
3. **AI Script Node**: Gọi API (hoặc mock API) để chia nhỏ prompt thành cấu trúc kịch bản gồm các cảnh (Scene 1, Scene 2, Scene 3) kèm lời bình thoại (Voice-over) và mô tả hình ảnh cho cảnh đó.
4. **Visual Node**: Dựa trên mô tả hình ảnh của từng cảnh để sinh ảnh minh họa (hoặc lấy ảnh mock chất lượng cao).
5. **Render Node**: Ghép hình ảnh, phụ đề (Subtitle) và tạo hiệu ứng chuyển động cơ bản để xuất ra file video MP4.
