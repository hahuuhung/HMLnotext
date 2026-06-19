# Sơ đồ quy trình xử lý Workflow nâng cao (Advanced Workflow Diagram)

Dưới đây là 3 luồng kịch bản (Templates) chính và cách các Node liên kết hoạt động:

```mermaid
graph TD
    %% Định nghĩa các luồng đầu vào
    T[Trigger Node: Chạy thủ công] -->|1. Chọn Prompt-to-Video| I1[Input Prompt: 'Cà phê phin VN']
    T -->|2. Chọn Doc-to-Video| I2[Input Document: 'kịch_bản_lịch_sử.txt']
    T -->|3. Chọn Blog-to-Social-Video| I3[Input URL: 'blog.vietnam.travel/cafe']

    %% Giai đoạn AI Script & Agent Orchestration
    I1 --> C[AI Script Node: Tách Cảnh & Biên Tập kịch bản]
    I2 --> C
    I3 --> C
    
    %% Phối hợp đa nhân vật
    subgraph AgentOrchestration["AI Agent Orchestration (Điều phối Agent)"]
        C <-->|Thảo luận & Tối ưu| A1[Biên Kịch Agent]
        C <-->|Duyệt kịch bản & Chọn phong cách| A2[Đạo Diễn Agent]
    end

    %% Giai đoạn Asset Generation
    C --> V[Visual Node: Sinh ảnh minh họa AI]
    C --> A[Audio TTS Node: Sinh giọng nói lồng tiếng AI]
    C --> S[Subtitle Node: Thiết lập phụ đề & kiểu chữ]

    %% Xuất bản video
    V --> R[Render Node: Lắp ghép Video & Audio]
    A --> R
    S --> R
    
    R --> F[Video Output: Preview & Download MP4]

    style T fill:#4CAF50,stroke:#388E3C,stroke-width:2px,color:#fff
    style I1 fill:#2196F3,stroke:#1976D2,stroke-width:2px,color:#fff
    style I2 fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style I3 fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    style C fill:#9C27B0,stroke:#7B1FA2,stroke-width:2px,color:#fff
    style A1 fill:#eae8f0,stroke:#6b21a8,stroke-dasharray: 5 5
    style A2 fill:#eae8f0,stroke:#6b21a8,stroke-dasharray: 5 5
    style V fill:#FF9800,stroke:#F57C00,stroke-width:2px,color:#fff
    style A fill:#8b5cf6,stroke:#5b21b6,stroke-width:2px,color:#fff
    style S fill:#f43f5e,stroke:#9f1239,stroke-width:2px,color:#fff
    style R fill:#E91E63,stroke:#C2185B,stroke-width:2px,color:#fff
    style F fill:#009688,stroke:#00796B,stroke-width:2px,color:#fff
```

## Các giai đoạn xử lý chính:
1. **Khởi động theo Mẫu (Templates)**: Người dùng có thể bắt đầu từ một Prompt, tải lên một tệp tài liệu văn bản, hoặc dán đường dẫn trang web (URL blog).
2. **AI Agent Orchestration**: Script Agent và Director Agent sẽ phối hợp phân tách kịch bản thành từng cảnh phim chi tiết, gợi ý hình ảnh phù hợp và sinh lời bình thoại.
3. **Pipeline Đa Phương Tiện**: Sinh song song hình ảnh minh họa (Visual), âm thanh lồng tiếng (Audio TTS) và lớp chữ phụ đề (Subtitle Overlay).
4. **Hợp nhất (Render)**: Ghép tất cả thành tệp MP4 đồng nhất theo đúng tỷ lệ màn hình (9:16, 16:9, 1:1) đã thiết lập.
