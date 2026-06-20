import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Connection, Edge, Node, NodeChange, EdgeChange } from '@xyflow/react';
import { addEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export interface LogEntry {
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface Scene {
  id: number;
  title: string;
  image: string;
  text: string;
  duration: number;
  fx: string;
}

export interface AgentMessage {
  time: string;
  agent: 'Biên Kịch Agent' | 'Đạo Diễn Agent' | 'Biên Tập Agent' | 'Âm Thanh Agent';
  color: string;
  message: string;
}

export interface RenderConfig {
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
}

export interface Project {
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

export interface WorkflowState {
  projects: Project[];
  activeProjectId: string;
  
  // Active Project State Mapping
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
  renderConfig: RenderConfig;
  codeValue: string;
  customAIPrompt: string;
  customAIModel: string;

  // Global UI State
  language: 'vi' | 'en';
  logs: LogEntry[];
  agentLogs: AgentMessage[];
  isRunning: boolean;
  
  // Actions
  setLanguage: (lang: 'vi' | 'en') => void;
  addLog: (message: string, type: LogEntry['type']) => void;
  
  // Project Actions
  switchProject: (projectId: string) => void;
  createNewProject: () => void;
  deleteProject: (projectId: string) => void;
  saveProject: () => void;

  // React Flow Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: Node[] | ((nds: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;

  // Form Setters
  setPromptValue: (val: string) => void;
  setDocValue: (val: string) => void;
  setUrlValue: (val: string) => void;
  setAiTone: (val: string) => void;
  setSceneCount: (val: number) => void;
  setImageStyle: (val: string) => void;
  setTtsVoice: (val: string) => void;
  setTtsSpeed: (val: string) => void;
  setSubStyle: (val: string) => void;
  setSubColor: (val: string) => void;
  setAspectRatio: (val: string) => void;
  setTransitionSpeed: (val: string) => void;
  updateRenderConfig: <K extends keyof RenderConfig>(key: K, value: RenderConfig[K]) => void;
  
  // Execution
  setWorkflowCompleted: (completed: boolean) => void;
  loadTemplate: (templateType: 'prompt' | 'doc' | 'blog') => void;
}

const defaultRenderConfig: RenderConfig = {
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

const defaultProject: Project = {
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
  workflowCompleted: true,
  renderConfig: defaultRenderConfig,
  codeValue: '// Viết mã JS xử lý tại đây\nfunction process(scenes) {\n  console.log(\'Xử lý kịch bản\');\n  return scenes;\n}',
  customAIPrompt: 'Hãy viết lại lời dẫn cho kịch bản ngắn gọn, dí dỏm hơn.',
  customAIModel: 'gpt-4o'
};

export const useWorkflowStore = create<WorkflowState>()(
  persist(
    (set, get) => ({
      projects: [defaultProject],
      activeProjectId: defaultProject.id,
      
      nodes: defaultProject.nodes,
      edges: defaultProject.edges,
      scenes: defaultProject.scenes,
      promptValue: defaultProject.promptValue,
      docValue: defaultProject.docValue,
      urlValue: defaultProject.urlValue,
      aiTone: defaultProject.aiTone,
      sceneCount: defaultProject.sceneCount,
      imageStyle: defaultProject.imageStyle,
      ttsVoice: defaultProject.ttsVoice,
      ttsSpeed: defaultProject.ttsSpeed,
      subStyle: defaultProject.subStyle,
      subColor: defaultProject.subColor,
      aspectRatio: defaultProject.aspectRatio,
      transitionSpeed: defaultProject.transitionSpeed,
      workflowCompleted: defaultProject.workflowCompleted,
      renderConfig: defaultRenderConfig,
      codeValue: defaultProject.codeValue!,
      customAIPrompt: defaultProject.customAIPrompt!,
      customAIModel: defaultProject.customAIModel!,

      language: 'vi',
      logs: [],
      agentLogs: [],
      isRunning: false,

      setLanguage: (lang) => set({ language: lang }),
      
      addLog: (message, type) => set((state) => ({
        logs: [...state.logs, { time: new Date().toTimeString().split(' ')[0], type, message }]
      })),

      saveProject: () => {
        const state = get();
        set({
          projects: state.projects.map(p => {
            if (p.id === state.activeProjectId) {
              return {
                ...p,
                nodes: state.nodes,
                edges: state.edges,
                scenes: state.scenes,
                promptValue: state.promptValue,
                docValue: state.docValue,
                urlValue: state.urlValue,
                aiTone: state.aiTone,
                sceneCount: state.sceneCount,
                imageStyle: state.imageStyle,
                ttsVoice: state.ttsVoice,
                ttsSpeed: state.ttsSpeed,
                subStyle: state.subStyle,
                subColor: state.subColor,
                aspectRatio: state.aspectRatio,
                transitionSpeed: state.transitionSpeed,
                workflowCompleted: state.workflowCompleted,
                renderConfig: state.renderConfig,
                codeValue: state.codeValue,
                customAIPrompt: state.customAIPrompt,
                customAIModel: state.customAIModel
              };
            }
            return p;
          })
        });
      },

      switchProject: (projectId: string) => {
        const state = get();
        const target = state.projects.find(p => p.id === projectId);
        if (!target) return;
        set({
          activeProjectId: projectId,
          nodes: target.nodes,
          edges: target.edges,
          scenes: target.scenes,
          promptValue: target.promptValue,
          docValue: target.docValue,
          urlValue: target.urlValue,
          aiTone: target.aiTone,
          sceneCount: target.sceneCount,
          imageStyle: target.imageStyle,
          ttsVoice: target.ttsVoice,
          ttsSpeed: target.ttsSpeed,
          subStyle: target.subStyle,
          subColor: target.subColor,
          aspectRatio: target.aspectRatio,
          transitionSpeed: target.transitionSpeed,
          workflowCompleted: target.workflowCompleted,
          renderConfig: target.renderConfig || defaultRenderConfig,
          codeValue: target.codeValue || '',
          customAIPrompt: target.customAIPrompt || '',
          customAIModel: target.customAIModel || ''
        });
      },

      createNewProject: () => {
        const id = `project-${Date.now()}`;
        const newProj = { ...defaultProject, id, name: `Dự án mới ${new Date().toLocaleDateString()}` };
        set(state => ({
          projects: [...state.projects, newProj]
        }));
        get().switchProject(id);
      },

      deleteProject: (projectId: string) => {
        const state = get();
        if (state.projects.length <= 1) return;
        const newProjects = state.projects.filter(p => p.id !== projectId);
        set({ projects: newProjects });
        if (state.activeProjectId === projectId) {
          get().switchProject(newProjects[0].id);
        }
      },

      onNodesChange: (changes: NodeChange[]) => {
        set({ nodes: applyNodeChanges(changes, get().nodes) });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({ edges: applyEdgeChanges(changes, get().edges) });
      },
      onConnect: (connection: Connection) => {
        set({ edges: addEdge(connection, get().edges) });
      },
      setNodes: (nodes) => {
        set({ nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes });
      },
      setEdges: (edges) => {
        set({ edges: typeof edges === 'function' ? edges(get().edges) : edges });
      },

      setPromptValue: (val) => set({ promptValue: val }),
      setDocValue: (val) => set({ docValue: val }),
      setUrlValue: (val) => set({ urlValue: val }),
      setAiTone: (val) => set({ aiTone: val }),
      setSceneCount: (val) => set({ sceneCount: val }),
      setImageStyle: (val) => set({ imageStyle: val }),
      setTtsVoice: (val) => set({ ttsVoice: val }),
      setTtsSpeed: (val) => set({ ttsSpeed: val }),
      setSubStyle: (val) => set({ subStyle: val }),
      setSubColor: (val) => set({ subColor: val }),
      setAspectRatio: (val) => set({ aspectRatio: val }),
      setTransitionSpeed: (val) => set({ transitionSpeed: val }),
      updateRenderConfig: (key, value) => set(state => ({
        renderConfig: { ...state.renderConfig, [key]: value }
      })),
      setWorkflowCompleted: (completed) => set({ workflowCompleted: completed }),

      loadTemplate: (templateType) => {
        // Simple implementation for now. Logic from App.tsx.
        // We will expand this if needed.
        if (templateType === 'prompt') {
          set({
            nodes: defaultProject.nodes,
            edges: defaultProject.edges
          });
        }
      }
    }),
    {
      name: 'vietflow-storage',
      partialize: (state) => ({ projects: state.projects, activeProjectId: state.activeProjectId })
    }
  )
);
