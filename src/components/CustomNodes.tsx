import { Handle, Position } from '@xyflow/react';
import { Play, Settings, Cpu, Image, Film, FileText, Globe, Volume2, Type, Code } from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    description?: string;
    status?: 'idle' | 'running' | 'success' | 'error';
    value?: string;
  };
  selected?: boolean;
}

// 1. Trigger Node
export function TriggerNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />
      
      <div className="node-header">
        <div className="node-icon-wrapper color-trigger">
          <Play size={16} fill="white" />
        </div>
        <div className="node-title">Kích Hoạt</div>
        <span className="node-badge node-badge-trigger">Trigger</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>{data.label}</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.description || 'Chạy kịch bản thủ công'}</p>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
}

// 2. Input Node
export function InputNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper color-input">
          <Settings size={16} />
        </div>
        <div className="node-title">Đầu Vào</div>
        <span className="node-badge node-badge-input">Input</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Chủ đề Video:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.value || 'Chưa thiết lập'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 3. AI Script Node
export function AINode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper color-ai">
          <Cpu size={16} />
        </div>
        <div className="node-title">AI Script</div>
        <span className="node-badge node-badge-ai">AI</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Phân Tách Cảnh:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? 'Đã tạo 3 cảnh phim' : status === 'running' ? 'Đang phân tích...' : 'Đang chờ dữ liệu...'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 4. Visual Node
export function VisualNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper color-visual">
          <Image size={16} />
        </div>
        <div className="node-title">Visual Node</div>
        <span className="node-badge node-badge-visual">Visual</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Sinh Ảnh Minh Họa:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? 'Đã sinh 3 ảnh AI' : status === 'running' ? 'Đang vẽ ảnh...' : 'Chờ kịch bản...'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 5. Render Node
export function RenderNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper color-render">
          <Film size={16} />
        </div>
        <div className="node-title">Xuất Bản</div>
        <span className="node-badge node-badge-render">Render</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Đầu ra MP4:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? 'Sẵn sàng tải về' : status === 'running' ? 'Đang dựng hình...' : 'Đợi assets...'}
        </p>
      </div>
    </div>
  );
}

// 6. Tài liệu (Doc Input Node)
export function DocInputNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#10b981' }}>
          <FileText size={16} />
        </div>
        <div className="node-title">Tài Liệu</div>
        <span className="node-badge" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>Doc</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Tệp văn bản:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.value || 'Chưa tải lên'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 7. Liên kết Web (Url Input Node)
export function UrlInputNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#3b82f6' }}>
          <Globe size={16} />
        </div>
        <div className="node-title">Liên Kết Blog</div>
        <span className="node-badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>URL</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Địa chỉ Blog:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.value || 'Chưa thiết lập'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 8. Lồng tiếng AI (Audio TTS Node)
export function AudioTTSNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#8b5cf6' }}>
          <Volume2 size={16} />
        </div>
        <div className="node-title">Lồng Tiếng AI</div>
        <span className="node-badge" style={{ backgroundColor: '#ede9fe', color: '#5b21b6' }}>Audio</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Giọng đọc:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? 'Đã sinh Audio TTS' : 'Chờ văn bản...'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 9. Phụ đề (Subtitle Node)
export function SubtitleNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#f43f5e' }}>
          <Type size={16} />
        </div>
        <div className="node-title">Phụ Đề</div>
        <span className="node-badge" style={{ backgroundColor: '#ffe4e6', color: '#9f1239' }}>Subtitle</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Kiểu hiển thị:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? 'Phụ đề nghệ thuật' : 'Chờ kịch bản...'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 10. Lập trình Code Node (Nhúng thẻ lập trình JS)
export function CodeNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#097969' }}>
          <Code size={16} />
        </div>
        <div className="node-title">Lập Trình Code</div>
        <span className="node-badge" style={{ backgroundColor: '#e8f5e9', color: '#1b5e20' }}>JS</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>JavaScript Script:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.value || 'console.log("HML");'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 11. Custom AI Prompt Node (Nhúng thẻ AI tùy chọn)
export function CustomAINode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: '#df6330' }}>
          <Cpu size={16} />
        </div>
        <div className="node-title">Thẻ AI Prompt</div>
        <span className="node-badge" style={{ backgroundColor: '#fff3e0', color: '#e65100' }}>AI Prompt</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>Prompt Custom:</p>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {data.value || 'Chưa thiết lập'}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}
