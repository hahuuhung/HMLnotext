const fs = require('fs');

const appPath = './src/App.tsx';
let content = fs.readFileSync(appPath, 'utf8');

const startIdx = content.indexOf('const runWorkflow = useCallback(async () => {');
const endMarker = '}, [nodes, scenes, promptValue, imageStyle, ttsVoice, ttsSpeed, subStyle, subColor, isRunning, addLog, addAgentLog, setNodes, renderConfig, aspectRatio, codeValue, customAIPrompt, customAIModel, setScenes, setSceneCount]);';
const endIdx = content.indexOf(endMarker, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newRunWorkflow = `const runWorkflow = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    setWorkflowCompleted(false);
    setAgentLogs([]);
    setCurrentTime(0);
    setActiveTab('agents');
    addLog('Bắt đầu chạy luồng video theo Graph BFS Engine...', 'info');

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // Reset nodes
    setNodes((nds) => nds.map((n) => ({ ...n, data: { ...n.data, status: 'idle' } })));
    await sleep(400);

    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    let queue: string[] = triggerNodes.map(n => n.id);
    const visited = new Set<string>();
    
    // Create a local reference to scenes so we can mutate and read within BFS
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
        addAgentLog('Biên Kịch Agent', 'Đang tạo kịch bản AI...', '#a855f7');
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
              title: \`Cảnh \${idx + 1}\`,
              image: item.image || 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80',
              text: item.text,
              duration: 5,
              fx: 'none',
            }));
            setScenes(currentScenes);
            setSceneCount(currentScenes.length);
            addLog('AI Script tạo thành công', 'success');
          }
        } catch (e) {
           addLog('AI Script failed', 'error');
        }
      } else if (n.type === 'visualNode') {
        addLog('Xử lý Visual/Image Generation...', 'info');
        await sleep(1500);
      } else if (n.type === 'audioTTS') {
        addLog('Xử lý TTS Audio...', 'info');
        await sleep(1500);
      } else if (n.type === 'subtitle') {
        addLog('Xử lý Phụ đề/Hiệu ứng...', 'info');
        await sleep(1000);
      } else if (n.type === 'renderNode') {
        addLog('Bắt đầu Render FFmpeg...', 'info');
        await sleep(2000);
        addLog('Render thành công', 'success');
      } else if (n.type === 'logicNode') {
        const expression = n.data.expression || 'scenes.length > 2';
        let conditionMet = false;
        try {
           // eslint-disable-next-line
           const evalFunc = new Function('scenes', \`return \${expression};\`);
           conditionMet = evalFunc(currentScenes);
        } catch (e) {
           conditionMet = false;
        }
        addLog(\`Logic Node: Evaluated \${expression} -> \${conditionMet}\`, 'info');
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
  `;
  
  const newContent = content.substring(0, startIdx) + newRunWorkflow + "\n  " + endMarker + content.substring(endIdx + endMarker.length);
  fs.writeFileSync(appPath, newContent, 'utf8');
  console.log("Successfully patched runWorkflow with BFS engine");
} else {
  console.error("Could not find boundaries", startIdx, endIdx);
}
