import { EdgeDefinition, NodeDefinition } from 'cytoscape';
import { useEffect, useState } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';

interface Node {
  id: string;
  label: string;
  [key: string]: any;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

interface GraphData {
  nodes: NodeDefinition[];
  edges: EdgeDefinition[];
}

interface Props {
  policyId: string;
}

export default function ReactGraphViewer({ policyId }: Props) {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  useEffect(() => {
    fetch(`http://localhost:3001/policy/${policyId}/graph`)
      .then(res => res.json())
      .then(data => {
        setGraph({ nodes: data.nodes || [], edges: data.edges || [] });
      });
  }, [policyId]);
  
  if (!graph) return <div>Loading graph...</div>;

  const elements = [...graph.nodes, ...graph.edges];

  return !graph.nodes.length ? <div>No graph data yet</div> : (
    <div style={{ width: '100%', height: '600px' }}>
      <CytoscapeComponent
        elements={elements}
        style={{ width: '100%', height: '100%' }}
        layout={{ name: 'grid' }}
        // layout={{ name: 'breadthfirst', directed: true, padding: 10 }}
        stylesheet={[
          { selector: 'node', style: { label: 'data(label)', 'background-color': '#3388AA', color: '#666' } },
          { selector: 'edge', style: { width: 2, 'line-color': '#aaa' } }
        ]}
      />
    </div>
  );
}
