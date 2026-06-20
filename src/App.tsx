import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
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
  Cpu, Upload,
  Image as ImageIcon,
  FileText,
  Globe,
  Volume2,
  Type,
  Users,
  Zap,
  Sliders,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  VolumeX,
  Check,
  Code,
  AlertTriangle,
  Grid,
  Layers,
  HelpCircle,
  Save,
  Plus,
  GitBranch,
  Columns
} from 'lucide-react';
import { 
  TriggerNode, 
  InputNode, 
  AINode, 
  VisualNode, 
  RenderNode,
  AudioTTSNode,
  SubtitleNode,
  CodeNode,
  CustomAINode
} from './components/CustomNodes';
import LogicNode from './components/LogicNode';
import PublishNode from './components/PublishNode';

// Define custom node types
const nodeTypes = {
  trigger: TriggerNode,
  inputNode: InputNode,
  aiNode: AINode,
  visualNode: VisualNode,
  renderNode: RenderNode,
  docInput: InputNode,
  urlInput: InputNode,
  audioTTS: AudioTTSNode,
  subtitle: SubtitleNode,
  codeNode: CodeNode,
  customAINode: CustomAINode,
  logicNode: LogicNode,
  publishNode: PublishNode,
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
  fx: string;
  audioUrl?: string;
}

interface AgentMessage {
  time: string;
  agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent';
  color: string;
  message: string;
}

interface RenderConfig {
  engine: 'ffmpeg' | 'remotion' | 'hybrid';
  videoCodec: 'libx264' | 'libx265' | 'prores';
  crf: number;
  watermarkText: string;
  watermarkPos: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  resizeMode: 'stretch' | 'letterbox' | 'crop';
  transitionType: 'fade' | 'slide' | 'wipe';
  audioMixBg: number;
  template: string;
  fps: number;
  concurrency: number;
  outputDir?: string;
}

interface ToolParam {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
}

interface Tool {
  id: string;
  name: string;
  type: 'google_search' | 'api' | 'llm' | 'custom_code';
  description: string;
  systemPrompt: string;
  endpointUrl?: string;
  params: ToolParam[];
  isActive: boolean;
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  nodes: Node[];
  edges: Edge[];
  scenes: Scene[];
  promptValue: string;
  docValue: string;
  urlValue: string;
  aiTone: string;
  sceneCount: number;
  imageStyle: string;
  ttsVoice: string;
  ttsSpeed: string;
  subStyle: string;
  subColor: string;
  aspectRatio: string;
  transitionSpeed: string;
  workflowCompleted: boolean;
  renderConfig?: RenderConfig;
  codeValue?: string;
  customAIPrompt?: string;
  customAIModel?: string;
}

