import { Handle, Position } from '@xyflow/react';
import { Send } from 'lucide-react';


const PublishNode = ({ data }: { data: any }) => {
  return (
    <div className={`node-container render-node ${data.status === 'running' ? 'node-running' : data.status === 'success' ? 'node-success' : ''}`}>
      <Handle type="target" position={Position.Left} className="handle-left" />
      <div className="node-header" style={{ background: '#ec4899', color: 'white' }}>
        <Send size={16} />
        <span className="node-title">Publish Social</span>
      </div>
      <div className="node-content">
        <div className="node-status-indicator"></div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.label || 'Tự động đăng bài'}</div>
        <div style={{ marginTop: '8px', fontSize: '11px', background: 'var(--bg-app)', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          Platform: {data.platform || 'YouTube/TikTok'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="handle-right" />
    </div>
  );
};

export default PublishNode;
