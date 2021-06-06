export type DflowId = string;
export type DflowNodeKind = string;
export type DflowPinKind = "input" | "output";
export type DflowGraphRunStatus = "waiting" | "success" | "failure";

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

const _missingString = (stringName: string) => `${stringName} must be a string`;

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

  disconnect() {
    if (this.kind === "input") {
      this.#source = undefined;
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
  readonly id: DflowId;
  readonly kind: string;
  readonly isAsync: boolean;
  readonly inputs: Map<DflowId, DflowPin> = new Map();
  readonly outputs: Map<DflowId, DflowPin> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];

  constructor(
    { id, kind, inputs = [], outputs = [] }: DflowSerializedNode,
    isAsync = false,
  ) {
    this.id = id;
    this.kind = kind;
    this.isAsync = isAsync;

    for (const serializedPin of inputs) {
      this.newInput(serializedPin);
    }

    for (const serializedPin of outputs) {
      this.newOutput(serializedPin);
    }
  }

  getInputById(pinId: DflowId): DflowPin {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("inputId"));
    }

    const pin = this.inputs.get(pinId);

    if (pin instanceof DflowPin) {
      return pin;
    } else {
      throw new Error(`DflowPin not found, id=${pinId}, kind={input}`);
    }
  }

  getInputByPosition(position: number): DflowPin | null {
    const inputId = this.#inputPosition[position];
    if (typeof inputId === "undefined") return null;
    return this.inputs.get(inputId) ?? null;
  }

  getOutputById(pinId: DflowId): DflowPin {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("outputId"));
    }

    const pin = this.outputs.get(pinId);

    if (pin instanceof DflowPin) {
      return pin;
    } else {
      throw new Error(`DflowPin not found, id=${pinId}, kind={output}`);
    }
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

  constructor(serializedNode: DflowSerializedNode) {
    super({ ...serializedNode, kind: DflowUnknownNode.kind });
  }

  run() {}
}

export class DflowEdge {
  readonly id: string;
  readonly source: DflowSerializedPinPath;
  readonly target: DflowSerializedPinPath;

  constructor({ id, source, target }: DflowSerializedEdge) {
    this.id = id;

    // 1. Read source and target.
    const [sourceNodeId, sourcePinId] = source;
    const [targetNodeId, targetPinId] = target;
    // 2. Check their types.
    if (typeof sourceNodeId !== "string") {
      throw new TypeError(_missingString("sourceNodeId"));
    }
    if (typeof sourcePinId !== "string") {
      throw new TypeError(_missingString("sourcePinId"));
    }
    if (typeof targetNodeId !== "string") {
      throw new TypeError(_missingString("targetNodeId"));
    }
    if (typeof targetPinId !== "string") {
      throw new TypeError(_missingString("targetPinId"));
    }
    // 3. Store in memory.
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
  #runStatus: DflowGraphRunStatus = "success";

  static sort(
    nodeIds: DflowId[],
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};

    const parentsOfNodeId = (
      nodeId: DflowId,
    ) => (nodeConnections.filter(({ targetId }) => (nodeId === targetId)).map((
      { sourceId },
    ) => (sourceId)));

    const levelOfNodeId = (nodeId: DflowId) => {
      const parentsNodeIds = parentsOfNodeId(nodeId);
      // 1. A node with no parent as level zero.
      if (parentsNodeIds.length === 0) {
        return 0;
      }
      // 2. Otherwise its level is the max level of its parents plus one.
      let maxLevel = 0;
      for (const parentNodeId of parentsNodeIds) {
        const level = levelOfNodeId(parentNodeId);
        maxLevel = Math.max(level, maxLevel);
      }
      return maxLevel + 1;
    };

    for (const nodeId of nodeIds) {
      levelOf[nodeId] = levelOfNodeId(nodeId);
    }

    return nodeIds.slice().sort((a, b) => (
      levelOf[a] <= levelOf[b] ? -1 : 1
    ));
  }

  clear() {
    this.nodes.clear();
    this.edges.clear();
  }

