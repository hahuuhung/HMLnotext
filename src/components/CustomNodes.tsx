import { Handle, Position } from '@xyflow/react';
import { AlertTriangle, Code2 } from 'lucide-react';
import { 
  Play, Settings, Cpu, Image, Film, FileText, Globe, Volume2, Type, Code,
  Calendar, Folder, Table, Music, Sliders, Eye, Send, Scissors
} from 'lucide-react';

interface CustomNodeProps {
  data: {
    label: string;
    description?: string;
    status?: 'idle' | 'running' | 'success' | 'error';
    value?: string;
    subtype?: string;
    errorMsg?: string;
    advancedMode?: boolean;
    aiTone?: string;
    sceneCount?: number;
    imageStyle?: string;
    ttsVoice?: string;
    ttsSpeed?: string;
    subStyle?: string;
    subColor?: string;
    aspectRatio?: string;
    writerModel?: string;
    transitionSpeed?: string;
    renderEngine?: string;
    renderCRF?: number;
    previewImage?: string;
  };
  selected?: boolean;
}

// Render appropriate Lucide icon by name
function getIcon(name: string) {
  switch (name) {
    case 'play': return <Play size={16} fill="white" />;
    case 'calendar': return <Calendar size={16} />;
    case 'folder': return <Folder size={16} />;
    case 'table': return <Table size={16} />;
    case 'globe': return <Globe size={16} />;
    case 'settings': return <Settings size={16} />;
    case 'fileText': return <FileText size={16} />;
    case 'image': return <Image size={16} />;
    case 'cpu': return <Cpu size={16} />;
    case 'type': return <Type size={16} />;
    case 'music': return <Music size={16} />;
    case 'volume2': return <Volume2 size={16} />;
    case 'sliders': return <Sliders size={16} />;
    case 'scissors': return <Scissors size={16} />;
    case 'film': return <Film size={16} />;
    case 'eye': return <Eye size={16} />;
    case 'send': return <Send size={16} />;
    case 'code': return <Code size={16} />;
    default: return <Settings size={16} />;
  }
}

