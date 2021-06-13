export type DflowId = string;
export type DflowNewItem<Item> = Omit<Item, "id"> & { id?: DflowId };

export type DflowNodeKind = string;
export type DflowNodeMetadata = {
  isAsync?: boolean;
  isConstant?: boolean;
};

export type DflowPinKind = "input" | "output";
export type DflowPinType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array";

export type DflowRunStatus = "waiting" | "success" | "failure";

// Stolen from https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
type JsonObject = { [Key in string]?: JsonValue };
type JsonArray = Array<JsonValue>;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
export type DflowPinData = JsonValue;

export type DflowNodesCatalog = Record<DflowNodeKind, typeof DflowNode>;

export type DflowSerializedItem = {
  id: DflowId;
};

export type DflowSerializedNode = DflowSerializedItem & {
  kind: DflowNodeKind;
  inputs?: DflowSerializedInput[];
  outputs?: DflowSerializedOutput[];
};

export type DflowSerializedPin = DflowSerializedItem & {
  types?: DflowPinType[];
};

export type DflowSerializedInput = DflowSerializedPin;

export type DflowSerializedOutput = DflowSerializedPin & {
  data?: DflowPinData;
};

export type DflowSerializedPinPath = [nodeId: DflowId, pinId: DflowId];

export type DflowSerializedEdge = DflowSerializedItem & {
  source: DflowSerializedPinPath;
  target: DflowSerializedPinPath;
};

export type DflowSerializedGraph = {
  nodes: DflowSerializedNode[];
  edges: DflowSerializedEdge[];
};

const _missingString = (stringName: string) => `${stringName} must be a string`;
const _missingNumber = (numberName: string) => `${numberName} must be a number`;
const _missingPin = (nodeId: DflowId, kind: DflowPinKind) =>
  `${kind} pin not found nodeId=${nodeId}`;
const _missingPinAtPosition = (
  nodeId: DflowId,
  kind: DflowPinKind,
  position: number,
) => `${_missingPin(nodeId, kind)} position=${position}`;
const _missingPinById = (nodeId: DflowId, kind: DflowPinKind, pinId: DflowId) =>
  `${_missingPin(nodeId, kind)} pinId=${pinId}`;

export class DflowPin {
  readonly id: DflowId;
  readonly kind: DflowPinKind;
  readonly types?: DflowPinType[];

  constructor(kind: DflowPinKind, { id, types }: DflowSerializedPin) {
    this.id = id;
    this.kind = kind;
    this.types = types;
  }
}

export class DflowInput extends DflowPin {
  #source?: DflowOutput;

  constructor({ id, types }: DflowSerializedInput) {
    super("input", { id, types });
  }

  connectTo(pin: DflowOutput) {
    this.#source = pin;
  }

  disconnect() {
    this.#source = undefined;
  }

  getData(): DflowPinData | undefined {
    return this.#source?.getData();
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedInput {
    const obj = { id: this.id } as DflowSerializedInput;

    if (typeof this.types !== "undefined") {
      obj.types = this.types;
    }

    return obj;
  }
}

export class DflowOutput extends DflowPin {
  #data?: DflowPinData;

  constructor({ id, data, types }: DflowSerializedOutput) {
    super("output", { id, types });

    this.setData(data);
  }

  getData(): DflowPinData | undefined {
    return this.#data;
  }

  setData(data?: DflowPinData) {
    const types = this.types ?? [];

    if (typeof data !== "undefined") {
      const isArray = Array.isArray(data);
      const isNull = data === null;
      const isObject = typeof data === "object" && !isNull && !isArray;

      switch (true) {
        case typeof this.types === "undefined":
        case typeof data === "string" && types.includes("string"):
        case typeof data === "number" && types.includes("number"):
        case typeof data === "boolean" && types.includes("boolean"):
        case isNull && types.includes("null"):
        case isObject && types.includes("object"):
        case isArray && types.includes("array"): {
          this.#data = data;
          break;
        }
        default: {
          throw new Error(
            `could not set data pinTypes=${
              JSON.stringify(this.types)
            } typeof=${typeof data}`,
          );
        }
      }
    }
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedOutput {
    const obj = { id: this.id } as DflowSerializedOutput;

    if (typeof this.#data !== "undefined") {
      obj.data = this.#data;
    }
    if (typeof this.types !== "undefined") {
      obj.types = this.types;
    }

    return obj;
  }
}

export class DflowNode {
  readonly id: DflowId;
  readonly kind: string;
  readonly isAsync: boolean;
  readonly isConstant: boolean;
  readonly inputs: Map<DflowId, DflowInput> = new Map();
  readonly outputs: Map<DflowId, DflowOutput> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];

  constructor(
    { id, kind, inputs = [], outputs = [] }: DflowSerializedNode,
    { isAsync = false, isConstant = false }: DflowNodeMetadata = {},
  ) {
    this.id = id;
    this.kind = kind;

    // Metadata.
    this.isAsync = isAsync;
    this.isConstant = isConstant;

    for (const serializedPin of inputs) {
      this.newInput(serializedPin);
    }

    for (const serializedPin of outputs) {
      this.newOutput(serializedPin);
    }
  }

