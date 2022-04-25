export type DflowId = string;
export type DflowNewItem<Item> = Omit<Item, "id"> & { id?: DflowId };

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
  | "DflowId";

export type DflowRunStatus = "waiting" | "success" | "failure";

type DflowExecutionNodeInfo =
  & Pick<
    DflowSerializableNode,
    "id" | "kind" | "outputs"
  >
  & { error?: string };

export type DflowExecutionReport = {
  status: DflowRunStatus;
  start: Date;
  end?: Date;
  steps?: DflowExecutionNodeInfo[];
};

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
  | DflowSerializableGraph;

export type DflowNodesCatalog = Record<DflowNode["kind"], typeof DflowNode>;

export type DflowSerializableItem = {
  id: DflowId;
  name?: string;
};

export type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };

export type DflowSerializablePin = DflowSerializableItem & {
  types?: DflowPinType[];
};

export type DflowSerializableInput = DflowSerializablePin & {
  multi?: boolean;
  optional?: boolean;
};

export type DflowSerializableOutput = DflowSerializablePin & {
  data?: DflowValue;
};

export type DflowSerializablePinPath = [nodeId: DflowId, pinId: DflowId];

export type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};

export type DflowSerializableGraph = DflowSerializableItem & {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};

export type DflowNewGraph = DflowNewItem<DflowSerializableGraph>;
export type DflowNewEdge = DflowNewItem<DflowSerializableEdge>;
export type DflowNewInput = DflowNewItem<DflowSerializableInput>;
export type DflowNewOutput = DflowNewItem<DflowSerializableOutput>;
export type DflowNewNode = DflowNewItem<DflowSerializableNode>;

export type DflowNodeConnection = { sourceId: DflowId; targetId: DflowId };

type DflowRunOptions = { verbose: boolean };

const _missingString = (stringName: string) => `${stringName} must be a string`;
const _missingPin = (nodeId: DflowId, kind: DflowPinKind) =>
  `${kind} pin not found nodeId=${nodeId}`;
const _missingPinAtPosition = (
  nodeId: DflowId,
  kind: DflowPinKind,
  position: number,
) => `${_missingPin(nodeId, kind)} position=${position}`;
const _missingPinById = (nodeId: DflowId, kind: DflowPinKind, pinId: DflowId) =>
  `${_missingPin(nodeId, kind)} pinId=${pinId}`;

const _executionNodeInfo = (
  { id, kind, outputs }: DflowSerializableNode,
  error?: string,
): DflowExecutionNodeInfo => {
  const obj = {
    id,
    kind,
    outputs: outputs?.map(({ id, data, name }) => ({ id, data, name })),
  } as DflowExecutionNodeInfo;

  if (error) {
    obj.error = error;
  }

  return obj;
};

export class DflowData {
  static isArray(data: DflowValue) {
    return Array.isArray(data);
  }

  static isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean";
  }

  static isDflowId(data: unknown): data is DflowId {
    return DflowData.isStringNotEmpty(data);
  }

  static isObject(data: DflowValue): data is DflowObject {
    // TODO improve this
    return (
      !DflowData.isUndefined(data) &&
      !DflowData.isNull(data) &&
      !DflowData.isArray(data) &&
      typeof data === "object"
    );
  }

  static isNull(data: DflowValue) {
    return data === null;
  }

  static isNumber(data: unknown): data is number {
    return typeof data === "number" && !isNaN(data);
  }

  static isString(data: unknown): data is string {
    return typeof data === "string";
  }

  static isStringNotEmpty(data: unknown) {
    return DflowData.isString(data) && (data as string).length > 0;
  }

  static isUndefined(data: unknown): data is undefined {
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
        case "DflowId":
          return DflowData.isDflowId(data);
        default:
          return false;
      }
    }, true);
  }
}

export class DflowItem {
  readonly id: DflowId;
  name?: string;

  static isDflowItem(item: unknown): item is DflowSerializableItem {
    if (typeof item !== "object" || item === null) return false;
    const { id, name } = item as Partial<DflowSerializableItem>;
    return (
      DflowData.isDflowId(id) &&
      (DflowData.isUndefined(name) || DflowData.isStringNotEmpty(name))
    );
  }

