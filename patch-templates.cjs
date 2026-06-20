const fs = require('fs');
const path = './src/App.tsx';
let content = fs.readFileSync(path, 'utf8');

const startStr = "const loadTemplate = useCallback((templateType: 'prompt' | 'doc' | 'blog') => {";
const endStr = "  }, [promptValue, docValue, urlValue, setNodes, setEdges]);";

const startIdx = content.indexOf(startStr);
const endIdx = content.indexOf(endStr, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newTemplateFunction = `const loadTemplate = useCallback((templateType: 'prompt' | 'doc' | 'blog') => {
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
`;
  
  const newContent = content.substring(0, startIdx) + newTemplateFunction + "\n" + content.substring(endIdx);
  fs.writeFileSync(path, newContent, 'utf8');
  console.log("Template patched successfully");
} else {
  console.log("Could not find patch points");
}
