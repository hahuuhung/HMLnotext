import React, { useState, useCallback, useEffect } from 'react';
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
  Cpu,
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
  Plus,
  Save,
  Check
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
  fx: string;
}

interface AgentMessage {
  time: string;
  agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent';
  color: string;
  message: string;
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
}

function WorkflowBuilder() {
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
          { id: 't1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Thủ Công', status: 'idle' } },
          { id: 't2', type: 'inputNode', position: { x: 260, y: 150 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: 'Hương vị Cà phê phin Việt Nam' } },
          { id: 't3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle' } },
          { id: 't4', type: 'visualNode', position: { x: 700, y: 50 }, data: { label: 'Visual Node', status: 'idle' } },
          { id: 't5', type: 'audioTTS', position: { x: 700, y: 250 }, data: { label: 'Lồng Tiếng AI', status: 'idle' } },
          { id: 't6', type: 'subtitle', position: { x: 920, y: 150 }, data: { label: 'Phụ Đề', status: 'idle' } },
          { id: 't7', type: 'renderNode', position: { x: 1140, y: 150 }, data: { label: 'Xuất Bản', status: 'idle' } },
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
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '14:22:07', type: 'info', message: 'Kích hoạt Chế độ dựng phim Kdenlive.' },
    { time: '14:22:08', type: 'info', message: 'Media Project Bin và Effect Stack đã sẵn sàng.' }
  ]);
  const [agentLogs, setAgentLogs] = useState<AgentMessage[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [workflowCompleted, setWorkflowCompleted] = useState(initialProject.workflowCompleted);
  
  const [editorMode, setEditorMode] = useState<'workflow' | 'kdenlive'>('workflow');

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

  const [trackLocks, setTrackLocks] = useState({ visual: false, fx: false, audio: false, subtitle: false });
  const [trackMutes, setTrackMutes] = useState({ audio: false, subtitle: false });
  const [trackVisibility, setTrackVisibility] = useState({ visual: true, fx: true, subtitle: true });

  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
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
          workflowCompleted
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
    workflowCompleted
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
        { id: 't1', type: 'trigger', position: { x: 50, y: 150 }, data: { label: 'Chạy Thủ Công', status: 'idle' } },
        { id: 't2', type: 'inputNode', position: { x: 260, y: 150 }, data: { label: 'Đầu Vào Prompt', status: 'idle', value: 'Chủ đề video mới' } },
        { id: 't3', type: 'aiNode', position: { x: 480, y: 150 }, data: { label: 'AI Script', status: 'idle' } },
        { id: 't7', type: 'renderNode', position: { x: 700, y: 150 }, data: { label: 'Xuất Bản', status: 'idle' } },
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
      workflowCompleted: false
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
          setIsPlayingPreview(false);
          setPeakL(0);
          setPeakR(0);
          return 0;
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
  }, [isPlayingPreview, workflowCompleted, totalDuration, trackMutes.audio]);


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
    setSelectedNode(null);
    setWorkflowCompleted(false);
    setIsPlayingPreview(false);
    setCurrentTime(0);
    
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
      setAspectRatio('9:16');
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
    setSelectedEdgeId(null);
  }, []);

  const addNodeDirectly = (type: string) => {
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

    const id = (nodes.length + 1).toString();
    const position = {
      x: 350 + Math.random() * 80,
      y: 120 + Math.random() * 80,
    };

    const newNode: Node = {
      id,
      type,
      position,
      data: { 
        label: typeLabels[type] || 'Node Mới',
        status: 'idle',
        value: type === 'inputNode' ? promptValue : type === 'docInput' ? docValue : type === 'urlInput' ? urlValue : undefined
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

  // Run Workflow Simulation
  const runWorkflow = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setWorkflowCompleted(false);
    setAgentLogs([]);
    setCurrentTime(0);
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

    // 2. Input
    setNodes((nds) => nds.map((n) => (['inputNode', 'docInput', 'urlInput'].includes(n.type || '') ? { ...n, data: { ...n.data, status: 'running' } } : n)));
    addLog('Đang thu thập dữ liệu đầu vào...', 'info');
    await sleep(1000);
    setNodes((nds) => nds.map((n) => (['inputNode', 'docInput', 'urlInput'].includes(n.type || '') ? { ...n, data: { ...n.data, status: 'success' } } : n)));

    // 3. AI Script Node
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
    setCurrentTime(0);
    setActiveTab('timeline');
    addLog('Mẫu video đã được dựng xong hoàn hảo!', 'success');
  }, [nodes, promptValue, imageStyle, ttsVoice, ttsSpeed, subStyle, subColor, isRunning, addLog, addAgentLog, setNodes]);

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
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginRight: '32px' }}>
              {trackMutes.audio ? '[Tắt tiếng]' : `TTS - ${ttsVoice === 'nu-mien-bac' ? 'Nữ Bắc' : 'Nam Nam'}`}
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

        {/* Toggle Mode Buttons style in Kdenlive style */}
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

      {/* Main Workspace (conditional rendering based on editorMode) */}
      {editorMode === 'workflow' ? (
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
                  <div><div className="node-palette-name">Visual Node</div><div className="node-palette-desc">Sinh hình ảnh AI</div></div>
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
            {/* Canvas floating toolbar */}
            <div className="canvas-toolbar">
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
          <div className="bottom-panel">
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
      ) : (
        /* Shotcut NLE Professional Layout */
        <div className="kdenlive-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', backgroundColor: '#1a1924' }}>
          <div className="kdenlive-top-row" style={{ display: 'flex', flex: 1.2, borderBottom: '2px solid #2e2d3b', minHeight: 0 }}>
            
            {/* 1. Left Sidebar: Playlist / Filters / History */}
            <div className="project-bin" style={{ flex: 1.2, display: 'flex', flexDirection: 'column', borderRight: '1px solid #2e2d3b', minHeight: 0 }}>
              <div className="shotcut-panel-tabs">
                <button 
                  className={`shotcut-panel-tab-btn ${leftTab === 'playlist' ? 'active' : ''}`}
                  onClick={() => setLeftTab('playlist')}
                >
                  Playlist (DS Phát)
                </button>
                <button 
                  className={`shotcut-panel-tab-btn ${leftTab === 'filters' ? 'active' : ''}`}
                  onClick={() => setLeftTab('filters')}
                >
                  Bộ lọc (Filters)
                </button>
                <button 
                  className={`shotcut-panel-tab-btn ${leftTab === 'history' ? 'active' : ''}`}
                  onClick={() => setLeftTab('history')}
                >
                  Lịch sử
                </button>
              </div>

              <div className="kdenlive-panel-content" style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
                {leftTab === 'playlist' && (
                  <div>
                    <div className="media-item">
                      <FileText size={16} style={{ color: '#10b981' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">{docValue}</span>
                        <span className="media-item-meta">Tài liệu kịch bản gốc</span>
                      </div>
                    </div>
                    <div className="media-item">
                      <Globe size={16} style={{ color: '#3b82f6' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">{urlValue}</span>
                        <span className="media-item-meta">Trang quét nội dung</span>
                      </div>
                    </div>
                    <div className="media-item">
                      <Volume2 size={16} style={{ color: '#8b5cf6' }} />
                      <div className="media-item-info">
                        <span className="media-item-title">Giong_Doc_AI_TTS.mp3</span>
                        <span className="media-item-meta">Thuyết minh lồng tiếng</span>
                      </div>
                    </div>
                    {scenes.slice(0, sceneCount).map((scene, idx) => (
                      <div key={scene.id} className="media-item" onClick={() => {
                        setCurrentTime(idx * 4 + 0.1);
                        addHistory(`Xem trước (seek) Cảnh ${idx + 1}`);
                      }}>
                        <ImageIcon size={16} style={{ color: '#f59e0b' }} />
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
                      placeholder="Tìm bộ lọc Shotcut..." 
                      value={filterSearch}
                      onChange={(e) => setFilterSearch(e.target.value)}
                    />
                    
                    <div style={{ padding: '6px', background: '#15141e', borderRadius: '4px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bộ lọc hiện tại:</span>
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

            {/* 2. Center Panel: Project Monitor with Audio Peak Meter */}
            <div className="project-monitor" style={{ flex: 2, borderRight: '1px solid #2e2d3b', background: '#111', padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="kdenlive-panel-header" style={{ width: '100%', border: 'none', background: 'none', color: '#fff', marginBottom: '8px' }}>
                <Film size={12} />
                Project Monitor (Trình xem thử)
              </div>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: 0 }}>
                {/* Video screen */}
                <div className="video-screen" style={{ width: aspectRatio === '9:16' ? '160px' : '280px', aspectRatio: aspectRatio === '9:16' ? '9/16' : '16/9', maxHeight: 'none', height: '220px', position: 'relative' }}>
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

                {/* Shotcut Audio Peak Meter */}
                <div className="shotcut-peak-meter-container" title="Audio Peak Meter (Shotcut Style)">
                  <div className="shotcut-peak-meter-channel">
                    <div className="peak-meter-bar" style={{ height: `${peakL}%` }} />
                  </div>
                  <div className="shotcut-peak-meter-channel">
                    <div className="peak-meter-bar" style={{ height: `${peakR}%` }} />
                  </div>
                  <div className="peak-meter-db-labels">
                    <span>0</span>
                    <span>-6</span>
                    <span>-12</span>
                    <span>-18</span>
                    <span>-24</span>
                    <span>-30</span>
                    <span>-42</span>
                    <span>-50</span>
                  </div>
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
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#a3a1b3' }}>
                    {currentTime.toFixed(1)}s / {totalDuration.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>

            {/* 3. Right Panel: Jobs (Export Tasks) */}
            <div className="shotcut-jobs-panel">
              <div className="kdenlive-panel-header">
                <Sliders size={12} />
                Jobs (Công việc xuất bản)
              </div>
              <div className="kdenlive-panel-content">
                {exportJobs.map(job => (
                  <div key={job.id} className="shotcut-job-item">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: '#e2e0e8' }}>{job.name}</span>
                      <span style={{ color: job.progress === 100 ? '#10b981' : 'var(--primary)' }}>
                        {job.progress}%
                      </span>
                    </div>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Trạng thái: {job.status}</span>
                    <div className="shotcut-job-progress-bar">
                      <div className="shotcut-job-progress-fill" style={{ width: `${job.progress}%` }} />
                    </div>
                  </div>
                ))}
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', fontSize: '11px', marginTop: '12px', padding: '6px' }}
                  onClick={() => {
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
                  }}
                  disabled={!workflowCompleted}
                >
                  + Khởi tạo Render Job mới
                </button>
              </div>
            </div>

          </div>

          {/* 4. Full Width Timeline */}
          <div className="kdenlive-bottom-row" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="kdenlive-panel-header" style={{ height: '32px', borderBottom: '1px solid #3d3b4f' }}>
              <Film size={12} />
              Shotcut Timeline Monitor (Dòng thời gian Shotcut)
            </div>

            {workflowCompleted && (
              <div className="kdenlive-timeline-toolbar">
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {/* Tool selection buttons */}
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
                      addHistory(`Đã ${!isSnapEnabled ? 'Bật' : 'Tắt'} bám dính (Snap)`);
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