function WorkflowBuilder() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('hml_projects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved projects", e);
      }
    }
    return [
      {
        id: 'project-default',
        name: 'Dự án Cà phê phin Việt Nam',
        createdAt: new Date().toLocaleString(),
        nodes: [
          { id: 't1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Thủ Công', status: 'idle', subtype: 'manual' } },
          { id: 't2', type: 'inputNode', position: { x: 260, y: 150 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: 'Hương vị Cà phê phin Việt Nam', subtype: 'prompt' } },
          { id: 't3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle', subtype: 'expand' } },
          { id: 't4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Visual Node', status: 'idle', subtype: 'aiImage' } },
          { id: 't5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Lồng Tiếng AI', status: 'idle', subtype: 'tts' } },
          { id: 't6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề', status: 'idle', subtype: 'timeline' } },
          { id: 't7', type: 'renderNode', position: { x: 1140, y: 150 }, data: { label: 'Xuất Bản', status: 'idle', subtype: 'mp4' } },
        ],
        edges: [
          { id: 'e-t1-t2', source: 't1', target: 't2' },
          { id: 'e-t2-t3', source: 't2', target: 't3' },
          { id: 'e-t3-t4', source: 't3', target: 't4' },
          { id: 'e-t3-t5', source: 't3', target: 't5' },
          { id: 'e-t4-t6', source: 't4', target: 't6' },
          { id: 'e-t5-t6', source: 't5', target: 't6' },
          { id: 'e-t6-t7', source: 't6', target: 't7' },
        ],
        scenes: [
          {
            id: 1,
            title: 'Cảnh 1: Giọt Cà Phê Rơi',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
            text: 'Từng giọt cà phê đen nhánh, đậm đặc rơi chầm chậm qua chiếc phin nhôm truyền thống.',
            duration: 4,
            fx: 'none',
          },
          {
            id: 2,
            title: 'Cảnh 2: Hạt Cà Phê Tây Nguyên',
            image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
            text: 'Những hạt cà phê Robusta chín mọng được thu hoạch từ vùng đất đỏ bazan lộng gió.',
            duration: 5,
            fx: 'vintage',
          },
          {
            id: 3,
            title: 'Cảnh 3: Ly Nâu Đá Thơm Ngon',
            image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&q=80',
            text: 'Hòa quyện cùng sữa đặc ngọt ngào và những viên đá mát lạnh, tạo nên hương vị khó quên.',
            duration: 4,
            fx: 'none',
          },
        ],
        promptValue: 'Hương vị Cà phê phin Việt Nam',
        docValue: 'kich_ban_lich_su_cafe.txt',
        urlValue: 'https://blog.vietnam.travel/cafe-phin',
        aiTone: 'truyen-cam',
        sceneCount: 3,
        imageStyle: 'cinematic',
        ttsVoice: 'nu-mien-bac',
        ttsSpeed: '1.0',
        subStyle: 'tiktok',
        subColor: '#ffff00',
        aspectRatio: '9:16',
        transitionSpeed: 'normal',
        workflowCompleted: true
      }
    ];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem('hml_active_project_id');
    return saved || 'project-default';
  });

  const initialProject = projects.find(p => p.id === activeProjectId) || projects[0] || {
    nodes: [], edges: [], scenes: [], promptValue: '', docValue: '', urlValue: '', aiTone: 'truyen-cam', sceneCount: 3, imageStyle: 'cinematic', ttsVoice: 'nu-mien-bac', ttsSpeed: '1.0', subStyle: 'tiktok', subColor: '#ffff00', aspectRatio: '9:16', transitionSpeed: 'normal', workflowCompleted: false
  };

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialProject.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialProject.edges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [activeTab, setActiveTab] = useState<'timeline' | 'logs' | 'agents'>('timeline');
  const [activeTemplate, setActiveTemplate] = useState<'prompt' | 'doc' | 'blog'>('prompt');
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '14:22:07', type: 'info', message: 'Kích hoạt Chế độ dựng phim Kdenlive.' },
    { time: '14:22:08', type: 'info', message: 'Media Project Bin và Effect Stack đã sẵn sàng.' }
  ]);
    const [agentLogs, setAgentLogs] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [writerModel, setWriterModel] = useState('gpt-4o');
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(280);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(320);
  const [isSidebarSwapped, setIsSidebarSwapped] = useState(false);

  const startResizingLeft = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = leftSidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentX = mouseMoveEvent.clientX;
      const deltaX = currentX - startX;
      const newWidth = isSidebarSwapped ? startWidth - deltaX : startWidth + deltaX;
      setLeftSidebarWidth(Math.max(180, Math.min(500, newWidth)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [leftSidebarWidth, isSidebarSwapped]);

  const startResizingRight = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = rightSidebarWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentX = mouseMoveEvent.clientX;
      const deltaX = currentX - startX;
      const newWidth = isSidebarSwapped ? startWidth + deltaX : startWidth - deltaX;
      setRightSidebarWidth(Math.max(220, Math.min(600, newWidth)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [rightSidebarWidth, isSidebarSwapped]);
  const [directorModel, setDirectorModel] = useState('gemini-1.5-pro');
  const [writerSystemPrompt, setWriterSystemPrompt] = useState('Bạn là Biên kịch AI chuyên nghiệp, chịu trách nhiệm phân tích bối cảnh và phân tách kịch bản phân cảnh phim ngắn.');
  const [directorSystemPrompt, setDirectorSystemPrompt] = useState('Bạn là Đạo diễn Visual AI, chịu trách nhiệm định hình phong cách hình ảnh và sinh prompt hình ảnh cho mỗi phân cảnh.');
  const [voiceSystemPrompt, setVoiceSystemPrompt] = useState('Bạn là Kỹ sư Âm thanh AI, chịu trách nhiệm căn chỉnh thời lượng thoại và chọn giọng đọc phù hợp.');
  const [showPrompts, setShowPrompts] = useState({ writer: false, director: false, voice: false });
  const [agentStatuses, setAgentStatuses] = useState({ writer: 'idle', director: 'idle', voice: 'idle' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'agents') {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentLogs, activeTab]);

  const addLog = useCallback((message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [...prev, { time, type, message }]);
  }, []);

  const addAgentLog = useCallback((agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent', message: string, color: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setAgentLogs((prev) => [...prev, { time, agent, color, message }]);
  }, []);

  const [workflowCompleted, setWorkflowCompleted] = useState(initialProject.workflowCompleted);
  const [watchPath, setWatchPath] = useState('');
  
  const [editorMode, setEditorMode] = useState<'workflow' | 'kdenlive' | 'tools' | 'agent-flow'>('workflow');

  // Panel dimensions (resizable like VS Code)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(260);
  const [shotcutLeftWidth, setShotcutLeftWidth] = useState(320);
  const [shotcutRightWidth, setShotcutRightWidth] = useState(320);
  const [shotcutTimelineHeight, setShotcutTimelineHeight] = useState(280);

  // Seafood sauce visual generator app states
  const [fbBrandName, setFbBrandName] = useState('Nước Chấm Biển Xanh');
  const [fbBenefit, setFbBenefit] = useState('Chua cay mặn ngọt, dậy vị hải sản tươi');
  const [fbStyle, setFbStyle] = useState<'restaurant' | 'flatlay' | 'instagram'>('restaurant');
  const [fbPhoto, setFbPhoto] = useState<string>('');
  const [fbStatus, setFbStatus] = useState<'idle' | 'cleaning' | 'placing' | 'lighting' | 'done'>('idle');
  const [fbGeneratedImages, setFbGeneratedImages] = useState<string[]>([]);

  // Drag resizing handlers
  const startResizingBottom = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startHeight = bottomPanelHeight;
    const startY = mouseDownEvent.clientY;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentY = mouseMoveEvent.clientY;
      const deltaY = currentY - startY;
      setBottomPanelHeight(Math.max(120, Math.min(600, startHeight - deltaY)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [bottomPanelHeight]);

  const startResizingShotcutLeft = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = shotcutLeftWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentX = mouseMoveEvent.clientX;
      const deltaX = currentX - startX;
      setShotcutLeftWidth(Math.max(180, Math.min(500, startWidth + deltaX)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [shotcutLeftWidth]);

  const startResizingShotcutRight = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startWidth = shotcutRightWidth;
    const startX = mouseDownEvent.clientX;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentX = mouseMoveEvent.clientX;
      const deltaX = currentX - startX;
      setShotcutRightWidth(Math.max(180, Math.min(500, startWidth - deltaX)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [shotcutRightWidth]);

  const startResizingShotcutTimeline = useCallback((mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    const startHeight = shotcutTimelineHeight;
    const startY = mouseDownEvent.clientY;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      const currentY = mouseMoveEvent.clientY;
      const deltaY = currentY - startY;
      setShotcutTimelineHeight(Math.max(150, Math.min(600, startHeight - deltaY)));
    };

    const stopDrag = () => {
      window.removeEventListener('mousemove', doDrag);
      window.removeEventListener('mouseup', stopDrag);
    };

    window.addEventListener('mousemove', doDrag);
    window.addEventListener('mouseup', stopDrag);
  }, [shotcutTimelineHeight]);

  const handleGenerateFBVisual = () => {
    if (!fbPhoto) {
      alert("Vui lòng chọn hoặc tải lên ảnh sản phẩm!");
      return;
    }
    setFbStatus('cleaning');
    setFbGeneratedImages([]);
    
    // Simulate background removal stage
    setTimeout(() => {
      setFbStatus('placing');
      
      // Simulate scene integration stage
      setTimeout(() => {
        setFbStatus('lighting');
        
        // Simulate shadow and lighting adjustment stage
        setTimeout(() => {
          setFbStatus('done');
          
          // Set mock variants matching selected style
          let variants: string[] = [];
          if (fbStyle === 'restaurant') {
            variants = [
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
              'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
              'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80'
            ];
          } else if (fbStyle === 'flatlay') {
            variants = [
              'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
              'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80'
            ];
          } else { // instagram
            variants = [
              'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
              'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
              'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80'
            ];
          }
          setFbGeneratedImages(variants);
          addLog(`Công cụ đã tạo thành công 3 biến thể hình ảnh visual cho "${fbBrandName}"!`, "success");
        }, 1200);
      }, 1000);
    }, 1000);
  };

  const handleDownloadVariant = (variantUrl: string, ratio: string) => {
    addLog(`Đang tải ảnh biến thể tỉ lệ ${ratio} (URL: ${variantUrl}) về máy...`, "success");
    alert(`Đã tải xuống ảnh biến thể với tỉ lệ ${ratio} thành công!`);
  };

  // Tools states
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('hml_tools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved tools", e);
      }
    }
    return [
      {
        id: 'tool-search',
        name: 'Google Search API',
        type: 'google_search',
        description: 'Tra cứu tin tức thời gian thực để tạo bối cảnh kịch bản cập nhật nhất.',
        systemPrompt: 'Dùng để tìm kiếm các bài viết tin tức mới nhất về chủ đề cà phê phin, văn hóa Việt Nam hoặc các sự kiện nổi bật khác.',
        params: [
          { name: 'query', type: 'string', description: 'Từ khóa tìm kiếm trên Google', required: true }
        ],
        isActive: true
      },
      {
        id: 'tool-llm',
        name: 'LLM Script Writer Helper',
        type: 'llm',
        description: 'Phát triển dàn ý thô sơ thành lời thoại dẫn chi tiết cho từng phân cảnh.',
        systemPrompt: 'Biến đổi dàn ý phân cảnh thành lời thoại truyền cảm, dí dỏm, tối ưu cho video ngắn 9:16.',
        params: [
          { name: 'outline', type: 'string', description: 'Dàn ý hoặc ý tưởng thô sơ', required: true },
          { name: 'tone', type: 'string', description: 'Giọng điệu kịch bản (truyen-cam / hai-huoc)', required: false }
        ],
        isActive: true
      },
      {
        id: 'tool-visual',
        name: 'Stable Diffusion Generator',
        type: 'llm',
        description: 'Vẽ tranh minh họa AI chất lượng cao khớp với văn bản bối cảnh của cảnh quay.',
        systemPrompt: 'Tự động biên dịch mô tả cảnh quay thành prompt vẽ ảnh 3D/Cinematic chi tiết cho Stable Diffusion/Midjourney.',
        params: [
          { name: 'sceneText', type: 'string', description: 'Văn bản mô tả nội dung cảnh quay', required: true },
          { name: 'style', type: 'string', description: 'Phong cách nghệ thuật hình ảnh', required: true }
        ],
        isActive: true
      },
      {
        id: 'tool-tts',
        name: 'TTS Voice Synthesizer',
        type: 'api',
        endpointUrl: 'https://api.hml.vn/v1/tts',
        description: 'API chuyển đổi văn bản kịch bản phân cảnh thành tệp âm thanh lồng tiếng.',
        systemPrompt: 'Gửi request chứa lời thoại đến máy chủ Viettel AI/FPT.AI để nhận về file âm thanh thoại MP3.',
        params: [
          { name: 'text', type: 'string', description: 'Văn bản lời thoại cần đọc', required: true },
          { name: 'voice', type: 'string', description: 'Giọng đọc miền Bắc/miền Nam', required: true },
          { name: 'speed', type: 'string', description: 'Tốc độ giọng đọc (0.9x -> 1.5x)', required: false }
        ],
        isActive: true
      },
      {
        id: 'tool-webhook',
        name: 'Social Auto-Publish Webhook',
        type: 'api',
        endpointUrl: 'https://api.tiktok.com/publish/video',
        description: 'Đăng tải video thành phẩm lên TikTok / YouTube Shorts tự động.',
        systemPrompt: 'Gửi file video MP4 đã render lên webhook API để đăng bài tự động kèm hashtag.',
        params: [
          { name: 'videoUrl', type: 'string', description: 'Đường dẫn video MP4 trên cloud', required: true },
          { name: 'caption', type: 'string', description: 'Mô tả đăng bài kèm hashtag', required: true }
        ],
        isActive: false
      }
    ];
  });

  const [selectedToolId, setSelectedToolId] = useState<string>('tool-search');
  
  // States for Prompt AI Helper and Testing playground
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [testParams, setTestParams] = useState<Record<string, string>>({});
  const [testOutput, setTestOutput] = useState<string>('');
  const [isTestingTool, setIsTestingTool] = useState(false);

  // Sync tools to LocalStorage
  useEffect(() => {
    localStorage.setItem('hml_tools', JSON.stringify(tools));
  }, [tools]);

  const handleToggleTool = (toolId: string) => {
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, isActive: !t.isActive } : t));
    const targetTool = tools.find(t => t.id === toolId);
    if (targetTool) {
      addLog(`Đã ${!targetTool.isActive ? 'Kích hoạt' : 'Hủy kích hoạt'} công cụ: "${targetTool.name}"`, 'info');
    }
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setTestParams({});
    setTestOutput('');
  };

  const handleUpdateToolField = <K extends keyof Tool>(toolId: string, key: K, value: Tool[K]) => {
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, [key]: value } : t));
  };

  const handleCreateTool = () => {
    const newId = `tool-custom-${Date.now()}`;
    const newTool: Tool = {
      id: newId,
      name: `Công cụ Mới #${tools.length + 1}`,
      type: 'api',
      description: 'Công cụ tích hợp Webhook API tùy chỉnh cho AI Agent.',
      systemPrompt: 'Khi Agent gọi công cụ này, gửi tham số tới URL endpoint cấu hình.',
      endpointUrl: 'https://api.example.com/v1/action',
      params: [
        { name: 'input_text', type: 'string', description: 'Nội dung đầu vào', required: true }
      ],
      isActive: true
    };
    setTools(prev => [...prev, newTool]);
    setSelectedToolId(newId);
    setTestParams({});
    setTestOutput('');
    addLog(`Đã tạo công cụ mới: "${newTool.name}"`, 'success');
  };

  const handleDeleteTool = (toolId: string) => {
    if (tools.length <= 1) {
      addLog('Không thể xóa công cụ cuối cùng!', 'warning');
      return;
    }
    const idx = tools.findIndex(t => t.id === toolId);
    const newTools = tools.filter(t => t.id !== toolId);
    setTools(newTools);
    if (selectedToolId === toolId) {
      const nextActive = newTools[idx === 0 ? 0 : idx - 1];
      setSelectedToolId(nextActive.id);
      setTestParams({});
      setTestOutput('');
    }
    addLog('Đã xóa công cụ thành công.', 'warning');
  };

  const handleAddParam = (toolId: string) => {
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        return {
          ...t,
          params: [...t.params, { name: `param_${t.params.length + 1}`, type: 'string', description: 'Tham số mới', required: false }]
        };
      }
      return t;
    }));
    addLog('Đã thêm tham số mới', 'info');
  };

  const handleUpdateParam = (toolId: string, index: number, field: keyof ToolParam, value: any) => {
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const newParams = [...t.params];
        newParams[index] = { ...newParams[index], [field]: value };
        return { ...t, params: newParams };
      }
      return t;
    }));
  };

  const handleDeleteParam = (toolId: string, index: number) => {
    setTools(prev => prev.map(t => {
      if (t.id === toolId) {
        const newParams = t.params.filter((_, i) => i !== index);
        return { ...t, params: newParams };
      }
      return t;
    }));
    addLog('Đã xóa tham số', 'warning');
  };

  const handleGeneratePrompt = () => {
    if (!aiPromptInput.trim()) return;
    setIsGeneratingPrompt(true);
    setTimeout(() => {
      const idea = aiPromptInput.toLowerCase();
      let generatedDesc = "Mô tả công cụ tự động sinh bởi AI.";
      let generatedPrompt = "System prompt của công cụ sinh bởi AI.";

      if (idea.includes("weather") || idea.includes("thời tiết")) {
        generatedDesc = "Tra cứu thông tin thời tiết hiện tại cho một địa điểm cụ thể.";
        generatedPrompt = "Khi người dùng yêu cầu kiểm tra thời tiết, hãy gọi API này để lấy nhiệt độ, độ ẩm và dự báo thời tiết của địa phương đó.";
      } else if (idea.includes("stock") || idea.includes("chứng khoán") || idea.includes("giá cổ phiếu")) {
        generatedDesc = "Lấy dữ liệu giá cổ phiếu thời gian thực từ sàn giao dịch tài chính.";
        generatedPrompt = "Khi cần phân tích giá cổ phiếu, hãy cung cấp mã cổ phiếu. API sẽ trả về giá mở cửa, giá đóng cửa, khối lượng giao dịch và xu hướng biến động.";
      } else if (idea.includes("shopee") || idea.includes("sản phẩm") || idea.includes("tiki") || idea.includes("lazada")) {
        generatedDesc = "Kiểm tra tình trạng còn hàng và giá bán của sản phẩm trên sàn thương mại điện tử.";
        generatedPrompt = "Gọi API này để kiểm tra xem sản phẩm có còn hàng không, giá hiện tại bao nhiêu và có chương trình khuyến mãi nào đang diễn ra hay không.";
      } else {
        generatedDesc = `Công cụ hỗ trợ: ${aiPromptInput}`;
        generatedPrompt = `Bạn là một trợ lý thông minh điều phối công cụ này. Khi nhận được yêu cầu liên quan đến '${aiPromptInput}', hãy chuẩn bị các tham số và thực thi API để trả về kết quả cấu trúc phù hợp.`;
      }

      setTools(prev => prev.map(t => {
        if (t.id === selectedToolId) {
          return { ...t, description: generatedDesc, systemPrompt: generatedPrompt };
        }
        return t;
      }));
      
      addLog("Trợ lý AI đã sinh thành công Prompt và Mô tả công cụ!", "success");
      setIsGeneratingPrompt(false);
    }, 1200);
  };

  const handleTestTool = () => {
    setIsTestingTool(true);
    setTestOutput("Đang kết nối tới máy chủ và thực thi công cụ...\n");
    setTimeout(() => {
      const currentTool = tools.find(t => t.id === selectedToolId);
      if (!currentTool) {
        setTestOutput(JSON.stringify({ error: "Không tìm thấy công cụ" }, null, 2));
        setIsTestingTool(false);
        return;
      }

      const missingParams = currentTool.params
        .filter(p => p.required && !testParams[p.name])
        .map(p => p.name);

      if (missingParams.length > 0) {
        setTestOutput(JSON.stringify({
          success: false,
          error: `Thiếu tham số bắt buộc: ${missingParams.join(", ")}`
        }, null, 2));
        addLog(`Chạy thử thất bại: Thiếu tham số bắt buộc.`, "error");
        setIsTestingTool(false);
        return;
      }

      let mockResult: any = {
        success: true,
        timestamp: new Date().toISOString(),
        tool_executed: currentTool.name,
        inputs: testParams,
        outputs: {}
      };

      if (currentTool.type === 'google_search') {
        mockResult.outputs = {
          query: testParams.query || "cà phê phin Việt Nam",
          total_results: 142000,
          organic_results: [
            { title: "Cách pha cà phê phin đậm đà chuẩn vị Việt", snippet: "Hướng dẫn chi tiết cách chọn bột cà phê, tỷ lệ nước và cách ủ cà phê phin ngon nhất.", link: "https://example.com/pha-cafe-phin" },
            { title: "Lịch sử cà phê phin tại Việt Nam", snippet: "Cà phê phin du nhập vào Việt Nam từ thời Pháp thuộc và đã biến đổi thành một nét văn hóa độc đáo...", link: "https://example.com/lich-su-cafe" }
          ]
        };
      } else if (currentTool.type === 'llm') {
        if (currentTool.id === 'tool-visual') {
          mockResult.outputs = {
            prompt_generated: `${testParams.sceneText || "Cảnh giọt cà phê rơi"}, photorealistic, 8k resolution, cinematic lighting, ${testParams.style || "cinematic"} style`,
            image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
            width: 1080,
            height: 1920
          };
        } else {
          mockResult.outputs = {
            text_output: `[Kịch bản phân cảnh gợi ý] Lời dẫn: Chào mừng bạn đến với hương vị cà phê phin truyền thống. Từng giọt cà phê tí tách rơi mang theo hương thơm nồng nàn của đất trời Tây Nguyên. Tone: ${testParams.tone || "truyen-cam"}.`,
            token_used: 185
          };
        }
      } else if (currentTool.type === 'api') {
        if (currentTool.id === 'tool-tts') {
          mockResult.outputs = {
            status: "rendered",
            audio_url: "https://api.hml.vn/v1/tts/output_12345.mp3",
            duration_seconds: 4.5,
            voice_used: testParams.voice || "nu-mien-bac",
            character_count: (testParams.text || "").length
          };
        } else if (currentTool.id === 'tool-webhook') {
          mockResult.outputs = {
            status: "published",
            post_id: "tiktok_post_987654321",
            published_at: new Date().toLocaleString(),
            video_url: testParams.videoUrl || "https://cloud.hml.vn/video.mp4",
            caption: testParams.caption || "Cà phê phin Việt Nam #cafe #shorts"
          };
        } else {
          mockResult.outputs = {
            status: "success",
            response_code: 200,
            data: {
              message: "API executed successfully",
              received_params: testParams
            }
          };
        }
      } else {
        mockResult.outputs = {
          status: "executed",
          custom_code_output: "Hello from Custom Code runtime!"
        };
      }

      setTestOutput(JSON.stringify(mockResult, null, 2));
      addLog(`Chạy thử công cụ "${currentTool.name}" thành công!`, "success");
      setIsTestingTool(false);
    }, 1000);
  };

  const [promptValue, setPromptValue] = useState(initialProject.promptValue);
  const [docValue, setDocValue] = useState(initialProject.docValue);
  const [urlValue, setUrlValue] = useState(initialProject.urlValue);
  
  const [aiTone, setAiTone] = useState(initialProject.aiTone);
  const [sceneCount, setSceneCount] = useState(initialProject.sceneCount);
  const [imageStyle, setImageStyle] = useState(initialProject.imageStyle);
  
  const [ttsVoice, setTtsVoice] = useState(initialProject.ttsVoice);
  const [ttsSpeed, setTtsSpeed] = useState(initialProject.ttsSpeed);
  
  const [subStyle, setSubStyle] = useState(initialProject.subStyle);
  const [subColor, setSubColor] = useState(initialProject.subColor);

  const [aspectRatio, setAspectRatio] = useState(initialProject.aspectRatio);
  const [transitionSpeed, setTransitionSpeed] = useState(initialProject.transitionSpeed);

  const [codeValue, setCodeValue] = useState(initialProject.codeValue || '// Viết mã JS xử lý tại đây\nfunction process(scenes) {\n  console.log(\'Xử lý kịch bản\');\n  return scenes;\n}');
  const [customAIPrompt, setCustomAIPrompt] = useState(initialProject.customAIPrompt || 'Hãy viết lại lời dẫn cho kịch bản ngắn gọn, dí dỏm hơn.');
  const [customAIModel, setCustomAIModel] = useState(initialProject.customAIModel || 'gpt-4o');

  const [renderConfig, setRenderConfig] = useState<RenderConfig>(() => {
    return initialProject.renderConfig || {
      engine: 'ffmpeg',
      videoCodec: 'libx264',
      crf: 23,
      watermarkText: 'HMLnotext',
      watermarkPos: 'bottom-right',
      resizeMode: 'letterbox',
      transitionType: 'fade',
      audioMixBg: 30,
      template: 'MainComposition',
      fps: 30,
      concurrency: 4
    };
  });

  const updateRenderConfig = <K extends keyof RenderConfig>(key: K, value: RenderConfig[K]) => {
    setRenderConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const [trackLocks, setTrackLocks] = useState({ visual: false, fx: false, audio: false, subtitle: false });
  const [trackMutes, setTrackMutes] = useState({ audio: false, subtitle: false });
  const [trackVisibility, setTrackVisibility] = useState({ visual: true, fx: true, subtitle: true });

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const [scenes, setScenes] = useState<Scene[]>(initialProject.scenes);

  useEffect(() => {
    setProjects(prev => prev.map(proj => {
      if (proj.id === activeProjectId) {
        return {
          ...proj,
          nodes,
          edges,
          scenes,
          promptValue,
          docValue,
          urlValue,
          aiTone,
          sceneCount,
          imageStyle,
          ttsVoice,
          ttsSpeed,
          subStyle,
          subColor,
          aspectRatio,
          transitionSpeed,
          workflowCompleted,
          renderConfig,
          codeValue,
          customAIPrompt,
          customAIModel
        };
      }
      return proj;
    }));
  }, [
    activeProjectId,
    nodes,
    edges,
    scenes,
    promptValue,
    docValue,
    urlValue,
    aiTone,
    sceneCount,
    imageStyle,
    ttsVoice,
    ttsSpeed,
    subStyle,
    subColor,
    aspectRatio,
    transitionSpeed,
    workflowCompleted,
    renderConfig,
    codeValue,
    customAIPrompt,
    customAIModel
  ]);

  useEffect(() => {
    localStorage.setItem('hml_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('hml_active_project_id', activeProjectId);
  }, [activeProjectId]);

  const switchProject = (projectId: string) => {
    const target = projects.find(p => p.id === projectId);
    if (!target) return;
    
    setIsPlayingPreview(false);
    setCurrentTime(0);
    setActiveProjectId(projectId);

    setNodes(target.nodes);
    setEdges(target.edges);
    setScenes(target.scenes);
    setPromptValue(target.promptValue);
    setDocValue(target.docValue);
    setUrlValue(target.urlValue);
    setAiTone(target.aiTone);
    setSceneCount(target.sceneCount);
    setImageStyle(target.imageStyle);
    setTtsVoice(target.ttsVoice);
    setTtsSpeed(target.ttsSpeed);
    setSubStyle(target.subStyle);
    setSubColor(target.subColor);
    setAspectRatio(target.aspectRatio);
    setTransitionSpeed(target.transitionSpeed);
    setWorkflowCompleted(target.workflowCompleted);
    setRenderConfig(target.renderConfig || {
      engine: 'ffmpeg',
      videoCodec: 'libx264',
      crf: 23,
      watermarkText: 'HMLnotext',
      watermarkPos: 'bottom-right',
      resizeMode: 'letterbox',
      transitionType: 'fade',
      audioMixBg: 30,
      template: 'MainComposition',
      fps: 30,
      concurrency: 4
    });
    setCodeValue(target.codeValue || '// Viết mã JS xử lý tại đây\nfunction process(scenes) {\n  console.log(\'Xử lý kịch bản\');\n  return scenes;\n}');
    setCustomAIPrompt(target.customAIPrompt || 'Hãy viết lại lời dẫn cho kịch bản ngắn gọn, dí dỏm hơn.');
    setCustomAIModel(target.customAIModel || 'gpt-4o');
    
    addLog(`Đã chuyển sang dự án: "${target.name}"`, 'success');
  };

  // Shotcut Editor Mode States
  const [leftTab, setLeftTab] = useState<'playlist' | 'filters' | 'history'>('playlist');
  const [filterSearch, setFilterSearch] = useState('');
  const [peakL, setPeakL] = useState(0);
  const [peakR, setPeakR] = useState(0);
  const [historyList, setHistoryList] = useState<string[]>([
    'Đã khởi tạo Workspace Shotcut',
    'Nạp tài nguyên Project Bin thành công',
  ]);
  const [exportJobs, setExportJobs] = useState<{ id: string; name: string; progress: number; status: string }[]>([
    { id: 'job-1', name: 'Xuất video_hml_916.mp4', progress: 100, status: 'Hoàn thành' }
  ]);

  const addHistory = useCallback((actionText: string) => {
    const time = new Date().toTimeString().split(' ')[0];
    setHistoryList(prev => [...prev, `${time} - ${actionText}`]);
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);

  const undoStack = useRef<{nodes: Node[], edges: Edge[]}[]>([]);

  const pushUndo = useCallback((currentNodes: Node[], currentEdges: Edge[]) => {
    undoStack.current.push({ nodes: JSON.parse(JSON.stringify(currentNodes)), edges: JSON.parse(JSON.stringify(currentEdges)) });
    if (undoStack.current.length > 20) undoStack.current.shift();
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.current.length === 0) {
      addLog('Không có thao tác nào để hoàn tác', 'warning');
      return;
    }
    const prevState = undoStack.current.pop();
    if (prevState) {
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      addLog('Đã hoàn tác', 'info');
    }
  }, [setNodes, setEdges, addLog]);

  const saveCanvasTemplate = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes, edges }));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "vietflow-template.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    addLog('Đã tải mẫu xuống máy', 'success');
  };

  const loadCanvasTemplate = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const parsed = JSON.parse(evt.target?.result as string);
          if (parsed.nodes && parsed.edges) {
            pushUndo(nodes, edges);
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            addLog('Đã nạp mẫu từ file json', 'success');
          }
        } catch(err) {
          addLog('File không hợp lệ', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const saveWorkflowManual = () => {
    localStorage.setItem('hml_projects', JSON.stringify(projects));
    showToast('Đã lưu cấu hình dự án & workflow thành công!');
    addLog('Đã lưu cấu hình dự án thủ công', 'success');
    addHistory('Lưu cấu hình dự án thủ công');
  };

  const activeEdges = edges.map(edge => {
    if (edge.id === selectedEdgeId) {
      return {
        ...edge,
        style: { stroke: '#f43f5e', strokeWidth: 3 },
        animated: true
      };
    }
    return edge;
  });



  const createNewProject = () => {
    const id = `project-${Date.now()}`;
    const name = `Dự án Video Mới (${new Date().toLocaleDateString()})`;
    const newProj: Project = {
      id,
      name,
      createdAt: new Date().toLocaleString(),
      nodes: [
        { id: 't1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Thủ Công', status: 'idle', subtype: 'manual' } },
        { id: 't2', type: 'inputNode', position: { x: 260, y: 150 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: 'Chủ đề video mới', subtype: 'prompt' } },
        { id: 't3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle', subtype: 'expand' } },
        { id: 't7', type: 'renderNode', position: { x: 700, y: 150 }, data: { label: 'Xuất Bản', status: 'idle', subtype: 'mp4' } },
      ],
      edges: [
        { id: 'e-t1-t2', source: 't1', target: 't2' },
        { id: 'e-t2-t3', source: 't2', target: 't3' },
        { id: 'e-t3-t7', source: 't3', target: 't7' },
      ],
      scenes: [
        {
          id: 1,
          title: 'Cảnh 1: Bắt đầu',
          image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&q=80',
          text: 'Giới thiệu về nội dung video mới.',
          duration: 5,
          fx: 'none',
        }
      ],
      promptValue: 'Chủ đề video mới',
      docValue: 'tai_lieu_moi.txt',
      urlValue: 'https://example.com/blog',
      aiTone: 'truyen-cam',
      sceneCount: 1,
      imageStyle: 'cinematic',
      ttsVoice: 'nu-mien-bac',
      ttsSpeed: '1.0',
      subStyle: 'tiktok',
      subColor: '#ffffff',
      aspectRatio: '16:9',
      transitionSpeed: 'normal',
      workflowCompleted: false,
      renderConfig: {
        engine: 'ffmpeg',
        videoCodec: 'libx264',
        crf: 23,
        watermarkText: 'HMLnotext',
        watermarkPos: 'bottom-right',
        resizeMode: 'letterbox',
        transitionType: 'fade',
        audioMixBg: 30,
        template: 'MainComposition',
        fps: 30,
        concurrency: 4
      },
      codeValue: '// Viết mã JS xử lý tại đây\nfunction process(scenes) {\n  console.log(\'Xử lý kịch bản\');\n  return scenes;\n}',
      customAIPrompt: 'Hãy viết lại lời dẫn cho kịch bản ngắn gọn, dí dỏm hơn.',
      customAIModel: 'gpt-4o'
    };
 
    setProjects(prev => [...prev, newProj]);
     
    setTimeout(() => {
      setActiveProjectId(id);
      setNodes(newProj.nodes);
      setEdges(newProj.edges);
      setScenes(newProj.scenes);
      setPromptValue(newProj.promptValue);
      setDocValue(newProj.docValue);
      setUrlValue(newProj.urlValue);
      setAiTone(newProj.aiTone);
      setSceneCount(newProj.sceneCount);
      setImageStyle(newProj.imageStyle);
      setTtsVoice(newProj.ttsVoice);
      setTtsSpeed(newProj.ttsSpeed);
      setSubStyle(newProj.subStyle);
      setSubColor(newProj.subColor);
      setAspectRatio(newProj.aspectRatio);
      setTransitionSpeed(newProj.transitionSpeed);
      setWorkflowCompleted(newProj.workflowCompleted);
      if (newProj.renderConfig) {
        setRenderConfig(newProj.renderConfig);
      }
      setCodeValue(newProj.codeValue || '');
      setCustomAIPrompt(newProj.customAIPrompt || '');
      setCustomAIModel(newProj.customAIModel || '');
    }, 50);
 
    addLog(`Đã tạo dự án mới: "${name}"`, 'success');
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      addLog('Không thể xóa dự án duy nhất còn lại!', 'warning');
      return;
    }
    const targetIdx = projects.findIndex(p => p.id === projectId);
    const nextActiveProject = projects[targetIdx === 0 ? 1 : targetIdx - 1];

    setProjects(prev => prev.filter(p => p.id !== projectId));
    
    setTimeout(() => {
      switchProject(nextActiveProject.id);
    }, 50);
    addLog(`Đã xóa dự án thành công.`, 'warning');
  };

  // Drag and Drop timeline items reordering
  const [draggedSceneIndex, setDraggedSceneIndex] = useState<number | null>(null);

  const handleSceneDragStart = (idx: number) => {
    if (trackLocks.visual) {
      addLog('Luồng Hình ảnh đang bị Khóa. Vui lòng mở khóa để sắp xếp.', 'warning');
      return;
    }
    setDraggedSceneIndex(idx);
  };

  const handleSceneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSceneDrop = (targetIdx: number) => {
    if (draggedSceneIndex === null) return;
    if (draggedSceneIndex === targetIdx) return;
    if (trackLocks.visual) return;
    
    const reordered = [...scenes];
    const [draggedItem] = reordered.splice(draggedSceneIndex, 1);
    reordered.splice(targetIdx, 0, draggedItem);
    
    setScenes(reordered);
    setDraggedSceneIndex(null);
    addLog(`Đã hoán đổi vị trí cảnh ${draggedSceneIndex + 1} sang cảnh ${targetIdx + 1}.`, 'success');
  };

  // FX change handler
  const handleSceneFxChange = (idx: number, fxValue: string) => {
    if (trackLocks.fx) {
      addLog('Luồng Hiệu ứng FX đang bị Khóa!', 'warning');
      return;
    }
    setScenes((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, fx: fxValue } : s))
    );
    const fxNameMap: Record<string, string> = {
      none: 'Không có',
      cinematic: 'Điện ảnh',
      vintage: 'Hoài cổ',
      noir: 'Trắng đen',
      glitch: 'Nhiễu sóng',
      blur: 'Làm mờ',
    };
    addLog(`Đã áp dụng hiệu ứng ${fxNameMap[fxValue] || fxValue} cho Cảnh ${idx + 1}`, 'success');
  };

  // Calculate total duration based on selected scenes
  const totalDuration = scenes.slice(0, sceneCount).reduce((acc, s) => acc + s.duration, 0);
  const [timelineScale, setTimelineScale] = useState(60); // pixels per second (zoom state)
  const [isSnapEnabled, setIsSnapEnabled] = useState(true);

  // Helper to format seconds into SMPTE Timecode (HH:MM:SS:FF) at 25 fps
  const formatTimecode = (secs: number, fps: number = 25): string => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    const f = Math.floor((secs % 1) * fps);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
  };


  // Synchronized Playhead and Preview Screen
  useEffect(() => {
    let startTimestamp: number;
    let animFrameId: number = 0;

    const playLoop = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) / 1000; // in seconds
      
      setCurrentTime((prev) => {
        const nextTime = prev + elapsed;
        startTimestamp = timestamp;
        
        if (nextTime >= totalDuration) {
          if (isLooping) {
            return 0;
          } else {
            setIsPlayingPreview(false);
            setPeakL(0);
            setPeakR(0);
            return 0;
          }
        }
        return nextTime;
      });

      // Animate Shotcut Audio Peak Meter
      if (!trackMutes.audio) {
        setPeakL(Math.floor(Math.random() * 40) + 50); // Bounces between 50% and 90%
        setPeakR(Math.floor(Math.random() * 40) + 50);
      } else {
        setPeakL(0);
        setPeakR(0);
      }
      
      animFrameId = requestAnimationFrame(playLoop);
    };

    if (isPlayingPreview && workflowCompleted) {
      animFrameId = requestAnimationFrame((t) => {
        startTimestamp = t;
        playLoop(t);
      });
    } else {
      if (animFrameId) cancelAnimationFrame(animFrameId);
      setPeakL(0);
      setPeakR(0);
    }

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isPlayingPreview, workflowCompleted, totalDuration, trackMutes.audio, isLooping]);


  // Map currentTime to active scene index
  useEffect(() => {
    let accTime = 0;
    const activeIndex = scenes.slice(0, sceneCount).findIndex((scene) => {
      accTime += scene.duration;
      return currentTime <= accTime;
    });
    if (activeIndex !== -1) {
      setActiveSceneIndex(activeIndex);
    }
  }, [currentTime, sceneCount, scenes]);

  // Click on Timeline tracks space to seek/tua video
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!workflowCompleted) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    let clickedTime = Math.max(0, Math.min(totalDuration, clickX / timelineScale));
    
    if (isSnapEnabled) {
      let currentOffset = 0;
      const snapThreshold = 0.25; // Snap range in seconds
      const snapPoints = [0];
      for (const s of scenes.slice(0, sceneCount)) {
        currentOffset += s.duration;
        snapPoints.push(currentOffset);
      }
      for (const pt of snapPoints) {
        if (Math.abs(clickedTime - pt) < snapThreshold) {
          clickedTime = pt;
          break;
        }
      }
    }
    
    setCurrentTime(clickedTime);
  };


  // Get active scene FX CSS Filter class (respects track visibility and lock)
  const getFxClass = () => {
    if (!trackVisibility.fx) return '';
    const activeScene = scenes[activeSceneIndex];
    if (!activeScene || !activeScene.fx || activeScene.fx === 'none') return '';
    return `fx-${activeScene.fx}`;
  };

  // Helper to load templates
  const loadTemplate = useCallback((templateType: 'prompt' | 'doc' | 'blog') => {
    setActiveTemplate(templateType);
    setSelectedNode(null);
    setWorkflowCompleted(false);
    setIsPlayingPreview(false);
    setCurrentTime(0);
    
    if (templateType === 'prompt') {
      // Mẫu Tự động: Xử lý Prompt cơ bản với Rẽ nhánh Logic
      const templateNodes: Node[] = [
        { id: 't1', type: 'trigger', position: { x: 50, y: 250 }, data: { label: 'Chạy Thủ Công', status: 'idle', subtype: 'manual' } },
        { id: 't2', type: 'inputNode', position: { x: 260, y: 250 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: promptValue, subtype: 'prompt' } },
        { id: 't3', type: 'aiNode', position: { x: 480, y: 250 }, data: { label: 'AI Sinh Kịch Bản', status: 'idle', subtype: 'expand' } },
        { id: 't4', type: 'logicNode', position: { x: 700, y: 250 }, data: { label: 'Kiểm tra độ dài', status: 'idle', expression: 'scenes.length > 2' } },
        // Nhánh True (Video Dài)
        { id: 't5_true', type: 'visualNode', position: { x: 950, y: 150 }, data: { label: 'Visual (Chi tiết)', status: 'idle', subtype: 'aiImage' } },
        { id: 't6_true', type: 'audioTTS', position: { x: 1180, y: 150 }, data: { label: 'Lồng Tiếng & Nhạc', status: 'idle', subtype: 'tts' } },
        { id: 't7_true', type: 'renderNode', position: { x: 1400, y: 150 }, data: { label: 'Xuất Chất lượng cao', status: 'idle', subtype: 'full' } },
        // Nhánh False (Video Ngắn)
        { id: 't5_false', type: 'visualNode', position: { x: 950, y: 350 }, data: { label: 'Visual (Nhanh)', status: 'idle', subtype: 'background' } },
        { id: 't6_false', type: 'renderNode', position: { x: 1180, y: 350 }, data: { label: 'Xuất Nhanh (Draft)', status: 'idle', subtype: 'preview' } },
      ];
      const templateEdges: Edge[] = [
        { id: 'e-t1-t2', source: 't1', target: 't2' },
        { id: 'e-t2-t3', source: 't2', target: 't3' },
        { id: 'e-t3-t4', source: 't3', target: 't4' },
        { id: 'e-t4-t5_true', source: 't4', target: 't5_true', sourceHandle: 'true' },
        { id: 'e-t5_true-t6_true', source: 't5_true', target: 't6_true' },
        { id: 'e-t6_true-t7_true', source: 't6_true', target: 't7_true' },
        { id: 'e-t4-t5_false', source: 't4', target: 't5_false', sourceHandle: 'false' },
        { id: 'e-t5_false-t6_false', source: 't5_false', target: 't6_false' },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
      setAspectRatio('16:9');
      addLog('Đã nạp mẫu: Prompt sang Video (Có rẽ nhánh Logic).', 'success');
      
    } else if (templateType === 'doc') {
      // Mẫu Tài Liệu: Chuyên sâu cho E-Learning / Giới thiệu sản phẩm
      const templateNodes: Node[] = [
        { id: 'd1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Theo dõi Thư mục', status: 'idle', subtype: 'watchFolder' } },
        { id: 'd2', type: 'docInput', position: { x: 260, y: 150 }, data: { label: 'Phân tích PDF/Word', status: 'idle', value: docValue, subtype: 'upload' } },
        { id: 'd3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'Tóm Tắt AI', status: 'idle', subtype: 'summary' } },
        { id: 'd4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Tạo Slide Minh Họa', status: 'idle', subtype: 'brandKit' } },
        { id: 'd5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Giọng Đọc Chuyên Nghiệp', status: 'idle', subtype: 'tts' } },
        { id: 'd6', type: 'subtitle', position: { x: 950, y: 150 }, data: { label: 'Phụ đề Giảng Dạy', status: 'idle', subtype: 'timeline' } },
        { id: 'd7', type: 'renderNode', position: { x: 1200, y: 150 }, data: { label: 'Xuất Video E-Learning', status: 'idle', subtype: 'mp4' } },
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
      setAspectRatio('16:9');
      addLog('Đã nạp mẫu: Tài liệu PDF/Word sang Video bài giảng.', 'success');
      
    } else if (templateType === 'blog') {
      // Mẫu Social: Video dọc cho TikTok / Shorts với Hashtag tự động và Đăng mạng xã hội
      const templateNodes: Node[] = [
        { id: 'b1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Lên Lịch (Hàng ngày)', status: 'idle', subtype: 'schedule' } },
        { id: 'b2', type: 'urlInput', position: { x: 260, y: 150 }, data: { label: 'Lấy tin tức từ Link', status: 'idle', value: urlValue, subtype: 'url' } },
        { id: 'b3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Viết Kịch Bản Trend', status: 'idle', subtype: 'expand' } },
        { id: 'b4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Lấy Video Nền (Stock)', status: 'idle', subtype: 'background' } },
        { id: 'b5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Giọng Đọc Nhanh (1.5x)', status: 'idle', subtype: 'tts' } },
        { id: 'b6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề Động (Karaoke)', status: 'idle', subtype: 'transition' } },
        { id: 'b7', type: 'codeNode', position: { x: 1140, y: 150 }, data: { label: 'Sinh Hashtag Tự Động', status: 'idle', subtype: 'js' } },
        { id: 'b8', type: 'renderNode', position: { x: 1360, y: 150 }, data: { label: 'Xuất Video Dọc', status: 'idle', subtype: 'social' } },
        { id: 'b9', type: 'publishNode', position: { x: 1580, y: 150 }, data: { label: 'Đăng TikTok/YouTube', status: 'idle', platform: 'TikTok' } },
      ];
      const templateEdges: Edge[] = [
        { id: 'e-b1-b2', source: 'b1', target: 'b2' },
        { id: 'e-b2-b3', source: 'b2', target: 'b3' },
        { id: 'e-b3-b4', source: 'b3', target: 'b4' },
        { id: 'e-b3-b5', source: 'b3', target: 'b5' },
        { id: 'e-b4-b6', source: 'b4', target: 'b6' },
        { id: 'e-b5-b6', source: 'b5', target: 'b6' },
        { id: 'e-b6-b7', source: 'b6', target: 'b7' },
        { id: 'e-b7-b8', source: 'b7', target: 'b8' },
        { id: 'e-b8-b9', source: 'b8', target: 'b9' },
      ];
      setNodes(templateNodes);
      setEdges(templateEdges);
      setAspectRatio('9:16');
      addLog('Đã nạp mẫu: Tự động hóa Video Social (TikTok/Shorts).', 'success');
    }

  }, [promptValue, docValue, urlValue, setNodes, setEdges]);

  // Load Prompt Template by default
  useEffect(() => {
    loadTemplate('prompt');
  }, []);

  // Fetch watch path and listen to SSE
  useEffect(() => {
    fetch('http://localhost:3000/watch/path')
      .then(res => res.json())
      .then(data => {
        if (data.path) setWatchPath(data.path);
      })
      .catch(err => console.error(err));

    const eventSource = new EventSource('http://localhost:3000/watch/events');
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'add') {
        addLog(`[Local Watch] Phát hiện file mới: ${data.name}`, 'info');
      } else if (data.type === 'remove') {
        addLog(`[Local Watch] File đã xóa: ${data.name}`, 'info');
      }
    };

    return () => eventSource.close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateWatchPath = async () => {
    try {
      const res = await fetch('http://localhost:3000/watch/path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: watchPath }),
      });
      const data = await res.json();
      if (data.success) {
        addLog(`Đã cập nhật thư mục Watch: ${data.path}`, 'success');
        setWatchPath(data.path);
      }
    } catch (err) {
      addLog('Lỗi khi cập nhật thư mục Watch', 'error');
    }
  };

  // Update nodes dynamic configurations in real-time
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.type === 'inputNode') return { ...node, data: { ...node.data, value: promptValue } };
        if (node.type === 'docInput') return { ...node, data: { ...node.data, value: docValue } };
        if (node.type === 'urlInput') return { ...node, data: { ...node.data, value: urlValue } };
        if (node.type === 'codeNode') return { ...node, data: { ...node.data, value: codeValue } };
        if (node.type === 'customAINode') return { ...node, data: { ...node.data, value: customAIPrompt } };
        if (node.type === 'aiNode') {
          return {
            ...node,
            data: {
              ...node.data,
              writerModel,
              aiTone,
              sceneCount
            }
          };
        }
        if (node.type === 'visualNode') {
          return {
            ...node,
            data: {
              ...node.data,
              imageStyle,
              previewImage: scenes.length > 0 ? scenes[0].image : undefined
            }
          };
        }
        if (node.type === 'audioTTS') {
          return {
            ...node,
            data: {
              ...node.data,
              ttsVoice,
              ttsSpeed
            }
          };
        }
        if (node.type === 'subtitle') {
          return {
            ...node,
            data: {
              ...node.data,
              subStyle,
              subColor
            }
          };
        }
        if (node.type === 'renderNode') {
          return {
            ...node,
            data: {
              ...node.data,
              aspectRatio,
              transitionSpeed,
              renderEngine: renderConfig.engine,
              renderCRF: renderConfig.crf
            }
          };
        }
        return node;
      })
    );
  }, [
    promptValue, docValue, urlValue, codeValue, customAIPrompt,
    writerModel, aiTone, sceneCount, imageStyle, scenes,
    ttsVoice, ttsSpeed, subStyle, subColor, aspectRatio,
    transitionSpeed, renderConfig.engine, renderConfig.crf, setNodes
  ]);



  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      addLog(`Đang tải lên tài nguyên: ${file.name}...`, 'info');
      const res = await fetch('http://localhost:3000/workspaces/demo-workspace/projects/demo-project/assets', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        addLog(`Tải lên thành công: ${file.name}`, 'success');
        // Lưu URL vào clipboard để tiện test trong Phase 2
        navigator.clipboard.writeText(data.assetUrl);
        addLog(`Đã sao chép URL vào clipboard: ${data.assetUrl}`, 'info');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      addLog(`Lỗi tải lên tài nguyên: ${file.name}`, 'error');
    }
  };

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
    setSelectedEdgeId(null);
  }, []);

  const addNodeDirectly = (type: string) => {
    pushUndo(nodes, edges);
    const typeLabels: Record<string, string> = {
      trigger: 'Kích Hoạt',
      inputNode: 'Đầu Vào Prompt',
      docInput: 'Tài Liệu',
      urlInput: 'Liên Kết Blog',
      aiNode: 'AI Script',
      visualNode: 'Visual Node',
      audioTTS: 'Lồng Tiếng AI',
      subtitle: 'Phụ Đề',
      codeNode: 'Lập Trình Code',
      customAINode: 'Thẻ AI Prompt',
      renderNode: 'Xuất Bản',
    };

    const id = (nodes.length + 1).toString();
    const position = {
      x: 350 + Math.random() * 80,
      y: 120 + Math.random() * 80,
    };

    const typeSubtypes: Record<string, string> = {
      trigger: 'manual',
      inputNode: 'prompt',
      docInput: 'upload',
      urlInput: 'url',
      aiNode: 'expand',
      visualNode: 'aiImage',
      audioTTS: 'tts',
      subtitle: 'timeline',
      renderNode: 'mp4',
    };

    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: typeLabels[type] || 'Node Mới',
        status: 'idle',
        subtype: typeSubtypes[type] || 'manual',
        value: type === 'inputNode' ? promptValue : type === 'docInput' ? docValue : type === 'urlInput' ? urlValue : type === 'codeNode' ? codeValue : type === 'customAINode' ? customAIPrompt : undefined
      },
    };

    setNodes((nds) => nds.concat(newNode));
    addLog(`Đã thêm Node ${typeLabels[type]} trực tiếp vào Canvas`, 'success');
    addHistory(`Thêm Node ${typeLabels[type]} vào Canvas`);
  };

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  const deleteSelectedEdge = useCallback(() => {
    if (!selectedEdgeId) return;
    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));
    addLog(`Đã xóa liên kết ${selectedEdgeId}`, 'warning');
    addHistory(`Xóa liên kết ${selectedEdgeId}`);
    setSelectedEdgeId(null);
  }, [selectedEdgeId, setEdges, addLog, addHistory]);


  // Drag and Drop nodes
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
        codeNode: 'Lập Trình Code',
        customAINode: 'Thẻ AI Prompt',
        renderNode: 'Xuất Bản',
      };

      const typeSubtypes: Record<string, string> = {
        trigger: 'manual',
        inputNode: 'prompt',
        docInput: 'upload',
        urlInput: 'url',
        aiNode: 'expand',
        visualNode: 'aiImage',
        audioTTS: 'tts',
        subtitle: 'timeline',
        renderNode: 'mp4',
      };

      const newNode: Node = {
        id: (nodes.length + 1).toString(),
        type,
        position,
        data: { 
          label: typeLabels[type] || 'Node Mới',
          status: 'idle',
          subtype: typeSubtypes[type] || 'manual',
          value: type === 'inputNode' ? promptValue : type === 'docInput' ? docValue : type === 'urlInput' ? urlValue : type === 'codeNode' ? codeValue : type === 'customAINode' ? customAIPrompt : undefined
        },
      };

      setNodes((nds) => nds.concat(newNode));
      addLog(`Đã thêm Node ${typeLabels[type]} vào Canvas`, 'success');
    },
    [nodes, promptValue, docValue, urlValue, codeValue, customAIPrompt, setNodes, addLog]
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
    setAgentLogs([]);
    setCurrentTime(0);
    setActiveTab('agents');
    addLog('Bắt đầu chạy luồng video theo Graph BFS Engine...', 'info');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Reset nodes and agents
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));
    setAgentStatuses({ writer: 'idle', director: 'idle', voice: 'idle' });
    await sleep(400);

    // AI Agents Introduction Dialogue
    setAgentStatuses({ writer: 'thinking', director: 'idle', voice: 'idle' });
    await sleep(800);
    addAgentLog('Biên Kịch Agent', `Xin chào, tôi là Biên Kịch. Định hướng của tôi: "${writerSystemPrompt}". Đang thiết lập kịch bản từ Prompt đầu vào: "${promptValue}"...`, '#a855f7');
    
    setAgentStatuses({ writer: 'idle', director: 'thinking', voice: 'idle' });
    await sleep(800);
    addAgentLog('Đạo Diễn Agent', `Chào Biên Kịch, tôi đã sẵn sàng. Định hướng hình ảnh: "${directorSystemPrompt}". Phong cách vẽ: "${imageStyle}".`, '#3b82f6');
    
    setAgentStatuses({ writer: 'idle', director: 'idle', voice: 'thinking' });
    await sleep(800);
    addAgentLog('Âm Thanh Agent', `Chào cuộc họp, tôi đã kết nối. Định hướng âm thanh: "${voiceSystemPrompt}". Sử dụng giọng: "${ttsVoice === 'nu-mien-bac' ? 'Vy Mai (Nữ Bắc)' : ttsVoice === 'nam-mien-bac' ? 'Nam An (Nam Bắc)' : ttsVoice === 'nu-mien-nam' ? 'Thảo Chi (Nữ Nam)' : 'Minh Hoàng (Nam Nam)'}".`, '#f97316');
    
    setAgentStatuses({ writer: 'idle', director: 'idle', voice: 'idle' });
    await sleep(400);

    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    let queue: string[] = triggerNodes.map(n => n.id);
    const visited = new Set<string>();
    
    let currentScenes = [...scenes];

    while (queue.length > 0) {
      const currentId = queue.shift();
      if (!currentId || visited.has(currentId)) continue;
      visited.add(currentId);

      const n = nodes.find(n => n.id === currentId);
      if (!n) continue;

      setNodes((nds) => nds.map((node) => node.id === currentId ? { ...node, data: { ...node.data, status: 'running' } } : node));

      let outputHandlesToFollow: string[] | null = null; // null means follow all

      // Simulate execution based on node type
      if (n.type === 'trigger') {
        addLog('Kích hoạt từ Trigger...', 'info');
        await sleep(1000);
      } else if (['inputNode', 'docInput', 'urlInput'].includes(n.type || '')) {
        addLog('Đang xử lý Input Data...', 'info');
        await sleep(1000);
      } else if (n.type === 'aiNode') {
        setAgentStatuses(s => ({ ...s, writer: 'thinking' }));
        addAgentLog('Biên Kịch Agent', `Đang phân tích dữ liệu đầu vào để phân tách các cảnh phim ngắn...`, '#a855f7');
        await sleep(1500);
        
        try {
          const res = await fetch('http://localhost:3000/providers/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: promptValue })
          });
          const result = await res.json();
          if (result.success && result.data) {
            currentScenes = result.data.map((item: any, idx: number) => ({
              id: idx + 1,
              title: `Cảnh ${idx + 1}`,
              image: item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
              text: item.text,
              duration: 5,
              fx: 'none',
            }));
            setScenes(currentScenes);
            setSceneCount(currentScenes.length);
            
            setAgentStatuses(s => ({ ...s, writer: 'active' }));
            addAgentLog('Biên Kịch Agent', `Đã phân tách xong ${currentScenes.length} phân cảnh cho video!`, '#a855f7');
            await sleep(800);
            
            // Post outline in chat
            const outline = currentScenes.map(sc => `- ${sc.title}: "${sc.text}"`).join('\n');
            addAgentLog('Biên Kịch Agent', `Dàn ý kịch bản:\n${outline}`, '#a855f7');
            await sleep(1000);
            
            addLog('AI Script tạo thành công', 'success');
          }
        } catch (e) {
           addLog('AI Script failed', 'error');
        }
        setAgentStatuses(s => ({ ...s, writer: 'success' }));
      } else if (n.type === 'visualNode') {
        setAgentStatuses(s => ({ ...s, director: 'thinking' }));
        addAgentLog('Đạo Diễn Agent', `Đang lên ý tưởng bối cảnh và tạo Prompt sinh ảnh AI cho ${currentScenes.length} cảnh...`, '#3b82f6');
        await sleep(1800);
        
        setAgentStatuses(s => ({ ...s, director: 'active' }));
        const visualSuggestions = currentScenes.map(sc => `- ${sc.title}: Góc máy Cinematic, bối cảnh khớp lời thoại. Prompt: "${sc.text}, photorealistic, 4k, ${imageStyle} style"`).join('\n');
        addAgentLog('Đạo Diễn Agent', `Đề xuất bối cảnh hình ảnh phong cách ${imageStyle}:\n${visualSuggestions}`, '#3b82f6');
        await sleep(1200);
        
        addLog('Xử lý Visual/Image Generation...', 'info');
        setAgentStatuses(s => ({ ...s, director: 'success' }));
      } else if (n.type === 'audioTTS') {
        setAgentStatuses(s => ({ ...s, voice: 'thinking' }));
        addAgentLog('Âm Thanh Agent', `Đang đo lường độ dài lời thoại và chuyển văn bản thành giọng nói AI...`, '#f97316');
        await sleep(1800);
        
        setAgentStatuses(s => ({ ...s, voice: 'active' }));
        const voiceDetails = currentScenes.map(sc => {
          const words = sc.text.split(' ').length;
          const duration = Math.max(3, Math.round(words * 0.3 / parseFloat(ttsSpeed)));
          return `- ${sc.title}: ${words} từ -> ${duration} giây (${ttsVoice === 'nu-mien-bac' ? 'Vy Mai - Bắc' : 'Nam An - Bắc'})`;
        }).join('\n');
        
        addAgentLog('Âm Thanh Agent', `Đã thiết lập giọng đọc và thời lượng thoại cho từng cảnh:\n${voiceDetails}`, '#f97316');
        await sleep(1200);
        
        addLog('Xử lý TTS Audio...', 'info');
        setAgentStatuses(s => ({ ...s, voice: 'success' }));
      } else if (n.type === 'subtitle') {
        setAgentStatuses(s => ({ ...s, writer: 'thinking' }));
        addAgentLog('Biên Kịch Agent', `Nhận thông tin thời lượng từ Âm Thanh. Đang lập dòng phụ đề kiểu "${subStyle}" với màu sắc "${subColor}"...`, '#a855f7');
        await sleep(1200);
        
        setAgentStatuses(s => ({ ...s, writer: 'success' }));
        addLog('Xử lý Phụ đề/Hiệu ứng...', 'info');
      } else if (n.type === 'renderNode') {
        setAgentStatuses({ writer: 'thinking', director: 'thinking', voice: 'thinking' });
        addAgentLog('Biên Kịch Agent', `Tất cả tài nguyên đã sẵn sàng! Đang chuyển tiếp sang Render Engine để ghép nối...`, '#a855f7');
        await sleep(1000);
        
        addLog('Bắt đầu Render FFmpeg...', 'info');
        await sleep(2000);
        addLog('Render thành công', 'success');
        
        setAgentStatuses({ writer: 'success', director: 'success', voice: 'success' });
        addAgentLog('Biên Kịch Agent', `Hội thoại kết thúc. Kịch bản phân cảnh đã được dựng thành video MP4 hoàn chỉnh!`, '#a855f7');
      } else if (n.type === 'logicNode') {
        const expression = n.data.expression || 'scenes.length > 2';
        let conditionMet = false;
        try {
           // eslint-disable-next-line
           const evalFunc = new Function('scenes', `return ${expression};`);
           conditionMet = evalFunc(currentScenes);
        } catch (e) {
           conditionMet = false;
        }
        addLog(`Logic Node: Evaluated ${expression} -> ${conditionMet}`, 'info');
        outputHandlesToFollow = conditionMet ? ['true'] : ['false'];
        await sleep(1000);
      } else if (n.type === 'publishNode') {
        addLog('Publish Node: Đang đẩy video lên ' + (n.data.platform || 'Mạng xã hội') + '...', 'info');
        await sleep(1500);
        addLog('Upload hoàn tất!', 'success');
      }

      setNodes((nds) => nds.map((node) => node.id === currentId ? { ...node, data: { ...node.data, status: 'success' } } : node));

      // Push outgoing targets
      const outgoingEdges = edges.filter(e => e.source === currentId);
      for (const e of outgoingEdges) {
         if (outputHandlesToFollow) {
            if (e.sourceHandle && outputHandlesToFollow.includes(e.sourceHandle)) {
               queue.push(e.target);
            }
         } else {
            queue.push(e.target);
         }
      }
    }

    setIsRunning(false);
    setWorkflowCompleted(true);
    setCurrentTime(0);
    setActiveTab('timeline');
    addLog('Luồng công việc Graph đã thực thi xong!', 'success');
  }, [nodes, scenes, promptValue, imageStyle, ttsVoice, ttsSpeed, subStyle, subColor, isRunning, addLog, addAgentLog, setNodes, renderConfig, aspectRatio, codeValue, customAIPrompt, customAIModel, setScenes, setSceneCount, writerModel, directorModel, writerSystemPrompt, directorSystemPrompt, voiceSystemPrompt]);

  const testNode = async () => {
    if (!selectedNode || isRunning) return;
    addLog(`Đang kiểm thử Node: ${selectedNode.data.label}...`, 'info');
    
    // Set to running
    setNodes(nds => nds.map(n => 
      n.id === selectedNode.id ? { ...n, data: { ...n.data, status: 'running', errorMsg: undefined } } : n
    ));
    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, status: 'running', errorMsg: undefined } } : null);
    
    // Simulate wait
    await new Promise(r => setTimeout(r, 1500));
    
    // Random fail (15% chance)
    const isFail = Math.random() < 0.15;
    if (isFail) {
      const errorMsg = 'Lỗi kết nối API hoặc thiếu tham số cấu hình. Hãy kiểm tra lại.';
      setNodes(nds => nds.map(n => 
        n.id === selectedNode.id ? { ...n, data: { ...n.data, status: 'error', errorMsg } } : n
      ));
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, status: 'error', errorMsg } } : null);
      addLog(`Kiểm thử thất bại: ${errorMsg}`, 'error');
    } else {
      setNodes(nds => nds.map(n => 
        n.id === selectedNode.id ? { ...n, data: { ...n.data, status: 'success' } } : n
      ));
      setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, status: 'success' } } : null);
      addLog('Kiểm thử Node thành công!', 'success');
    }
  };

  // Subtitle styling generator for preview screen (respects track visibility and mute)
  const getSubStyle = () => {
    if (!trackVisibility.subtitle || trackMutes.subtitle) {
      return { display: 'none' };
    }

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
${scenes.map(s => `[${s.title}] (${s.duration}s)\nLời bình: ${s.text}\nẢnh nguồn: ${s.image}\nHiệu ứng FX: ${s.fx}\n`).join('\n')}`;

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

  // Render CapCut Time Ruler Ticks
  const renderRulerTicks = () => {
    const ticks = [];
    const step = 2; // numbers every 2 seconds
    for (let i = 0; i <= totalDuration; i++) {
      ticks.push(
        <div key={i} className="time-ruler-mark" style={{ left: `${i * timelineScale}px` }}>
          {i % step === 0 && <span className="time-ruler-label">{i}s</span>}
          {i % step !== 0 && <div className="time-ruler-submark" />}
        </div>
      );
    }
    return ticks;
  };

  const adjustSceneDuration = (idx: number, delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setScenes(prev => {
      const next = prev.map((s, i) => {
        if (i === idx) {
          const nextDur = Math.max(1, Math.min(15, s.duration + delta));
          return { ...s, duration: nextDur };
        }
        return s;
      });
      return next;
    });
    const newDur = Math.max(1, Math.min(15, scenes[idx].duration + delta));
    addLog(`Đã điều chỉnh thời lượng Cảnh ${idx + 1} thành ${newDur}s.`, 'info');
    addHistory(`Tỉa Cảnh ${idx + 1} thành ${newDur} giây`);
  };

  // Build Track Blocks dynamically
  const buildTrackBlocks = (trackType: 'visual' | 'audio' | 'subtitle' | 'fx') => {
    let currentOffset = 0;
    return scenes.slice(0, sceneCount).map((scene, idx) => {
      const startOffset = currentOffset;
      currentOffset += scene.duration;
      const isActive = activeSceneIndex === idx;

      const blockStyle = { 
        left: `${startOffset * timelineScale}px`, 
        width: `${scene.duration * timelineScale}px` 
      };

      if (trackType === 'visual') {
        if (!trackVisibility.visual) return null;
        return (
          <div 
            key={scene.id} 
            className={`track-block track-block-visual ${isActive ? 'active' : ''}`}
            style={blockStyle}
            draggable={!trackLocks.visual}
            onDragStart={() => handleSceneDragStart(idx)}
            onDragOver={handleSceneDragOver}
            onDrop={() => handleSceneDrop(idx)}
            onClick={() => setCurrentTime(startOffset + 0.1)}
          >
            <img src={scene.image} alt={scene.title} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '32px' }}>{scene.title}</span>
            <div className="trim-controls">
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, -1, e)} title="Giảm 1s">-</button>
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, 1, e)} title="Tăng 1s">+</button>
            </div>
          </div>
        );
      } else if (trackType === 'audio') {
        return (
          <div 
            key={scene.id} 
            className={`track-block track-block-audio ${isActive ? 'active' : ''}`}
            style={{ ...blockStyle, opacity: trackMutes.audio ? 0.35 : 1 }}
            onClick={() => setCurrentTime(startOffset + 0.1)}
          >
            <Volume2 size={12} style={{ marginRight: '6px', minWidth: '12px' }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
              {trackMutes.audio ? '[Tắt tiếng]' : `TTS - ${ttsVoice === 'nu-mien-bac' ? 'Nữ Bắc' : 'Nam Nam'}`}
              {!trackMutes.audio && scene.audioUrl && (
                <button 
                  onClick={(e) => { e.stopPropagation(); new Audio(scene.audioUrl!).play(); }} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', padding: '0 4px', marginLeft: '4px' }}
                  title="Nghe thử"
                >
                  <Play size={12} fill="currentColor" />
                </button>
              )}
            </span>
            <div className="waveform-visual" />
            <div className="trim-controls">
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, -1, e)} title="Giảm 1s">-</button>
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, 1, e)} title="Tăng 1s">+</button>
            </div>
          </div>
        );
      } else if (trackType === 'subtitle') {
        if (!trackVisibility.subtitle) return null;
        return (
          <div 
            key={scene.id} 
            className={`track-block track-block-subtitle ${isActive ? 'active' : ''}`}
            style={blockStyle}
            onClick={() => setCurrentTime(startOffset + 0.1)}
          >
            <Type size={12} style={{ marginRight: '6px', minWidth: '12px' }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '32px' }}>{scene.text}</span>
            <div className="subtitle-outline-visual" />
            <div className="trim-controls">
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, -1, e)} title="Giảm 1s">-</button>
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, 1, e)} title="Tăng 1s">+</button>
            </div>
          </div>
        );
      } else { // FX track
        if (!trackVisibility.fx) return null;
        const fxLabels: Record<string, string> = {
          none: 'Không FX',
          cinematic: 'Cinematic Glow',
          vintage: 'Vintage Sepia',
          noir: 'Noir Noir',
          glitch: 'Glitch Art',
          blur: 'Soft Blur',
        };
        const hasFx = scene.fx !== 'none';
        
        return (
          <div 
            key={scene.id} 
            className={`track-block track-block-fx ${isActive ? 'active' : ''}`}
            style={{ 
              ...blockStyle, 
              opacity: hasFx ? 1 : 0.25, 
              background: hasFx ? undefined : '#2e2d3b', 
              borderStyle: hasFx ? 'solid' : 'dashed'
            }}
            onClick={() => setCurrentTime(startOffset + 0.1)}
          >
            <Zap size={12} style={{ marginRight: '6px', minWidth: '12px', color: hasFx ? '#f472b6' : 'inherit' }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '32px' }}>
              {hasFx ? fxLabels[scene.fx] : 'Chưa áp FX'}
            </span>
            <div className="trim-controls">
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, -1, e)} title="Giảm 1s">-</button>
              <button className="trim-btn" onClick={(e) => adjustSceneDuration(idx, 1, e)} title="Tăng 1s">+</button>
            </div>
          </div>
        );
      }
    });
  };


  // Kdenlive Track Controls Left Panel Generator
  const renderTrackControlsLeft = (trackType: 'visual' | 'fx' | 'audio' | 'subtitle') => {
    const isLocked = trackLocks[trackType];
    const isMuted = trackType === 'audio' || trackType === 'subtitle' ? trackMutes[trackType as 'audio' | 'subtitle'] : false;
    const isVisible = trackType !== 'audio' ? trackVisibility[trackType as 'visual' | 'fx' | 'subtitle'] : true;

    const toggleLock = (e: React.MouseEvent) => {
      e.stopPropagation();
      setTrackLocks(prev => {
        const next = { ...prev, [trackType]: !prev[trackType] };
        addLog(`Đã ${next[trackType] ? 'Khóa' : 'Mở khóa'} luồng ${trackType.toUpperCase()}`, 'info');
        return next;
      });
    };

    const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (trackType !== 'audio' && trackType !== 'subtitle') return;
      setTrackMutes(prev => {
        const next = { ...prev, [trackType]: !prev[trackType as 'audio' | 'subtitle'] };
        addLog(`Đã ${next[trackType as 'audio' | 'subtitle'] ? 'Tắt tiếng' : 'Bật tiếng'} luồng ${trackType.toUpperCase()}`, 'info');
        return next;
      });
    };

    const toggleVisibility = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (trackType === 'audio') return;
      setTrackVisibility(prev => {
        const next = { ...prev, [trackType]: !prev[trackType as 'visual' | 'fx' | 'subtitle'] };
        addLog(`Đã ${next[trackType as 'visual' | 'fx' | 'subtitle'] ? 'Hiển thị' : 'Ẩn'} luồng ${trackType.toUpperCase()}`, 'info');
        return next;
      });
    };

    const labelsMap = {
      visual: 'V1 Visual',
      fx: 'V2 FX',
      audio: 'A1 Voice',
      subtitle: 'S1 Subs'
    };

    return (
      <div className={`timeline-track-label track-${trackType}`}>
        <span style={{ flex: 1, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', fontWeight: 600 }}>
          {labelsMap[trackType]}
        </span>

        <div style={{ display: 'flex', gap: '4px' }}>
          {/* Lock Button */}
          <button className={`track-action-btn ${isLocked ? 'active' : ''}`} onClick={toggleLock}>
            {isLocked ? <Lock size={10} style={{ color: 'var(--primary)' }} /> : <Unlock size={10} />}
          </button>
          
          {/* Visibility / Eye Button */}
          {trackType !== 'audio' && (
            <button className={`track-action-btn ${!isVisible ? 'active' : ''}`} onClick={toggleVisibility}>
              {isVisible ? <Eye size={10} /> : <EyeOff size={10} style={{ color: 'var(--error)' }} />}
            </button>
          )}

          {/* Mute Button */}
          {(trackType === 'audio' || trackType === 'subtitle') && (
            <button className={`track-action-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
              {isMuted ? <VolumeX size={10} style={{ color: 'var(--error)' }} /> : <Volume2 size={10} />}
            </button>
          )}
        </div>
      </div>
    );
  };

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

        {/* Project Selector Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid var(--border-dark)', paddingLeft: '16px', marginLeft: '16px', marginRight: 'auto' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>Dự án:</span>
          <select 
            className="form-select" 
            style={{ width: '200px', height: '32px', padding: '0 8px', fontSize: '12px', margin: 0, backgroundColor: editorMode === 'kdenlive' ? '#1a1924' : '#fff', color: editorMode === 'kdenlive' ? '#fff' : 'inherit', borderColor: editorMode === 'kdenlive' ? '#3d3b4f' : 'var(--border-dark)' }}
            value={activeProjectId} 
            onChange={(e) => switchProject(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button 
            className="btn" 
            style={{ padding: '6px 10px', fontSize: '11px', height: '32px' }}
            onClick={createNewProject}
            title="Tạo dự án mới"
          >
            + Mới
          </button>
          <button 
            className="btn" 
            style={{ padding: '6px 10px', fontSize: '11px', height: '32px', color: 'var(--error)' }}
            onClick={() => deleteProject(activeProjectId)}
            disabled={projects.length <= 1}
            title="Xóa dự án hiện tại"
          >
            <Trash2 size={12} />
          </button>
        </div>

        <div className="mode-toggle-group" style={{ marginRight: '16px' }}>
          <button 
            className={`mode-toggle-btn ${editorMode === 'workflow' ? 'active' : ''}`} 
            onClick={() => setEditorMode('workflow')}
          >
            Workflow (n8n)
          </button>
          <button 
            className={`mode-toggle-btn ${editorMode === 'kdenlive' ? 'active' : ''}`} 
            onClick={() => setEditorMode('kdenlive')}
          >
            Dựng Phim (Shotcut)
          </button>
          <button 
            className={`mode-toggle-btn ${editorMode === 'tools' ? 'active' : ''}`} 
            onClick={() => setEditorMode('tools')}
          >
            Bảng điều khiển Tools
          </button>
          <button 
            className={`mode-toggle-btn ${editorMode === 'agent-flow' ? 'active' : ''}`} 
            onClick={() => setEditorMode('agent-flow')}
          >
            Điều phối Agent AI
          </button>
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

          <button 
            className="btn" 
            onClick={() => setIsSidebarSwapped(!isSidebarSwapped)}
            title="Hoán đổi vị trí thanh bên (Trái <=> Phải)"
          >
            <Columns size={15} />
            Đổi bên
          </button>
        </div>
      </div>

      {/* Main Workspace (conditional rendering based on editorMode) */}
      {editorMode === 'workflow' ? (
        <div className="workspace-container">
          {/* Slim Sidebar Menu */}
          <div className="slim-sidebar">
            <div className="slim-icon active" title="Mẫu Thiết Kế"><Grid size={20} /></div>
            <div className="slim-icon" title="Thư viện Media"><Layers size={20} /></div>
            <div className="slim-icon" style={{ marginTop: 'auto' }}><HelpCircle size={20} /></div>
          </div>
          
          <div className="sidebar-left" style={{ width: `${leftSidebarWidth}px`, order: isSidebarSwapped ? 6 : 2 }}>
            <div className="sidebar-header">
              Mẫu Video Nhanh (Templates)
            </div>
            <div style={{ padding: '8px 16px 4px 16px', display: 'flex', gap: '8px', flexDirection: 'column' }}>
              <button 
                className={`btn ${activeTemplate === 'prompt' ? 'btn-primary' : ''}`} 
                style={{ 
                  fontSize: '12px', 
                  justifyContent: 'flex-start', 
                  background: activeTemplate === 'prompt' ? undefined : 'var(--bg-app)', 
                  border: activeTemplate === 'prompt' ? 'none' : '1px solid var(--border)',
                  color: activeTemplate === 'prompt' ? 'white' : 'var(--text-primary)'
                }} 
                onClick={() => loadTemplate('prompt')}
              >
                ✨ Mẫu Tự động (Prompt)
              </button>
              <button 
                className={`btn ${activeTemplate === 'doc' ? 'btn-primary' : ''}`} 
                style={{ 
                  fontSize: '12px', 
                  justifyContent: 'flex-start', 
                  background: activeTemplate === 'doc' ? undefined : 'var(--bg-app)', 
                  border: activeTemplate === 'doc' ? 'none' : '1px solid var(--border)',
                  color: activeTemplate === 'doc' ? 'white' : 'var(--text-primary)'
                }} 
                onClick={() => loadTemplate('doc')}
              >
                📄 Mẫu Tài liệu (Upload)
              </button>
              <button 
                className={`btn ${activeTemplate === 'blog' ? 'btn-primary' : ''}`} 
                style={{ 
                  fontSize: '12px', 
                  justifyContent: 'flex-start', 
                  background: activeTemplate === 'blog' ? undefined : 'var(--bg-app)', 
                  border: activeTemplate === 'blog' ? 'none' : '1px solid var(--border)',
                  color: activeTemplate === 'blog' ? 'white' : 'var(--text-primary)'
                }} 
                onClick={() => loadTemplate('blog')}
              >
                📱 Mẫu Social (Shorts/TikTok)
              </button>
              <button className="btn" style={{ fontSize: '12px', justifyContent: 'center', background: 'var(--accent)', color: 'white', border: 'none', marginTop: '4px' }} onClick={() => alert('Đang kết nối thư viện Cộng đồng (Marketplace)... Tính năng sẽ có trong bản cập nhật tới!')}>🌍 Chợ Template (Marketplace)</button>
            </div>

            {/* Bảng cấu hình nhanh No-code */}
            <div style={{ 
              margin: '8px 16px', 
              padding: '12px', 
              borderRadius: '8px', 
              background: '#f8fafc', 
              border: '1px solid var(--border-dark)', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '10px' 
            }}>
              <h4 style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
                ⚙️ Cấu hình nhanh
              </h4>
              {activeTemplate === 'prompt' && (
                <>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Ý tưởng video (Prompt):</label>
                    <textarea 
                      className="form-textarea" 
                      rows={3} 
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                      value={promptValue} 
                      onChange={(e) => setPromptValue(e.target.value)} 
                      placeholder="Nhập ý tưởng video của bạn..."
                    />
                  </div>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Giọng điệu kịch bản:</label>
                    <select 
                      className="form-select" 
                      style={{ fontSize: '12px', padding: '4px 8px', height: '30px' }}
                      value={aiTone} 
                      onChange={(e) => setAiTone(e.target.value)}
                    >
                      <option value="truyen-cam">Truyền cảm, sâu lắng</option>
                      <option value="hai-huoc">Hài hước, dí dỏm</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Tỷ lệ khung hình:</label>
                    <select 
                      className="form-select" 
                      style={{ fontSize: '12px', padding: '4px 8px', height: '30px' }}
                      value={aspectRatio} 
                      onChange={(e) => setAspectRatio(e.target.value)}
                    >
                      <option value="16:9">Ngang (16:9) - YouTube</option>
                      <option value="9:16">Dọc (9:16) - TikTok / Shorts</option>
                      <option value="1:1">Vuông (1:1) - FB Feed</option>
                    </select>
                  </div>
                </>
              )}

              {activeTemplate === 'doc' && (
                <>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Tên file đính kèm:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                      value={docValue} 
                      onChange={(e) => setDocValue(e.target.value)}
                      placeholder="VD: kich_ban.txt"
                    />
                    <label className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', padding: '6px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, background: 'var(--primary)', color: 'white', marginTop: '4px' }}>
                      <Upload size={12} style={{ marginRight: '4px' }} /> Chọn tệp tóm tắt (.txt/.pdf)
                      <input type="file" style={{ display: 'none' }} onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocValue(file.name);
                          addLog(`Đã đính kèm tệp tài liệu: ${file.name}`, 'info');
                        }
                      }} />
                    </label>
                  </div>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Giọng điệu kịch bản:</label>
                    <select 
                      className="form-select" 
                      style={{ fontSize: '12px', padding: '4px 8px', height: '30px' }}
                      value={aiTone} 
                      onChange={(e) => setAiTone(e.target.value)}
                    >
                      <option value="truyen-cam">Nghị luận thuyết phục</option>
                      <option value="hai-huoc">Kể chuyện vui vẻ</option>
                    </select>
                  </div>
                </>
              )}

              {activeTemplate === 'blog' && (
                <>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Liên kết bài viết (Blog URL):</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '12px', padding: '6px 8px' }}
                      value={urlValue} 
                      onChange={(e) => setUrlValue(e.target.value)}
                      placeholder="https://example.com/tin-tuc"
                    />
                  </div>
                  <div className="form-group" style={{ gap: '4px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 500 }}>Chọn giọng đọc lồng tiếng:</label>
                    <select 
                      className="form-select" 
                      style={{ fontSize: '12px', padding: '4px 8px', height: '30px' }}
                      value={ttsVoice} 
                      onChange={(e) => setTtsVoice(e.target.value)}
                    >
                      <option value="nu-mien-bac">Vy Mai (Nữ miền Bắc)</option>
                      <option value="nam-mien-nam">Minh Hoàng (Nam miền Nam)</option>
                    </select>
                  </div>
                </>
              )}

              <button 
                className="btn btn-primary" 
                style={{ 
                  marginTop: '6px', 
                  justifyContent: 'center', 
                  fontSize: '12px', 
                  fontWeight: 600, 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                  color: 'white', 
                  border: 'none', 
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                  padding: '8px'
                }} 
                onClick={runWorkflow}
                disabled={isRunning}
              >
                <Play size={12} fill="white" />
                {isRunning ? 'Đang chạy...' : 'Chạy Nhanh (Quick Run)'}
              </button>
            </div>
            <div className="sidebar-header" style={{ marginTop: '8px' }}>
              Nút Quy trình
            </div>
            <div className="sidebar-subtitle">
              Nodes Palette
            </div>
            
            <div style={{ padding: '0 16px 12px 16px' }}>
              <label className="btn-primary" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', padding: '8px', borderRadius: '8px', fontSize: '13px' }}>
                <Upload size={14} style={{ marginRight: '6px' }} /> Tải lên Tài nguyên
                <input type="file" style={{ display: 'none' }} onChange={handleFileUpload} />
              </label>
            </div>
            
            <div style={{ padding: '0 16px 12px 16px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', display: 'block' }}>Thư mục Local Watch</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  style={{ fontSize: '11px', padding: '4px 8px', flex: 1 }} 
                  value={watchPath}
                  onChange={(e) => setWatchPath(e.target.value)}
                  placeholder="C:/Users/Admin/Assets"
                />
                <button className="btn" style={{ padding: '4px 8px', fontSize: '11px' }} onClick={handleUpdateWatchPath}>Lưu</button>
              </div>
            </div>
            
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              <div className="palette-category">
                <Plus size={14} /> Lập lịch
              </div>
              <div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'trigger')}>
                  <div className="node-icon-wrapper color-trigger"><Play size={14} fill="white" /></div>
                  <div><div className="node-palette-name">Trigger</div><div className="node-palette-desc">Kích hoạt luồng</div></div>
                </div>
              </div>

              <div className="palette-category">
                <FileText size={14} /> Nhập liệu
              </div>
              <div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'docInput')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: '#10b981' }}><FileText size={14} /></div>
                  <div><div className="node-palette-name">Tài Liệu</div><div className="node-palette-desc">Nhận tệp văn bản</div></div>
                </div>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'urlInput')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: '#3b82f6' }}><Globe size={14} /></div>
                  <div><div className="node-palette-name">Liên Kết Blog</div><div className="node-palette-desc">Nhập địa chỉ URL</div></div>
                </div>
              </div>

              <div className="palette-category" style={{ backgroundColor: 'var(--bg-app)' }}>
                <Cpu size={14} /> Xử lý
              </div>
              <div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'aiNode')}>
                  <div className="node-icon-wrapper color-ai"><Cpu size={14} /></div>
                  <div><div className="node-palette-name">AI Script</div><div className="node-palette-desc">Biên tập kịch bản</div></div>
                </div>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'visualNode')}>
                  <div className="node-icon-wrapper color-visual"><ImageIcon size={14} /></div>
                  <div><div className="node-palette-name">Visual Node</div><div className="node-palette-desc">Sinh hình ảnh AI</div></div>
                </div>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'audioTTS')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: '#8b5cf6' }}><Volume2 size={14} /></div>
                  <div><div className="node-palette-name">Lồng Tiếng AI</div><div className="node-palette-desc">TTS đa giọng đọc</div></div>
                </div>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'subtitle')}>
                  <div className="node-icon-wrapper color-subtitle"><Type size={14} /></div>
                  <div><div className="node-palette-name">Phụ Đề</div><div className="node-palette-desc">Tạo text trên video</div></div>
                </div>
              </div>

              <div className="palette-category">
                <GitBranch size={14} /> Điều Hướng & Biểu Thức
              </div>
              <div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'logicNode')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: 'var(--accent)' }}><GitBranch size={14} /></div>
                  <div><div className="node-palette-name">Logic / If Else</div><div className="node-palette-desc">Rẽ nhánh luồng</div></div>
                </div>
              </div>

              <div className="palette-category">
                <Code size={14} /> Tiện ích
              </div>
              <div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'codeNode')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: '#097969' }}><Code size={14} /></div>
                  <div><div className="node-palette-name">Lập Trình Code</div><div className="node-palette-desc">Nhúng mã JS xử lý</div></div>
                </div>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'customAINode')}>
                  <div className="node-icon-wrapper" style={{ backgroundColor: '#df6330' }}><Cpu size={14} /></div>
                  <div><div className="node-palette-name">Thẻ AI Prompt</div><div className="node-palette-desc">Nhúng AI prompt tùy chọn</div></div>
                </div>
              </div>

              <div className="palette-category">
                <Film size={14} /> Xuất bản
              </div>
              <div className="palette-category"><GitBranch size={14} /> �i?u Hu?ng</div><div className="node-list" style={{ paddingTop: '8px', paddingBottom: '12px' }}><div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'logicNode')}><div className="node-icon-wrapper" style={{ backgroundColor: 'var(--accent)' }}><GitBranch size={14} /></div><div><div className="node-palette-name">Logic Node</div><div className="node-palette-desc">R? nh�nh lu?ng</div></div></div></div><div className="palette-category"><Film size={14} /> Xu?t & Publish</div><div className="node-list" style={{ paddingTop: '8px', paddingBottom: '24px' }}>
                <div className="node-palette-item" draggable onDragStart={(e) => onDragStart(e, 'renderNode')}>
                  <div className="node-icon-wrapper color-render"><Film size={14} /></div>
                  <div><div className="node-palette-name">Xuất Bản</div><div className="node-palette-desc">Xuất video MP4</div></div>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="sidebar-resizer" 
            onMouseDown={startResizingLeft}
            style={{
              order: isSidebarSwapped ? 5 : 3,
              borderLeft: isSidebarSwapped ? 'none' : '1px solid var(--border-dark)',
              borderRight: isSidebarSwapped ? '1px solid var(--border-dark)' : 'none',
            }}
          />

          {/* Center Canvas */}
          <div 
            className="canvas-wrapper"
            style={{ borderRadius: '16px', margin: '8px 0', border: '1px solid var(--border-dark)', overflow: 'hidden', flex: 1, order: 4, marginBottom: `${bottomPanelHeight + 8}px` }}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <div style={{ position: 'absolute', top: '16px', left: '20px', zIndex: 10 }}>
              <h2 style={{ fontSize: '18px', margin: 0 }}>Vùng thiết kế</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Powered by React-Flow style graphs</p>
            </div>
            {/* Canvas floating toolbar */}
            <div className="canvas-toolbar">
              <button className="canvas-toolbar-btn" onClick={handleUndo} title="Hoàn tác (Undo)">
                <RotateCcw size={14} />
                Hoàn tác
              </button>
              
              <button className="canvas-toolbar-btn" onClick={loadCanvasTemplate} title="Mở sơ đồ (JSON)">
                <Upload size={14} style={{ transform: 'none' }} />
                Mở sơ đồ
              </button>

              <button className="canvas-toolbar-btn" onClick={saveCanvasTemplate} title="Lưu sơ đồ thiết kế về máy (JSON)">
                <Download size={14} />
                Lưu mẫu sơ đồ
              </button>

              <div style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-dark)', margin: '0 4px' }} />

              <div style={{ position: 'relative' }}>
                <button 
                  className="canvas-toolbar-btn" 
                  onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                >
                  <Plus size={14} />
                  + Thêm Node Nhanh
                </button>
                {isAddDropdownOpen && (
                  <div className="quick-add-menu">
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('trigger'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#10b981' }}><Play size={10} /></div>
                      Kích Hoạt
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('inputNode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#3b82f6' }}><Zap size={10} /></div>
                      Đầu Vào Prompt
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('docInput'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#ec4899' }}><FileText size={10} /></div>
                      Tài Liệu
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('urlInput'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#14b8a6' }}><Globe size={10} /></div>
                      Liên Kết Blog
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('aiNode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#a855f7' }}><Cpu size={10} /></div>
                      AI Script
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('visualNode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#f59e0b' }}><ImageIcon size={10} /></div>
                      Visual Node
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('audioTTS'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#8b5cf6' }}><Volume2 size={10} /></div>
                      Lồng Tiếng AI
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('subtitle'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#f43f5e' }}><Type size={10} /></div>
                      Phụ Đề
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('codeNode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#097969' }}><Code size={10} /></div>
                      Lập Trình Code
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('customAINode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#df6330' }}><Cpu size={10} /></div>
                      Thẻ AI Prompt
                    </button>
                    <button className="quick-add-item" onClick={() => { addNodeDirectly('renderNode'); setIsAddDropdownOpen(false); }}>
                      <div className="quick-add-icon" style={{ backgroundColor: '#d946ef' }}><Film size={10} /></div>
                      Xuất Bản
                    </button>
                  </div>
                )}
              </div>

              <button className="canvas-toolbar-btn btn-save" onClick={saveWorkflowManual}>
                <Save size={14} />
                Lưu Workflow
              </button>

              {selectedEdgeId && (
                <button className="canvas-toolbar-btn btn-delete" onClick={deleteSelectedEdge}>
                  <Trash2 size={14} />
                  Xóa liên kết
                </button>
              )}
            </div>

            <ReactFlow
              nodes={nodes}
              edges={activeEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              onEdgeClick={onEdgeClick}
              onPaneClick={onPaneClick}
              fitView
            >
              <Background color="#ccc" gap={16} />
            </ReactFlow>
          </div>

          {/* Right Sidebar - Inspector */}
                    <div 
            className="sidebar-resizer" 
            onMouseDown={startResizingRight}
            style={{
              order: isSidebarSwapped ? 3 : 5,
              borderLeft: isSidebarSwapped ? '1px solid var(--border-dark)' : 'none',
              borderRight: isSidebarSwapped ? 'none' : '1px solid var(--border-dark)',
            }}
          />
          <div className="sidebar-right" style={{ width: `${rightSidebarWidth}px`, order: isSidebarSwapped ? 2 : 6 }}>
            <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Bảng điều khiển</span>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <select 
                  style={{ border: '1px solid var(--border)', borderRadius: '4px', padding: '2px 4px', fontSize: '11px', outline: 'none' }}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'vi' | 'en')}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
                <button 
                  onClick={() => setSelectedNode(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '14px' }}
                  title="Đóng bảng"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Cấu hình Project Selector bên thanh phải */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-dark)', backgroundColor: 'var(--bg-app)' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Save size={14} style={{ color: '#10b981' }} /> Lưu trữ Dự án
              </label>
              <select 
                className="form-select" 
                style={{ width: '100%', height: '36px', padding: '0 12px', fontSize: '13px' }}
                value={activeProjectId} 
                onChange={(e) => switchProject(e.target.value)}
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button className="btn" style={{ flex: 1, fontSize: '12px', height: '32px' }} onClick={createNewProject}>+ Mới</button>
                <button className="btn" style={{ flex: 1, fontSize: '12px', height: '32px', color: 'var(--error)' }} onClick={() => deleteProject(activeProjectId)} disabled={projects.length <= 1}>Xóa</button>
              </div>
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

                <div className="form-group" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '12px' }}>
                  <label className="form-label">Tên Node:</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={String(selectedNode.data.label)} 
                    onChange={(e) => {
                      const newLabel = e.target.value;
                      setNodes(nds => nds.map(n => {
                        if (n.id === selectedNode.id) {
                          return {
                            ...n,
                            data: {
                              ...n.data,
                              label: newLabel
                            }
                          };
                        }
                        return n;
                      }));
                      setSelectedNode(prev => prev ? {
                        ...prev,
                        data: {
                          ...prev.data,
                          label: newLabel
                        }
                      } : null);
                    }}
                  />
                </div>

                {['trigger', 'inputNode', 'docInput', 'urlInput', 'aiNode', 'visualNode', 'audioTTS', 'subtitle', 'renderNode'].includes(selectedNode.type || '') && (
                  <div className="form-group" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '12px' }}>
                    <label className="form-label">Chức năng con (Sub-type):</label>
                    <select 
                      className="form-select"
                      value={(selectedNode.data.subtype as string) || ''}
                      onChange={(e) => {
                        const newSubtype = e.target.value;
                        setNodes(nds => nds.map(n => {
                          if (n.id === selectedNode.id) {
                            return { ...n, data: { ...n.data, subtype: newSubtype } };
                          }
                          return n;
                        }));
                        setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, subtype: newSubtype } } : null);
                      }}
                    >
                      {selectedNode.type === 'trigger' && (
                        <>
                          <option value="manual">Chạy Thủ Công</option>
                          <option value="schedule">Lên Lịch (Schedule)</option>
                          <option value="webhook">Webhook URL</option>
                          <option value="watchFolder">Theo Dõi Thư Mục</option>
                          <option value="csvImport">Nhập CSV / Sheet</option>
                        </>
                      )}
                      {['inputNode', 'docInput', 'urlInput'].includes(selectedNode.type || '') && (
                        <>
                          <option value="prompt">Text Prompt</option>
                          <option value="url">URL Bài Viết / Blog</option>
                          <option value="product">Dữ Liệu Sản Phẩm</option>
                          <option value="upload">Tải Lên Media</option>
                          <option value="stock">Thư Viện Stock</option>
                        </>
                      )}
                      {selectedNode.type === 'aiNode' && (
                        <>
                          <option value="outline">Tạo Outline Kịch Bản</option>
                          <option value="hook3s">Tạo Hook 3 Giây Đầu</option>
                          <option value="expand">Phát Triển Kịch Bản</option>
                          <option value="split">Phân Tách Cảnh</option>
                          <option value="caption">Tạo Caption / Phụ Đề</option>
                          <option value="translate">Dịch / Bản Địa Hóa</option>
                        </>
                      )}
                      {selectedNode.type === 'visualNode' && (
                        <>
                          <option value="aiImage">Sinh Ảnh Minh Họa AI</option>
                          <option value="stockSearch">Tìm Kiếm Stock Media</option>
                          <option value="planner">Phân Cảnh Hình Ảnh</option>
                          <option value="background">Tạo Ảnh Nền</option>
                          <option value="avatar">Nhân Vật AI (Avatar)</option>
                          <option value="brandKit">Bộ Thương Hiệu (Brand)</option>
                        </>
                      )}
                      {selectedNode.type === 'audioTTS' && (
                        <>
                          <option value="tts">Text-to-Speech</option>
                          <option value="clone">Nhái Giọng (Voice Clone)</option>
                          <option value="bgMusic">Nhạc Nền (BG Music)</option>
                          <option value="sfx">Hiệu Ứng Âm Thanh</option>
                          <option value="normalization">Chuẩn Hóa Âm Thanh</option>
                        </>
                      )}
                      {selectedNode.type === 'subtitle' && (
                        <>
                          <option value="timeline">Dựng Timeline Video</option>
                          <option value="trim">Cắt Ghép (Trim / Cut)</option>
                          <option value="transition">Hiệu Ứng Chuyển Cảnh</option>
                          <option value="captionStyle">Kiểu Phụ Đề Chữ</option>
                          <option value="watermark">Watermark / Logo</option>
                          <option value="aspectRatio">Tỷ Lệ Khung Hình</option>
                          <option value="template">Áp Dụng Template</option>
                        </>
                      )}
                      {selectedNode.type === 'renderNode' && (
                        <>
                          <option value="preview">Render Preview</option>
                          <option value="full">Render Full Video</option>
                          <option value="mp4">Xuất Bản MP4</option>
                          <option value="upload">Tải Video Lên Mây</option>
                          <option value="social">Đăng Mạng Xã Hội</option>
                        </>
                      )}
                    </select>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: 'var(--text-muted)' }}>Chế độ nâng cao (Expression):</label>
                  <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                    <input 
                      type="checkbox" 
                      style={{ opacity: 0, width: 0, height: 0 }}
                      checked={!!selectedNode.data.advancedMode}
                      onChange={(e) => {
                        const isAdv = e.target.checked;
                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, advancedMode: isAdv } } : n));
                        setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, advancedMode: isAdv } } : null);
                      }}
                    />
                    <span className="slider round" style={{ 
                      position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                      backgroundColor: selectedNode.data.advancedMode ? '#a855f7' : '#ccc', borderRadius: '20px', transition: '.4s' 
                    }}>
                      <span style={{
                        position: 'absolute', content: '""', height: '16px', width: '16px', left: selectedNode.data.advancedMode ? '18px' : '2px',
                        bottom: '2px', backgroundColor: 'white', borderRadius: '50%', transition: '.4s'
                      }} />
                    </span>
                  </label>
                </div>

                {selectedNode.data.status === 'error' && (
                  <div style={{ background: '#fef2f2', border: '1px solid #f87171', borderRadius: '6px', padding: '12px', marginBottom: '16px' }}>
                    <p style={{ margin: 0, fontSize: '12px', color: '#b91c1c', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <AlertTriangle size={14} /> Node gặp sự cố
                    </p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#991b1b' }}>{(selectedNode.data.errorMsg as string) || 'Vui lòng kiểm tra lại cấu hình thông số của Node này.'}</p>
                  </div>
                )}

                {selectedNode.data.advancedMode ? (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ color: '#a855f7' }}>Advanced Expression (JS):</label>
                    <textarea 
                      className="form-textarea" 
                      rows={6}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', background: '#1e1e1e', color: '#d4d4d4', border: '1px solid #333' }}
                      value={(selectedNode.data.advancedExpression as string) || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setNodes(nds => nds.map(n => n.id === selectedNode.id ? { ...n, data: { ...n.data, advancedExpression: val } } : n));
                        setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, advancedExpression: val } } : null);
                      }}
                      placeholder="{{ $trigger.data.url }}"
                    />
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sử dụng {'{{ variable }}'} để trỏ đến dữ liệu động.</span>
                  </div>
                ) : (
                  <>
                    {/* Trigger Specific Inputs */}
                {selectedNode.type === 'trigger' && selectedNode.data.subtype === 'schedule' && (
                  <div className="form-group">
                    <label className="form-label">Lịch chạy (Cron timer):</label>
                    <input type="text" className="form-input" defaultValue="0 8 * * *" placeholder="0 8 * * *" />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mỗi ngày vào 8:00 sáng</span>
                  </div>
                )}
                {selectedNode.type === 'trigger' && selectedNode.data.subtype === 'webhook' && (
                  <div className="form-group">
                    <label className="form-label">Webhook URL:</label>
                    <input type="text" className="form-input" value="https://api.hml.vn/hook/xyz" readOnly />
                  </div>
                )}

                {/* Visual - Brand kit inputs */}
                {selectedNode.type === 'visualNode' && selectedNode.data.subtype === 'brandKit' && (
                  <div className="form-group">
                    <label className="form-label">Logo thương hiệu:</label>
                    <input type="file" className="form-input" />
                    <label className="form-label" style={{ marginTop: '8px' }}>Màu sắc chủ đạo:</label>
                    <input type="color" className="form-input" defaultValue="#1d4ed8" style={{ height: '40px', padding: '2px' }} />
                  </div>
                )}

                {/* Audio - Background Music */}
                {selectedNode.type === 'audioTTS' && selectedNode.data.subtype === 'bgMusic' && (
                  <div className="form-group">
                    <label className="form-label">Đường dẫn file nhạc nền:</label>
                    <input type="text" className="form-input" defaultValue="assets/bg_lofi_chill.mp3" />
                  </div>
                )}

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

                {/* Code Node */}
                {selectedNode.type === 'codeNode' && (
                  <div className="form-group">
                    <label className="form-label">Mã nguồn JavaScript xử lý:</label>
                    <textarea 
                      className="form-textarea" 
                      rows={10}
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                      value={codeValue}
                      onChange={(e) => setCodeValue(e.target.value)}
                    />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      ℹ️ Bạn có thể nhúng mã script JavaScript tùy chỉnh để thao tác, trích lọc dữ liệu phân cảnh, hoặc điều khiển luồng dữ liệu trung gian.
                    </span>
                  </div>
                )}

                {/* Custom AI Prompt Node */}
                {selectedNode.type === 'customAINode' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Prompt AI tùy chỉnh:</label>
                      <textarea 
                        className="form-textarea" 
                        rows={4}
                        value={customAIPrompt}
                        onChange={(e) => setCustomAIPrompt(e.target.value)}
                        placeholder="VD: Dịch lời dẫn sang Tiếng Anh..."
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mô hình AI:</label>
                      <select className="form-select" value={customAIModel} onChange={(e) => setCustomAIModel(e.target.value)}>
                        <option value="gpt-4o">GPT-4o (Đa nhiệm)</option>
                        <option value="claude-3-5-sonnet">Claude 3.5 Sonnet (Sáng tạo)</option>
                        <option value="gemini-pro">Gemini Pro (Tốc độ)</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Render Node */}
                {selectedNode.type === 'renderNode' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Tỷ lệ video:</label>
                      <select className="form-select" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
                        <option value="16:9">Ngang (16:9) - YouTube Video / Facebook Watch</option>
                        <option value="9:16">Dọc (9:16) - TikTok / YouTube Shorts / Facebook Reels</option>
                        <option value="1:1">Vuông (1:1) - Facebook Feed / Instagram Post</option>
                        <option value="4:5">Dọc Lửng (4:5) - Facebook Portrait Post</option>
                        <option value="21:9">Điện Ảnh (21:9) - Cinema Movie / Facebook Cover</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: '16px', borderBottom: '1px solid var(--border-dark)', paddingBottom: '12px' }}>
                      <label className="form-label">Tốc độ chuyển cảnh:</label>
                      <select className="form-select" value={transitionSpeed} onChange={(e) => setTransitionSpeed(e.target.value)}>
                        <option value="slow">Chậm (Mượt mà)</option>
                        <option value="normal">Bình thường</option>
                        <option value="fast">Nhanh (Kịch tính)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Công cụ Render (Engine):</label>
                      <select 
                        className="form-select" 
                        value={renderConfig.engine} 
                        onChange={(e) => updateRenderConfig('engine', e.target.value as RenderConfig['engine'])}
                        style={{ borderColor: 'var(--primary)' }}
                      >
                        <option value="ffmpeg">FFmpeg (Core Render Engine)</option>
                        <option value="remotion">Remotion (React Animation)</option>
                        <option value="hybrid">Hybrid (Remotion + FFmpeg)</option>
                      </select>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {renderConfig.engine === 'ffmpeg' && 'FFmpeg: Thích hợp ghép nối ảnh/video tĩnh, phụ đề cứng, logo mờ, nhạc nền nhanh chóng.'}
                        {renderConfig.engine === 'remotion' && 'Remotion: Thích hợp cho video hoạt cảnh phức tạp, chuyển động động mượt mà bằng React component.'}
                        {renderConfig.engine === 'hybrid' && 'Hybrid: Remotion render hoạt cảnh phức tạp riêng lẻ, FFmpeg ghép nối (assemble) tốc độ cao.'}
                      </p>
                    </div>

                    {/* FFmpeg Engine Options */}
                    {renderConfig.engine === 'ffmpeg' && (
                      <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, borderBottom: '1px dashed var(--border-dark)', paddingBottom: '4px' }}>Cấu hình FFmpeg</h4>
                        
                        <div className="form-group">
                          <label className="form-label">Codec Video:</label>
                          <select className="form-select" value={renderConfig.videoCodec} onChange={(e) => updateRenderConfig('videoCodec', e.target.value as RenderConfig['videoCodec'])}>
                            <option value="libx264">H.264 (libx264) - Tương thích cao</option>
                            <option value="libx265">HEVC (libx265) - Nén cao</option>
                            <option value="prores">Apple ProRes - Chất lượng Studio</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Chất lượng nén (CRF: {renderConfig.crf}):</label>
                          <input 
                            type="range" 
                            min="18" 
                            max="28" 
                            className="form-input" 
                            style={{ padding: 0 }}
                            value={renderConfig.crf} 
                            onChange={(e) => updateRenderConfig('crf', Number(e.target.value))} 
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)' }}>
                            <span>18 (Cao nhất)</span>
                            <span>28 (Thấp nhất)</span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Nhãn logo mờ (Watermark):</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={renderConfig.watermarkText} 
                            onChange={(e) => updateRenderConfig('watermarkText', e.target.value)} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Thư mục Output Local (Tùy chọn):</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={renderConfig.outputDir || ''} 
                            onChange={(e) => updateRenderConfig('outputDir', e.target.value)} 
                            placeholder="VD: C:/Users/Admin/Desktop"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Vị trí Watermark:</label>
                          <select className="form-select" value={renderConfig.watermarkPos} onChange={(e) => updateRenderConfig('watermarkPos', e.target.value as RenderConfig['watermarkPos'])}>
                            <option value="top-left">Góc trên - Trái</option>
                            <option value="top-right">Góc trên - Phải</option>
                            <option value="bottom-left">Góc dưới - Trái</option>
                            <option value="bottom-right">Góc dưới - Phải</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Chế độ Resize:</label>
                          <select className="form-select" value={renderConfig.resizeMode} onChange={(e) => updateRenderConfig('resizeMode', e.target.value as RenderConfig['resizeMode'])}>
                            <option value="letterbox">Thêm viền đen (Letterbox)</option>
                            <option value="crop">Cắt góc (Crop - Pan & Scan)</option>
                            <option value="stretch">Kéo dãn hình (Stretch)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Hiệu ứng Transition:</label>
                          <select className="form-select" value={renderConfig.transitionType} onChange={(e) => updateRenderConfig('transitionType', e.target.value as RenderConfig['transitionType'])}>
                            <option value="fade">Mờ dần (Fade)</option>
                            <option value="slide">Trượt cảnh (Slide)</option>
                            <option value="wipe">Quét cảnh (Wipe)</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Âm lượng nhạc nền: {renderConfig.audioMixBg}%</label>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            className="form-input" 
                            style={{ padding: 0 }}
                            value={renderConfig.audioMixBg} 
                            onChange={(e) => updateRenderConfig('audioMixBg', Number(e.target.value))} 
                          />
                        </div>
                      </div>
                    )}

                    {/* Remotion Engine Options */}
                    {renderConfig.engine === 'remotion' && (
                      <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, borderBottom: '1px dashed var(--border-dark)', paddingBottom: '4px' }}>Cấu hình Remotion</h4>
                        
                        <div className="form-group">
                          <label className="form-label">React Component Template:</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={renderConfig.template} 
                            onChange={(e) => updateRenderConfig('template', e.target.value)} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Tốc độ khung hình (FPS):</label>
                          <select className="form-select" value={renderConfig.fps} onChange={(e) => updateRenderConfig('fps', Number(e.target.value))}>
                            <option value={24}>24 FPS - Điện ảnh</option>
                            <option value={30}>30 FPS - Chuẩn Web</option>
                            <option value={60}>60 FPS - Chuyển động siêu mượt</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label className="form-label">Số luồng render song song (Multi-threading):</label>
                          <select className="form-select" value={renderConfig.concurrency} onChange={(e) => updateRenderConfig('concurrency', Number(e.target.value))}>
                            <option value={1}>1 luồng (Thấp)</option>
                            <option value={2}>2 luồng</option>
                            <option value={4}>4 luồng (Khuyên dùng)</option>
                            <option value={8}>8 luồng (Hiệu năng cao)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Hybrid Engine Options */}
                    {renderConfig.engine === 'hybrid' && (
                      <div style={{ background: 'var(--bg-app)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-dark)', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                        <h4 style={{ fontSize: '12px', fontWeight: 600, borderBottom: '1px dashed var(--border-dark)', paddingBottom: '4px' }}>Cấu hình Kết Hợp (Hybrid)</h4>
                        
                        <div className="form-group">
                          <label className="form-label">React Component Template (Remotion):</label>
                          <input 
                            type="text" 
                            className="form-input" 
                            value={renderConfig.template} 
                            onChange={(e) => updateRenderConfig('template', e.target.value)} 
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">Hiệu ứng Transition (FFmpeg Assemble):</label>
                          <select className="form-select" value={renderConfig.transitionType} onChange={(e) => updateRenderConfig('transitionType', e.target.value as RenderConfig['transitionType'])}>
                            <option value="fade">Mờ dần (Fade)</option>
                            <option value="slide">Trượt cảnh (Slide)</option>
                            <option value="wipe">Quét cảnh (Wipe)</option>
                          </select>
                        </div>

                        <div style={{ fontSize: '11px', color: 'var(--primary)', padding: '6px', background: 'var(--primary-light)', borderRadius: '4px' }}>
                          ℹ️ Hybrid Engine sẽ render các component hoạt cảnh React thành file video riêng lẻ qua Remotion, sau đó dùng FFmpeg trộn âm thanh lồng tiếng, phụ đề, hiệu ứng chuyển cảnh và logo mờ để tăng tốc độ xuất bản gấp 3 lần.
                        </div>
                      </div>
                    )}
                  </>
                )}

                  </>
                )}


                <div style={{ marginTop: '24px', borderTop: '1px dashed var(--border-dark)', paddingTop: '16px', paddingBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    className="btn btn-apply" 
                    onClick={() => {
                      addLog('Đã lưu cấu hình Node thành công', 'success');
                      setSelectedNode(null);
                    }}
                  >
                    Áp dụng
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      className="btn" 
                      style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
                      onClick={testNode}
                      disabled={isRunning || selectedNode.data.status === 'running'}
                    >
                      <Play size={14} />
                      {selectedNode.data.status === 'running' ? 'Đang chạy' : 'Kiểm thử Node'}
                    </button>
                    <button 
                      className="btn" 
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--error-light)', color: 'var(--error)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0 12px' }}
                      onClick={deleteNode}
                      title="Xóa Node này"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Active scene configurations */}
                {workflowCompleted && (
                  <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid var(--border-dark)' }}>
                    <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', marginBottom: '12px' }}>
                      Thiết lập Cảnh {activeSceneIndex + 1}
                    </h4>
                    <div className="form-group" style={{ marginBottom: '12px' }}>
                      <label className="form-label">Bộ lọc hiệu ứng FX:</label>
                      <select 
                        className="form-select"
                        value={scenes[activeSceneIndex].fx}
                        onChange={(e) => handleSceneFxChange(activeSceneIndex, e.target.value)}
                      >
                        <option value="none">Không có hiệu ứng</option>
                        <option value="cinematic">Cinematic Glow (Màu ấm)</option>
                        <option value="vintage">Vintage Sepia (Phim cổ)</option>
                        <option value="noir">Noir Grayscale (Đen trắng)</option>
                        <option value="glitch">Glitch Art (Nhiễu sóng)</option>
                        <option value="blur">Soft Blur (Làm mờ)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Thời lượng cảnh (giây):</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={15} 
                        className="form-input" 
                        value={scenes[activeSceneIndex].duration} 
                        onChange={(e) => {
                          const val = Math.max(1, Number(e.target.value));
                          setScenes(prev => prev.map((s, i) => i === activeSceneIndex ? { ...s, duration: val } : s));
                        }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Panel */}
          <div 
            className="panel-resizer-horizontal" 
            onMouseDown={startResizingBottom}
            style={{
              left: `${leftSidebarWidth + 60}px`,
              right: `${rightSidebarWidth}px`,
              bottom: `${bottomPanelHeight}px`
            }}
          />
          <div className="bottom-panel" style={{ height: `${bottomPanelHeight}px`, left: `${leftSidebarWidth + 60}px`, right: `${rightSidebarWidth}px` }}>
            <div className="bottom-tab-container">
              <div className="bottom-tabs-header">
                <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
                  Phân Cảnh CapCut (Timeline)
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
                      /* CapCut Multi-track timeline view */
                      <div className="timeline-tracks-container">
                        {/* 1. Time Ruler */}
                        <div className="time-ruler" onClick={handleTimelineClick}>
                          {renderRulerTicks()}
                          {/* Red Playhead line */}
                          <div 
                            className="playhead" 
                            style={{ left: `${currentTime * timelineScale}px` }}
                          >
                            <div className="playhead-handle" />
                          </div>
                        </div>

                        {/* 2. Visual Track */}
                        <div className="timeline-track-row">
                          {renderTrackControlsLeft('visual')}
                          <div className="timeline-track-content" onClick={handleTimelineClick}>
                            {buildTrackBlocks('visual')}
                          </div>
                        </div>

                        {/* 3. FX Track */}
                        <div className="timeline-track-row">
                          {renderTrackControlsLeft('fx')}
                          <div className="timeline-track-content" onClick={handleTimelineClick}>
                            {buildTrackBlocks('fx')}
                          </div>
                        </div>

                        {/* 4. Audio Track */}
                        <div className="timeline-track-row">
                          {renderTrackControlsLeft('audio')}
                          <div className="timeline-track-content" onClick={handleTimelineClick}>
                            {buildTrackBlocks('audio')}
                          </div>
                        </div>

                        {/* 5. Subtitle Track */}
                        <div className="timeline-track-row" style={{ borderBottom: 'none' }}>
                          {renderTrackControlsLeft('subtitle')}
                          <div className="timeline-track-content" onClick={handleTimelineClick}>
                            {buildTrackBlocks('subtitle')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'agents' && (
                    <div className="agent-orchestration-container">
                      {/* Thẻ trạng thái các Agent */}
                      <div className="agent-cards-row">
                        {/* Biên kịch */}
                        <div className={`agent-card ${agentStatuses.writer !== 'idle' ? 'writer-active' : ''}`}>
                          <div className="agent-card-header">
                            <div className="agent-avatar-circle" style={{ backgroundColor: '#a855f7' }}>BK</div>
                            <span className="agent-card-title">Biên Kịch</span>
                          </div>
                          <select 
                            className="agent-selector-select"
                            value={writerModel}
                            onChange={(e) => setWriterModel(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="gpt-4o">GPT-4o</option>
                            <option value="claude-3.5-sonnet">Claude 3.5</option>
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                          </select>
                          <button 
                            className="icon-btn-small" 
                            style={{ fontSize: '9px', border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', padding: '2px 0', textAlign: 'left' }}
                            onClick={() => setShowPrompts(p => ({ ...p, writer: !p.writer }))}
                          >
                            {showPrompts.writer ? '▲ Thu gọn' : '▼ Cấu hình Prompt'}
                          </button>
                          {showPrompts.writer && (
                            <textarea 
                              className="agent-prompt-textarea"
                              value={writerSystemPrompt}
                              onChange={(e) => setWriterSystemPrompt(e.target.value)}
                              disabled={isRunning}
                            />
                          )}
                          <div className="agent-status-badge">
                            <span className={`agent-status-dot ${agentStatuses.writer}`} />
                            <span style={{ fontSize: '9px' }}>
                              {agentStatuses.writer === 'idle' && 'Đang chờ...'}
                              {agentStatuses.writer === 'thinking' && 'Đang phân tích...'}
                              {agentStatuses.writer === 'active' && 'Đang soạn kịch...'}
                              {agentStatuses.writer === 'success' && 'Đã xong'}
                            </span>
                          </div>
                        </div>

                        {/* Đạo diễn hình ảnh */}
                        <div className={`agent-card ${agentStatuses.director !== 'idle' ? 'director-active' : ''}`}>
                          <div className="agent-card-header">
                            <div className="agent-avatar-circle" style={{ backgroundColor: '#3b82f6' }}>ĐD</div>
                            <span className="agent-card-title">Đạo Diễn Visual</span>
                          </div>
                          <select 
                            className="agent-selector-select"
                            value={directorModel}
                            onChange={(e) => setDirectorModel(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
                            <option value="gpt-4o-mini">GPT-4o Mini</option>
                            <option value="claude-3-haiku">Claude Haiku</option>
                          </select>
                          <button 
                            className="icon-btn-small" 
                            style={{ fontSize: '9px', border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', padding: '2px 0', textAlign: 'left' }}
                            onClick={() => setShowPrompts(p => ({ ...p, director: !p.director }))}
                          >
                            {showPrompts.director ? '▲ Thu gọn' : '▼ Cấu hình Prompt'}
                          </button>
                          {showPrompts.director && (
                            <textarea 
                              className="agent-prompt-textarea"
                              value={directorSystemPrompt}
                              onChange={(e) => setDirectorSystemPrompt(e.target.value)}
                              disabled={isRunning}
                            />
                          )}
                          <div className="agent-status-badge">
                            <span className={`agent-status-dot ${agentStatuses.director}`} />
                            <span style={{ fontSize: '9px' }}>
                              {agentStatuses.director === 'idle' && 'Đang chờ...'}
                              {agentStatuses.director === 'thinking' && 'Đang phác thảo...'}
                              {agentStatuses.director === 'active' && 'Đang tạo ảnh...'}
                              {agentStatuses.director === 'success' && 'Đã xong'}
                            </span>
                          </div>
                        </div>

                        {/* Âm thanh / TTS */}
                        <div className={`agent-card ${agentStatuses.voice !== 'idle' ? 'voice-active' : ''}`}>
                          <div className="agent-card-header">
                            <div className="agent-avatar-circle" style={{ backgroundColor: '#f97316' }}>AT</div>
                            <span className="agent-card-title">Lồng Tiếng AI</span>
                          </div>
                          <select 
                            className="agent-selector-select"
                            value={ttsVoice}
                            onChange={(e) => setTtsVoice(e.target.value)}
                            disabled={isRunning}
                          >
                            <option value="nu-mien-bac">Vy Mai (Bắc)</option>
                            <option value="nam-mien-bac">Nam An (Bắc)</option>
                            <option value="nu-mien-nam">Thảo Chi (Nam)</option>
                            <option value="nam-mien-nam">Minh Hoàng (Nam)</option>
                          </select>
                          <button 
                            className="icon-btn-small" 
                            style={{ fontSize: '9px', border: 'none', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', padding: '2px 0', textAlign: 'left' }}
                            onClick={() => setShowPrompts(p => ({ ...p, voice: !p.voice }))}
                          >
                            {showPrompts.voice ? '▲ Thu gọn' : '▼ Cấu hình Prompt'}
                          </button>
                          {showPrompts.voice && (
                            <textarea 
                              className="agent-prompt-textarea"
                              value={voiceSystemPrompt}
                              onChange={(e) => setVoiceSystemPrompt(e.target.value)}
                              disabled={isRunning}
                            />
                          )}
                          <div className="agent-status-badge">
                            <span className={`agent-status-dot ${agentStatuses.voice}`} />
                            <span style={{ fontSize: '9px' }}>
                              {agentStatuses.voice === 'idle' && 'Đang chờ...'}
                              {agentStatuses.voice === 'thinking' && 'Cân đối thoại...'}
                              {agentStatuses.voice === 'active' && 'Đang phát âm...'}
                              {agentStatuses.voice === 'success' && 'Đã xong'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Khung chat hội thoại */}
                      <div className="agent-chat-thread">
                        {agentLogs.length === 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', padding: '20px' }}>
                            <Users size={28} strokeWidth={1.5} style={{ marginBottom: '8px' }} />
                            <p style={{ fontSize: '12px', textAlign: 'center' }}>Chưa có thảo luận nào giữa các AI Agents. Nhấn <strong>Chạy thử</strong> để theo dõi.</p>
                          </div>
                        ) : (
                          <>
                            {agentLogs.map((chat, idx) => {
                              const isLeft = chat.agent !== 'Biên Tập Agent';
                              return (
                                <div 
                                  key={idx} 
                                  className={`agent-chat-bubble ${isLeft ? 'left' : 'right'}`}
                                  style={{ borderLeft: `4px solid ${chat.color}`, background: 'var(--bg-card)' }}
                                >
                                  <div className="agent-bubble-header">
                                    <span className="agent-bubble-name" style={{ color: chat.color }}>{chat.agent}</span>
                                    <span className="agent-bubble-time">{chat.time}</span>
                                  </div>
                                  <p className="agent-bubble-text">{chat.message}</p>
                                </div>
                              );
                            })}
                            
                            {/* Blinking Typing Indicators */}
                            {(agentStatuses.writer === 'thinking' || agentStatuses.writer === 'active') && (
                              <div className="typing-indicator" style={{ borderLeft: '4px solid #a855f7' }}>
                                <span className="agent-bubble-name" style={{ color: '#a855f7', fontSize: '9px', marginRight: '6px' }}>Biên Kịch</span>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                              </div>
                            )}
                            {(agentStatuses.director === 'thinking' || agentStatuses.director === 'active') && (
                              <div className="typing-indicator" style={{ borderLeft: '4px solid #3b82f6' }}>
                                <span className="agent-bubble-name" style={{ color: '#3b82f6', fontSize: '9px', marginRight: '6px' }}>Đạo Diễn</span>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                              </div>
                            )}
                            {(agentStatuses.voice === 'thinking' || agentStatuses.voice === 'active') && (
                              <div className="typing-indicator" style={{ borderLeft: '4px solid #f97316' }}>
                                <span className="agent-bubble-name" style={{ color: '#f97316', fontSize: '9px', marginRight: '6px' }}>Âm Thanh</span>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                                <div className="typing-indicator-dot"></div>
                              </div>
                            )}
                            
                            <div ref={chatEndRef} />
                          </>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Video Preview Screen */}
            <div className="video-preview-wrapper" style={{ 
              width: aspectRatio === '9:16' ? '220px' : 
                     aspectRatio === '1:1' ? '280px' : 
                     aspectRatio === '4:5' ? '240px' : 
                     aspectRatio === '21:9' ? '380px' : '340px', 
              transition: 'width 0.3s ease' 
            }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>
                Màn hình xem trước
              </span>
              <div className="video-screen" style={{ 
                aspectRatio: aspectRatio === '9:16' ? '9/16' : 
                             aspectRatio === '1:1' ? '1/1' : 
                             aspectRatio === '4:5' ? '4/5' : 
                             aspectRatio === '21:9' ? '21/9' : '16/9', 
                maxHeight: 'none', 
                height: '170px' 
              }}>
                {workflowCompleted ? (
                  <>
                    <img 
                      src={scenes[activeSceneIndex].image} 
                      alt="Active scene" 
                      className={getFxClass()}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                    />
                    <div style={{ position: 'absolute', bottom: '15px', left: '10px', right: '10px', display: 'flex', justifyContent: 'center' }}>
                      <span style={getSubStyle()}>
                        {scenes[activeSceneIndex].text}
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
                      setCurrentTime(0);
                      setIsPlayingPreview(false);
                    }}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                  <span style={{ fontSize: '11px', alignSelf: 'center', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                    {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : editorMode === 'kdenlive' ? (
        /* Shotcut NLE Professional Layout */
        <div className="kdenlive-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1e1e1e', color: '#e2e0e8' }}>
          
          {/* Top Menu Bar */}
          <div className="shotcut-menu-bar" style={{ display: 'flex', gap: '16px', background: '#151419', borderBottom: '1px solid #2d2b38', padding: '4px 16px', fontSize: '12px' }}>
            <span className="shotcut-menu-item" style={{ cursor: 'pointer', opacity: 0.85 }}>File</span>
            <span className="shotcut-menu-item" style={{ cursor: 'pointer', opacity: 0.85 }}>Edit</span>
            <span className="shotcut-menu-item" style={{ cursor: 'pointer', opacity: 0.85 }}>View</span>
            <span className="shotcut-menu-item" style={{ cursor: 'pointer', opacity: 0.85 }}>Settings</span>
            <span className="shotcut-menu-item" style={{ cursor: 'pointer', opacity: 0.85 }}>Help</span>
          </div>

          {/* Top Toolbar */}
          <div className="shotcut-toolbar" style={{ display: 'flex', gap: '8px', background: '#1c1b22', borderBottom: '1px solid #2d2b38', padding: '6px 16px', alignItems: 'center' }}>
            <button className="shotcut-toolbar-btn" onClick={() => addLog("Mở tệp tin nguồn video...", "info")} style={{ background: 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Upload size={13} /> Mở Tệp</button>
            <button className="shotcut-toolbar-btn" onClick={saveWorkflowManual} style={{ background: 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Save size={13} /> Lưu</button>
            <button className="shotcut-toolbar-btn" onClick={handleUndo} style={{ background: 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><RotateCcw size={13} /> Undo</button>
            <button className="shotcut-toolbar-btn" onClick={() => addLog("Tính năng Redo sẽ khả dụng ở bản cập nhật tới", "warning")} style={{ background: 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><RotateCcw size={13} style={{ transform: 'scaleX(-1)' }} /> Redo</button>
            <div className="shotcut-toolbar-divider" style={{ width: '1px', height: '16px', backgroundColor: '#3d3b4f', margin: '0 4px' }} />
            <button className={`shotcut-toolbar-btn ${leftTab === 'playlist' ? 'active' : ''}`} onClick={() => setLeftTab('playlist')} style={{ background: leftTab === 'playlist' ? '#3d3b4f' : 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Grid size={13} /> Playlist</button>
            <button className={`shotcut-toolbar-btn ${leftTab === 'filters' ? 'active' : ''}`} onClick={() => setLeftTab('filters')} style={{ background: leftTab === 'filters' ? '#3d3b4f' : 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><Sliders size={13} /> Bộ lọc</button>
            <button className={`shotcut-toolbar-btn ${leftTab === 'history' ? 'active' : ''}`} onClick={() => setLeftTab('history')} style={{ background: leftTab === 'history' ? '#3d3b4f' : 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}><RotateCcw size={13} /> Lịch sử</button>
            <div className="shotcut-toolbar-divider" style={{ width: '1px', height: '16px', backgroundColor: '#3d3b4f', margin: '0 4px' }} />
            <button className="shotcut-toolbar-btn" onClick={() => {
              if (workflowCompleted) {
                addLog("Bắt đầu tác vụ xuất video (Render Export)...", "info");
                const jobId = `job-${Date.now()}`;
                const newJob = { id: jobId, name: `Xuất_${promptValue.slice(0, 10)}.mp4`, progress: 0, status: 'Đang chạy' };
                setExportJobs(prev => [...prev, newJob]);
                addHistory(`Khởi tạo tiến trình xuất video: ${newJob.name}`);
                let prog = 0;
                const interval = setInterval(() => {
                  prog += 20;
                  setExportJobs(prev => prev.map(j => j.id === jobId ? { ...j, progress: prog, status: prog === 100 ? 'Hoàn thành' : 'Đang xử lý' } : j));
                  if (prog >= 100) {
                    clearInterval(interval);
                    addHistory(`Đã xuất bản thành công file: ${newJob.name}`);
                  }
                }, 800);
              } else {
                alert("Hãy chạy workflow để tạo video trước khi xuất bản!");
              }
            }} disabled={!workflowCompleted} style={{ background: 'transparent', border: '1px solid #3d3b4f', color: '#fff', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', opacity: workflowCompleted ? 1 : 0.4 }}><Download size={13} /> Export</button>
          </div>

          {/* Main NLE Work Area */}
          <div className="kdenlive-top-row" style={{ display: 'flex', flex: 1, borderBottom: '1px solid #3d3b4f', minHeight: 0, position: 'relative' }}>
            
            {/* 1. Playlist / Filters / History sidebar */}
            <div className="project-bin" style={{ width: `${shotcutLeftWidth}px`, minWidth: '180px', display: 'flex', flexDirection: 'column', borderRight: '1px solid #2e2d3b', minHeight: 0 }}>
              <div className="shotcut-panel-tabs">
                <button className={`shotcut-panel-tab-btn ${leftTab === 'playlist' ? 'active' : ''}`} onClick={() => setLeftTab('playlist')}>Playlist</button>
                <button className={`shotcut-panel-tab-btn ${leftTab === 'filters' ? 'active' : ''}`} onClick={() => setLeftTab('filters')}>Bộ lọc</button>
                <button className={`shotcut-panel-tab-btn ${leftTab === 'history' ? 'active' : ''}`} onClick={() => setLeftTab('history')}>Lịch sử</button>
              </div>

              <div className="kdenlive-panel-content" style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
                {leftTab === 'playlist' && (
                  <div>
                    <div className="media-item">
                      <FileText size={14} style={{ color: '#10b981' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">{docValue}</span>
                        <span className="media-item-meta">Tài liệu kịch bản gốc</span>
                      </div>
                    </div>
                    <div className="media-item">
                      <Globe size={14} style={{ color: '#3b82f6' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">{urlValue}</span>
                        <span className="media-item-meta">Trang quét nội dung</span>
                      </div>
                    </div>
                    <div className="media-item">
                      <Volume2 size={14} style={{ color: '#8b5cf6' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">Giong_Doc_AI_TTS.mp3</span>
                        <span className="media-item-meta">Thuyết minh lồng tiếng</span>
                      </div>
                    </div>
                    {scenes.slice(0, sceneCount).map((scene, idx) => (
                      <div key={scene.id} className="media-item" onClick={() => {
                        setCurrentTime(idx * 4 + 0.1);
                        addHistory(`Xem trước Cảnh ${idx + 1}`);
                      }}>
                        <ImageIcon size={14} style={{ color: '#f59e0b' }} />
                        <div className="media-item-info">
                          <span className="media-item-title">Video_Clip_Phan_Canh_${idx + 1}.mp4</span>
                          <span className="media-item-meta">{scene.duration}s | 1080p</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {leftTab === 'filters' && (
                  <div>
                    <input 
                      type="text" 
                      className="shotcut-search-bar" 
                      placeholder="Tìm bộ lọc..." 
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                    
                    <div style={{ padding: '6px', background: '#15141e', borderRadius: '4px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', color: '#8d8a98' }}>Bộ lọc hiện tại:</span>
                      <div style={{ fontSize: '12px', color: '#fff', fontWeight: 600, marginTop: '4px' }}>
                        {scenes[activeSceneIndex]?.fx === 'none' ? 'Không có bộ lọc' : scenes[activeSceneIndex]?.fx.toUpperCase()}
                      </div>
                    </div>

                    <span style={{ fontSize: '11px', color: '#8d8a98', fontWeight: 500 }}>Bộ lọc video khả dụng:</span>
                    <div className="shotcut-filter-list">
                      {[
                        { key: 'cinematic', label: 'Cinematic Glow' },
                        { key: 'vintage', label: 'Vintage Sepia' },
                        { key: 'noir', label: 'Noir Grayscale' },
                        { key: 'glitch', label: 'Glitch Art' },
                        { key: 'blur', label: 'Soft Blur' },
                        { key: 'none', label: 'Bỏ bộ lọc' }
                      ]
                        .filter(item => item.label.toLowerCase().includes(filterSearch.toLowerCase()))
                        .map(item => (
                          <div key={item.key} className="shotcut-filter-item">
                            <span>{item.label}</span>
                            <button 
                              className="shotcut-filter-add-btn" 
                              onClick={() => {
                                handleSceneFxChange(activeSceneIndex, item.key);
                                addHistory(`Áp dụng bộ lọc ${item.label} cho Cảnh ${activeSceneIndex + 1}`);
                              }}
                            >
                              +
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {leftTab === 'history' && (
                  <div className="shotcut-history-list">
                    {historyList.map((hist, idx) => (
                      <div key={idx} className="shotcut-history-item">
                        {hist}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Resizer (Left) */}
            <div 
              className="sidebar-resizer active-nle" 
              onMouseDown={startResizingShotcutLeft}
            />

            {/* 2. Program Player Monitor */}
            <div className="project-monitor" style={{ flex: 1, borderRight: '1px solid #2e2d3b', background: '#141419', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="kdenlive-panel-header" style={{ width: '100%', border: 'none', background: 'none', color: '#fff', marginBottom: '8px', display: 'flex', gap: '8px' }}>
                <Film size={12} />
                <span>Trình phát Clip nguồn & Thành phẩm</span>
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0, width: '100%' }}>
                {/* Video screen */}
                <div className="video-screen" style={{ 
                  width: aspectRatio === '9:16' ? '150px' : 
                         aspectRatio === '1:1' ? '220px' : 
                         aspectRatio === '4:5' ? '180px' : 
                         aspectRatio === '21:9' ? '320px' : '280px', 
                  aspectRatio: aspectRatio === '9:16' ? '9/16' : 
                               aspectRatio === '1:1' ? '1/1' : 
                               aspectRatio === '4:5' ? '4/5' : 
                               aspectRatio === '21:9' ? '21/9' : '16/9', 
                  maxHeight: 'none', 
                  height: '240px', 
                  position: 'relative',
                  border: '2px solid #333'
                }}>
                  {workflowCompleted ? (
                    <>
                      <img 
                        src={scenes[activeSceneIndex].image} 
                        alt="Active scene" 
                        className={getFxClass()}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                      />
                      <div style={{ position: 'absolute', bottom: '15px', left: '10px', right: '10px', display: 'flex', justifyContent: 'center' }}>
                        <span style={getSubStyle()}>
                          {scenes[activeSceneIndex].text}
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
                    <div style={{ color: '#8d8a98', fontSize: '12px', textAlign: 'center', padding: '16px' }}>
                      Hãy chạy workflow để nạp tài nguyên...
                    </div>
                  )}
                </div>
              </div>

              {workflowCompleted && (
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px', alignItems: 'center' }}>
                  <button 
                    className="btn" 
                    style={{ padding: '6px 12px', fontSize: '12px', backgroundColor: '#242331', border: '1px solid #3d3b4f', color: '#fff' }}
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlayingPreview(false);
                      setPeakL(0);
                      setPeakR(0);
                      addHistory('Reset dòng thời gian về 0');
                    }}
                  >
                    <RotateCcw size={12} />
                    Reset
                  </button>
                  
                  {/* Detailed Player Scrubber Buttons */}
                  <div className="player-transport-controls" style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', height: '28px', backgroundColor: '#242331', color: '#fff', border: '1px solid #3d3b4f' }} onClick={() => setCurrentTime(prev => Math.max(0, prev - 2))} title="Tua lại 2s">◀◀</button>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', height: '28px', backgroundColor: '#242331', color: '#fff', border: '1px solid #3d3b4f' }} onClick={() => setIsPlayingPreview(!isPlayingPreview)} title={isPlayingPreview ? "Tạm dừng" : "Phát"}>
                      {isPlayingPreview ? '⏸' : '▶'}
                    </button>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', height: '28px', backgroundColor: '#242331', color: '#fff', border: '1px solid #3d3b4f' }} onClick={() => setCurrentTime(prev => Math.min(totalDuration, prev + 2))} title="Tua đi 2s">▶▶</button>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', height: '28px', backgroundColor: isLooping ? '#3b82f6' : '#242331', color: '#fff', border: '1px solid #3d3b4f' }} onClick={() => { setIsLooping(!isLooping); addHistory(`Đã ${!isLooping ? 'Bật' : 'Tắt'} chế độ lặp phát`); }} title="Lặp lại (Loop)">🔁</button>
                    <button className="btn" style={{ padding: '4px 8px', fontSize: '11px', height: '28px', backgroundColor: '#242331', color: '#fff', border: '1px solid #3d3b4f' }} onClick={() => { alert("Chế độ Toàn màn hình đã được kích hoạt!"); }} title="Toàn màn hình">📺</button>
                  </div>

                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a3a1b3' }}>
                    {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>

            {/* Sidebar Resizer (Right) */}
            <div 
              className="sidebar-resizer active-nle" 
              onMouseDown={startResizingShotcutRight}
            />

            {/* 3. Right Sidebar: Audio Peak Meter & Jobs/Properties */}
            <div className="shotcut-right-panel" style={{ width: `${shotcutRightWidth}px`, minWidth: '180px', display: 'flex', borderLeft: 'none', background: '#1c1b22', minHeight: 0 }}>
              
              {/* Vertical Audio Peak Meter */}
              <div className="shotcut-peak-meter-container" style={{ padding: '12px 6px', borderRight: '1px solid #2e2d3b', display: 'flex', flexDirection: 'row', gap: '4px' }} title="Audio Peak Meter">
                <div className="shotcut-peak-meter-channel" style={{ height: '90%', width: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <div className="peak-meter-bar" style={{ position: 'absolute', bottom: 0, width: '100%', height: `${peakL}%`, backgroundColor: peakL > 80 ? '#ef4444' : peakL > 60 ? '#eab308' : '#10b981', transition: 'height 0.1s linear' }} />
                </div>
                <div className="shotcut-peak-meter-channel" style={{ height: '90%', width: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
                  <div className="peak-meter-bar" style={{ position: 'absolute', bottom: 0, width: '100%', height: `${peakR}%`, backgroundColor: peakR > 80 ? '#ef4444' : peakR > 60 ? '#eab308' : '#10b981', transition: 'height 0.1s linear' }} />
                </div>
                <div className="peak-meter-db-labels" style={{ fontSize: '8px', color: '#8d8a98', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '90%', paddingLeft: '4px' }}>
                  <span>0</span>
                  <span>-12</span>
                  <span>-24</span>
                  <span>-36</span>
                  <span>-50</span>
                </div>
              </div>

              {/* Jobs & Properties Stack */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <div className="kdenlive-panel-header" style={{ borderBottom: '1px solid #2e2d3b', padding: '8px 12px', fontSize: '11px', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Sliders size={12} /> Properties (Thuộc tính)
                </div>
                <div style={{ padding: '10px 12px', fontSize: '11px', color: '#a3a1b3', borderBottom: '1px solid #2e2d3b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div><strong>Độ phân giải:</strong> 1080 x 1920 (FHD)</div>
                  <div><strong>Tỉ lệ khung hình:</strong> {aspectRatio}</div>
                  <div><strong>FPS:</strong> 25.00 fps</div>
                  <div><strong>Codec Video:</strong> {renderConfig.videoCodec}</div>
                  <div><strong>Codec Audio:</strong> AAC Stereo</div>
                </div>

                <div className="kdenlive-panel-header" style={{ borderBottom: '1px solid #2e2d3b', padding: '8px 12px', fontSize: '11px', fontWeight: 600, display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <Sliders size={12} /> Hàng đợi Export Jobs
                </div>
                <div style={{ padding: '10px', flex: 1 }}>
                  {exportJobs.map(job => (
                    <div key={job.id} className="shotcut-job-item" style={{ marginBottom: '8px', background: '#25242d', padding: '8px', borderRadius: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: '#e2e0e8', fontSize: '11px' }}>{job.name}</span>
                        <span style={{ color: job.progress === 100 ? '#10b981' : 'var(--primary)', fontSize: '11px' }}>
                          {job.progress}%
                        </span>
                      </div>
                      <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Status: {job.status}</span>
                      <div className="shotcut-job-progress-bar" style={{ height: '4px', width: '100%', backgroundColor: '#111', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                        <div className="shotcut-job-progress-fill" style={{ width: `${job.progress}%`, height: '100%', backgroundColor: '#10b981' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Horizontal Splitter (Timeline) */}
          <div 
            className="panel-resizer-horizontal active-nle"
            onMouseDown={startResizingShotcutTimeline}
            style={{ cursor: 'row-resize', height: '4px', width: '100%', backgroundColor: 'transparent' }}
          />

          {/* 4. Full Width Timeline tracks */}
          <div className="kdenlive-bottom-row" style={{ height: `${shotcutTimelineHeight}px`, display: 'flex', flexDirection: 'column', minHeight: '120px' }}>
            <div className="kdenlive-panel-header" style={{ height: '32px', borderBottom: '1px solid #3d3b4f', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
              <Film size={12} style={{ marginRight: '6px' }} />
              <span>Shotcut Multi-track Timeline Editor</span>
            </div>

            {workflowCompleted && (
              <div className="kdenlive-timeline-toolbar">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button className="snap-toggle-btn active" style={{ fontSize: '10px', padding: '2px 6px' }} title="Công cụ chọn (S)">S</button>
                  <button className="snap-toggle-btn" style={{ fontSize: '10px', padding: '2px 6px' }} title="Công cụ cắt Razor (R)">R</button>
                  <button className="snap-toggle-btn" style={{ fontSize: '10px', padding: '2px 6px' }} title="Công cụ dãn cách (M)">M</button>
                  <div style={{ width: '1px', height: '16px', backgroundColor: '#3d3b4f', margin: '0 4px' }} />
                  
                  {/* Snap Toggle */}
                  <button 
                    className={`snap-toggle-btn ${isSnapEnabled ? 'active' : ''}`}
                    onClick={() => {
                      setIsSnapEnabled(!isSnapEnabled);
                      addLog(`Đã ${!isSnapEnabled ? 'Bật' : 'Tắt'} chế độ Bám dính (Snap-to-Grid).`, 'info');
                    }}
                  >
                    <Zap size={10} />
                    Bám dính (Snap)
                  </button>

                  <button 
                    className="snap-toggle-btn" 
                    onClick={() => {
                      addLog("Giả lập thêm luồng Video/Audio mới thành công.", "success");
                      addHistory("Đã thêm một track dựng video mới");
                    }}
                    style={{ fontSize: '10px' }}
                  >
                    + Thêm Track
                  </button>
                </div>

                {/* Timecode display */}
                <div className="timecode-display-group">
                  <span style={{ fontSize: '10px', color: '#8d8a98' }}>FPS: 25</span>
                  <div className="timecode-display" title="Mã thời gian SMPTE (HH:MM:SS:FF)">
                    {formatTimecode(currentTime)}
                  </div>
                </div>

                {/* Zoom control */}
                <div className="kdenlive-zoom-control">
                  <span style={{ fontSize: '10px' }}>Thu phóng:</span>
                  <input 
                    type="range" 
                    min={30} 
                    max={120} 
                    className="kdenlive-zoom-slider"
                    value={timelineScale}
                    onChange={(e) => {
                      setTimelineScale(Number(e.target.value));
                    }}
                    title="Kéo để thu phóng dòng thời gian"
                  />
                  <span style={{ fontSize: '10px', fontFamily: 'monospace', width: '32px' }}>{timelineScale}px/s</span>
                </div>
              </div>
            )}

            {workflowCompleted ? (
              <div className="timeline-tracks-container" style={{ border: 'none', borderRadius: 0, flex: 1, overflowY: 'auto' }}>
                {/* Ruler */}
                <div className="time-ruler" onClick={handleTimelineClick}>
                  {renderRulerTicks()}
                  <div className="playhead" style={{ left: `${currentTime * timelineScale}px` }}>
                    <div className="playhead-handle" />
                  </div>
                </div>
                {/* Visual row */}
                <div className="timeline-track-row">
                  {renderTrackControlsLeft('visual')}
                  <div className="timeline-track-content" onClick={handleTimelineClick}>
                    {buildTrackBlocks('visual')}
                  </div>
                </div>
                {/* FX row */}
                <div className="timeline-track-row">
                  {renderTrackControlsLeft('fx')}
                  <div className="timeline-track-content" onClick={handleTimelineClick}>
                    {buildTrackBlocks('fx')}
                  </div>
                </div>
                {/* Audio row */}
                <div className="timeline-track-row">
                  {renderTrackControlsLeft('audio')}
                  <div className="timeline-track-content" onClick={handleTimelineClick}>
                    {buildTrackBlocks('audio')}
                  </div>
                </div>
                {/* Subtitle row */}
                <div className="timeline-track-row" style={{ borderBottom: 'none' }}>
                  {renderTrackControlsLeft('subtitle')}
                  <div className="timeline-track-content" onClick={handleTimelineClick}>
                    {buildTrackBlocks('subtitle')}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, color: '#8d8a98', gap: '8px', background: '#1a1924' }}>
                <Film size={28} strokeWidth={1.5} />
                <p style={{ fontSize: '13px' }}>Chưa có phân cảnh nào được dựng. Nhấp <strong>Chạy thử</strong> ở trên để tạo tài nguyên.</p>
              </div>
            )}
          </div>
        </div>
      ) : editorMode === 'tools' ? (
        /* Tools Dashboard */
        (() => {
          const selectedTool = tools.find(t => t.id === selectedToolId) || tools[0];
          return (
            <div className="tools-dashboard-layout">
              {/* Left Column: Tools List */}
              <div className="tools-left-panel">
                <div className="tools-left-header">
                  <h2 className="tools-left-title">Bảng điều khiển Tools</h2>
                  <p className="tools-left-subtitle">Quản lý và kiểm thử các công cụ của Agent</p>
                </div>
                
                <div className="tools-list">
                  {tools.map(tool => {
                    const isSelected = tool.id === selectedToolId;
                    return (
                      <div 
                        key={tool.id} 
                        className={`tool-card-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleSelectTool(tool.id)}
                      >
                        <div className="tool-card-meta">
                          <span className={`tool-type-badge ${tool.type}`}>
                            {tool.type === 'google_search' && 'Search'}
                            {tool.type === 'api' && 'API'}
                            {tool.type === 'llm' && 'AI/LLM'}
                            {tool.type === 'custom_code' && 'Code'}
                          </span>
                          
                          {/* Active Toggle */}
                          <label className="status-switch" onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={tool.isActive}
                              onChange={() => handleToggleTool(tool.id)}
                            />
                            <span className="status-slider"></span>
                          </label>
                        </div>
                        
                        <div className="tool-card-icon-title">
                          {tool.type === 'google_search' && <Globe size={16} style={{ color: '#1d4ed8' }} />}
                          {tool.type === 'api' && <Zap size={16} style={{ color: '#047857' }} />}
                          {tool.type === 'llm' && <Cpu size={16} style={{ color: '#6b21a8' }} />}
                          {tool.type === 'custom_code' && <Code size={16} style={{ color: '#c2410c' }} />}
                          <span className="tool-card-title-text">{tool.name}</span>
                        </div>
                        
                        <p className="tool-card-desc-text">{tool.description}</p>
                      </div>
                    );
                  })}
                  
                  <button className="tool-create-btn-card" onClick={handleCreateTool}>
                    <Plus size={16} />
                    + Tạo Công Cụ Mới
                  </button>
                </div>
              </div>

              {/* Right Column: Configuration & Playground */}
              {selectedTool ? (
                <div className="tools-right-panel">
                  {/* General Config Section */}
                  <div className="tool-config-section">
                    <div className="tool-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Settings size={18} style={{ color: 'var(--primary)' }} />
                        <span>Cấu hình Công cụ: {selectedTool.name}</span>
                      </div>
                      <button 
                        className="btn" 
                        style={{ color: 'var(--error)', borderColor: 'var(--error-light)', padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleDeleteTool(selectedTool.id)}
                      >
                        <Trash2 size={12} /> Xóa công cụ
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Tên Công cụ:</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={selectedTool.name}
                        onChange={(e) => handleUpdateToolField(selectedTool.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Loại Công cụ:</label>
                      <select 
                        className="form-select"
                        value={selectedTool.type}
                        onChange={(e) => handleUpdateToolField(selectedTool.id, 'type', e.target.value as any)}
                      >
                        <option value="google_search">Google Search API (Tìm kiếm web)</option>
                        <option value="api">Webhook API (Gửi HTTP Request)</option>
                        <option value="llm">AI / LLM Model Helper (Mô hình ngôn ngữ)</option>
                        <option value="custom_code">Custom JS Code (Chạy mã JavaScript)</option>
                      </select>
                    </div>

                    {selectedTool.type === 'api' && (
                      <div className="form-group">
                        <label className="form-label">Endpoint URL:</label>
                        <input 
                          type="text" 
                          className="form-input" 
                          value={selectedTool.endpointUrl || ''}
                          onChange={(e) => handleUpdateToolField(selectedTool.id, 'endpointUrl', e.target.value)}
                          placeholder="https://api.example.com/v1/endpoint"
                        />
                      </div>
                    )}

                    <div className="form-group">
                      <label className="form-label">Mô tả công dụng (Description):</label>
                      <textarea 
                        className="form-textarea"
                        rows={2}
                        value={selectedTool.description}
                        onChange={(e) => handleUpdateToolField(selectedTool.id, 'description', e.target.value)}
                        placeholder="Mô tả cho AI Agent hiểu khi nào nên dùng công cụ này..."
                      />
                    </div>
                  </div>

                  {/* Input Parameters Config */}
                  <div className="tool-config-section">
                    <div className="tool-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sliders size={18} style={{ color: 'var(--success)' }} />
                        <span>Tham số Đầu vào (Input Schema)</span>
                      </div>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                        onClick={() => handleAddParam(selectedTool.id)}
                      >
                        <Plus size={12} /> Thêm tham số
                      </button>
                    </div>

                    {selectedTool.params.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '16px 0' }}>
                        Chưa có tham số nào. Nhấn "+ Thêm tham số" để cấu hình.
                      </div>
                    ) : (
                      <table className="params-table">
                        <thead>
                          <tr>
                            <th>Tên tham số</th>
                            <th>Kiểu</th>
                            <th>Mô tả chi tiết</th>
                            <th style={{ width: '100px' }}>Bắt buộc</th>
                            <th style={{ width: '40px' }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedTool.params.map((param, index) => (
                            <tr key={index}>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-input" 
                                  style={{ padding: '6px 8px', fontSize: '12px' }}
                                  value={param.name}
                                  onChange={(e) => handleUpdateParam(selectedTool.id, index, 'name', e.target.value)}
                                />
                              </td>
                              <td>
                                <select 
                                  className="form-select"
                                  style={{ padding: '4px 6px', fontSize: '12px', height: '30px' }}
                                  value={param.type}
                                  onChange={(e) => handleUpdateParam(selectedTool.id, index, 'type', e.target.value as any)}
                                >
                                  <option value="string">String (Văn bản)</option>
                                  <option value="number">Number (Số)</option>
                                  <option value="boolean">Boolean (Đúng/Sai)</option>
                                </select>
                              </td>
                              <td>
                                <input 
                                  type="text" 
                                  className="form-input"
                                  style={{ padding: '6px 8px', fontSize: '12px' }}
                                  value={param.description}
                                  onChange={(e) => handleUpdateParam(selectedTool.id, index, 'description', e.target.value)}
                                />
                              </td>
                              <td>
                                <label className="status-switch">
                                  <input 
                                    type="checkbox" 
                                    checked={param.required}
                                    onChange={(e) => handleUpdateParam(selectedTool.id, index, 'required', e.target.checked)}
                                  />
                                  <span className="status-slider"></span>
                                </label>
                              </td>
                              <td>
                                <button 
                                  className="param-delete-btn"
                                  onClick={() => handleDeleteParam(selectedTool.id, index)}
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* AI Prompt Generator box */}
                  <div className="tool-config-section">
                    <div className="tool-section-title">
                      <Cpu size={18} style={{ color: '#a855f7' }} />
                      <span>Trợ lý sinh mô tả & Prompt AI cho Tool</span>
                    </div>

                    <div className="ai-assistant-box">
                      <div className="ai-assistant-header">
                        <Cpu size={14} />
                        <span>Trợ lý LLM Generator</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
                        Nhập ý tưởng hoạt động của công cụ bằng ngôn ngữ tự nhiên. Trợ lý AI sẽ tự động sinh mô tả chức năng và System Prompt hướng dẫn cách Agent gọi công cụ này.
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <textarea 
                          className="form-textarea"
                          rows={2}
                          style={{ flex: 1, fontSize: '13px' }}
                          value={aiPromptInput}
                          onChange={(e) => setAiPromptInput(e.target.value)}
                          placeholder="Ví dụ: Tạo công cụ giúp tôi tra cứu giá vàng hôm nay tại Việt Nam..."
                        />
                        <button 
                          className="btn btn-primary"
                          style={{ alignSelf: 'flex-end', background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)', color: 'white', border: 'none', padding: '12px 16px' }}
                          onClick={handleGeneratePrompt}
                          disabled={isGeneratingPrompt || !aiPromptInput.trim()}
                        >
                          {isGeneratingPrompt ? 'Đang sinh...' : '🤖 Sinh Prompt'}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">System Prompt hướng dẫn Agent gọi Tool:</label>
                      <textarea 
                        className="form-textarea"
                        rows={4}
                        style={{ fontFamily: 'var(--font-sans)', fontSize: '13px' }}
                        value={selectedTool.systemPrompt}
                        onChange={(e) => handleUpdateToolField(selectedTool.id, 'systemPrompt', e.target.value)}
                        placeholder="System instructions cho Agent biết cách sử dụng và phản hồi của tool..."
                      />
                    </div>
                  </div>

                  {/* Playground Testing Section */}
                  <div className="tool-config-section" style={{ marginBottom: '24px' }}>
                    <div className="tool-section-title">
                      <Play size={18} style={{ color: 'var(--warning)' }} />
                      <span>Playground (Chạy thử & Kiểm tra phản hồi)</span>
                    </div>

                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                      Kiểm thử phản hồi JSON của công cụ bằng cách điền các tham số dưới đây.
                    </p>

                    {selectedTool.params.length === 0 ? (
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                        Không có tham số nào cần truyền.
                      </div>
                    ) : (
                      <div className="playground-grid">
                        {selectedTool.params.map(param => (
                          <div className="form-group" key={param.name}>
                            <label className="form-label">
                              {param.name} {param.required && <span style={{ color: 'var(--error)' }}>*</span>}
                              <span style={{ fontSize: '11px', fontWeight: 'normal', color: 'var(--text-muted)', marginLeft: '4px' }}>
                                ({param.type})
                              </span>
                            </label>
                            
                            {param.type === 'boolean' ? (
                              <select 
                                className="form-select"
                                value={testParams[param.name] || 'false'}
                                onChange={(e) => setTestParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                              >
                                <option value="false">False (Sai)</option>
                                <option value="true">True (Đúng)</option>
                              </select>
                            ) : (
                              <input 
                                type={param.type === 'number' ? 'number' : 'text'}
                                className="form-input"
                                value={testParams[param.name] || ''}
                                onChange={(e) => setTestParams(prev => ({ ...prev, [param.name]: e.target.value }))}
                                placeholder={param.description}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
                      <button 
                        className="btn btn-primary"
                        style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: 'white', border: 'none' }}
                        onClick={handleTestTool}
                        disabled={isTestingTool}
                      >
                        {isTestingTool ? 'Đang chạy thử...' : '▶ Chạy thử công cụ'}
                      </button>
                    </div>

                    {testOutput && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                        <label className="form-label">Phản hồi JSON kết quả:</label>
                        <div className="playground-console">
                          {testOutput}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                  Vui lòng chọn hoặc tạo công cụ để bắt đầu cấu hình.
                </div>
              )}
            </div>
          );
        })()
      ) : (
        /* Google Flow Agent Dashboard (editorMode === 'agent-flow') */
        <div className="agent-flow-light-theme" style={{ display: 'flex', flex: 1, height: 'calc(100vh - 64px)', overflow: 'hidden', backgroundColor: '#f8fafc', color: '#1e293b', fontFamily: 'var(--font-sans)' }}>
          {/* Cột Trái: Chatbot hội thoại AI Agent */}
          <div className="agent-flow-sidebar-left" style={{ width: '320px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}>
            <div className="agent-flow-sidebar-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users size={16} style={{ color: '#4f46e5' }} />
                AI Agent Chatbot
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Theo dõi cuộc hội thoại giữa các AI Agents</p>
            </div>
            
            <div className="agent-flow-chat-thread" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {agentLogs.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', padding: '20px', textAlign: 'center' }}>
                  <Users size={32} strokeWidth={1.5} style={{ marginBottom: '12px', color: '#cbd5e1' }} />
                  <p style={{ fontSize: '12px', margin: 0 }}>Chưa có thảo luận nào giữa các AI Agents.</p>
                  <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>Bấm nút <strong>Chạy thử</strong> ở góc trên bên phải để bắt đầu cuộc trò chuyện!</p>
                </div>
              ) : (
                <>
                  {agentLogs.map((chat, idx) => {
                    const isLeft = chat.agent !== 'Biên Tập Agent';
                    return (
                      <div 
                        key={idx} 
                        className={`agent-flow-chat-bubble ${isLeft ? 'left' : 'right'}`}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignSelf: isLeft ? 'flex-start' : 'flex-end',
                          maxWidth: '90%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          borderLeft: `4px solid ${chat.color}`,
                          backgroundColor: '#f1f5f9',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', gap: '16px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: chat.color }}>{chat.agent}</span>
                          <span style={{ fontSize: '9px', color: '#94a3b8' }}>{chat.time}</span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#334155', margin: 0, lineHeight: '1.4' }}>{chat.message}</p>
                      </div>
                    );
                  })}
                  
                  {/* Blinking Typing Indicators */}
                  {(agentStatuses.writer === 'thinking' || agentStatuses.writer === 'active') && (
                    <div className="agent-flow-typing" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px', borderRadius: '12px', borderLeft: '4px solid #a855f7', backgroundColor: '#f1f5f9', alignSelf: 'flex-start' }}>
                      <span style={{ color: '#a855f7', fontSize: '11px', fontWeight: 600, marginRight: '4px' }}>Biên Kịch</span>
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#a855f7', animation: 'blink 1.4s infinite both' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#a855f7', animation: 'blink 1.4s infinite both 0.2s' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#a855f7', animation: 'blink 1.4s infinite both 0.4s' }} />
                    </div>
                  )}
                  {(agentStatuses.director === 'thinking' || agentStatuses.director === 'active') && (
                    <div className="agent-flow-typing" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px', borderRadius: '12px', borderLeft: '4px solid #3b82f6', backgroundColor: '#f1f5f9', alignSelf: 'flex-start' }}>
                      <span style={{ color: '#3b82f6', fontSize: '11px', fontWeight: 600, marginRight: '4px' }}>Đạo Diễn</span>
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6', animation: 'blink 1.4s infinite both' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6', animation: 'blink 1.4s infinite both 0.2s' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6', animation: 'blink 1.4s infinite both 0.4s' }} />
                    </div>
                  )}
                  {(agentStatuses.voice === 'thinking' || agentStatuses.voice === 'active') && (
                    <div className="agent-flow-typing" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px', borderRadius: '12px', borderLeft: '4px solid #f97316', backgroundColor: '#f1f5f9', alignSelf: 'flex-start' }}>
                      <span style={{ color: '#f97316', fontSize: '11px', fontWeight: 600, marginRight: '4px' }}>Âm Thanh</span>
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f97316', animation: 'blink 1.4s infinite both' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f97316', animation: 'blink 1.4s infinite both 0.2s' }} />
                      <div className="typing-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#f97316', animation: 'blink 1.4s infinite both 0.4s' }} />
                    </div>
                  )}
                  
                  <div ref={chatEndRef} />
                </>
              )}
            </div>
            
            <div style={{ padding: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input text-chat-input" 
                style={{ flex: 1, fontSize: '12px', height: '34px', padding: '6px 10px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }} 
                placeholder="Nhập tin nhắn..." 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const text = (e.target as HTMLInputElement).value.trim();
                    if (text) {
                      addAgentLog('Biên Tập Agent', text, '#10b981');
                      (e.target as HTMLInputElement).value = '';
                      // Simulate a response from agents
                      setTimeout(() => {
                        addAgentLog('Biên Kịch Agent', `Tôi ghi nhận yêu cầu của Biên tập: "${text}". Tôi đang tiến hành cập nhật lại phân cảnh.`, '#a855f7');
                      }, 1000);
                    }
                  }
                }}
              />
              <button 
                className="btn btn-primary" 
                style={{ height: '34px', padding: '0 12px', fontSize: '12px', backgroundColor: '#4f46e5' }}
                onClick={() => {
                  const input = document.querySelector('.text-chat-input') as HTMLInputElement;
                  const text = input?.value.trim();
                  if (text) {
                    addAgentLog('Biên Tập Agent', text, '#10b981');
                    input.value = '';
                    setTimeout(() => {
                      addAgentLog('Biên Kịch Agent', `Tôi ghi nhận yêu cầu của Biên tập: "${text}". Tôi đang tiến hành cập nhật lại phân cảnh.`, '#a855f7');
                    }, 1000);
                  }
                }}
              >
                Gửi
              </button>
            </div>
          </div>

          {/* Cột Giữa: Sơ đồ Agent Flow và Khu vực thiết kế chai nước chấm */}
          <div className="agent-flow-main-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '24px', gap: '20px' }}>
            {/* Sơ đồ Flow kết nối các Agents */}
            <div className="agent-flowchart-card" style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '16px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sơ đồ điều phối AI Agent (Google Flow)</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', position: 'relative', padding: '10px 0' }}>
                {/* Node 1: Biên Kịch */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: agentStatuses.writer !== 'idle' ? '#faf5ff' : '#f8fafc',
                    border: `2px solid ${agentStatuses.writer !== 'idle' ? '#a855f7' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: agentStatuses.writer === 'active' ? '0 0 12px rgba(168, 85, 247, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <Users size={24} style={{ color: agentStatuses.writer !== 'idle' ? '#a855f7' : '#64748b' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Biên Kịch Agent</span>
                  <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '10px' }}>{writerModel}</span>
                </div>

                {/* Arrow 1 */}
                <div style={{ flex: 1, height: '2px', backgroundColor: agentStatuses.writer === 'success' ? '#a855f7' : '#cbd5e1', margin: '0 12px', position: 'relative', maxWidth: '80px' }}>
                  <div className="flow-arrow-head" style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', borderTop: `2px solid ${agentStatuses.writer === 'success' ? '#a855f7' : '#cbd5e1'}`, borderRight: `2px solid ${agentStatuses.writer === 'success' ? '#a855f7' : '#cbd5e1'}`, transform: 'rotate(45deg)' }} />
                  {agentStatuses.writer === 'active' && <div className="flow-arrow-pulse" />}
                </div>

                {/* Node 2: Đạo Diễn */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: agentStatuses.director !== 'idle' ? '#eff6ff' : '#f8fafc',
                    border: `2px solid ${agentStatuses.director !== 'idle' ? '#3b82f6' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: agentStatuses.director === 'active' ? '0 0 12px rgba(59, 130, 246, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <Cpu size={24} style={{ color: agentStatuses.director !== 'idle' ? '#3b82f6' : '#64748b' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Đạo Diễn Visual</span>
                  <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '10px' }}>{directorModel}</span>
                </div>

                {/* Arrow 2 */}
                <div style={{ flex: 1, height: '2px', backgroundColor: agentStatuses.director === 'success' ? '#3b82f6' : '#cbd5e1', margin: '0 12px', position: 'relative', maxWidth: '80px' }}>
                  <div className="flow-arrow-head" style={{ position: 'absolute', right: 0, top: '-4px', width: '10px', height: '10px', borderTop: `2px solid ${agentStatuses.director === 'success' ? '#3b82f6' : '#cbd5e1'}`, borderRight: `2px solid ${agentStatuses.director === 'success' ? '#3b82f6' : '#cbd5e1'}`, transform: 'rotate(45deg)' }} />
                  {agentStatuses.director === 'active' && <div className="flow-arrow-pulse" />}
                </div>

                {/* Node 3: Âm Thanh */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 2 }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%', backgroundColor: agentStatuses.voice !== 'idle' ? '#fff7ed' : '#f8fafc',
                    border: `2px solid ${agentStatuses.voice !== 'idle' ? '#f97316' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: agentStatuses.voice === 'active' ? '0 0 12px rgba(249, 115, 22, 0.4)' : 'none',
                    transition: 'all 0.3s ease'
                  }}>
                    <Volume2 size={24} style={{ color: agentStatuses.voice !== 'idle' ? '#f97316' : '#64748b' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Lồng Tiếng AI</span>
                  <span style={{ fontSize: '10px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '10px' }}>TTS Engine</span>
                </div>
              </div>
            </div>

            {/* Khu vực thiết kế chai nước chấm hải sản (F&B Creative Tool) */}
            <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Ứng dụng Tạo ảnh Visual Nước chấm Hải sản (F&B AI Generator)</h3>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>Dành cho Shop affiliate, brand nhỏ, thiết kế nhanh ad creative F&B</p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#4f46e5', backgroundColor: '#e0e7ff', padding: '4px 10px', borderRadius: '12px' }}>F&B Tool</span>
              </div>

              <div style={{ display: 'flex', gap: '24px' }}>
                {/* Left side: Upload & Parameters */}
                <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Upload zone */}
                  <div className="fb-upload-zone" style={{ border: '2px dashed #cbd5e1', borderRadius: '12px', padding: '20px', textAlign: 'center', backgroundColor: '#f8fafc', transition: 'all 0.2s', position: 'relative' }}>
                    {fbPhoto ? (
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img src={fbPhoto} alt="Product upload" style={{ maxHeight: '140px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }} />
                        <button 
                          className="param-delete-btn" 
                          style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                          onClick={() => setFbPhoto('')}
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Upload size={32} style={{ color: '#94a3b8' }} />
                        <span style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>Kéo thả ảnh chai nước chấm vào đây hoặc click duyệt file</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0, cursor: 'pointer' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                setFbPhoto(evt.target?.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        
                        <div style={{ marginTop: '12px', width: '100%' }}>
                          <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginBottom: '6px' }}>Hoặc chọn nhanh chai mẫu có sẵn:</span>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                            <div 
                              className="sample-bottle-item"
                              style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '2px', cursor: 'pointer', backgroundColor: '#fff' }}
                              onClick={() => {
                                setFbPhoto('https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80');
                                addLog("Đã chọn Chai Nước sốt Ớt làm mẫu", "info");
                              }}
                              title="Chai Sốt Ớt Đỏ"
                            >
                              <img src="https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&q=80" alt="Chai Ớt" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div 
                              className="sample-bottle-item"
                              style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '2px', cursor: 'pointer', backgroundColor: '#fff' }}
                              onClick={() => {
                                setFbPhoto('https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&q=80');
                                addLog("Đã chọn Chai Sốt Gia vị Xanh làm mẫu", "info");
                              }}
                              title="Chai Gia Vị Xanh"
                            >
                              <img src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100&q=80" alt="Chai Gia vị" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div 
                              className="sample-bottle-item"
                              style={{ width: '45px', height: '45px', borderRadius: '6px', border: '1px solid #e2e8f0', padding: '2px', cursor: 'pointer', backgroundColor: '#fff' }}
                              onClick={() => {
                                setFbPhoto('https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80');
                                addLog("Đã chọn Chai Dầu hào / Nước chấm làm mẫu", "info");
                              }}
                              title="Chai Nước Sốt Gourmet"
                            >
                              <img src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80" alt="Chai Gourmet" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Brand name & benefit inputs */}
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Tên Thương hiệu nước chấm:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '13px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }}
                      value={fbBrandName} 
                      onChange={(e) => setFbBrandName(e.target.value)} 
                      placeholder="VD: Nước Mắm Nha Trang..."
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ color: '#475569' }}>Thông điệp / Lợi ích cốt lõi:</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      style={{ fontSize: '13px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }}
                      value={fbBenefit} 
                      onChange={(e) => setFbBenefit(e.target.value)} 
                      placeholder="VD: Chua cay, đậm vị hải sản tươi nguyên chất..."
                    />
                  </div>
                </div>

                {/* Right side: Scene styles selection & Execution */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '1px solid #f1f5f9', paddingLeft: '24px' }}>
                  <label className="form-label" style={{ color: '#475569', marginBottom: 0 }}>Chọn Phong cách bối cảnh:</label>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div 
                      onClick={() => setFbStyle('restaurant')}
                      style={{
                        padding: '12px', borderRadius: '10px', border: `2px solid ${fbStyle === 'restaurant' ? '#4f46e5' : '#e2e8f0'}`,
                        backgroundColor: fbStyle === 'restaurant' ? '#faf5ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&q=80" alt="Restaurant" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Bàn ăn nhà hàng</div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>restaurant table setting</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFbStyle('flatlay')}
                      style={{
                        padding: '12px', borderRadius: '10px', border: `2px solid ${fbStyle === 'flatlay' ? '#4f46e5' : '#e2e8f0'}`,
                        backgroundColor: fbStyle === 'flatlay' ? '#faf5ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=100&q=80" alt="Flat lay" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Chụp từ trên xuống (Flat lay)</div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>flat lay food photography</div>
                      </div>
                    </div>

                    <div 
                      onClick={() => setFbStyle('instagram')}
                      style={{
                        padding: '12px', borderRadius: '10px', border: `2px solid ${fbStyle === 'instagram' ? '#4f46e5' : '#e2e8f0'}`,
                        backgroundColor: fbStyle === 'instagram' ? '#faf5ff' : '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ width: '40px', height: '40px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                        <img src="https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=100&q=80" alt="Instagram" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155' }}>Instagram Lifestyle</div>
                        <div style={{ fontSize: '10.5px', color: '#64748b' }}>lifestyle Instagram aesthetic</div>
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn btn-primary animate-btn-pulse" 
                    style={{
                      height: '42px', width: '100%', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)', color: 'white', border: 'none', fontWeight: 600,
                      marginTop: '8px', fontSize: '13px'
                    }}
                    onClick={handleGenerateFBVisual}
                    disabled={fbStatus !== 'idle' && fbStatus !== 'done'}
                  >
                    {fbStatus === 'idle' && '🚀 Tạo Visual chai nước chấm'}
                    {fbStatus === 'cleaning' && '✂ 1. Đang tách nền chai...'}
                    {fbStatus === 'placing' && '🖼 2. Đang lồng bối cảnh...'}
                    {fbStatus === 'lighting' && '☀️ 3. Đang cân ánh sáng & đổ bóng...'}
                    {fbStatus === 'done' && 'Tạo lại Visual'}
                  </button>
                </div>
              </div>

              {/* Progress animation banner */}
              {fbStatus !== 'idle' && fbStatus !== 'done' && (
                <div style={{
                  padding: '16px', borderRadius: '12px', background: 'linear-gradient(90deg, #f3f4f6 0%, #eff6ff 100%)',
                  border: '1px solid #dbeafe', display: 'flex', flexDirection: 'column', gap: '8px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#1e40af' }}>
                      {fbStatus === 'cleaning' && 'Tiến trình: 33% - Tách nền vật thể (Background Removal)...'}
                      {fbStatus === 'placing' && 'Tiến trình: 66% - Tích hợp bối cảnh thông minh (Scene Placement)...'}
                      {fbStatus === 'lighting' && 'Tiến trình: 90% - Xử lý đổ bóng & ánh sáng động (Realistic Shadows)...'}
                    </span>
                    <div className="fb-spinner" />
                  </div>
                  <div style={{ height: '6px', width: '100%', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', backgroundColor: '#3b82f6', transition: 'width 0.8s ease',
                      width: fbStatus === 'cleaning' ? '33%' : fbStatus === 'placing' ? '66%' : '90%'
                    }} />
                  </div>
                </div>
              )}

              {/* Output variants */}
              {fbStatus === 'done' && fbGeneratedImages.length > 0 && (
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#334155', margin: 0 }}>3 Biến thể ảnh Ad Creative tạo bởi AI:</h4>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                    {fbGeneratedImages.map((imgUrl, i) => (
                      <div key={i} className="fb-output-variant" style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ flex: 1, aspectRatio: '1/1', position: 'relative', overflow: 'hidden', backgroundColor: '#e2e8f0' }}>
                          <img src={imgUrl} alt={`Variant ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {/* Mock bottle overlay to show placement */}
                          {fbPhoto && (
                            <img 
                              src={fbPhoto} 
                              alt="Bottle Overlay" 
                              className="fb-mock-bottle-overlay"
                              style={{ 
                                position: 'absolute', 
                                bottom: '10%', 
                                left: '50%', 
                                transform: 'translateX(-50%)', 
                                height: '55%', 
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))'
                              }} 
                            />
                          )}
                          <div style={{ position: 'absolute', bottom: '6px', left: '6px', backgroundColor: 'rgba(15,23,42,0.75)', color: 'white', fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                            Biến thể {i+1}
                          </div>
                        </div>

                        <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fbBrandName}</div>
                          <div style={{ fontSize: '9px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fbBenefit}</div>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginTop: '4px' }}>
                            <button 
                              className="btn" 
                              style={{ padding: '4px 2px', fontSize: '9.5px', justifyContent: 'center', height: '24px', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                              onClick={() => handleDownloadVariant(imgUrl, '1:1')}
                            >
                              Tải 1:1
                            </button>
                            <button 
                              className="btn" 
                              style={{ padding: '4px 2px', fontSize: '9.5px', justifyContent: 'center', height: '24px', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                              onClick={() => handleDownloadVariant(imgUrl, '4:5')}
                            >
                              Tải 4:5
                            </button>
                            <button 
                              className="btn" 
                              style={{ padding: '4px 2px', fontSize: '9.5px', justifyContent: 'center', height: '24px', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                              onClick={() => handleDownloadVariant(imgUrl, '9:16')}
                            >
                              Tải 9:16
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Cột Phải: Tham số Agent cấu hình nhanh và Video Preview */}
          <div className="agent-flow-sidebar-right" style={{ width: '320px', borderLeft: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff', overflowY: 'auto' }}>
            <div className="agent-flow-sidebar-header" style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Settings size={16} style={{ color: '#4f46e5' }} />
                Tham số Agents
              </h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0' }}>Định tuyến và cấu hình tham số mô hình</p>
            </div>
            
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <div className="form-group">
                <label className="form-label" style={{ color: '#475569' }}>Nhiệt độ sáng tạo (Temperature):</label>
                <input type="range" min="0" max="1" step="0.1" defaultValue="0.7" style={{ padding: 0 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748b' }}>
                  <span>0.0 (Chính xác)</span>
                  <span>1.0 (Sáng tạo)</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#475569' }}>Định tuyến Mô hình (Routing):</label>
                <select className="form-select" defaultValue="auto" style={{ fontSize: '12px', padding: '6px 10px', backgroundColor: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }}>
                  <option value="auto">Auto-routing (Tối ưu chi phí)</option>
                  <option value="high-performance">High Performance (Ưu tiên mô hình mạnh)</option>
                  <option value="local">Local Only (Chạy offline qua Ollama)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ color: '#475569' }}>Lưu trữ dữ liệu hội thoại:</label>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
                  <label className="status-switch" style={{ width: '44px', height: '22px' }}>
                    <input type="checkbox" defaultChecked />
                    <span className="status-slider"></span>
                  </label>
                  <span style={{ fontSize: '12px', marginLeft: '10px', color: '#475569' }}>Ghi nhớ Logs</span>
                </div>
              </div>
            </div>

            {/* Video preview monitor */}
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', backgroundColor: '#f8fafc' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Màn hình xem trước video</span>
              
              <div className="video-screen" style={{
                aspectRatio: aspectRatio === '9:16' ? '9/16' : 
                             aspectRatio === '1:1' ? '1/1' : 
                             aspectRatio === '4:5' ? '4/5' : 
                             aspectRatio === '21:9' ? '21/9' : '16/9',
                maxHeight: 'none',
                height: '180px',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                backgroundColor: '#000000',
                position: 'relative'
              }}>
                {workflowCompleted ? (
                  <>
                    <img 
                      src={scenes[activeSceneIndex].image} 
                      alt="Active scene" 
                      className={getFxClass()}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} 
                    />
                    <div style={{ position: 'absolute', bottom: '15px', left: '10px', right: '10px', display: 'flex', justifyContent: 'center' }}>
                      <span style={getSubStyle()}>
                        {scenes[activeSceneIndex].text}
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
                  <div style={{ color: '#94a3b8', fontSize: '11px', textAlign: 'center', padding: '16px' }}>
                    Đang chờ xuất bản video...
                  </div>
                )}
              </div>

              {workflowCompleted && (
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', marginTop: '4px' }}>
                  <button 
                    className="btn" 
                    style={{ padding: '3px 8px', fontSize: '11px', height: '24px', backgroundColor: '#ffffff', borderColor: '#cbd5e1' }}
                    onClick={() => {
                      setCurrentTime(0);
                      setIsPlayingPreview(false);
                    }}
                  >
                    <RotateCcw size={10} /> Reset
                  </button>
                  <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#64748b' }}>
                    {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Check size={16} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
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
