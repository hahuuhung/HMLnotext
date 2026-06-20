import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';


const LogicNode = ({ data }: { data: any }) => {
  return (
    <div className={`node-container logic-node ${data.status === 'running' ? 'node-running' : data.status === 'success' ? 'node-success' : ''}`}>
      <Handle type="target" position={Position.Left} className="handle-left" />
      <div className="node-header" style={{ background: 'var(--accent)', color: 'white' }}>
        <GitBranch size={16} />
        <span className="node-title">Logic / Condition</span>
      </div>
      <div className="node-content">
        <div className="node-status-indicator"></div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.label || 'Condition'}</div>
        <div style={{ marginTop: '8px', fontSize: '11px', background: 'var(--bg-app)', padding: '4px', borderRadius: '4px', border: '1px solid var(--border)' }}>
          {data.expression || 'IF Scenes > 2'}
        </div>
      </div>
      {/* Hai cổng output cho nhánh True / False */}
      <Handle type="source" position={Position.Right} id="true" style={{ top: '30%', background: '#10b981' }} />
      <span style={{ position: 'absolute', right: '-25px', top: '22%', fontSize: '10px', color: '#10b981', fontWeight: 'bold' }}>True</span>
      
      <Handle type="source" position={Position.Right} id="false" style={{ top: '70%', background: '#ef4444' }} />
      <span style={{ position: 'absolute', right: '-25px', top: '62%', fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>False</span>
    </div>
  );
};

export default LogicNode;