  constructor({ id, name }: DflowSerializablePin) {
    this.id = id;
    this.name = name;
  }

  toObject(): DflowSerializableItem {
    const obj = { id: this.id } as DflowSerializableItem;

    if (typeof this.name === "string") {
      obj.name = this.name;
    }

    return obj;
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
    "DflowId",
  ];

  static isDflowPin(pin: unknown): pin is DflowSerializablePin {
    if (typeof pin !== "object" || pin === null) return false;
    const { types, ...item } = pin as Partial<DflowSerializablePin>;
    return (
      DflowItem.isDflowItem(item) &&
      DflowPin.isDflowPinTypes(types)
    );
  }

  static isDflowPinType(type: unknown): type is DflowPinType {
    if (typeof type !== "string") return false;
    return DflowPin.types.includes(type);
  }

  static isDflowPinTypes(types: unknown): types is DflowPinType[] {
    if (!Array.isArray(types)) return false;
    return types.every((type) => DflowPin.isDflowPinType(type));
  }

  constructor(
    kind: DflowPinKind,
    { types = [], ...pin }: DflowSerializablePin,
  ) {
    super(pin);

    this.kind = kind;
    this.types = types;
  }

  get hasTypeAny() {
    return this.types.length === 0;
  }

  hasType(type: DflowPinType) {
    return this.hasTypeAny || this.types.includes(type);
  }

  toObject() {
    const obj = super.toObject() as DflowSerializablePin;

    if (this.types.length > 0) {
      obj.types = this.types;
    }

    return obj;
  }
}

export class DflowInput extends DflowPin {
  #multi?: boolean;
  #optional?: boolean;
  #source?: DflowOutput;
  #sources?: Set<DflowOutput>;

  static isDflowInput(item: unknown): item is DflowSerializableInput {
    if (typeof item !== "object" || item === null) return false;
    const { id, types, optional, multi } = item as Partial<
      DflowSerializableInput
    >;
    return DflowPin.isDflowPin({ id, types }) &&
      (typeof multi === "undefined" || typeof multi === "boolean") &&
      (typeof optional === "undefined" || typeof optional === "boolean");
  }

  constructor({ multi, optional, ...pin }: DflowSerializableInput) {
    super("input", pin);

    this.#multi = multi;
    this.#optional = optional;
  }

