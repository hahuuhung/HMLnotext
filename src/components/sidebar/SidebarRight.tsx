import type { Node } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Settings, Image as ImageIcon, Volume2, Type, Sliders, Film } from 'lucide-react';

interface SidebarRightProps {
  selectedNode: Node | null;
}

export function SidebarRight({ selectedNode }: SidebarRightProps) {
  const { 
    promptValue, setPromptValue,
    aiTone, setAiTone,
    sceneCount, setSceneCount,
    imageStyle, setImageStyle,
    ttsVoice, setTtsVoice,
    ttsSpeed, setTtsSpeed,
    subStyle, setSubStyle,
    subColor, setSubColor,
    aspectRatio, setAspectRatio,
    transitionSpeed, setTransitionSpeed
  } = useWorkflowStore();

  return (
    <div className="sidebar-right">
      <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Bảng điều khiển</span>
        <Settings size={16} color="var(--text-muted)" />
      </div>

      <div className="properties-panel">
        {!selectedNode ? (
          <div className="empty-properties">
            <Settings size={32} style={{ marginBottom: '16px', color: 'var(--border-light)' }} />
            <p>Chọn một node trên Canvas<br/>để thiết lập thuộc tính</p>
          </div>
        ) : (
          <div className="node-properties">
            <div className="node-prop-header">
              <h3>{selectedNode.data.label as string}</h3>
              <span className="node-type-badge">{selectedNode.type}</span>
            </div>

            {selectedNode.type === 'trigger' && (
              <div className="prop-group">
                <label>Loại Kích Hoạt</label>
                <select className="form-select" disabled value={selectedNode.data.subtype as string}>
                  <option value="manual">Chạy Thủ Công</option>
                  <option value="schedule">Lên Lịch Xử Lý</option>
                  <option value="watchFolder">Theo Dõi Thư Mục</option>
                </select>
                <p className="prop-help">Node này xác định cách workflow được bắt đầu.</p>
              </div>
            )}

            {selectedNode.type === 'inputNode' && selectedNode.data.subtype === 'prompt' && (
              <div className="prop-group">
                <label>Chủ đề / Prompt chính</label>
                <textarea 
                  className="form-textarea" 
                  rows={4}
                  value={promptValue}
                  onChange={(e) => setPromptValue(e.target.value)}
                  placeholder="Ví dụ: Giới thiệu về quán cà phê phong cách vintage..."
                />
              </div>
            )}

            {selectedNode.type === 'aiNode' && (
              <>
                <div className="prop-group">
                  <label><Type size={14} style={{ marginRight: '6px' }} />Giọng văn AI (Tone)</label>
                  <select className="form-select" value={aiTone} onChange={(e) => setAiTone(e.target.value)}>
                    <option value="truyen-cam">Truyền cảm, chậm rãi</option>
                    <option value="soi-dong">Sôi động, năng lượng (Tiktok)</option>
                    <option value="chuyen-nghiep">Chuyên nghiệp, tin tức</option>
                    <option value="ke-chuyen">Kể chuyện cổ tích</option>
                  </select>
                </div>
                <div className="prop-group">
                  <label><Sliders size={14} style={{ marginRight: '6px' }} />Số lượng cảnh (Scenes)</label>
                  <input 
                    type="range" 
                    min="1" max="10" 
                    value={sceneCount} 
                    onChange={(e) => setSceneCount(parseInt(e.target.value))}
                    className="form-range"
                  />
                  <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '4px' }}>{sceneCount} cảnh</div>
                </div>
              </>
            )}

            {selectedNode.type === 'visualNode' && (
              <div className="prop-group">
                <label><ImageIcon size={14} style={{ marginRight: '6px' }} />Phong cách Hình ảnh</label>
                <select className="form-select" value={imageStyle} onChange={(e) => setImageStyle(e.target.value)}>
                  <option value="cinematic">Cinematic (Điện ảnh)</option>
                  <option value="anime">Anime (Hoạt hình Nhật)</option>
                  <option value="realistic">Photorealistic (Chân thực)</option>
                  <option value="3d">3D Render (Pixar style)</option>
                  <option value="watercolor">Watercolor (Màu nước)</option>
                </select>
              </div>
            )}

            {selectedNode.type === 'audioTTS' && (
              <>
                <div className="prop-group">
                  <label><Volume2 size={14} style={{ marginRight: '6px' }} />Giọng đọc AI</label>
                  <select className="form-select" value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}>
                    <option value="nu-mien-bac">Nữ Miền Bắc (Chuẩn)</option>
                    <option value="nam-mien-nam">Nam Miền Nam (Trầm ấm)</option>
                    <option value="nu-mien-nam">Nữ Miền Nam (Ngọt ngào)</option>
                    <option value="nam-mien-bac">Nam Miền Bắc (Tin tức)</option>
                  </select>
                </div>
                <div className="prop-group">
                  <label>Tốc độ đọc</label>
                  <select className="form-select" value={ttsSpeed} onChange={(e) => setTtsSpeed(e.target.value)}>
                    <option value="0.8">Chậm (0.8x)</option>
                    <option value="1.0">Bình thường (1.0x)</option>
                    <option value="1.2">Nhanh (1.2x)</option>
                    <option value="1.5">Rất nhanh (1.5x)</option>
                  </select>
                </div>
              </>
            )}

            {selectedNode.type === 'subtitle' && (
              <>
                <div className="prop-group">
                  <label>Hiệu ứng Phụ đề</label>
                  <select className="form-select" value={subStyle} onChange={(e) => setSubStyle(e.target.value)}>
                    <option value="tiktok">Tiktok (Pop-up từng từ)</option>
                    <option value="karaoke">Karaoke (Đổi màu theo lời)</option>
                    <option value="netflix">Netflix (Tĩnh, dưới màn hình)</option>
                  </select>
                </div>
                <div className="prop-group">
                  <label>Màu nhấn (Highlight Color)</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="color" 
                      value={subColor} 
                      onChange={(e) => setSubColor(e.target.value)}
                      style={{ width: '32px', height: '32px', padding: '0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                    />
                    <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{subColor}</span>
                  </div>
                </div>
              </>
            )}

            {selectedNode.type === 'renderNode' && (
              <>
                <div className="prop-group">
                  <label><Film size={14} style={{ marginRight: '6px' }} />Tỷ lệ khung hình</label>
                  <select className="form-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                    <option value="16:9">16:9 (Youtube, TV)</option>
                    <option value="9:16">9:16 (Tiktok, Shorts, Reels)</option>
                    <option value="1:1">1:1 (Instagram Square)</option>
                  </select>
                </div>
                <div className="prop-group">
                  <label>Transition (Hiệu ứng chuyển cảnh)</label>
                  <select className="form-select" value={transitionSpeed} onChange={(e) => setTransitionSpeed(e.target.value)}>
                    <option value="none">Cắt cứng (Hard Cut)</option>
                    <option value="fast">Nhanh (Crossfade 0.5s)</option>
                    <option value="normal">Bình thường (Crossfade 1s)</option>
                    <option value="slow">Chậm (Crossfade 2s)</option>
                  </select>
                </div>
              </>
            )}
            
            <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
              <button className="btn btn-secondary" style={{ width: '100%', marginBottom: '8px' }}>
                Xóa Node
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
