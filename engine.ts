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
  | "array"
  | "DflowGraph";

export type DflowRunStatus = "waiting" | "success" | "failure";

// Inspiration from https://github.com/sindresorhus/type-fest/blob/main/source/basic.d.ts
export type DflowObject = { [Key in string]?: DflowValue };
export type DflowArray = Array<DflowValue>;
export type DflowValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | DflowArray
  | DflowObject
  | DflowSerializedGraph;

export type DflowNodesCatalog = Record<DflowNodeKind, typeof DflowNode>;

export type DflowSerializedItem = {
  id: DflowId;
  name?: string;
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
  data?: DflowValue;
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

export class DflowItem {
  readonly id: DflowId;

  static isDflowItem({ id, name }: DflowSerializedItem) {
    return typeof id === "string" &&
      (["undefined", "string"].includes(typeof name));
  }

  constructor({ id }: DflowSerializedPin) {
    this.id = id;
  }
}

export class DflowPin extends DflowItem {
  readonly kind: DflowPinKind;
  readonly types: DflowPinType[];

  static types = [
    "string",
    "number",
    "boolean",
    "null",
    "object",
    "array",
    "DflowGraph",
  ];

  static isDflowPin({ types = [], ...item }: DflowSerializedPin) {
    return DflowItem.isDflowItem(item) &&
      (types.every((pinType) => DflowPin.isDflowPinType(pinType)));
  }

  static isDflowPinType(pinType: DflowPinType) {
    DflowPin.types.includes(pinType);
  }

  constructor(kind: DflowPinKind, { id, types = [] }: DflowSerializedPin) {
    super({ id });

    this.kind = kind;
    this.types = types;
  }

  get hasTypeAny() {
    return this.types.length === 0;
  }

  get hasTypeString() {
    return this.hasTypeAny || this.types.includes("string");
  }

  get hasTypeNumber() {
    return this.hasTypeAny || this.types.includes("number");
  }

  get hasTypeBoolean() {
    return this.hasTypeAny || this.types.includes("boolean");
  }

  get hasTypeNull() {
    return this.hasTypeAny || this.types.includes("null");
  }

  get hasTypeObject() {
    return this.hasTypeAny || this.types.includes("object");
  }

  get hasTypeArray() {
    return this.hasTypeAny || this.types.includes("array");
  }
}

export class DflowData {
  static isArray(data: DflowValue) {
    return Array.isArray(data);
  }

  static isBoolean(data: DflowValue) {
    return typeof data === "boolean";
  }

  static isDflowGraph(data: DflowValue) {
    return typeof data === "object" && data !== null && !Array.isArray(data) &&
      Array.isArray(data.nodes) && Array.isArray(data.edges) &&
      DflowGraph.isDflowGraph(data as DflowSerializedGraph);
  }

  static isObject(data: DflowValue) {
    return !DflowData.isUndefined(data) && !DflowData.isNull(data) &&
      !DflowData.isArray(data) && typeof data === "object";
  }

  static isNull(data: DflowValue) {
    return data === null;
  }

  static isNumber(data: DflowValue) {
    return typeof data === "number";
  }

  static isString(data: DflowValue) {
    return typeof data === "string";
  }

  static isUndefined(data: DflowValue) {
    return typeof data === "undefined";
  }

  static validate(data: DflowValue, types: DflowPinType[]) {
    if (types.length === 0) {
      return true;
    }

    return types.some((pinType) => {
      switch (pinType) {
        case "array":
          return DflowData.isArray(data);
        case "boolean":
          return DflowData.isBoolean(data);
        case "null":
          return DflowData.isNull(data);
        case "number":
          return DflowData.isNumber(data);
        case "object":
          return DflowData.isObject(data);
        case "string":
          return DflowData.isString(data);
        case "DflowGraph":
          return DflowData.isDflowGraph(data);
        default:
          return false;
      }
    }, true);
  }
}

export class DflowInput extends DflowPin {
  #source?: DflowOutput;

  static isDflowInput({ id, types }: DflowSerializedInput) {
    return DflowPin.isDflowPin({ id, types });
  }

  constructor({ id, types }: DflowSerializedInput) {
    super("input", { id, types });
  }

  connectTo(pin: DflowOutput) {
    this.#source = pin;
  }

  disconnect() {
    this.#source = undefined;
  }

  get data(): DflowValue {
    return this.#source?.data;
  }

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedInput {
    const obj = { id: this.id } as DflowSerializedInput;

    if (this.types.length > 0) {
      obj.types = this.types;
    }

    return obj;
  }
}

export class DflowOutput extends DflowPin {
  #data?: DflowValue;

  static isDflowOutput({ id, data, types = [] }: DflowSerializedOutput) {
    return DflowPin.isDflowPin({ id, types }) &&
      DflowData.validate(data, types);
  }

  constructor({ id, data, types }: DflowSerializedOutput) {
    super("output", { id, types });

    this.#data = data;
  }

  clear() {
    this.#data = undefined;
  }

  get data(): DflowValue {
    return this.#data;
  }

  set data(data: DflowValue) {
    switch (true) {
      case DflowData.isUndefined(data):
        this.clear();
        break;
      case this.hasTypeAny:
      case DflowData.isString(data) && this.hasTypeString:
      case DflowData.isNumber(data) && this.hasTypeNumber:
      case DflowData.isBoolean(data) && this.hasTypeBoolean:
      case DflowData.isNull(data) && this.hasTypeNull:
      case DflowData.isObject(data) && this.hasTypeObject:
      case DflowData.isArray(data) && this.hasTypeArray: {
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

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedOutput {
    const obj = { id: this.id } as DflowSerializedOutput;

    if (!DflowData.isUndefined(this.#data)) {
      obj.data = this.#data;
    }

    if (this.types.length > 0) {
      obj.types = this.types;
    }

    return obj;
  }
}

export class DflowNode extends DflowItem {
  readonly kind: string;
  readonly meta: DflowNodeMetadata;
  readonly inputs: Map<DflowId, DflowInput> = new Map();
  readonly outputs: Map<DflowId, DflowOutput> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];

  static isDflowNode(
    { kind, inputs = [], outputs = [], ...item }: DflowSerializedNode,
  ) {
    return DflowItem.isDflowItem(item) && typeof kind === "string" &&
      // Check inputs.
      (inputs.every((input) => DflowInput.isDflowInput(input))) &&
      // Check outputs.
      (outputs.every((output) => DflowOutput.isDflowOutput(output)));
  }

  constructor(
    { id, kind, inputs = [], outputs = [] }: DflowSerializedNode,
    { isAsync = false, isConstant = false }: DflowNodeMetadata = {},
  ) {
    super({ id });

    this.kind = kind;

    // Metadata.
    this.meta = { isAsync, isConstant };

    // Inputs.
    for (const serializedPin of inputs) {
      this.newInput(serializedPin);
    }

    // Outputs.
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

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedNode {
    const obj = {
      id: this.id,
      kind: this.kind,
    } as DflowSerializedNode;

    const inputs = [];
    const outputs = [];

    for (const input of this.inputs.values()) {
      inputs.push(input.toObject());
    }
    if (inputs.length > 0) {
      obj.inputs = inputs;
    }

    for (const output of this.outputs.values()) {
      outputs.push(output.toObject());
    }
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

export class DflowEdge extends DflowItem {
  readonly source: DflowSerializedPinPath;
  readonly target: DflowSerializedPinPath;

  static isDflowEdge(
    { source, target, ...item }: DflowSerializedEdge,
    graph: DflowSerializedGraph,
  ) {
    return DflowItem.isDflowItem(item) &&
      // Check source.
      (Array.isArray(source) && source.length === 2 &&
        graph.nodes.find((
          { id, outputs = [] },
        ) => (id === source[0] &&
          outputs.find(({ id }) => id === source[1]))
        )) &&
      // Check target.
      (Array.isArray(target) && target.length === 2 &&
        graph.nodes.find((
          { id, inputs = [] },
        ) => (id === target[0] && inputs.find(({ id }) => id === target[1]))));
  }

  constructor({ source, target, ...item }: DflowSerializedEdge) {
    super(item);

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

  toJSON() {
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

  static isDflowGraph(graph: DflowSerializedGraph): boolean {
    return graph.nodes.every((node) => DflowNode.isDflowNode(node)) &&
      graph.edges.every((edge) => DflowEdge.isDflowEdge(edge, graph));
  }

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
        if (node.meta.isConstant === false) {
          if (node.meta.isAsync) {
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

  toJSON() {
    return JSON.stringify(this.toObject());
  }

  toObject(): DflowSerializedGraph {
    const nodes = [];
    const edges = [];

    for (const node of this.nodes.values()) {
      nodes.push(node.toObject());
    }
    for (const edge of this.edges.values()) {
      edges.push(edge.toObject());
    }

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
