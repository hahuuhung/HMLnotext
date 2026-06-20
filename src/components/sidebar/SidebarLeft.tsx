import { Play, Users, Save, HelpCircle } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

export function SidebarLeft() {
  const { 
    projects, 
    activeProjectId, 
    switchProject, 
    createNewProject, 
    deleteProject,
    saveProject,
    loadTemplate
  } = useWorkflowStore();

  return (
    <div className="sidebar-left">
      <div className="sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <div className="logo-icon small">H</div>
          <span style={{ fontWeight: 600 }}>Quản lý Dự án</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {projects.map(p => (
            <div 
              key={p.id}
              className={`project-item ${p.id === activeProjectId ? 'active' : ''}`}
              onClick={() => switchProject(p.id)}
            >
              <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.name}
              </div>
              <button 
                className="icon-btn-small" 
                onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}
                title="Xóa dự án"
              >
                &times;
              </button>
            </div>
          ))}
          <button className="btn btn-secondary" onClick={createNewProject} style={{ marginTop: '8px' }}>
            + Dự án mới
          </button>
          <button className="btn btn-primary" onClick={saveProject} style={{ marginTop: '4px' }}>
            <Save size={14} /> Lưu lại
          </button>
        </div>
      </div>

      <div className="node-palette">
        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px' }}>
          Mẫu Video Nhanh
        </h3>
        
        <div 
          className="node-template"
          onClick={() => loadTemplate('prompt')}
        >
          <div className="node-template-icon" style={{ backgroundColor: '#10b981' }}>
            <Play size={16} color="#fff" />
          </div>
          <div className="node-template-info">
            <h4>Prompt sang Video</h4>
            <p>Nhập ý tưởng, AI tự làm từ A-Z</p>
          </div>
        </div>

        <div 
          className="node-template"
          onClick={() => loadTemplate('doc')}
        >
          <div className="node-template-icon" style={{ backgroundColor: '#3b82f6' }}>
            <HelpCircle size={16} color="#fff" />
          </div>
          <div className="node-template-info">
            <h4>Tài liệu sang Video</h4>
            <p>Upload file TXT/PDF làm kịch bản</p>
          </div>
        </div>
        
        <div 
          className="node-template"
          onClick={() => loadTemplate('blog')}
        >
          <div className="node-template-icon" style={{ backgroundColor: '#f43f5e' }}>
            <Users size={16} color="#fff" />
          </div>
          <div className="node-template-info">
            <h4>Blog sang Video (9:16)</h4>
            <p>Tạo video Tiktok từ link bài viết</p>
          </div>
        </div>
      </div>
    </div>
  );
}
