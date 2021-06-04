export type DflowId = string;

export type DflowPinKind = "input" | "output";

export interface DflowItemSerialized {
  id: string;
}

export interface DflowNodeSerialized extends DflowItemSerialized {
  kind: string;
}

export interface DflowPinPathSerialized {
  nodeId: DflowId;
  pinId: DflowId;
  pinKind: DflowPinKind;
}

export interface DflowEdgeSerialized extends DflowItemSerialized {
  source: Omit<DflowPinPathSerialized, "pinKind">;
  target: Omit<DflowPinPathSerialized, "pinKind">;
}

export interface DflowGraphSerialized {
  nodes: DflowNodeSerialized[];
  edges: DflowEdgeSerialized[];
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

export class DflowEdge {
  readonly id: string;
  readonly source: DflowPinPathSerialized;
  readonly target: DflowPinPathSerialized;

  constructor({ id, source, target }: DflowEdgeSerialized) {
    this.id = id;
    this.source = { ...source, pinKind: "output" };
    this.target = { ...target, pinKind: "input" };
  }

  toJSON(): string {
    return JSON.stringify({ id: this.id });
  }
}

export class DflowGraph {
  readonly nodes: Map<DflowId, DflowNode> = new Map();
  readonly edges: Map<DflowId, DflowEdge> = new Map();

  toJSON(): string {
    const nodes = Object.values(this.nodes).map((node) => node.toJSON());
    const edges = Object.values(this.edges).map((edge) => edge.toJSON());

    return JSON.stringify({ nodes, edges });
  }
}

export class DflowHost {
  readonly graph = new DflowGraph();

  addNode(nodeJson: DflowNodeSerialized) {
    const node = new DflowNode(this.graph, nodeJson);
    this.graph.nodes.set(node.id, node);
  }

  addEdge(edgeJson: DflowEdgeSerialized) {
    const edge = new DflowEdge(edgeJson);
    this.graph.edges.set(edge.id, edge);
  }

  clearGraph() {
    this.graph.nodes.clear();
    this.graph.edges.clear();
  }
}
