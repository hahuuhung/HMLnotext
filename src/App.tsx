import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Play, 
  Download, 
  Trash2, 
  Film, 
  Pause, 
  RotateCcw,
  Info,
  Settings,
  Cpu,
  Image as ImageIcon
} from 'lucide-react';
import { TriggerNode, InputNode, AINode, VisualNode, RenderNode } from './components/CustomNodes';

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  inputNode: InputNode,
  aiNode: AINode,
  visualNode: VisualNode,
  renderNode: RenderNode,
};

// Initial nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 50, y: 150 },
    data: { label: 'Chạy Thủ Công', status: 'idle', description: 'Bấm nút Run ở trên' },
  },
  {
    id: '2',
    type: 'inputNode',
    position: { x: 300, y: 150 },
    data: { label: 'Đầu Vào', status: 'idle', value: 'Hương vị Cà phê phin Việt Nam' },
  },
  {
    id: '3',
    type: 'aiNode',
    position: { x: 550, y: 150 },
    data: { label: 'AI Script', status: 'idle' },
  },
];

// Initial edges
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

interface LogEntry {
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

interface Scene {
  id: number;
  title: string;
  image: string;
  text: string;
  duration: number;
}

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs'>('timeline');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '13:34:07', type: 'info', message: 'Khởi tạo Workspace thành công.' },
    { time: '13:34:08', type: 'info', message: 'Sẵn sàng kéo thả node và kết nối.' }
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const [workflowCompleted, setWorkflowCompleted] = useState(false);

  // Inspector States
  const [promptValue, setPromptValue] = useState('Hương vị Cà phê phin Việt Nam');
  const [aiTone, setAiTone] = useState('truyen-cam');
  const [sceneCount, setSceneCount] = useState(3);
  const [imageStyle, setImageStyle] = useState('cinematic');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [transitionSpeed, setTransitionSpeed] = useState('normal');

  // Preview Playback States
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const playIntervalRef = useRef<any>(null);

  // Mock Scenes Data (generated upon successful workflow execution)
  const mockScenes: Scene[] = [
    {
      id: 1,
      title: 'Cảnh 1: Giọt Cà Phê Rơi',
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
      text: 'Từng giọt cà phê đen nhánh, đậm đặc rơi chầm chậm qua chiếc phin nhôm truyền thống.',
      duration: 4,
    },
    {
      id: 2,
      title: 'Cảnh 2: Hạt Cà Phê Tây Nguyên',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
      text: 'Những hạt cà phê Robusta chín mọng được thu hoạch từ vùng đất đỏ bazan lộng gió.',
      duration: 5,
    },
    {
      id: 3,
      title: 'Cảnh 3: Ly Nâu Đá Thơm Ngon',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
      text: 'Hòa quyện cùng sữa đặc ngọt ngào và những viên đá mát lạnh, tạo nên hương vị khó quên.',
      duration: 4,
    },
  ];