  getNodeById(nodeId: DflowId): DflowNode {
    if (typeof nodeId !== "string") {
      throw new TypeError(_missingString("nodeId"));
    }

    const node = this.nodes.get(nodeId);

    if (node instanceof DflowNode) {
      return node;
    } else {
      throw new Error(`DflowNode not found, id=${nodeId}`);
    }
  }

  getEdgeById(edgeId: DflowId): DflowEdge {
    if (typeof edgeId !== "string") {
      throw new TypeError(_missingString("edgeId"));
    }

    const edge = this.edges.get(edgeId);

    if (edge instanceof DflowEdge) {
      return edge;
    } else {
      throw new Error(`DflowEdge not found, id=${edgeId}`);
    }
  }

  async run() {
    // Set runStatus to waiting if there was some unhandled error in a previous run.
    if (this.runStatusIsSuccess) {
      this.#runStatus = "waiting";
    }

    // Get nodeIds sorted by graph hierarchy.
    const nodeIds = DflowGraph.sort(
      [...this.nodes.keys()],
      [...this.edges.values()].map((edge) => ({
        sourceId: edge.source[0],
        targetId: edge.target[0],
      })),
    );

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

        this.#runStatus = "failure";
      }
    }

    // Set runStatus to success if there was no error.
    if (this.runStatusIsWaiting) {
      this.#runStatus = "success";
    }
  }

  get runStatusIsSuccess() {
    return this.#runStatus === "success";
  }

  get runStatusIsWaiting() {
    return this.#runStatus === "waiting";
  }

  get runStatusIsFailure() {
    return this.#runStatus === "failure";
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

  deleteEdge(edgeId: DflowId) {
    if (typeof edgeId !== "string") {
      throw new TypeError(_missingString("edgeId"));
    }

    const edge = this.graph.getEdgeById(edgeId);

    if (edge instanceof DflowEdge) {
      // 1. Cleanup target pin.
      const [targetNodeId, targetPinId] = edge.target;
      const targetNode = this.graph.getNodeById(targetNodeId);
      const targetPin = targetNode.getInputById(targetPinId);
      targetPin.disconnect();
      // 2. Delete edge.
      this.graph.edges.delete(edgeId);
    } else {
      throw new Error(`DflowEdge not found, id=${edgeId}`);
    }
  }

  deleteNode(nodeId: DflowId) {
    if (typeof nodeId !== "string") {
      throw new TypeError(_missingString("nodeId"));
    }

    const node = this.graph.getNodeById(nodeId);

    if (node instanceof DflowNode) {
      // 1. Delete all edges connected to node.
      for (const edge of this.graph.edges.values()) {
        const { source: [sourceNodeId], target: [targetNodeId] } = edge;
        if (sourceNodeId === node.id || targetNodeId === node.id) {
          this.deleteEdge(edge.id);
        }
      }
      // 2. Delete node.
      this.graph.nodes.delete(nodeId);
    } else {
      throw new Error(`DflowNode not found, id=${nodeId}`);
    }
  }

  newNode(serializedNode: DflowSerializedNode): DflowNode {
    const NodeClass = this.#nodesCatalog[serializedNode.kind] ??
      DflowUnknownNode;
    const node = new NodeClass(serializedNode);

    if (this.graph.nodes.has(node.id)) {
      throw new Error(`Cannot overwrite DflowNode, id=${node.id}`);
    } else {
      this.graph.nodes.set(node.id, node);
    }

    return node;
  }

  newEdge(serializedEdge: DflowSerializedEdge): DflowEdge {
    const edge = new DflowEdge(serializedEdge);

    if (this.graph.edges.has(edge.id)) {
      throw new Error(`Cannot overwrite DflowEdge, id=${edge.id}`);
    } else {
      this.graph.edges.set(edge.id, edge);
    }

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;

    const sourceNode = this.graph.getNodeById(sourceNodeId);
    const targetNode = this.graph.getNodeById(targetNodeId);
    const sourcePin = sourceNode.getOutputById(sourcePinId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.connectTo(sourcePin);

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