  getInputById(pinId: DflowId): DflowInput {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("inputId"));
    }

    const pin = this.inputs.get(pinId);

    if (pin instanceof DflowInput) {
      return pin;
    } else {
      throw new Error(_missingPinById(this.id, "input", pinId));
    }
  }

  getInputByPosition(position: number): DflowInput {
    if (typeof position !== "number") {
      throw new TypeError(_missingNumber("position"));
    }

    const pinId = this.#inputPosition[position];

    if (typeof pinId === "undefined") {
      throw new Error(_missingPinAtPosition(this.id, "input", position));
    }

    return this.getInputById(pinId);
  }

  getOutputById(pinId: DflowId): DflowOutput {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("outputId"));
    }

    const pin = this.outputs.get(pinId);

    if (pin instanceof DflowOutput) {
      return pin;
    } else {
      throw new Error(_missingPinById(this.id, "output", pinId));
    }
  }

  getOutputByPosition(position: number): DflowOutput {
    if (typeof position !== "number") {
      throw new TypeError(_missingNumber("position"));
    }

    const pinId = this.#outputPosition[position];

    if (typeof pinId === "undefined") {
      throw new Error(_missingPinAtPosition(this.id, "output", position));
    }

    return this.getOutputById(pinId);
  }

  newInput(obj: DflowSerializedInput): void {
    const pin = new DflowInput(obj);
    this.inputs.set(pin.id, pin);
    this.#inputPosition.push(pin.id);
  }

  newOutput(obj: DflowSerializedOutput): void {
    const pin = new DflowOutput(obj);
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
    const obj = {
      id: this.id,
      kind: this.kind,
    } as DflowSerializedNode;

    const inputs = Object.values(this.inputs).map((input) => input.toObject());
    if (inputs.length > 0) {
      obj.inputs = inputs;
    }

    const outputs = Object.values(this.outputs).map((output) =>
      output.toObject()
    );
    if (outputs.length > 0) {
      obj.outputs = outputs;
    }

    return obj;
  }
}

export class DflowUnknownNode extends DflowNode {
  static kind = "Unknown";

  constructor(obj: DflowSerializedNode) {
    super({ ...obj, kind: DflowUnknownNode.kind });
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
    return {
      id: this.id,
      source: this.source,
      target: this.target,
    };
  }
}

export class DflowGraph {
  #runStatus: DflowRunStatus = "success";
  readonly nodes: Map<DflowId, DflowNode> = new Map();
  readonly edges: Map<DflowId, DflowEdge> = new Map();

  static sort(
    nodeIds: DflowId[],
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};

    const parentsOfNodeId = (nodeId: DflowId) =>
      nodeConnections
        .filter(({ targetId }) => nodeId === targetId)
        .map(({ sourceId }) => sourceId);

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

    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
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

  generateEdgeId(i = this.edges.size): DflowId {
    const id = `e${i}`;
    return this.edges.has(id) ? this.generateEdgeId(i + 1) : id;
  }

  generateNodeId(i = this.nodes.size): DflowId {
    const id = `n${i}`;
    return this.nodes.has(id) ? this.generateNodeId(i + 1) : id;
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
        if (node.isConstant === false) {
          if (node.isAsync) {
            await node.run();
          } else {
            node.run();
          }
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

  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const edgeId = this.graph.generateEdgeId();

        const sourcePin = sourceNode.getOutputByPosition(sourcePosition);

        const targetPin = targetNode.getInputByPosition(targetPosition);

        this.newEdge({
          id: edgeId,
          source: [sourceNode.id, sourcePin.id],
          target: [targetNode.id, targetPin.id],
        });
      },
    };
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
        const {
          source: [sourceNodeId],
          target: [targetNodeId],
        } = edge;
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

  newNode(obj: DflowNewItem<DflowSerializedNode>): DflowNode {
    const NodeClass = this.#nodesCatalog[obj.kind] ??
      DflowUnknownNode;
    const id = typeof obj.id === "string"
      ? obj.id
      : this.graph.generateNodeId();
    const node = new NodeClass({ ...obj, id });

    if (this.graph.nodes.has(node.id)) {
      throw new Error(`Cannot overwrite DflowNode, id=${node.id}`);
    } else {
      this.graph.nodes.set(node.id, node);
    }

    return node;
  }

  newEdge(obj: DflowNewItem<DflowSerializedEdge>): DflowEdge {
    const id = typeof obj.id === "string"
      ? obj.id
      : this.graph.generateEdgeId();
    const edge = new DflowEdge({ ...obj, id });

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

  newInput(nodeId: DflowId, obj: DflowSerializedInput) {
    const node = this.graph.getNodeById(nodeId);
    node.newInput(obj);
  }

  newOutput(nodeId: DflowId, obj: DflowSerializedOutput) {
    const node = this.graph.getNodeById(nodeId);
    node.newOutput(obj);
  }
}