function NodeDecorators({ status, advancedMode, errorMsg }: { status?: string, advancedMode?: boolean, errorMsg?: string }) {
  return (
    <>
      <div className="node-status-dot running" style={{ display: status === 'running' ? 'block' : 'none' }} />
      <div className="node-status-dot success" style={{ display: status === 'success' ? 'block' : 'none' }} />
      <div className="node-status-dot error" style={{ display: status === 'error' ? 'block' : 'none' }} />
      {status === 'error' && (
        <div className="node-error-badge" title={errorMsg || 'Lỗi chưa xác định'} style={{ position: 'absolute', top: -8, right: -8, background: 'var(--error)', borderRadius: '50%', padding: '4px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          <AlertTriangle size={12} color="white" />
        </div>
      )}
      {advancedMode && (
        <div className="node-advanced-badge" title="Advanced Expression Mode" style={{ position: 'absolute', top: -8, left: -8, background: '#a855f7', borderRadius: '50%', padding: '4px', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
          <Code2 size={10} color="white" />
        </div>
      )}
    </>
  );
}

// 1. Trigger Node
export function TriggerNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'manual';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    manual: { label: 'Chạy Thủ Công', badge: 'Trigger', color: '#10b981', icon: 'play', desc: 'Kích hoạt bằng phím chạy' },
    schedule: { label: 'Lên Lịch (Schedule)', badge: 'Cron', color: '#059669', icon: 'calendar', desc: 'Chạy định kỳ tự động' },
    webhook: { label: 'Webhook URL', badge: 'API', color: '#047857', icon: 'globe', desc: 'Kích hoạt qua API HTTP' },
    watchFolder: { label: 'Theo Dõi Thư Mục', badge: 'Folder', color: '#065f46', icon: 'folder', desc: 'Kích hoạt khi có file mới' },
    csvImport: { label: 'Nhập CSV / Sheet', badge: 'Import', color: '#1b5e20', icon: 'table', desc: 'Nhập kịch bản từ bảng tính' }
  };

  const meta = metas[subtype] || metas.manual;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />
      
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 500 }}>{data.label}</p>
        <div style={{ marginTop: '4px', marginBottom: '4px' }}>
          <span className="badge-small" style={{ backgroundColor: `${meta.color}22`, color: meta.color, padding: '2px 6px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            {meta.badge.toUpperCase()}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{data.description || meta.desc}</p>
      </div>
      <Handle type="source" position={Position.Right} id="a" />
    </div>
  );
}

// 2. Input Node
export function InputNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'prompt';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    prompt: { label: 'Ý Tưởng Văn Bản', badge: 'Prompt', color: '#3b82f6', icon: 'settings', desc: 'Nhập ý tưởng kịch bản video' },
    url: { label: 'Liên Kết Blog', badge: 'URL', color: '#2563eb', icon: 'globe', desc: 'Nội dung trích xuất từ link' },
    product: { label: 'Dữ Liệu Sản Phẩm', badge: 'Product', color: '#1d4ed8', icon: 'fileText', desc: 'Thông số, giá cả sản phẩm' },
    upload: { label: 'Tài Liệu Cục Bộ', badge: 'File TXT', color: '#1e40af', icon: 'folder', desc: 'Tệp kịch bản đính kèm' },
    stock: { label: 'Thư Viện Stock', badge: 'Stock', color: '#172554', icon: 'image', desc: 'Tìm kiếm media chất lượng cao' }
  };

  const meta = metas[subtype] || metas.prompt;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <p style={{ fontWeight: 600, fontSize: '11px', color: 'var(--text-secondary)' }}>{meta.desc}:</p>
        <div className="node-val-box" style={{ 
          background: 'var(--bg-app)', 
          padding: '6px 8px', 
          borderRadius: '6px', 
          border: '1px solid var(--border-dark)', 
          fontSize: '11px', 
          color: 'var(--text-primary)', 
          marginTop: '6px', 
          maxHeight: '48px', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4',
          fontFamily: subtype === 'prompt' ? 'inherit' : 'var(--font-mono)'
        }}>
          {data.value ? data.value : 'Chưa nhập thông tin'}
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 3. AI Script Node
export function AINode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'expand';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    outline: { label: 'Tạo Outline Kịch Bản', badge: 'AI Outline', color: '#a855f7', icon: 'cpu', desc: 'Khung dàn ý phân cảnh' },
    hook3s: { label: 'Tạo Hook 3 Giây Đầu', badge: 'AI Hook', color: '#9333ea', icon: 'cpu', desc: 'Lời dẫn cuốn hút người xem' },
    expand: { label: 'Phát Triển Kịch Bản', badge: 'AI Script', color: '#7e22ce', icon: 'cpu', desc: 'Viết kịch bản dẫn chi tiết' },
    split: { label: 'Phân Tách Cảnh', badge: 'AI Split', color: '#6b21a8', icon: 'cpu', desc: 'Tách kịch bản thành các scene' },
    caption: { label: 'Tạo Caption / Phụ Đề', badge: 'AI Caption', color: '#581c87', icon: 'type', desc: 'Trích xuất phụ đề tự động' },
    translate: { label: 'Dịch / Bản Địa Hóa', badge: 'AI Lang', color: '#3b0764', icon: 'globe', desc: 'Dịch kịch bản đa ngôn ngữ' }
  };

  const meta = metas[subtype] || metas.expand;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
          <span className="badge-small" style={{ backgroundColor: '#a855f722', color: '#a855f7', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            🤖 {data.writerModel || 'GPT-4o'}
          </span>
          <span className="badge-small" style={{ backgroundColor: '#9333ea22', color: '#9333ea', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            🎭 {data.aiTone === 'truyen-cam' ? 'Truyền Cảm' : 'Dí Dỏm'}
          </span>
          <span className="badge-small" style={{ backgroundColor: '#7e22ce22', color: '#7e22ce', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            🎬 {data.sceneCount || 3} Cảnh
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? '✔ Đã phân tích kịch bản' : status === 'running' ? '⏳ Đang biên soạn...' : meta.desc}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 4. Visual Node
export function VisualNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'aiImage';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    aiImage: { label: 'Sinh Ảnh Minh Họa AI', badge: 'AI Art', color: '#f59e0b', icon: 'image', desc: 'Mỹ thuật vẽ hình ảnh AI' },
    stockSearch: { label: 'Tìm Kiếm Stock Media', badge: 'Stock Search', color: '#d97706', icon: 'image', desc: 'Tìm clip, hình ảnh bản quyền' },
    planner: { label: 'Phân Cảnh Hình Ảnh', badge: 'Visual Plan', color: '#b45309', icon: 'settings', desc: 'Sắp xếp bố cục hình ảnh' },
    background: { label: 'Tạo Ảnh Nền', badge: 'Background', color: '#92400e', icon: 'image', desc: 'Tạo phông nền cho clip' },
    avatar: { label: 'Nhân Vật AI (Avatar)', badge: 'AI Avatar', color: '#78350f', icon: 'cpu', desc: 'Người dẫn ảo phát biểu' },
    brandKit: { label: 'Bộ Thương Hiệu (Brand)', badge: 'Brand Kit', color: '#451a03', icon: 'sliders', desc: 'Áp dụng logo, màu, font' }
  };

  const meta = metas[subtype] || metas.aiImage;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '6px', overflow: 'hidden', background: '#e5e7eb', flexShrink: 0, border: '1px solid var(--border-dark)' }}>
            <img 
              src={data.previewImage || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=80&q=80'} 
              alt="Visual Preview" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span className="badge-small" style={{ backgroundColor: '#f59e0b22', color: '#f59e0b', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600, display: 'inline-block', marginBottom: '2px' }}>
              🎨 {data.imageStyle === 'cinematic' ? 'Cinematic' : data.imageStyle === 'anime' ? 'Anime' : '3D Render'}
            </span>
            <p style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {status === 'success' ? '✔ Đã nạp assets' : status === 'running' ? '⏳ Đang vẽ hình...' : meta.desc}
            </p>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 5. Audio Node
export function AudioTTSNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'tts';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    tts: { label: 'Text-to-Speech', badge: 'AI TTS', color: '#8b5cf6', icon: 'volume2', desc: 'Chuyển văn bản thành giọng nói' },
    clone: { label: 'Nhái Giọng (Voice Clone)', badge: 'Voice Clone', color: '#7c3aed', icon: 'volume2', desc: 'Nhái giọng đọc thương hiệu' },
    bgMusic: { label: 'Nhạc Nền (BG Music)', badge: 'BG Music', color: '#6d28d9', icon: 'music', desc: 'Thêm nhạc đệm nhẹ nhàng' },
    sfx: { label: 'Hiệu Ứng Âm Thanh', badge: 'Sound FX', color: '#5b21b6', icon: 'volume2', desc: 'Thêm tiếng động chuyển cảnh' },
    normalization: { label: 'Chuẩn Hóa Âm Thanh', badge: 'Normalizer', color: '#4c1d95', icon: 'sliders', desc: 'Cân bằng âm lượng tự động' }
  };

  const meta = metas[subtype] || metas.tts;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px' }}>
          <span className="badge-small" style={{ backgroundColor: '#8b5cf622', color: '#8b5cf6', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            🗣 {data.ttsVoice === 'nu-mien-bac' ? 'Vy Mai (Bắc)' : 'Nam An (Nam)'}
          </span>
          <span className="badge-small" style={{ backgroundColor: '#7c3aed22', color: '#7c3aed', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            ⚡ {data.ttsSpeed || '1.0'}x
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? '✔ Âm thanh sẵn sàng' : status === 'running' ? '⏳ Đang mix thoại...' : meta.desc}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 6. Editing Node
export function SubtitleNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'timeline';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    timeline: { label: 'Dựng Timeline Video', badge: 'Timeline', color: '#f43f5e', icon: 'sliders', desc: 'Kéo thả sắp xếp cảnh quay' },
    trim: { label: 'Cắt Ghép (Trim / Cut)', badge: 'Trim', color: '#e11d48', icon: 'scissors', desc: 'Cắt tỉa thời lượng phân cảnh' },
    transition: { label: 'Hiệu Ứng Chuyển Cảnh', badge: 'Transition', color: '#be123c', icon: 'film', desc: 'Hiệu ứng chuyển mượt mà' },
    captionStyle: { label: 'Kiểu Phụ Đề Chữ', badge: 'Caption Style', color: '#9f1239', icon: 'type', desc: 'Thiết kế font, viền phụ đề' },
    watermark: { label: 'Watermark / Logo', badge: 'Watermark', color: '#881337', icon: 'image', desc: 'Chèn nhãn bản quyền thương hiệu' },
    aspectRatio: { label: 'Tỷ Lệ Khung Hình', badge: 'Aspect Ratio', color: '#fb7185', icon: 'sliders', desc: 'Tỷ lệ 9:16, 16:9, 1:1' },
    template: { label: 'Áp Dụng Template', badge: 'Template', color: '#f43f5e', icon: 'sliders', desc: 'Áp mẫu chỉnh sửa hàng loạt' }
  };

  const meta = metas[subtype] || metas.timeline;

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span className="badge-small" style={{ backgroundColor: '#f43f5e22', color: '#f43f5e', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
            🔤 {data.subStyle === 'tiktok' ? 'TikTok' : data.subStyle === 'vintage' ? 'Vintage' : 'Cinematic'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: data.subColor || '#ffff00', border: '1px solid var(--border-dark)' }} title={`Màu chữ: ${data.subColor || '#ffff00'}`} />
            <span style={{ fontSize: '9px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{data.subColor}</span>
          </div>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? '✔ Đã ráp phụ đề' : status === 'running' ? '⏳ Đang căn chỉnh...' : meta.desc}
        </p>
      </div>
      <Handle type="source" position={Position.Right} id="output" />
    </div>
  );
}

// 7. Render Node
export function RenderNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  const subtype = data.subtype || 'mp4';

  const metas: Record<string, { label: string; badge: string; color: string; icon: string; desc: string }> = {
    preview: { label: 'Render Preview', badge: 'Preview', color: '#d946ef', icon: 'eye', desc: 'Kết xuất bản nháp nhanh' },
    full: { label: 'Render Full Video', badge: 'Full Render', color: '#c084fc', icon: 'film', desc: 'Kết xuất chất lượng cao nhất' },
    mp4: { label: 'Xuất Bản MP4', badge: 'Export MP4', color: '#c026d3', icon: 'film', desc: 'Tải về file thành phẩm' },
    upload: { label: 'Tải Video Lên Mây', badge: 'Cloud Upload', color: '#a21caf', icon: 'folder', desc: 'Lưu trữ backup Drive/Dropbox' },
    social: { label: 'Đăng Mạng Xã Hội', badge: 'Social Publish', color: '#86198f', icon: 'send', desc: 'Tự động đăng TikTok, YouTube' }
  };

  const meta = metas[subtype] || metas.mp4;

  const getAspectRatioBadge = (ratio: string) => {
    switch (ratio) {
      case '9:16': return { label: 'TikTok/Shorts (9:16)', color: '#111', bg: '#f3f4f6' };
      case '16:9': return { label: 'YouTube/TV (16:9)', color: '#ef4444', bg: '#fee2e2' };
      case '1:1': return { label: 'Square (1:1)', color: '#3b82f6', bg: '#dbeafe' };
      case '4:5': return { label: 'Portrait (4:5)', color: '#8b5cf6', bg: '#ede9fe' };
      case '21:9': return { label: 'Cinema (21:9)', color: '#059669', bg: '#d1fae5' };
      default: return { label: `Khung ${ratio}`, color: '#4b5563', bg: '#f3f4f6' };
    }
  };

  const ratioBadge = getAspectRatioBadge(data.aspectRatio || '16:9');

  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

      <Handle type="target" position={Position.Left} id="input" />
      <div className="node-header">
        <div className="node-icon-wrapper" style={{ backgroundColor: meta.color }}>
          {getIcon(meta.icon)}
        </div>
        <div className="node-title">{meta.label}</div>
        <span className="node-badge" style={{ backgroundColor: `${meta.color}22`, color: meta.color }}>{meta.badge}</span>
      </div>
      <div className="node-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '6px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            <span className="badge-small" style={{ backgroundColor: ratioBadge.bg, color: ratioBadge.color, padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
              📱 {ratioBadge.label}
            </span>
            <span className="badge-small" style={{ backgroundColor: '#c026d322', color: '#c026d3', padding: '2px 5px', borderRadius: '4px', fontSize: '9px', fontWeight: 600 }}>
              ⚙ {data.renderEngine === 'ffmpeg' ? 'FFmpeg' : data.renderEngine === 'remotion' ? 'Remotion' : 'Hybrid'}
            </span>
          </div>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            Nén CRF: {data.renderCRF || 23} | Transition: {data.transitionSpeed === 'slow' ? 'Chậm' : data.transitionSpeed === 'fast' ? 'Nhanh' : 'Thường'}
          </span>
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {status === 'success' ? '✔ Xuất bản thành công' : status === 'running' ? '⏳ Đang render...' : meta.desc}
        </p>
      </div>
    </div>
  );
}

// 8. Custom Code Node
export function CodeNode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

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

// 9. Custom AI Prompt Node
export function CustomAINode({ data, selected }: CustomNodeProps) {
  const status = data.status || 'idle';
  return (
    <div className={`custom-node status-${status} ${selected ? 'selected' : ''}`}>
      <NodeDecorators status={status} advancedMode={data.advancedMode} errorMsg={data.errorMsg} />

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
