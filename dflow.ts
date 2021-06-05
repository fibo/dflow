export type DflowId = string;
export type DflowNodeKind = string;
export type DflowPinKind = "input" | "output";

// Stolen from https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type DflowPinData = JsonValue;

export type DflowNodesCatalog = Record<DflowNodeKind, typeof DflowNode>;

export interface DflowSerializedItem {
  id: DflowId;
}

export interface DflowSerializedNode extends DflowSerializedItem {
  kind: DflowNodeKind;
  inputs?: DflowSerializedPin[];
  outputs?: DflowSerializedPin[];
}

export interface DflowSerializedPin {
  id: DflowId;
  data?: DflowPinData;
}

export type DflowSerializedPinPath = [nodeId: DflowId, pinId: DflowId];

export interface DflowSerializedEdge extends DflowSerializedItem {
  source: DflowSerializedPinPath;
  target: DflowSerializedPinPath;
}

export interface DflowSerializedGraph {
  nodes: DflowSerializedNode[];
  edges: DflowSerializedEdge[];
}

export class DflowPin {
  readonly id: DflowId;
  readonly kind: DflowPinKind;
  #data?: DflowPinData;
  #source?: DflowPin;

  constructor(kind: DflowPinKind, { id, data }: DflowSerializedPin) {
    this.kind = kind;
    this.id = id;
    this.setData(data);
  }

  connectTo(pin: DflowPin) {
    if (this.kind === "input") {
      this.#source = pin;
    }
  }

  getData(): DflowPinData | undefined {
    if (this.kind === "output") {
      return this.#data;
    } else {
      const source = this.#source;

      if (typeof source !== "undefined") {
        return source.getData();
      }
    }
  }

  setData(data?: DflowPinData) {
    if (typeof data !== "undefined") {
      this.#data = data;
    }
  }

  toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedPin {
    const serializedPin = { id: this.id } as DflowSerializedPin;
    if (typeof this.#data !== "undefined") {
      serializedPin.data = this.#data;
    }
    return serializedPin;
  }
}

export class DflowNode {
  readonly graph: DflowGraph;
  readonly id: DflowId;
  readonly kind: string;
  readonly isAsync: boolean;
  readonly inputs: Map<DflowId, DflowPin> = new Map();
  readonly outputs: Map<DflowId, DflowPin> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];

  constructor(
    graph: DflowGraph,
    { id, kind, inputs = [], outputs = [] }: DflowSerializedNode,
  ) {
    this.graph = graph;
    this.id = id;
    this.kind = kind;
    this.isAsync = false;

    for (const serializedPin of inputs) {
      this.newInput(serializedPin);
    }

    for (const serializedPin of outputs) {
      this.newOutput(serializedPin);
    }
  }

  getInputByPosition(position: number): DflowPin | null {
    const inputId = this.#inputPosition[position];
    if (typeof inputId === "undefined") return null;
    return this.inputs.get(inputId) ?? null;
  }

  getOutputByPosition(position: number): DflowPin | null {
    const outputId = this.#outputPosition[position];
    if (typeof outputId === "undefined") return null;
    return this.outputs.get(outputId) ?? null;
  }

  newInput(serializedPin: DflowSerializedPin): void {
    const pin = new DflowPin("input", serializedPin);
    this.inputs.set(pin.id, pin);
    this.#inputPosition.push(pin.id);
  }

  newOutput(serializedPin: DflowSerializedPin): void {
    const pin = new DflowPin("output", serializedPin);
    this.outputs.set(pin.id, pin);
    this.#outputPosition.push(pin.id);
  }

  run(): void {
    throw new Error(
      `${this.constructor.name} does not implement a run() method`,
    );
  }

  toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedNode {
    const serializedNode = {
      id: this.id,
      kind: this.kind,
    } as DflowSerializedNode;
    const inputs = Object.values(this.inputs).map((input) => input.toObject());
    if (inputs.length > 0) {
      serializedNode.inputs = inputs;
    }
    const outputs = Object.values(this.outputs).map((output) =>
      output.toObject()
    );
    if (outputs.length > 0) {
      serializedNode.outputs = outputs;
    }
    return serializedNode;
  }
}

export class DflowUnknownNode extends DflowNode {
  static kind = "Unknown";

  constructor(graph: DflowGraph, serializedNode: DflowSerializedNode) {
    super(graph, { ...serializedNode, kind: DflowUnknownNode.kind });
  }

  run() {}
}

export class DflowEdge {
  readonly id: string;
  readonly source: DflowSerializedPinPath;
  readonly target: DflowSerializedPinPath;

  constructor({ id, source, target }: DflowSerializedEdge) {
    this.id = id;
    this.source = source;
    this.target = target;
  }

  toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedEdge {
    const serializedEdge = {
      id: this.id,
      source: this.source,
      target: this.target,
    };
    return serializedEdge;
  }
}

export class DflowGraph {
  readonly nodes: Map<DflowId, DflowNode> = new Map();
  readonly edges: Map<DflowId, DflowEdge> = new Map();

  static sort(nodeIds: DflowId[]): DflowId[] {
    return nodeIds;
  }

  clear() {
    this.nodes.clear();
    this.edges.clear();
  }

  async run() {
    const nodeIds = DflowGraph.sort([...this.nodes.keys()]);

    for (const nodeId of nodeIds) {
      const node = this.nodes.get(nodeId) as DflowNode;

      try {
        if (node.isAsync) {
          await node.run();
        } else {
          node.run();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  toJSON(): string {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedGraph {
    const nodes = Object.values(this.nodes).map((node) => node.toObject());
    const edges = Object.values(this.edges).map((edge) => edge.toObject());

    return { nodes, edges };
  }
}

export class DflowHost {
  readonly graph = new DflowGraph();
  readonly #nodesCatalog: DflowNodesCatalog;

  constructor(nodesCatalog: DflowNodesCatalog = {}) {
    this.#nodesCatalog = nodesCatalog;
  }

  newNode(serializedNode: DflowSerializedNode): DflowNode {
    const NodeClass = this.#nodesCatalog[serializedNode.kind] ??
      DflowUnknownNode;
    const node = new NodeClass(this.graph, serializedNode);
    this.graph.nodes.set(node.id, node);
    return node;
  }

  newEdge(serializedEdge: DflowSerializedEdge): DflowEdge {
    const edge = new DflowEdge(serializedEdge);
    this.graph.edges.set(edge.id, edge);

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;
    const sourceNode = this.graph.nodes.get(sourceNodeId);
    const targetNode = this.graph.nodes.get(targetNodeId);
    const sourcePin = sourceNode?.outputs.get(sourcePinId);
    const targetPin = targetNode?.inputs.get(targetPinId);
    if (typeof sourcePin !== "undefined" && typeof targetPin !== "undefined") {
      targetPin.connectTo(sourcePin);
    }

    return edge;
  }

  newInput(nodeId: DflowId, serializedPin: DflowSerializedPin) {
    const node = this.graph.nodes.get(nodeId);
    node?.newInput(serializedPin);
  }

  newOutput(nodeId: DflowId, serializedPin: DflowSerializedPin) {
    const node = this.graph.nodes.get(nodeId);
    node?.newOutput(serializedPin);
  }
}
