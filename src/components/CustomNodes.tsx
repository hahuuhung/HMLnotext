import { Handle, Position } from '@xyflow/react';
import { Play, Settings, Cpu, Image, Film } from 'lucide-react';

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
