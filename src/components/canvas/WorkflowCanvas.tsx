import React, { useCallback } from 'react';
import { ReactFlow, Background, type Connection, type Edge, type Node, addEdge } from '@xyflow/react';
import { useWorkflowStore } from '../../store/workflowStore';
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
} from '../CustomNodes';

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
};

interface WorkflowCanvasProps {
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onEdgeClick: (event: React.MouseEvent, edge: Edge) => void;
  onPaneClick: () => void;
  selectedEdgeId: string | null;
}

export function WorkflowCanvas({ onNodeClick, onEdgeClick, onPaneClick, selectedEdgeId }: WorkflowCanvasProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, setEdges } = useWorkflowStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

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

  return (
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
  );
}
