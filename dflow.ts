export type DflowId = string;
export type DflowNodeKind = string;

export type DflowPinKind = "input" | "output";

// Stolen from https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type DflowPinData = JsonValue;

export type DflowNodesCatalog = Record<DflowNodeKind, typeof DflowNode>;

export interface DflowItemSerialized {
  id: DflowId;
}

export interface DflowNodeSerialized extends DflowItemSerialized {
  kind: DflowNodeKind;
}

export interface DflowPinSerialized {
  id: DflowId;
  data?: DflowPinData;
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

export class DflowPin {
  readonly id: DflowId;
  data?: DflowPinData;

  constructor({ id, data }: DflowPinSerialized) {
    this.id = id;
    this.data = data;
  }

  toJSON(): string {
    return JSON.stringify({ id: this.id });
  }
}

export class DflowNode {
  readonly graph: DflowGraph;
  readonly id: DflowId;
  readonly kind: string;
  readonly inputs: Map<DflowId, DflowPin> = new Map();
  readonly outputs: Map<DflowId, DflowPin> = new Map();

  constructor(graph: DflowGraph, { id, kind }: DflowNodeSerialized) {
    this.graph = graph;
    this.id = id;
    this.kind = kind;
  }

  toJSON(): string {
    const inputs = Object.values(this.inputs).map((input) => input.toJSON());
    const outputs = Object.values(this.outputs).map((output) =>
      output.toJSON()
    );
    return JSON.stringify({ id: this.id, kind: this.kind, inputs, outputs });
  }
}

export class DflowUnknownNode extends DflowNode {
  static kind = "Unknown";

  constructor(graph: DflowGraph, nodeJson: DflowNodeSerialized) {
    super(graph, { ...nodeJson, kind: DflowUnknownNode.kind });
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
  readonly #nodesCatalog: DflowNodesCatalog;

  constructor(nodesCatalog: DflowNodesCatalog = {}) {
    this.#nodesCatalog = nodesCatalog;
  }

  addNode(nodeJson: DflowNodeSerialized) {
    const NodeClass = this.#nodesCatalog[nodeJson.kind] ?? DflowUnknownNode;
    const node = new NodeClass(this.graph, nodeJson);
    this.graph.nodes.set(node.id, node);
  }

  addEdge(edgeJson: DflowEdgeSerialized) {
    const edge = new DflowEdge(edgeJson);
    this.graph.edges.set(edge.id, edge);
  }

  addInput(nodeId: DflowId, pinJson: DflowPinSerialized) {
    const pin = new DflowPin(pinJson);
    const node = this.graph.nodes.get(nodeId);
    node?.inputs.set(pinJson.id, pin);
  }

  addOutput(nodeId: DflowId, pinJson: DflowPinSerialized) {
    const pin = new DflowPin(pinJson);
    const node = this.graph.nodes.get(nodeId);
    node?.outputs.set(pinJson.id, pin);
  }

  clearGraph() {
    this.graph.nodes.clear();
    this.graph.edges.clear();
  }
}