  get data(): DflowValue {
    return this.#source?.data ||
      Array.from(this.#sources ?? []).map((output) => output.data);
  }

  get isConnected() {
    return typeof this.#source === "undefined" ||
      (Array.from(this.#sources ?? [])).length > 0;
  }

  get isMulti() {
    return this.#multi;
  }

  get isOptional() {
    return this.#optional;
  }

  connectTo(pin: DflowOutput) {
    const { hasTypeAny: targetHasTypeAny, types: targetTypes } = this;
    const { types: sourceTypes } = pin;

    const canConnect = targetHasTypeAny ||
      targetTypes.some((pinType) => sourceTypes.includes(pinType));

    if (canConnect) {
      if (this.#multi) {
        if (!this.#sources) {
          this.#sources = new Set();
        }
        this.#sources.add(pin);
      } else {
        this.#source = pin;
      }
    } else {
      throw new Error(
        `mismatching pinTypes, source has types [${sourceTypes.join()}] and target has types [${targetTypes.join()}]`,
      );
    }
  }

  disconnect() {
    this.#source = undefined;
  }

  toObject(): DflowSerializableInput {
    return super.toObject() as DflowSerializableInput;
  }
}

export class DflowOutput extends DflowPin {
  #data?: DflowValue;

  static isDflowOutput({ id, data, types = [] }: DflowSerializableOutput) {
    return (
      DflowPin.isDflowPin({ id, types }) && DflowData.validate(data, types)
    );
  }

  constructor({ data, ...pin }: DflowSerializableOutput) {
    super("output", pin);

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
      case DflowData.isDflowId(data) && this.hasType("DflowId"):
      case DflowData.isString(data) && this.hasType("string"):
      case DflowData.isNumber(data) && this.hasType("number"):
      case DflowData.isBoolean(data) && this.hasType("boolean"):
      case DflowData.isNull(data) && this.hasType("null"):
      case DflowData.isObject(data) && this.hasType("object"):
      case DflowData.isArray(data) && this.hasType("array"): {
        this.#data = data;
        break;
      }
      default: {
        throw new Error(
          `could not set data pinTypes=${
            JSON.stringify(
              this.types,
            )
          } typeof=${typeof data}`,
        );
      }
    }
  }

  toObject(): DflowSerializableOutput {
    const obj = super.toObject() as DflowSerializableOutput;

    if (typeof this.#data !== "undefined") {
      obj.data = this.#data;
    }

    return obj;
  }
}

export class DflowNode extends DflowItem {
  readonly #inputs: Map<DflowId, DflowInput> = new Map();
  readonly #outputs: Map<DflowId, DflowOutput> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];
  readonly kind: string;
  readonly meta: DflowNodeMetadata;
  readonly host: DflowHost;

  static kind: string;
  static isAsync?: DflowNodeMetadata["isAsync"];
  static isConstant?: DflowNodeMetadata["isConstant"];
  static inputs?: DflowNewInput[];
  static outputs?: DflowNewOutput[];

  static input(
    typing: DflowPinType | DflowPinType[] = [],
    rest?: Omit<DflowNewInput, "types">,
  ): DflowNewInput {
    if (DflowPin.isDflowPinType(typing)) {
      return { types: [typing], ...rest };
    }
    if (DflowPin.isDflowPinTypes(typing)) {
      return { types: typing, ...rest };
    }
    throw new TypeError("invalid input definition");
  }

  static output(
    typing: DflowPinType | DflowPinType[] = [],
    rest?: Omit<DflowNewOutput, "types">,
  ): DflowNewOutput {
    if (DflowPin.isDflowPinType(typing)) {
      return { types: [typing], ...rest };
    }
    if (DflowPin.isDflowPinTypes(typing)) {
      return { types: typing, ...rest };
    }
    throw new TypeError("invalid output definition");
  }

  /**
   * @deprecated Use DflowNode.input
   */
  static in(
    types: DflowPinType[] = [],
    rest?: Omit<DflowNewInput, "types">,
  ): DflowNewInput[] {
    return [{ types, ...rest }];
  }

  /**
   * @deprecated use DflowNode.output
   */
  static out(
    types: DflowPinType[] = [],
    rest?: Omit<DflowNewOutput, "types">,
  ): DflowNewOutput[] {
    return [{ types, ...rest }];
  }

  static isDflowNode(node: unknown): node is DflowSerializableNode {
    if (typeof node !== "object" || node === null) return false;
    const {
      kind,
      inputs = [],
      outputs = [],
      ...item
    } = node as Partial<DflowSerializableNode>;
    return (
      DflowItem.isDflowItem(item) &&
      DflowData.isStringNotEmpty(kind) &&
      // Check inputs.
      inputs.every((input) => DflowInput.isDflowInput(input)) &&
      // Check outputs.
      outputs.every((output) => DflowOutput.isDflowOutput(output))
    );
  }

  constructor(
    { kind, inputs = [], outputs = [], ...item }: DflowSerializableNode,
    host: DflowHost,
    { isAsync = false, isConstant = false }: DflowNodeMetadata = {},
  ) {
    super(item);

    this.host = host;
    this.kind = kind;

    // Metadata.
    this.meta = { isAsync, isConstant };

    // Inputs.
    for (const pin of inputs) {
      this.newInput(pin);
    }

    // Outputs.
    for (const pin of outputs) {
      this.newOutput(pin);
    }
  }

  get inputs() {
    return this.#inputs.values();
  }

  get outputs() {
    return this.#outputs.values();
  }

  get numInputs() {
    return this.#inputs.size;
  }

  get numOutputs() {
    return this.#outputs.size;
  }

  clearOutputs() {
    for (const output of this.outputs) {
      output.clear();
    }
  }

  #generateInputId(i = this.numInputs): DflowId {
    const id = `i${i}`;
    return this.#inputs.has(id) ? this.#generateInputId(i + 1) : id;
  }

  #generateOutputId(i = this.numOutputs): DflowId {
    const id = `o${i}`;
    return this.#outputs.has(id) ? this.#generateOutputId(i + 1) : id;
  }