  // Handle Input Changes and reflect to Nodes
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'inputNode') {
          return {
            ...node,
            data: {
              ...node.data,
              value: promptValue,
            },
          };
        }
        return node;
      })
    );
  }, [promptValue, setNodes]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { time, type, message }]);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
      addLog(`Đã kết nối Node ${params.source} sang Node ${params.target}`, 'info');
    },
    [setEdges, addLog]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Drag and Drop implementation
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Project coordinates
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const typeLabels: Record<string, string> = {
        trigger: 'Kích Hoạt',
        inputNode: 'Đầu Vào',
        aiNode: 'AI Script',
        visualNode: 'Visual Node',
        renderNode: 'Xuất Bản',
      };

      const newNode: Node = {
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { 
          label: typeLabels[type] || 'Node Mới',
          status: 'idle',
          value: type === 'inputNode' ? promptValue : undefined
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addLog(`Đã thêm Node ${typeLabels[type]} vào Canvas`, 'success');
    },
    [nodes, promptValue, setNodes, addLog]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Run Workflow Simulation
  const runWorkflow = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setWorkflowCompleted(false);
    setActiveTab('logs');
    addLog('Bắt đầu khởi chạy workflow...', 'info');

    // Helper function to sleep
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Reset status of all nodes to idle
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));
    await sleep(400);

    // 1. Run Trigger Nodes
    setNodes((nds) =>
      nds.map((n) => (n.type === 'trigger' ? { ...n, data: { ...n.data, status: 'running' } } : n))
    );
    addLog('Kích hoạt Trigger: Bắt đầu xử lý luồng.', 'info');
    await sleep(1000);
    setNodes((nds) =>
      nds.map((n) => (n.type === 'trigger' ? { ...n, data: { ...n.data, status: 'success' } } : n))
    );

    // 2. Run Input Nodes
    setNodes((nds) =>
      nds.map((n) => (n.type === 'inputNode' ? { ...n, data: { ...n.data, status: 'running' } } : n))
    );
    addLog(`Đọc tham số đầu vào: "${promptValue}"`, 'info');
    await sleep(1000);
    setNodes((nds) =>
      nds.map((n) => (n.type === 'inputNode' ? { ...n, data: { ...n.data, status: 'success' } } : n))
    );

    // 3. Run AI Script Nodes
    setNodes((nds) =>
      nds.map((n) => (n.type === 'aiNode' ? { ...n, data: { ...n.data, status: 'running' } } : n))
    );
    addLog('AI đang phân tích và viết kịch bản...', 'info');
    await sleep(1500);
    setNodes((nds) =>
      nds.map((n) => (n.type === 'aiNode' ? { ...n, data: { ...n.data, status: 'success' } } : n))
    );
    addLog(`AI đã sinh xong kịch bản gồm ${sceneCount} cảnh với giọng điệu ${aiTone === 'truyen-cam' ? 'Truyền cảm' : 'Hài hước'}.`, 'success');

    // 4. Run Visual Nodes (if connected or existing in flow)
    const hasVisual = nodes.some((n) => n.type === 'visualNode');
    if (hasVisual) {
      setNodes((nds) =>
        nds.map((n) => (n.type === 'visualNode' ? { ...n, data: { ...n.data, status: 'running' } } : n))
      );
      addLog('Đang sinh ảnh minh họa AI...', 'info');
      await sleep(1500);
      setNodes((nds) =>
        nds.map((n) => (n.type === 'visualNode' ? { ...n, data: { ...n.data, status: 'success' } } : n))
      );
      addLog(`Đã vẽ xong ảnh minh họa theo phong cách ${imageStyle.toUpperCase()}.`, 'success');
    }

    // 5. Run Render Nodes (if connected or existing in flow)
    const hasRender = nodes.some((n) => n.type === 'renderNode');
    if (hasRender) {
      setNodes((nds) =>
        nds.map((n) => (n.type === 'renderNode' ? { ...n, data: { ...n.data, status: 'running' } } : n))
      );
      addLog('Đang ghép nối âm thanh, phụ đề và render video MP4...', 'info');
      await sleep(2000);
      setNodes((nds) =>
        nds.map((n) => (n.type === 'renderNode' ? { ...n, data: { ...n.data, status: 'success' } } : n))
      );
      addLog(`Dựng thành công video tỷ lệ ${aspectRatio}. Sẵn sàng xuất bản.`, 'success');
    }

    setIsRunning(false);
    setWorkflowCompleted(true);
    setActiveTab('timeline');
    addLog('Workflow chạy hoàn tất!', 'success');
  }, [nodes, promptValue, aiTone, sceneCount, imageStyle, aspectRatio, isRunning, addLog, setNodes]);

  // Video Preview Auto play simulator
  useEffect(() => {
    if (isPlayingPreview && workflowCompleted) {
      playIntervalRef.current = setInterval(() => {
        setActiveSceneIndex((prev) => (prev + 1) % mockScenes.length);
      }, mockScenes[activeSceneIndex].duration * 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlayingPreview, activeSceneIndex, workflowCompleted]);

  // Download Mock Video File
  const downloadMockVideo = () => {
    const textData = `MOCK VIDEO FILE DATA
Chủ đề: ${promptValue}
Tỷ lệ khung hình: ${aspectRatio}
Tốc độ chuyển cảnh: ${transitionSpeed}
Phong cách ảnh: ${imageStyle}

KỊCH BẢN PHÂN CẢNH:
${mockScenes.map(s => `[${s.title}] (${s.duration}s)\nLời bình: ${s.text}\nẢnh nguồn: ${s.image}\n`).join('\n')}
Dựng và xuất bản tự động qua HML Auto Video Builder vào lúc: ${new Date().toLocaleString()}`;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${promptValue.replace(/\s+/g, '_')}_video_manifest.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('Đã tải xuống file cấu hình kịch bản video!', 'success');
  };

  const deleteNode = useCallback(() => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
    addLog(`Đã xóa Node ${String(selectedNode.data.label)}`, 'warning');
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges, addLog]);

  return (
    <div id="root">
      {/* Top Toolbar */}
      <div className="toolbar">
        <div className="logo-section">
          <div className="logo-icon">V</div>
          <div>
            <h1 className="logo-title" style={{ margin: 0, fontSize: '18px', letterSpacing: 'normal' }}>
              HML Auto Video Builder
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Công cụ tạo video tự động No-code</p>
          </div>
        </div>

        <div className="actions-section">
          <button 
            className="btn btn-primary" 
            onClick={runWorkflow}
            disabled={isRunning}
          >
            <Play size={15} fill={isRunning ? 'transparent' : 'white'} />
            {isRunning ? 'Đang chạy...' : 'Chạy thử (Run)'}
          </button>
          
          <button 
            className="btn" 
            onClick={downloadMockVideo}
            disabled={!workflowCompleted}
            style={{ opacity: workflowCompleted ? 1 : 0.6 }}
          >
            <Download size={15} />
            Tải video (MP4)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="workspace-container">
        {/* Left Sidebar - Node Palette */}
        <div className="sidebar-left">
          <div className="sidebar-header">Thư viện Node</div>
          <div className="node-list">
            <div 
              className="node-palette-item" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'trigger')}
            >
              <div className="node-icon-wrapper color-trigger">
                <Play size={14} fill="white" />
              </div>
              <div>
                <div className="node-palette-name">Trigger</div>
                <div className="node-palette-desc">Kích hoạt luồng chạy</div>
              </div>
            </div>

            <div 
              className="node-palette-item" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'inputNode')}
            >
              <div className="node-icon-wrapper color-input">
                <Settings size={14} />
              </div>
              <div>
                <div className="node-palette-name">Đầu Vào Prompt</div>
                <div className="node-palette-desc">Nhập chủ đề cho video</div>
              </div>
            </div>

            <div 
              className="node-palette-item" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'aiNode')}
            >
              <div className="node-icon-wrapper color-ai">
                <Cpu size={14} />
              </div>
              <div>
                <div className="node-palette-name">AI Script</div>
                <div className="node-palette-desc">Viết kịch bản và phân cảnh</div>
              </div>
            </div>

            <div 
              className="node-palette-item" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'visualNode')}
            >
              <div className="node-icon-wrapper color-visual">
                <ImageIcon size={14} />
              </div>
              <div>
                <div className="node-palette-name">Visual Node</div>
                <div className="node-palette-desc">Sinh hình ảnh minh họa AI</div>
              </div>
            </div>

            <div 
              className="node-palette-item" 
              draggable 
              onDragStart={(e) => onDragStart(e, 'renderNode')}
            >
              <div className="node-icon-wrapper color-render">
                <Film size={14} />
              </div>
              <div>
                <div className="node-palette-name">Xuất Bản</div>
                <div className="node-palette-desc">Dựng và xuất video MP4</div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', padding: '12px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-border)' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
                <Info size={14} className="color-primary" style={{ color: 'var(--primary)' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>Hướng dẫn</span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                Kéo thả các node vào màn hình canvas, kết nối chúng lại với nhau rồi nhấn <strong>Chạy thử</strong> để tạo video.
              </p>
            </div>
          </div>
        </div>

        {/* Center Canvas */}
        <div 
          className="canvas-wrapper"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            fitView
          >
            <Controls />
            <MiniMap style={{ bottom: 270 }} />
            <Background color="#ccc" gap={16} />
          </ReactFlow>
        </div>

        {/* Right Sidebar - Inspector */}
        <div className="sidebar-right">
          <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Bảng Thuộc Tính</span>
            {selectedNode && (
              <button 
                onClick={deleteNode}
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                title="Xóa node này"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          {!selectedNode ? (
            <div className="inspector-empty">
              <Settings size={36} strokeWidth={1.5} />
              <p style={{ fontWeight: 500 }}>Chưa chọn Node nào</p>
              <p style={{ fontSize: '12px' }}>Hãy nhấp chọn một Node bất kỳ trên Canvas để cấu hình thuộc tính.</p>
            </div>
          ) : (
            <div className="inspector-content">
              <h3 className="inspector-title">
                {String(selectedNode.data.label)} (Cấu hình)
              </h3>

              {/* Input Node Form */}
              {selectedNode.type === 'inputNode' && (
                <div className="form-group">
                  <label className="form-label">Ý tưởng / Chủ đề video:</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                    placeholder="Ví dụ: Giới thiệu văn hóa uống cà phê phin tại Việt Nam..."
                  />
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Nhập ý tưởng cốt lõi để AI biên soạn kịch bản chi tiết.
                  </span>
                </div>
              )}

              {/* AI Script Node Form */}
              {selectedNode.type === 'aiNode' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Giọng điệu kịch bản:</label>
                    <select 
                      className="form-select"
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                    >
                      <option value="truyen-cam">Truyền cảm, sâu lắng</option>
                      <option value="hai-huoc">Hài hước, năng động</option>
                      <option value="chuyen-nghiep">Chuyên nghiệp, trang trọng</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số lượng phân cảnh (Scenes):</label>
                    <select 
                      className="form-select"
                      value={sceneCount}
                      onChange={(e) => setSceneCount(Number(e.target.value))}
                    >
                      <option value={3}>3 Cảnh (Khoảng 15 giây)</option>
                      <option value={5}>5 Cảnh (Khoảng 30 giây)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Visual Node Form */}
              {selectedNode.type === 'visualNode' && (
                <div className="form-group">
                  <label className="form-label">Phong cách hình ảnh AI:</label>
                  <select 
                    className="form-select"
                    value={imageStyle}
                    onChange={(e) => setImageStyle(e.target.value)}
                  >
                    <option value="cinematic">Cinematic (Điện ảnh chân thực)</option>
                    <option value="anime">Anime (Hoạt hình Nhật Bản)</option>
                    <option value="3d-render">3D Render (Đồ họa đa chiều)</option>
                    <option value="sketch">Sketch (Phác thảo tay)</option>
                  </select>
                </div>
              )}

              {/* Render Node Form */}
              {selectedNode.type === 'renderNode' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tỷ lệ khung hình:</label>
                    <select 
                      className="form-select"
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                    >
                      <option value="9:16">Dọc (9:16) - TikTok/Reels</option>
                      <option value="16:9">Ngang (16:9) - YouTube</option>
                      <option value="1:1">Vuông (1:1) - Instagram</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Tốc độ chuyển cảnh:</label>
                    <select 
                      className="form-select"
                      value={transitionSpeed}
                      onChange={(e) => setTransitionSpeed(e.target.value)}
                    >
                      <option value="slow">Chậm (Mượt mà)</option>
                      <option value="normal">Bình thường</option>
                      <option value="fast">Nhanh (Kịch tính)</option>
                    </select>
                  </div>
                </>
              )}

              <div style={{ marginTop: '20px', padding: '12px', background: '#fcfcfd', borderRadius: '8px', border: '1px solid var(--border-dark)' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  ID Node: <code>{selectedNode.id}</code><br/>
                  Trạng thái hiện tại: <strong style={{ color: selectedNode.data.status === 'success' ? 'var(--success)' : selectedNode.data.status === 'running' ? 'var(--warning)' : 'inherit' }}>
                    {selectedNode.data.status === 'success' ? 'Hoàn thành' : selectedNode.data.status === 'running' ? 'Đang chạy' : 'Đang chờ'}
                  </strong>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Console and Timeline Layout */}
        <div className="bottom-panel">
          <div className="bottom-tab-container">
            <div className="bottom-tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                onClick={() => setActiveTab('timeline')}
              >
                Phân Cảnh Video (Timeline)
              </button>
              <button 
                className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
                onClick={() => setActiveTab('logs')}
              >
                Nhật Ký Hệ Thống (Console)
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'logs' ? (
                <div className="logs-console">
                  {logs.map((log, idx) => (
                    <div key={idx} className="log-entry">
                      <span className="log-time">[{log.time}]</span>
                      <span className={`log-${log.type}`}>
                        {log.type === 'success' ? '✔' : log.type === 'warning' ? '⚠' : 'ℹ'} {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ height: '100%' }}>
                  {!workflowCompleted ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '8px' }}>
                      <Film size={28} strokeWidth={1.5} />
                      <p style={{ fontSize: '13px' }}>Chưa có phân cảnh nào được dựng. Nhấp <strong>Chạy thử</strong> ở trên để tạo.</p>
                    </div>
                  ) : (
                    <div className="timeline-scene-container">
                      {mockScenes.slice(0, sceneCount).map((scene, idx) => (
                        <div 
                          key={scene.id} 
                          className={`timeline-scene-card ${activeSceneIndex === idx && isPlayingPreview ? 'selected' : ''}`}
                          style={{ borderColor: activeSceneIndex === idx && isPlayingPreview ? 'var(--primary)' : 'var(--border-dark)' }}
                          onClick={() => {
                            setActiveSceneIndex(idx);
                            setIsPlayingPreview(false);
                          }}
                        >
                          <div className="timeline-scene-title">{scene.title}</div>
                          <div className="timeline-scene-image">
                            <img src={scene.image} alt={scene.title} />
                          </div>
                          <div className="timeline-scene-text">{scene.text}</div>
                          <div className="timeline-scene-duration">{scene.duration} giây</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Video Preview Screen */}
          <div className="video-preview-wrapper">
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Màn hình xem trước
            </span>
            <div className="video-screen">
              {workflowCompleted ? (
                <>
                  <img 
                    src={mockScenes[activeSceneIndex].image} 
                    alt="Active scene" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                  />
                  <div className="video-overlay-text">
                    {mockScenes[activeSceneIndex].text}
                  </div>
                  <div 
                    className="video-play-indicator"
                    onClick={() => setIsPlayingPreview(!isPlayingPreview)}
                  >
                    {isPlayingPreview ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" style={{ marginLeft: '2px' }} />}
                  </div>
                </>
              ) : (
                <div style={{ color: '#4b5563', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                  Đang chờ xuất bản video...
                </div>
              )}
            </div>
            {workflowCompleted && (
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px', width: '100%', justifyContent: 'center' }}>
                <button 
                  className="btn" 
                  style={{ padding: '4px 8px', fontSize: '11px' }}
                  onClick={() => {
                    setActiveSceneIndex(0);
                    setIsPlayingPreview(false);
                  }}
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <WorkflowBuilder />
    </ReactFlowProvider>
  );
}
