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
  Settings,
  Cpu,
  Image as ImageIcon,
  FileText,
  Globe,
  Volume2,
  Type,
  Users
} from 'lucide-react';
import { 
  TriggerNode, 
  InputNode, 
  AINode, 
  VisualNode, 
  RenderNode,
  DocInputNode,
  UrlInputNode,
  AudioTTSNode,
  SubtitleNode
} from './components/CustomNodes';

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  inputNode: InputNode,
  aiNode: AINode,
  visualNode: VisualNode,
  renderNode: RenderNode,
  docInput: DocInputNode,
  urlInput: UrlInputNode,
  audioTTS: AudioTTSNode,
  subtitle: SubtitleNode,
};

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

interface AgentMessage {
  time: string;
  agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent';
  color: string;
  message: string;
}

function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs' | 'agents'>('timeline');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '13:54:07', type: 'info', message: 'Khởi tạo Workspace nâng cao thành công.' },
    { time: '13:54:08', type: 'info', message: 'Hệ thống AI Agent Orchestration sẵn sàng.' }
  ]);
  const [agentLogs, setAgentLogs] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [workflowCompleted, setWorkflowCompleted] = useState(false);

  // Inspector States
  const [promptValue, setPromptValue] = useState('Hương vị Cà phê phin Việt Nam');
  const [docValue, setDocValue] = useState('kich_ban_lich_su_cafe.txt');
  const [urlValue, setUrlValue] = useState('https://blog.vietnam.travel/cafe-phin');
  
  const [aiTone, setAiTone] = useState('truyen-cam');
  const [sceneCount, setSceneCount] = useState(3);
  const [imageStyle, setImageStyle] = useState('cinematic');
  
  // TTS Voice states
  const [ttsVoice, setTtsVoice] = useState('nu-mien-bac');
  const [ttsSpeed, setTtsSpeed] = useState('1.0');
  
  // Subtitle states
  const [subStyle, setSubStyle] = useState('tiktok');
  const [subColor, setSubColor] = useState('#ffff00');

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

  // Helper to load templates
  const loadTemplate = useCallback((templateType: 'prompt' | 'doc' | 'blog') => {
    setSelectedNode(null);
    setWorkflowCompleted(false);
    setIsPlayingPreview(false);
    
    if (templateType === 'prompt') {
      const templateNodes: Node[] = [
        { id: 't1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Thủ Công', status: 'idle' } },
        { id: 't2', type: 'inputNode', position: { x: 260, y: 150 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: promptValue } },
        { id: 't3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle' } },
        { id: 't4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Visual Node', status: 'idle' } },
        { id: 't5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Lồng Tiếng AI', status: 'idle' } },
        { id: 't6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề', status: 'idle' } },
        { id: 't7', type: 'renderNode', position: { x: 1140, y: 150 }, data: { label: 'Xuất Bản', status: 'idle' } },
      ];
      const templateEdges: Edge[] = [
        { id: 'e-t1-t2', source: 't1', target: 't2' },
        { id: 'e-t2-t3', source: 't2', target: 't3' },
        { id: 'e-t3-t4', source: 't3', target: 't4' },
        { id: 'e-t3-t5', source: 't3', target: 't5' },
        { id: 'e-t4-t6', source: 't4', target: 't6' },
        { id: 'e-t5-t6', source: 't5', target: 't6' },
        { id: 'e-t6-t7', source: 't6', target: 't7' },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
      addLog('Đã nạp mẫu: Prompt sang Video.', 'success');
    } else if (templateType === 'doc') {
      const templateNodes: Node[] = [
        { id: 'd1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Tự Động', status: 'idle' } },
        { id: 'd2', type: 'docInput', position: { x: 260, y: 150 }, data: { label: 'Tài Liệu', status: 'idle', value: docValue } },
        { id: 'd3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle' } },
        { id: 'd4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Visual Node', status: 'idle' } },
        { id: 'd5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Lồng Tiếng AI', status: 'idle' } },
        { id: 'd6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề', status: 'idle' } },
        { id: 'd7', type: 'renderNode', position: { x: 1140, y: 150 }, data: { label: 'Xuất Bản', status: 'idle' } },
      ];
      const templateEdges: Edge[] = [
        { id: 'e-d1-d2', source: 'd1', target: 'd2' },
        { id: 'e-d2-d3', source: 'd2', target: 'd3' },
        { id: 'e-d3-d4', source: 'd3', target: 'd4' },
        { id: 'e-d3-d5', source: 'd3', target: 'd5' },
        { id: 'e-d4-d6', source: 'd4', target: 'd6' },
        { id: 'e-d5-d6', source: 'd5', target: 'd6' },
        { id: 'e-d6-d7', source: 'd6', target: 'd7' },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
      addLog('Đã nạp mẫu: Tài liệu sang Video.', 'success');
    } else if (templateType === 'blog') {
      const templateNodes: Node[] = [
        { id: 'b1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Lên Lịch', status: 'idle' } },
        { id: 'b2', type: 'urlInput', position: { x: 260, y: 150 }, data: { label: 'Liên Kết Blog', status: 'idle', value: urlValue } },
        { id: 'b3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle' } },
        { id: 'b4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Visual Node', status: 'idle' } },
        { id: 'b5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Lồng Tiếng AI', status: 'idle' } },
        { id: 'b6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề', status: 'idle' } },
        { id: 'b7', type: 'renderNode', position: { x: 1140, y: 150 }, data: { label: 'Xuất Bản', status: 'idle' } },
      ];
      const templateEdges: Edge[] = [
        { id: 'e-b1-b2', source: 'b1', target: 'b2' },
        { id: 'e-b2-b3', source: 'b2', target: 'b3' },
        { id: 'e-b3-b4', source: 'b3', target: 'b4' },
        { id: 'e-b3-b5', source: 'b3', target: 'b5' },
        { id: 'e-b4-b6', source: 'b4', target: 'b6' },
        { id: 'e-b5-b6', source: 'b5', target: 'b6' },
        { id: 'e-b6-b7', source: 'b6', target: 'b7' },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
      setAspectRatio('9:16'); // auto portrait for social
      addLog('Đã nạp mẫu: Blog sang Social Video (9:16).', 'success');
    }
  }, [promptValue, docValue, urlValue, setNodes, setEdges]);

  // Load Prompt Template by default
  useEffect(() => {
    loadTemplate('prompt');
  }, []);

  // Update input nodes data values
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'inputNode') return { ...node, data: { ...node.data, value: promptValue } };
        if (node.type === 'docInput') return { ...node, data: { ...node.data, value: docValue } };
        if (node.type === 'urlInput') return { ...node, data: { ...node.data, value: urlValue } };
        return node;
      })
    );
  }, [promptValue, docValue, urlValue, setNodes]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { time, type, message }]);
  }, []);

  const addAgentLog = useCallback((agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent', message: string, color: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setAgentLogs((prev) => [...prev, { time, agent, color, message }]);
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

  // Drag and Drop
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 40,
      };

      const typeLabels: Record<string, string> = {
        trigger: 'Kích Hoạt',
        inputNode: 'Đầu Vào Prompt',
        docInput: 'Tài Liệu',
        urlInput: 'Liên Kết Blog',
        aiNode: 'AI Script',
        visualNode: 'Visual Node',
        audioTTS: 'Lồng Tiếng AI',
        subtitle: 'Phụ Đề',
        renderNode: 'Xuất Bản',
      };

      const newNode: Node = {
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { 
          label: typeLabels[type] || 'Node Mới',
          status: 'idle',
          value: type === 'inputNode' ? promptValue : type === 'docInput' ? docValue : type === 'urlInput' ? urlValue : undefined
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addLog(`Đã thêm Node ${typeLabels[type]} vào Canvas`, 'success');
    },
    [nodes, promptValue, docValue, urlValue, setNodes, addLog]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Run Workflow Simulation with AI Agent Chat
  const runWorkflow = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setWorkflowCompleted(false);
    setAgentLogs([]);
    setActiveTab('agents');
    addLog('Bắt đầu chạy luồng video nâng cao...', 'info');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Reset nodes
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));
    await sleep(400);

    // 1. Trigger
    setNodes((nds) => nds.map((n) => (n.type === 'trigger' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
    addLog('Kích hoạt Trigger: Khởi động hệ thống điều phối Agents.', 'info');
    await sleep(1000);
    setNodes((nds) => nds.map((n) => (n.type === 'trigger' ? { ...n, data: { ...n.data, status: 'success' } } : n)));

    // 2. Input (Prompt, Doc, or URL)
    setNodes((nds) => nds.map((n) => (['inputNode', 'docInput', 'urlInput'].includes(n.type || '') ? { ...n, data: { ...n.data, status: 'running' } } : n)));
    addLog('Đang thu thập dữ liệu đầu vào...', 'info');
    await sleep(1000);
    setNodes((nds) => nds.map((n) => (['inputNode', 'docInput', 'urlInput'].includes(n.type || '') ? { ...n, data: { ...n.data, status: 'success' } } : n)));

    // 3. AI Script Node + Agent Orchestration Simulation
    setNodes((nds) => nds.map((n) => (n.type === 'aiNode' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
    addLog('Khởi chạy hội thoại điều phối Agent...', 'info');
    
    addAgentLog('Biên Kịch Agent', `Đã nhận nội dung đầu vào. Tôi bắt đầu phân tách thành kịch bản phân cảnh cho chủ đề: ${promptValue}.`, '#a855f7');
    await sleep(1200);
    addAgentLog('Đạo Diễn Agent', 'Kịch bản cần có nhịp điệu nhanh hơn ở phần mở đầu. Hãy thêm mô tả hành động trực quan cho Cảnh 1.', '#2563eb');
    await sleep(1200);
    addAgentLog('Biên Kịch Agent', 'Đồng ý. Tôi đã điều chỉnh lại lời thoại và bổ sung mô tả chuyển cảnh mượt mà.', '#a855f7');
    await sleep(1000);
    
    setNodes((nds) => nds.map((n) => (n.type === 'aiNode' ? { ...n, data: { ...n.data, status: 'success' } } : n)));
    addLog('AI Script đã hoàn thành kịch bản phân cảnh.', 'success');

    // 4. Visual Node
    const hasVisual = nodes.some((n) => n.type === 'visualNode');
    if (hasVisual) {
      setNodes((nds) => nds.map((n) => (n.type === 'visualNode' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
      addAgentLog('Biên Tập Agent', `Tôi bắt đầu phác thảo hình ảnh theo phong cách nghệ thuật ${imageStyle.toUpperCase()}.`, '#10b981');
      await sleep(1500);
      setNodes((nds) => nds.map((n) => (n.type === 'visualNode' ? { ...n, data: { ...n.data, status: 'success' } } : n)));
      addLog('Đã vẽ ảnh minh họa AI hoàn thành.', 'success');
    }

    // 5. Audio TTS Node
    const hasAudio = nodes.some((n) => n.type === 'audioTTS');
    if (hasAudio) {
      setNodes((nds) => nds.map((n) => (n.type === 'audioTTS' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
      addAgentLog('Âm Thanh Agent', `Đang áp dụng giọng đọc "${ttsVoice === 'nu-mien-bac' ? 'Nữ Miền Bắc' : 'Nam Miền Nam'}" với tốc độ ${ttsSpeed}x.`, '#f59e0b');
      await sleep(1500);
      setNodes((nds) => nds.map((n) => (n.type === 'audioTTS' ? { ...n, data: { ...n.data, status: 'success' } } : n)));
      addLog('Đã hoàn thành sinh tệp âm thanh thuyết minh AI TTS.', 'success');
    }

    // 6. Subtitle Node
    const hasSub = nodes.some((n) => n.type === 'subtitle');
    if (hasSub) {
      setNodes((nds) => nds.map((n) => (n.type === 'subtitle' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
      addAgentLog('Biên Tập Agent', `Đang thiết lập lớp phủ phụ đề dạng chữ nghệ thuật "${subStyle.toUpperCase()}" với màu sắc ${subColor}.`, '#10b981');
      await sleep(1000);
      setNodes((nds) => nds.map((n) => (n.type === 'subtitle' ? { ...n, data: { ...n.data, status: 'success' } } : n)));
      addLog('Đã đồng bộ thời gian phụ đề và khung hình.', 'success');
    }

    // 7. Render Node
    const hasRender = nodes.some((n) => n.type === 'renderNode');
    if (hasRender) {
      setNodes((nds) => nds.map((n) => (n.type === 'renderNode' ? { ...n, data: { ...n.data, status: 'running' } } : n)));
      addLog('Dựng hình tổng hợp cuối cùng...', 'info');
      await sleep(2000);
      setNodes((nds) => nds.map((n) => (n.type === 'renderNode' ? { ...n, data: { ...n.data, status: 'success' } } : n)));
      addLog('Tạo thành công video MP4.', 'success');
    }

    setIsRunning(false);
    setWorkflowCompleted(true);
    setActiveTab('timeline');
    addLog('Mẫu video đã được dựng xong hoàn hảo!', 'success');
  }, [nodes, promptValue, imageStyle, ttsVoice, ttsSpeed, subStyle, subColor, isRunning, addLog, addAgentLog, setNodes]);

  // Video Preview Playback
  useEffect(() => {
    if (isPlayingPreview && workflowCompleted) {
      playIntervalRef.current = setInterval(() => {
        setActiveSceneIndex((prev) => (prev + 1) % mockScenes.length);
      }, mockScenes[activeSceneIndex].duration * 1000);
    } else {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlayingPreview, activeSceneIndex, workflowCompleted]);

  // Subtitle styling generator for preview screen
  const getSubStyle = () => {
    switch (subStyle) {
      case 'tiktok':
        return {
          fontFamily: 'Impact, sans-serif',
          color: subColor,
          fontSize: '15px',
          fontWeight: 'bold',
          textTransform: 'uppercase' as const,
          background: 'black',
          padding: '4px 10px',
          borderRadius: '4px',
        };
      case 'vintage':
        return {
          fontFamily: "'Courier New', monospace",
          color: '#ffffff',
          backgroundColor: 'rgba(74, 52, 33, 0.85)',
          fontSize: '12px',
          border: '1px solid #d97706',
          padding: '6px 8px',
          borderRadius: '2px',
        };
      default: // cinematic
        return {
          fontFamily: 'var(--font-sans)',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 400,
          background: 'rgba(0,0,0,0.6)',
          padding: '4px 12px',
          borderRadius: '20px',
        };
    }
  };

  const downloadMockVideo = () => {
    const textData = `HML AUTO VIDEO MANIFEST
==========================
Được tạo bởi: AI Agent Orchestration
Thời gian: ${new Date().toLocaleString()}

THAM SỐ HỆ THỐNG:
- Chủ đề kịch bản: ${promptValue}
- File đính kèm: ${docValue}
- Nguồn tham khảo: ${urlValue}
- Giọng đọc AI TTS: ${ttsVoice} (Tốc độ: ${ttsSpeed}x)
- Kiểu chữ phụ đề: ${subStyle} (Màu: ${subColor})
- Tỷ lệ khung hình: ${aspectRatio}
- Tốc độ chuyển cảnh: ${transitionSpeed}

CHI TIẾT PHÂN CẢNH VIDEO:
${mockScenes.map(s => `[${s.title}] (${s.duration}s)\nLời bình: ${s.text}\nẢnh nguồn: ${s.image}\n`).join('\n')}`;

    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${promptValue.replace(/\s+/g, '_')}_social_video.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addLog('Đã xuất bản thành công cấu hình kịch bản video và tải về!', 'success');
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
          <div className="logo-icon">H</div>
          <div>
            <h1 className="logo-title" style={{ margin: 0, fontSize: '18px', letterSpacing: 'normal' }}>
              HML Auto Video Builder (PRO)
            </h1>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hệ điều phối AI Agents & Pipeline Âm thanh Phụ đề</p>
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
            Tải kịch bản (MP4)
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="workspace-container">
        {/* Left Sidebar */}
        <div className="sidebar-left" style={{ gap: '16px' }}>
          <div style={{ padding: '16px 20px 0 20px' }}>
            <div className="sidebar-header" style={{ padding: 0, border: 'none', marginBottom: '8px' }}>
              Mẫu Thiết Kế (Templates)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button className="btn" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => loadTemplate('prompt')}>
                <Type size={14} className="color-ai" />
                Prompt sang Video
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => loadTemplate('doc')}>
                <FileText size={14} style={{ color: '#10b981' }} />
                Tài liệu sang Video
              </button>
              <button className="btn" style={{ justifyContent: 'flex-start', fontSize: '12px' }} onClick={() => loadTemplate('blog')}>
                <Globe size={14} style={{ color: '#3b82f6' }} />
                Blog sang Social Video
              </button>
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="sidebar-header">Thư viện Node</div>
            <div className="node-list" style={{ paddingTop: '8px' }}>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'trigger')}>
                <div className="node-icon-wrapper color-trigger"><Play size={14} fill="white" /></div>
                <div><div className="node-palette-name">Trigger</div><div className="node-palette-desc">Kích hoạt luồng</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'docInput')}>
                <div className="node-icon-wrapper" style={{ backgroundColor: '#10b981' }}><FileText size={14} /></div>
                <div><div className="node-palette-name">Tài Liệu</div><div className="node-palette-desc">Nhận tệp văn bản</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'urlInput')}>
                <div className="node-icon-wrapper" style={{ backgroundColor: '#3b82f6' }}><Globe size={14} /></div>
                <div><div className="node-palette-name">Liên Kết Blog</div><div className="node-palette-desc">Nhập địa chỉ URL</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'aiNode')}>
                <div className="node-icon-wrapper color-ai"><Cpu size={14} /></div>
                <div><div className="node-palette-name">AI Script</div><div className="node-palette-desc">Biên tập kịch bản</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'visualNode')}>
                <div className="node-icon-wrapper color-visual"><ImageIcon size={14} /></div>
                <div><div className="node-palette-name">Visual Node</div><div className="node-palette-desc">Sinh hình ảnh minh họa AI</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'audioTTS')}>
                <div className="node-icon-wrapper" style={{ backgroundColor: '#8b5cf6' }}><Volume2 size={14} /></div>
                <div><div className="node-palette-name">Lồng Tiếng AI</div><div className="node-palette-desc">TTS đa giọng đọc</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'subtitle')}>
                <div className="node-icon-wrapper" style={{ backgroundColor: '#f43f5e' }}><Type size={14} /></div>
                <div><div className="node-palette-name">Phụ Đề</div><div className="node-palette-desc">Thêm phụ đề chữ chạy</div></div>
              </div>
              <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'renderNode')}>
                <div className="node-icon-wrapper color-render"><Film size={14} /></div>
                <div><div className="node-palette-name">Xuất Bản</div><div className="node-palette-desc">Xuất video MP4</div></div>
              </div>
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
                style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}
                title="Xóa node"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          {!selectedNode ? (
            <div className="inspector-empty">
              <Settings size={36} strokeWidth={1.5} />
              <p style={{ fontWeight: 500 }}>Chưa chọn Node</p>
              <p style={{ fontSize: '12px' }}>Nhấp vào node trên canvas để thay đổi thông số.</p>
            </div>
          ) : (
            <div className="inspector-content">
              <h3 className="inspector-title">{String(selectedNode.data.label)}</h3>

              {/* Input Prompt Node */}
              {selectedNode.type === 'inputNode' && (
                <div className="form-group">
                  <label className="form-label">Ý tưởng / Prompt video:</label>
                  <textarea 
                    className="form-textarea" 
                    rows={4}
                    value={promptValue}
                    onChange={(e) => setPromptValue(e.target.value)}
                  />
                </div>
              )}

              {/* Doc Input Node */}
              {selectedNode.type === 'docInput' && (
                <div className="form-group">
                  <label className="form-label">Tên file tài liệu tải lên:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={docValue}
                    onChange={(e) => setDocValue(e.target.value)}
                  />
                  <button className="btn btn-primary" style={{ marginTop: '8px', fontSize: '12px' }}>
                    Tải tệp tin (.txt/.pdf)
                  </button>
                </div>
              )}

              {/* URL Input Node */}
              {selectedNode.type === 'urlInput' && (
                <div className="form-group">
                  <label className="form-label">Liên kết bài viết (URL):</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={urlValue}
                    onChange={(e) => setUrlValue(e.target.value)}
                  />
                </div>
              )}

              {/* AI Script Node */}
              {selectedNode.type === 'aiNode' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Giọng điệu biên tập:</label>
                    <select className="form-select" value={aiTone} onChange={(e) => setAiTone(e.target.value)}>
                      <option value="truyen-cam">Truyền cảm, sâu lắng</option>
                      <option value="hai-huoc">Hài hước, dí dỏm</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số cảnh phân tách:</label>
                    <select className="form-select" value={sceneCount} onChange={(e) => setSceneCount(Number(e.target.value))}>
                      <option value={3}>3 phân cảnh</option>
                      <option value={5}>5 phân cảnh</option>
                    </select>
                  </div>
                </>
              )}

              {/* Visual Node */}
              {selectedNode.type === 'visualNode' && (
                <div className="form-group">
                  <label className="form-label">Mỹ thuật hình ảnh:</label>
                  <select className="form-select" value={imageStyle} onChange={(e) => setImageStyle(e.target.value)}>
                    <option value="cinematic">Cinematic (Điện ảnh)</option>
                    <option value="anime">Anime (Hoạt hình)</option>
                    <option value="3d-render">3D Đồ họa</option>
                  </select>
                </div>
              )}

              {/* Audio TTS Node */}
              {selectedNode.type === 'audioTTS' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Giọng đọc lồng tiếng:</label>
                    <select className="form-select" value={ttsVoice} onChange={(e) => setTtsVoice(e.target.value)}>
                      <option value="nu-mien-bac">Nữ miền Bắc (Ấm áp)</option>
                      <option value="nam-mien-nam">Nam miền Nam (Dễ thương)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tốc độ đọc:</label>
                    <select className="form-select" value={ttsSpeed} onChange={(e) => setTtsSpeed(e.target.value)}>
                      <option value="0.9">Chậm (0.9x)</option>
                      <option value="1.0">Bình thường (1.0x)</option>
                      <option value="1.2">Nhanh (1.2x)</option>
                    </select>
                  </div>
                </>
              )}

              {/* Subtitle Node */}
              {selectedNode.type === 'subtitle' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Kiểu phụ đề:</label>
                    <select className="form-select" value={subStyle} onChange={(e) => setSubStyle(e.target.value)}>
                      <option value="tiktok">Chữ chạy TikTok (Viền đen)</option>
                      <option value="vintage">Điện ảnh cổ điển (Courier)</option>
                      <option value="cinematic">Cinematic tiêu chuẩn (Sleek)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Màu chữ phụ đề:</label>
                    <input 
                      type="color" 
                      className="form-input" 
                      style={{ height: '40px', padding: '2px' }}
                      value={subColor} 
                      onChange={(e) => setSubColor(e.target.value)} 
                    />
                  </div>
                </>
              )}

              {/* Render Node */}
              {selectedNode.type === 'renderNode' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Tỷ lệ video:</label>
                    <select className="form-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                      <option value="9:16">Dọc (9:16) - TikTok/Reels</option>
                      <option value="16:9">Ngang (16:9) - YouTube</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tốc độ chuyển cảnh:</label>
                    <select className="form-select" value={transitionSpeed} onChange={(e) => setTransitionSpeed(e.target.value)}>
                      <option value="slow">Chậm (Mượt mà)</option>
                      <option value="normal">Bình thường</option>
                      <option value="fast">Nhanh (Kịch tính)</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Bottom Panel */}
        <div className="bottom-panel">
          <div className="bottom-tab-container">
            <div className="bottom-tabs-header">
              <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
                Phân Cảnh (Timeline)
              </button>
              <button className={`tab-btn ${activeTab === 'logs' ? 'active' : ''}`} onClick={() => setActiveTab('logs')}>
                Nhật Ký (Console)
              </button>
              <button className={`tab-btn ${activeTab === 'agents' ? 'active' : ''}`} onClick={() => setActiveTab('agents')}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={14} />
                  Điều phối Agents
                </span>
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'logs' && (
                <div className="logs-console">
                  {logs.map((log, idx) => (
                    <div key={idx} className="log-entry">
                      <span className="log-time">[{log.time}]</span>
                      <span className={`log-${log.type}`}>
                        {log.type === 'success' ? '✔' : 'ℹ'} {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'timeline' && (
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
                          className="timeline-scene-card"
                          style={{ borderColor: activeSceneIndex === idx && isPlayingPreview ? 'var(--primary)' : 'var(--border-dark)' }}
                          onClick={() => {
                            setActiveSceneIndex(idx);
                            setIsPlayingPreview(false);
                          }}
                        >
                          <div className="timeline-scene-title">{scene.title}</div>
                          <div className="timeline-scene-image"><img src={scene.image} alt={scene.title} /></div>
                          <div className="timeline-scene-text">{scene.text}</div>
                          <div className="timeline-scene-duration">{scene.duration} giây</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'agents' && (
                <div className="logs-console" style={{ gap: '10px' }}>
                  {agentLogs.length === 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', padding: '20px' }}>
                      <Users size={28} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                      <p style={{ fontSize: '12px' }}>Không có cuộc thảo luận nào. Nhấp <strong>Chạy thử</strong> để xem hoạt động Agent Orchestration.</p>
                    </div>
                  ) : (
                    agentLogs.map((chat, idx) => (
                      <div key={idx} style={{ padding: '8px 12px', background: 'var(--bg-app)', borderRadius: '8px', borderLeft: `4px solid ${chat.color}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <strong style={{ color: chat.color, fontSize: '12px' }}>{chat.agent}</strong>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{chat.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-primary)', margin: 0 }}>{chat.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Video Preview Screen */}
          <div className="video-preview-wrapper" style={{ width: aspectRatio === '9:16' ? '220px' : '340px', transition: 'width 0.3s ease' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Màn hình xem trước
            </span>
            <div className="video-screen" style={{ aspectRatio: aspectRatio === '9:16' ? '9/16' : '16/9', maxHeight: 'none', height: '170px' }}>
              {workflowCompleted ? (
                <>
                  <img 
                    src={mockScenes[activeSceneIndex].image} 
                    alt="Active scene" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                  />
                  {/* Dynamic Subtitle overlay */}
                  <div style={{ position: 'absolute', bottom: '15px', left: '10px', right: '10px', display: 'flex', justifyContent: 'center' }}>
                    <span style={getSubStyle()}>
                      {mockScenes[activeSceneIndex].text}
                    </span>
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