  getInputById(pinId: DflowId): DflowInput {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("inputId"));
    }

    const pin = this.#inputs.get(pinId);

    if (pin) {
      return pin;
    } else {
      throw new Error(_missingPinById(this.id, "input", pinId));
    }
  }

  input(position: number): DflowInput {
    const pinId = this.#inputPosition[position];

    if (!pinId) {
      throw new Error(_missingPinAtPosition(this.id, "input", position));
    }

    return this.getInputById(pinId);
  }

  getOutputById(pinId: DflowId): DflowOutput {
    if (typeof pinId !== "string") {
      throw new TypeError(_missingString("outputId"));
    }

    const pin = this.#outputs.get(pinId);

    if (pin) {
      return pin;
    } else {
      throw new Error(_missingPinById(this.id, "output", pinId));
    }
  }

  output(position: number): DflowOutput {
    const pinId = this.#outputPosition[position];

    if (!pinId) {
      throw new Error(_missingPinAtPosition(this.id, "output", position));
    }

    return this.getOutputById(pinId);
  }

  deleteInput(pinId: DflowId) {
    this.host.deleteEdgesConnectedToPin([this.id, pinId]);
    this.#inputs.delete(pinId);
    this.#inputPosition.splice(this.#inputPosition.indexOf(pinId), 1);
  }

  deleteOutput(pinId: DflowId) {
    this.host.deleteEdgesConnectedToPin([this.id, pinId]);
    this.#outputs.delete(pinId);
    this.#outputPosition.splice(this.#outputPosition.indexOf(pinId), 1);
  }

  newInput(obj: DflowNewInput): DflowInput {
    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : this.#generateInputId();

    const pin = new DflowInput({ ...obj, id });
    this.#inputs.set(id, pin);
    this.#inputPosition.push(id);
    return pin;
  }

  newOutput(obj: DflowNewOutput): DflowOutput {
    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : this.#generateOutputId();

    const pin = new DflowOutput({ ...obj, id });
    this.#outputs.set(id, pin);
    this.#outputPosition.push(id);
    return pin;
  }

  run(): void {}

  toObject(): DflowSerializableNode {
    const obj = {
      ...super.toObject(),
      kind: this.kind,
    } as DflowSerializableNode;

    const inputs = [];
    const outputs = [];

    for (const input of this.inputs) {
      inputs.push(input.toObject());
    }
    if (inputs.length > 0) {
      obj.inputs = inputs;
    }

    for (const output of this.outputs) {
      outputs.push(output.toObject());
    }
    if (outputs.length > 0) {
      obj.outputs = outputs;
    }

    return obj;
  }
}

export class DflowEdge extends DflowItem {
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;

  static isDflowEdge(
    edge: DflowSerializableEdge,
    graph: DflowSerializableGraph,
  ): edge is DflowSerializableEdge {
    if (typeof edge !== "object" || edge === null) return false;
    const { source, target, ...item } = edge as Partial<DflowSerializableEdge>;
    if (DflowItem.isDflowItem(item)) return false;
    // Check source pin.
    if (!Array.isArray(source)) return false;
    if (source.length !== 2) return false;
    const sourceNode = graph.nodes.find(
      ({ id, outputs = [] }) =>
        id === source[0] && outputs.find(({ id }) => id === source[1]),
    );
    if (!DflowNode.isDflowNode(sourceNode)) return false;
    // Check target pin.
    if (!Array.isArray(target)) return false;
    if (target.length !== 2) return false;
    const targetNode = graph.nodes.find(
      ({ id, inputs = [] }) =>
        id === target[0] && inputs.find(({ id }) => id === target[1]),
    );
    if (!DflowNode.isDflowNode(targetNode)) return false;
    // All checks passed.
    return true;
  }

  constructor({ source, target, ...item }: DflowSerializableEdge) {
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

  toObject(): DflowSerializableEdge {
    return {
      ...super.toObject(),
      source: this.source,
      target: this.target,
    };
  }
}

export class DflowGraph extends DflowItem {
  readonly #nodes: Map<DflowId, DflowNode> = new Map();
  readonly #edges: Map<DflowId, DflowEdge> = new Map();
  runOptions: DflowRunOptions = { verbose: false };
  runStatus: DflowRunStatus | null = null;
  executionReport: DflowExecutionReport | null = null;

