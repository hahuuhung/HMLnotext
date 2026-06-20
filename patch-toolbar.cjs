const fs = require('fs');
const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Inject Imports
content = content.replace(
  "    Send\n} from 'lucide-react';",
  "    Send,\n    Undo,\n    FolderOpen,\n    Download\n} from 'lucide-react';"
);

// 2. Inject Undo State and Methods
const hookAnchor = "const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);";
const stateCode = `
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
`;
content = content.replace(hookAnchor, hookAnchor + "\n" + stateCode);

// 3. Track actions for undo
content = content.replace(
  "const addNodeDirectly = (type: string) => {",
  "const addNodeDirectly = (type: string) => {\n    pushUndo(nodes, edges);"
);
content = content.replace(
  "const deleteSelectedEdge = useCallback(() => {\n    if (!selectedEdgeId) return;\n    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));",
  "const deleteSelectedEdge = useCallback(() => {\n    if (!selectedEdgeId) return;\n    pushUndo(nodes, edges);\n    setEdges((eds) => eds.filter((e) => e.id !== selectedEdgeId));"
);
content = content.replace(
  "const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);",
  "const onConnect = useCallback((params: Connection) => {\n    pushUndo(nodes, edges);\n    setEdges((eds) => addEdge(params, eds));\n  }, [setEdges, pushUndo, nodes, edges]);"
);

// 4. Update the Canvas Toolbar
const toolbarAnchor = `<button className="canvas-toolbar-btn btn-save" onClick={saveWorkflowManual}>
                <Save size={14} />
                Lưu Workflow
              </button>`;
const newToolbar = `
              <button className="canvas-toolbar-btn" onClick={handleUndo}>
                <Undo size={14} />
                Hoàn tác
              </button>
              <button className="canvas-toolbar-btn" onClick={saveCanvasTemplate}>
                <Download size={14} />
                Tải Mẫu
              </button>
              <button className="canvas-toolbar-btn" onClick={loadCanvasTemplate}>
                <FolderOpen size={14} />
                Mở Mẫu
              </button>
              <button className="canvas-toolbar-btn btn-save" onClick={saveWorkflowManual}>
                <Save size={14} />
                Lưu Dự án
              </button>`;
content = content.replace(toolbarAnchor, newToolbar);

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully patched toolbar for undo and template save/load.');
