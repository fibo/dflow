export type DflowId = string;

export interface DflowNodeSerialized {
  id: string;
  kind: string;
}

export class DflowNode {
  readonly graph: DflowGraph;
  readonly id: string;
  readonly kind: string;

  constructor(graph: DflowGraph, { id, kind }: DflowNodeSerialized) {
    this.graph = graph;
    this.id = id;
    this.kind = kind;
  }

  toJSON(): string {
    return JSON.stringify({ id: this.id, kind: this.kind });
  }
}

export class DflowGraph {
  nodes: Map<DflowId, DflowNode> = new Map();

  toJSON(): string {
    const nodes = Object.values(this.nodes).map((node) => node.toJSON());

    return JSON.stringify({ nodes, edges: [] });
  }
}

export class DflowHost {
  readonly graph = new DflowGraph();

  addNode(nodeJson: DflowNodeSerialized) {
    const node = new DflowNode(this.graph, nodeJson);
    this.graph.nodes.set(node.id, node);
  }
}