  static childrenOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ sourceId }) => nodeId === sourceId)
      .map(({ targetId }) => targetId);
  }

  static parentsOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
  }

  static levelOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ) {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    // 1. A node with no parent as level zero.
    if (parentsNodeIds.length === 0) {
      return 0;
    }

    // 2. Otherwise its level is the max level of its parents plus one.
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds) {
      const level = DflowGraph.levelOfNodeId(parentNodeId, nodeConnections);
      maxLevel = Math.max(level, maxLevel);
    }
    return maxLevel + 1;
  }

  static ancestorsOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0) {
      return [];
    } else {
      return parentsNodeIds.reduce<DflowId[]>(
        (accumulator, parentNodeId, index, array) => {
          const ancestors = DflowGraph.ancestorsOfNodeId(
            parentNodeId,
            nodeConnections,
          );

          const result = accumulator.concat(ancestors);

          // On last iteration, remove duplicates
          return index === array.length - 1
            ? Array.from(new Set(array.concat(result)))
            : result;
        },
        [],
      );
    }
  }

  /**
   * Sort nodes by their level.
   */
  static sort(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};

    for (const nodeId of nodeIds) {
      levelOf[nodeId] = DflowGraph.levelOfNodeId(nodeId, nodeConnections);
    }

    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  get edges() {
    return this.#edges.values();
  }

  get nodes() {
    return this.#nodes.values();
  }

  get nodeConnections(): DflowNodeConnection[] {
    return [...this.#edges.values()].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0],
    }));
  }

  get edgeIds() {
    return [...this.#edges.keys()];
  }

  get nodeIds() {
    return [...this.#nodes.keys()];
  }

  get numEdges() {
    return this.#edges.size;
  }

  get numNodes() {
    return this.#nodes.size;
  }

  addEdge(edge: DflowEdge) {
    if (this.#edges.has(edge.id)) {
      throw new Error(`cannot overwrite edge, id=${edge.id}`);
    } else {
      this.#edges.set(edge.id, edge);
    }
  }

  addNode(node: DflowNode) {
    if (this.#nodes.has(node.id)) {
      throw new Error(`cannot overwrite node, id=${node.id}`);
    } else {
      this.#nodes.set(node.id, node);
    }
  }

  clear() {
    this.#nodes.clear();
    this.#edges.clear();
  }

  deleteEdge(edgeId: DflowId) {
    this.#edges.delete(edgeId);
  }

  deleteNode(nodeId: DflowId) {
    this.#nodes.delete(nodeId);
  }

  getNodeById(nodeId: DflowId): DflowNode {
    if (typeof nodeId !== "string") {
      throw new TypeError(_missingString("nodeId"));
    }

    const node = this.#nodes.get(nodeId);

    if (node) {
      return node;
    } else {
      throw new Error(`DflowNode not found, id=${nodeId}`);
    }
  }

  getEdgeById(edgeId: DflowId): DflowEdge {
    if (typeof edgeId !== "string") {
      throw new TypeError(_missingString("edgeId"));
    }

    const edge = this.#edges.get(edgeId);

    if (edge) {
      return edge;
    } else {
      throw new Error(`DflowEdge not found, id=${edgeId}`);
    }
  }

  generateEdgeId(i = this.numEdges): DflowId {
    const id = `e${i}`;
    return this.#edges.has(id) ? this.generateEdgeId(i + 1) : id;
  }

  generateNodeId(i = this.numNodes): DflowId {
    const id = `n${i}`;
    return this.#nodes.has(id) ? this.generateNodeId(i + 1) : id;
  }

  nodeIdsInsideFunctions() {
    const ancestorsOfReturnNodes = [];

    // Find all "return" nodes and get their ancestors.
    for (const node of this.nodes) {
      if (node.kind === "return") {
        ancestorsOfReturnNodes.push(
          DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections),
        );
      }
    }

    // Flatten and deduplicate results.
    return Array.from(new Set(ancestorsOfReturnNodes.flat()));
  }

  async run() {
    const { verbose } = this.runOptions;

    // Set runStatus to waiting if there was some unhandled error in a previous run.
    this.runStatus = "waiting";

    this.executionReport = {
      status: this.runStatus,
      start: new Date(),
    };

    if (verbose) {
      this.executionReport.steps = [];
    }

    // Get nodeIds
    // 1. filtered by nodes inside functions
    // 2. sorted by graph hierarchy
    const nodeIdsExcluded = this.nodeIdsInsideFunctions();
    const nodeIds = DflowGraph.sort(
      this.nodeIds.filter((nodeId) => !nodeIdsExcluded.includes(nodeId)),
      this.nodeConnections,
    );

    // Two nested loops:
    //   1. NODES_LOOP
    //   2. INPUTS_LOOP
    //
    // For every node loop over their inputs and validate data.

    // 1. NODES_LOOP
    // /////////////
    NODES_LOOP:
    for (const nodeId of nodeIds) {
      const node = this.#nodes.get(nodeId) as DflowNode;

      try {
        if (!node.meta.isConstant) {
          let someInputIsNotValid = false;

          // 2. INPUTS_LOOP
          // //////////////
          INPUTS_LOOP:
          for (const { id, data, types, isOptional } of node.inputs) {
            // Ignore optional inputs.
            if (isOptional && typeof data === "undefined") {
              continue INPUTS_LOOP;
            }

            // Validate input data.
            if (!DflowData.validate(data, types)) {
              someInputIsNotValid = true;
              if (verbose) {
                this.executionReport.steps?.push(
                  _executionNodeInfo(
                    node.toObject(),
                    `invalid input data nodeId=${nodeId} inputId=${id} data=${data}`,
                  ),
                );
              }
              break INPUTS_LOOP;
            }
          }

          if (someInputIsNotValid) {
            for (const output of node.outputs) {
              output.clear();
            }
            continue NODES_LOOP;
          }

          if (node.meta.isAsync) {
            await node.run();
          } else {
            node.run();
          }
        }

        if (verbose) {
          this.executionReport.steps?.push(_executionNodeInfo(node.toObject()));
        }
      } catch (error) {
        console.error(error);
        this.runStatus = "failure";
      }
    }

    // Set runStatus to success if there was no error.
    if (this.runStatus === "waiting") {
      this.runStatus = "success";
    }

    this.executionReport.status = this.runStatus;
    this.executionReport.end = new Date();
  }

  toObject(): DflowSerializableGraph {
    const obj = {
      ...super.toObject(),
      nodes: [],
      edges: [],
    } as DflowSerializableGraph;

    for (const node of this.nodes) {
      obj.nodes.push(node.toObject());
    }
    for (const edge of this.edges) {
      obj.edges.push(edge.toObject());
    }

    return obj;
  }
}

export class DflowHost {
  readonly #graph: DflowGraph;
  readonly nodesCatalog: DflowNodesCatalog;
  readonly context: Record<string, unknown>;

  static #generateInputIds(pins: DflowNewInput[] = []) {
    return pins.map((pin, i) => ({ ...pin, id: `i${i}` }));
  }

  static #generateOutputIds(pins: DflowNewOutput[] = []) {
    return pins.map((pin, i) => ({ ...pin, id: `o${i}` }));
  }

  constructor(nodesCatalog: DflowNodesCatalog = {}) {
    this.nodesCatalog = { ...nodesCatalog, ...coreNodesCatalog };
    this.#graph = new DflowGraph({ id: "g1" });
    this.context = {};
  }

  get executionReport() {
    return this.#graph.executionReport;
  }

  get edges() {
    return this.#graph.edges;
  }

  get nodes() {
    return this.#graph.nodes;
  }

  get numEdges() {
    return this.#graph.numEdges;
  }

  get numNodes() {
    return this.#graph.numNodes;
  }

  get nodeKinds() {
    return Object.keys(this.nodesCatalog);
  }

  get runStatusIsSuccess() {
    return this.#graph.runStatus === "success";
  }

  get runStatusIsWaiting() {
    return this.#graph.runStatus === "waiting";
  }

  get runStatusIsFailure() {
    return this.#graph.runStatus === "failure";
  }

  set verbose(option: DflowRunOptions["verbose"]) {
    this.#graph.runOptions.verbose = option;
  }

  clearGraph() {
    this.#graph.clear();
  }

  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const edgeId = this.#graph.generateEdgeId();

        const sourcePin = sourceNode.output(sourcePosition);
        const targetPin = targetNode.input(targetPosition);

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

    const edge = this.#graph.getEdgeById(edgeId);

    if (edge) {
      // 1. Cleanup target pin.
      const [targetNodeId, targetPinId] = edge.target;
      const targetNode = this.getNodeById(targetNodeId);
      const targetPin = targetNode.getInputById(targetPinId);
      targetPin.disconnect();

      // 2. Delete edge.
      this.#graph.deleteEdge(edgeId);
    } else {
      throw new Error(`DflowEdge not found, id=${edgeId}`);
    }
  }

  deleteNode(nodeId: DflowId) {
    if (typeof nodeId !== "string") {
      throw new TypeError(_missingString("nodeId"));
    }

    const node = this.getNodeById(nodeId);

    if (node) {
      // 1. Delete all edges connected to node.
      for (const edge of this.#graph.edges) {
        const {
          source: [sourceNodeId],
          target: [targetNodeId],
        } = edge;
        if (sourceNodeId === node.id || targetNodeId === node.id) {
          this.deleteEdge(edge.id);
        }
      }

      // 2. Delete node.
      this.#graph.deleteNode(nodeId);
    } else {
      throw new Error(`DflowNode not found, id=${nodeId}`);
    }
  }

  deleteEdgesConnectedToPin([nodeId, pinId]: DflowSerializablePinPath) {
    for (const edge of this.edges) {
      const [sourceNodeId, sourcePinId] = edge.source;
      const [targetNodeId, targetPinId] = edge.target;

      if (
        (sourceNodeId === nodeId && sourcePinId === pinId) ||
        (targetNodeId === nodeId && targetPinId === pinId)
      ) {
        this.deleteEdge(edge.id);
      }
    }
  }

  executeFunction(functionId: DflowId, args: DflowArray) {
    const { verbose } = this.#graph.runOptions;

    // Get all return nodes connected to function node.
    const nodeConnections = this.#graph.nodeConnections;
    const childrenNodeIds = DflowGraph.childrenOfNodeId(
      functionId,
      nodeConnections,
    );
    const returnNodeIds = [];
    for (const childrenNodeId of childrenNodeIds) {
      const node = this.getNodeById(childrenNodeId);
      if (node.kind === DflowNodeReturn.kind) {
        returnNodeIds.push(node.id);
      }
    }

    // Get all nodes inside function.
    const nodeIdsInsideFunction = returnNodeIds.reduce<DflowId[]>(
      (accumulator, returnNodeId, index, array) => {
        const ancestors = DflowGraph.ancestorsOfNodeId(
          returnNodeId,
          nodeConnections,
        );

        const result = accumulator.concat(ancestors);

        // On last iteration, remove duplicates
        return index === array.length ? Array.from(new Set(result)) : result;
      },
      [],
    );

    // 1. get nodeIds sorted by graph hierarchy
    // 2. if it is an argument node, inject input data
    // 3. if if is a return node, output data
    // 4. otherwise run node
    const nodeIds = DflowGraph.sort(
      [...returnNodeIds, ...nodeIdsInsideFunction],
      nodeConnections,
    );
    for (const nodeId of nodeIds) {
      const node = this.getNodeById(nodeId);
      try {
        switch (node.kind) {
          case DflowNodeArgument.kind: {
            const position = node.input(0).data;
            // Argument position default to 0, must be >= 0.
            const index = typeof position === "number" && !isNaN(position)
              ? Math.max(
                position,
                0,
              )
              : 0;
            node.output(0).data = args[index];
            break;
          }
          case DflowNodeReturn.kind: {
            return node.input(1).data;
          }
          default: {
            // Notice that executeFunction cannot execute async functions.
            if (!node.meta.isConstant && !node.meta.isAsync) {
              node.run();
            }

            if (verbose) {
              this.executionReport?.steps?.push(
                _executionNodeInfo(node.toObject()),
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  getEdgeById(edgeId: DflowId) {
    return this.#graph.getEdgeById(edgeId);
  }

  getNodeById(nodeId: DflowId) {
    return this.#graph.getNodeById(nodeId);
  }

  newNode(obj: DflowNewNode): DflowNode {
    const NodeClass = this.nodesCatalog[obj.kind] ?? DflowNodeUnknown;

    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : this.#graph.generateNodeId();

    const meta = {
      isAsync: NodeClass.isAsync,
      isConstant: NodeClass.isConstant,
    };

    const inputs = Array.isArray(obj.inputs)
      ? obj.inputs
      : DflowHost.#generateInputIds(NodeClass.inputs);
    const outputs = Array.isArray(obj.outputs)
      ? obj.outputs
      : DflowHost.#generateOutputIds(NodeClass.outputs);

    const node = new NodeClass({ ...obj, id, inputs, outputs }, this, meta);

    this.#graph.addNode(node);

    return node;
  }

  newEdge(obj: DflowNewEdge): DflowEdge {
    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : this.#graph.generateEdgeId();

    const edge = new DflowEdge({ ...obj, id });

    this.#graph.addEdge(edge);

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;

    const sourceNode = this.#graph.getNodeById(sourceNodeId);
    const targetNode = this.#graph.getNodeById(targetNodeId);
    const sourcePin = sourceNode.getOutputById(sourcePinId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.connectTo(sourcePin);

    return edge;
  }

  newInput(nodeId: DflowId, obj: DflowNewInput): DflowInput {
    const node = this.#graph.getNodeById(nodeId);
    return node.newInput(obj);
  }

  newOutput(nodeId: DflowId, obj: DflowNewOutput): DflowOutput {
    const node = this.#graph.getNodeById(nodeId);
    return node.newOutput(obj);
  }

  toObject() {
    return this.#graph.toObject();
  }

  async run() {
    await this.#graph.run();
  }
}

// Core nodes.

const { input, output } = DflowNode;

class DflowNodeArgument extends DflowNode {
  static kind = "argument";
  static isConstant = true;
  static inputs = [input("number", { name: "position", optional: true })];
  static outputs = [output()];
}

class DflowNodeArray extends DflowNode {
  static kind = "array";
  static inputs = [input()];
  static outputs = [output("array")];
  run() {
    const data = this.input(0).data;
    if (DflowData.isArray(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowNodeBoolean extends DflowNode {
  static kind = "boolean";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run() {
    const data = this.input(0).data;
    if (DflowData.isBoolean(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowNodeData extends DflowNode {
  static kind = "data";
  static isConstant = true;
  static outputs = [output()];
}

class DflowNodeFunction extends DflowNode {
  static kind = "function";
  static isConstant = true;
  static outputs = [output("DflowId", { name: "id" })];
  constructor(...args: ConstructorParameters<typeof DflowNode>) {
    super(...args);
    this.output(0).data = this.id;
  }
}

class DflowNodeIsUndefined extends DflowNode {
  static kind = "isUndefined";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = typeof this.input(0).data === "undefined";
  }
}

class DflowNodeNumber extends DflowNode {
  static kind = "number";
  static inputs = [input()];
  static outputs = [output("number")];
  run() {
    const data = this.input(0).data;
    if (DflowData.isNumber(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowNodeObject extends DflowNode {
  static kind = "object";
  static inputs = [input()];
  static outputs = [output("object")];
  run() {
    const data = this.input(0).data;
    if (DflowData.isObject(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowNodeReturn extends DflowNode {
  static kind = "return";
  static isConstant = true;
  static inputs = [
    input("DflowId", { name: "functionId" }),
    input([], { name: "value" }),
  ];
}

class DflowNodeString extends DflowNode {
  static kind = "string";
  static inputs = [input()];
  static outputs = [output("string")];
  run() {
    const data = this.input(0).data;
    if (DflowData.isString(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

// The "Unknown" node is not inclued in core nodes catalog.
class DflowNodeUnknown extends DflowNode {}

const coreNodesCatalog: DflowNodesCatalog = {
  [DflowNodeArgument.kind]: DflowNodeArgument,
  [DflowNodeArray.kind]: DflowNodeArray,
  [DflowNodeBoolean.kind]: DflowNodeBoolean,
  [DflowNodeData.kind]: DflowNodeData,
  [DflowNodeIsUndefined.kind]: DflowNodeIsUndefined,
  [DflowNodeNumber.kind]: DflowNodeNumber,
  [DflowNodeObject.kind]: DflowNodeObject,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeString.kind]: DflowNodeString,
  [DflowNodeReturn.kind]: DflowNodeReturn,
};
