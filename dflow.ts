// DflowItem
// ////////////////////////////////////////////////////////////////////

/**
 * Every DflowItem has an identifier unique in its scope.
 * A node or edge id is unique in its graph.
 * An input or output id is unique in its node.
 */
export type DflowId = string;

/**
 * A pin can be of kind "input" or "output"
 */
type DflowPinKind = "input" | "output";

/**
 * An item can be a pin, node or edge
 */
type DflowItemKind = DflowPinKind | "node" | "edge";

type DflowSerializableItem = {
  id: DflowId;
};

type DflowItemConstructorArg = DflowSerializableItem;

interface DflowItem<Serializable extends DflowValue> {
  readonly id: DflowId;

  /**
   * Return serializable item,
   * i.e. an object that can be converted to JSON format.
   */
  toObject(): Serializable;
}

// DflowData
// ////////////////////////////////////////////////////////////////////

export type DflowValue =
  | string
  | number
  | boolean
  | DflowArray
  | DflowObject;

export type DflowObject = { [Key in string]?: DflowValue };

export type DflowArray = Array<DflowValue>;

const dflowDataTypes = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId",
] as const;

export type DflowDataType = typeof dflowDataTypes[number];

export class DflowData {
  static types = dflowDataTypes;

  static isArray(data: unknown): data is DflowArray {
    return Array.isArray(data);
  }

  static isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean";
  }

  static isDflowId(data: unknown): data is DflowId {
    return typeof data === "string" && data !== "";
  }

  static isObject(data: unknown): data is DflowObject {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }

  static isNumber(data: unknown): data is number {
    return typeof data === "number" && !isNaN(data) && Number.isFinite(data);
  }

  static isString(data: unknown): data is string {
    return typeof data === "string";
  }

  static isDflowData(data: unknown) {
    if (typeof data === "undefined") return false;
    return (
      DflowData.isString(data) ||
      DflowData.isBoolean(data) ||
      DflowData.isNumber(data) ||
      DflowData.isObject(data) ||
      DflowData.isArray(data) ||
      DflowData.isDflowId(data)
    );
  }

  static isValidDataType(types: DflowDataType[], data: unknown) {
    const isAnyType = types.length === 0;
    if (isAnyType) return true;

    return types.some((pinType) => {
      switch (pinType) {
        case "array":
          return DflowData.isArray(data);
        case "boolean":
          return DflowData.isBoolean(data);
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

// DflowPin
// ////////////////////////////////////////////////////////////////////

type DflowSerializablePin =
  & DflowSerializableItem
  & Partial<Pick<DflowPin, "name">>;

type DflowPinDefinition =
  & Pick<DflowPin, "types">
  & Partial<Pick<DflowPin, "name">>;

type DflowPinConstructorArg = Partial<Pick<DflowPin, "name" | "types">>;

export class DflowPin {
  readonly name?: string;

  readonly types: DflowDataType[];

  constructor(
    { name, types = [] }: DflowPinConstructorArg,
  ) {
    if (name) this.name = name;
    this.types = types;
  }

  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ) {
    // Source can have any type,
    // DflowHost.run() will validate data.
    const sourceHasTypeAny = sourceTypes.length === 0;
    if (sourceHasTypeAny) return true;
    // Target can have any type,
    // DflowNode.run() will validate data.
    const targetHasTypeAny = targetTypes.length === 0;
    if (targetHasTypeAny) return true;
    // Target pin handles some of the type source can have,
    // DflowNode.run() will validate date.
    return targetTypes.some((pinType) => sourceTypes.includes(pinType));
  }

  get hasTypeAny() {
    return this.types.length === 0;
  }

  hasType(type: DflowDataType) {
    return this.hasTypeAny || this.types.includes(type);
  }
}

// DflowInput
// ////////////////////////////////////////////////////////////////////

type DflowInputDefinition =
  & DflowPinDefinition
  & Partial<Pick<DflowInput, "optional">>;

type DflowInputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & Pick<DflowInputDefinition, "optional">;

export type DflowSerializableInput = DflowSerializablePin;

/**
 * @implements DflowItem<DflowSerializableInput>
 */
export class DflowInput extends DflowPin
  implements DflowItem<DflowSerializableInput> {
  readonly id: DflowId;

  #source?: DflowOutput;

  /**
   * By default an input is not optional; in this case if its data
   * is not defined then its node will not be executed.
   */
  optional?: boolean;

  constructor({ id, optional, ...pin }: DflowInputConstructorArg) {
    super(pin);
    this.id = id;
    if (optional) this.optional = optional;
  }

  get data(): DflowValue | undefined {
    return this.#source?.data;
  }

  get isConnected() {
    return typeof this.#source === "undefined";
  }

  connectTo(pin: DflowOutput) {
    if (DflowPin.canConnect(pin.types, this.types)) this.#source = pin;
    else {
      throw new DflowErrorCannotConnectPins({
        source: pin.toObject(),
        target: this.toObject(),
      });
    }
  }

  disconnect() {
    this.#source = undefined;
  }

  toObject(): DflowSerializableInput {
    return { id: this.id };
  }
}

// DflowOutput
// ////////////////////////////////////////////////////////////////////

type DflowOutputDefinition = DflowPinDefinition & {
  data?: DflowValue;
};

export type DflowSerializableOutput =
  & DflowSerializablePin
  & Partial<Pick<DflowOutput, "data">>;

type DflowOutputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & {
    data?: DflowValue;
  };

/**
 * @implements DflowItem<DflowSerializableOutput>
 */
export class DflowOutput extends DflowPin
  implements DflowItem<DflowSerializableOutput> {
  readonly id: DflowId;

  #data: DflowValue | undefined;

  constructor({ id, data, ...pin }: DflowOutputConstructorArg) {
    super(pin);
    this.id = id;
    this.#data = data;
  }

  get data(): DflowValue | undefined {
    return this.#data;
  }

  set data(data: unknown) {
    switch (true) {
      case typeof data === "undefined":
        this.clear();
        break;
      case this.hasTypeAny:
      case this.hasType("string") && DflowData.isString(data):
      case this.hasType("number") && DflowData.isNumber(data):
      case this.hasType("boolean") && DflowData.isBoolean(data):
      case this.hasType("object") && DflowData.isObject(data):
      case this.hasType("array") && DflowData.isArray(data):
      case this.hasType("DflowId") && DflowData.isDflowId(data): {
        this.#data = data as DflowValue;
        break;
      }
      default: {
        this.clear();
        break;
      }
    }
  }

  clear() {
    this.#data = undefined;
  }

  toObject(): DflowSerializableOutput {
    const obj: DflowSerializableOutput = { id: this.id };
    if (typeof this.#data !== "undefined") obj.data = this.#data;
    return obj;
  }
}

// DflowNode
// ////////////////////////////////////////////////////////////////////

export type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };

/**
 * DflowNode constructor accepts a single argument.
 *
 * You can import this type as a helper, for example if you need to create a DflowNode that does something in the constructor.
 * @example
 * ```ts
 * class DflowNodeFunction extends DflowNode {
 *   static kind = "function";
 *   static outputs = [output("DflowId", { name: "id" })];
 *   constructor(arg: DflowNodeConstructorArg) {
 *     super(arg);
 *     this.output(0).data = this.id;
 *   }
 * }
 * ```
 */
export type DflowNodeConstructorArg = {
  node: DflowSerializableNode;
  host: DflowHost;
};

/**
 * `DflowNode` represents a block of code: it can have inputs and outputs.
 *
 * Extend it to create a node.
 * @example
 * ```ts
 * const { input, output } = DflowNode;

 * class Addition extends DflowNode {
 *   static kind = "addition";
 *   static inputs = [input("number"), input("number")];
 *   static outputs = [output("number")];
 *   run() {
 *     this.output(0).data = (this.input(0).data as number) +
 *       (this.input(1).data as number);
 *   }
 * }
 * ```
 *
 * @implements DflowItem<DflowSerializableNode>
 */
export class DflowNode implements DflowItem<DflowSerializableNode> {
  readonly id: DflowId;

  readonly #inputsMap: Map<DflowId, DflowInput> = new Map();

  readonly #outputsMap: Map<DflowId, DflowOutput> = new Map();

  readonly #inputPosition: DflowId[] = [];

  readonly #outputPosition: DflowId[] = [];

  readonly kind: string;

  readonly host: DflowHost;

  constructor(
    {
      node: { id, kind, inputs = [], outputs = [] },
      host,
    }: DflowNodeConstructorArg,
  ) {
    this.id = id;
    this.host = host;
    this.kind = kind;

    // Inputs.

    const generateInputId = (i: number): DflowId => {
      const id = `i${i}`;
      return this.#inputsMap.has(id) ? generateInputId(i + 1) : id;
    };

    for (const obj of inputs) {
      const numInputs = this.#inputsMap.size;
      const id = DflowData.isDflowId(obj.id)
        ? obj.id
        : generateInputId(numInputs);
      const pin = new DflowInput({ ...obj, id });
      this.#inputsMap.set(id, pin);
      this.#inputPosition.push(id);
    }

    // Outputs.

    const generateOutputId = (i: number): DflowId => {
      const id = `o${i}`;
      return this.#outputsMap.has(id) ? generateOutputId(i + 1) : id;
    };

    for (const obj of outputs) {
      const numOutputs = this.#outputsMap.size;
      const id = DflowData.isDflowId(obj.id)
        ? obj.id
        : generateOutputId(numOutputs);
      const pin = new DflowOutput({ ...obj, id });
      this.#outputsMap.set(id, pin);
      this.#outputPosition.push(id);
    }
  }

  /**
   * `DlowNode.input()` is a `DflowInputDefinition` helper.
   *
   * @example
   * ```ts
   * const { input } = DflowNode;
   *
   * export class Echo extends DflowNode {
   *   static kind = "echo";
   *   static inputs = [input("string")];
   *   run () {
   *     console.log(this.input(0).data as string);
   *   }
   * }
   * ```
   *
   * Input with `number` type.
   * @example
   * ```ts
   * input("number")
   * ```
   *
   * Optional `number` input.
   * @example
   * ```ts
   * input("number", { optional: true })
   * ```
   *
   * Input that accepts both `number` and `string` type.
   * @example
   * ```ts
   * input(["number", "string"])
   * ```
   *
   * Input with any type.
   * @example
   * ```ts
   * input()
   * ```
   *
   * Input with type `array` and name.
   * @example
   * ```ts
   * input("array", { name: "list" })
   * ```
   *
   * Input with any type and named "foo".
   * @example
   * ```ts
   * input([], { name: "foo" })
   * ```
   */
  static input(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  /**
   * `DflowNode.output()` is a `DflowOutputDefinition` helper.
   *
   * @example
   * ```ts
   * const { output } = DflowNode;
   *
   * export class MathPI extends DflowNode {
   *   static kind = "mathPI";
   *   static outputs = [output("number", { name: "π", data: Math.PI })];
   * }
   * ```
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  get inputsDataAreValid(): boolean {
    for (const { data, types, optional } of this.#inputsMap.values()) {
      // Ignore optional inputs with no data.
      if (optional && typeof data === "undefined") continue;
      // Validate input data.
      if (DflowData.isValidDataType(types, data)) continue;
      // Some input is not valid.
      return false;
    }
    return true;
  }

  clearOutputs() {
    for (const output of this.#outputsMap.values()) output.clear();
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getInputById(id: DflowId): DflowInput {
    const item = this.#inputsMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "input", id });
    return item;
  }

  /**
   * Get input by position.
   *
   * @throws DflowErrorItemNotFound
   */
  input(position: number): DflowInput {
    const pinId = this.#inputPosition[position];

    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "input",
        nodeId: this.id,
        position,
      });
    }

    return this.getInputById(pinId);
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getOutputById(id: DflowId): DflowOutput {
    const item = this.#outputsMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "output", id });
    return item;
  }

  /**
   * Get output by position.
   *
   * @throws DflowErrorItemNotFound
   */
  output(position: number): DflowOutput {
    const pinId = this.#outputPosition[position];

    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "output",
        nodeId: this.id,
        position,
      });
    }

    return this.getOutputById(pinId);
  }

  run(): void | Promise<void> {}

  toObject(): DflowSerializableNode {
    const obj: DflowSerializableNode = {
      id: this.id,
      kind: this.kind,
    };

    const ins = [...this.#inputsMap.values()].map((item) => item.toObject());
    if (ins.length > 0) obj.inputs = ins;

    const outs = [...this.#outputsMap.values()].map((item) => item.toObject());
    if (outs.length > 0) obj.outputs = outs;

    return obj;
  }
}

// DflowEdge
// ////////////////////////////////////////////////////////////////////

type DflowSerializablePinPath = [nodeId: DflowId, pinId: DflowId];

export type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};

type DflowEdgeConstructorArg = DflowSerializableEdge;

/**
 * `DflowEdge` connects an input to an output.
 *
 * @implements DflowItem<DflowSerializableEdge>
 */
export class DflowEdge implements DflowItem<DflowSerializableEdge> {
  readonly id: DflowId;

  readonly source: DflowSerializablePinPath;

  readonly target: DflowSerializablePinPath;

  constructor({ source, target, id }: DflowEdgeConstructorArg) {
    this.id = id;
    this.source = source;
    this.target = target;
  }

  toObject(): DflowSerializableEdge {
    return {
      id: this.id,
      source: this.source,
      target: this.target,
    };
  }
}

// DflowNodesCatalog
// ////////////////////////////////////////////////////////////////////

export interface DflowNodeDefinition {
  new (arg: DflowNodeConstructorArg): DflowNode;
  kind: DflowNode["kind"];
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}

export type DflowNodesCatalog = Record<
  DflowNode["kind"],
  DflowNodeDefinition
>;

// DflowGraph
// ////////////////////////////////////////////////////////////////////

export type DflowGraphRunStatus = "running" | "success" | "failure";

export type DflowExecutionNodeInfo =
  & Pick<
    DflowSerializableNode,
    "id" | "kind" | "outputs"
  >
  & { error?: string };

export type DflowGraphExecutionReport = {
  status: DflowGraphRunStatus;
  start: string;
  end: string;
  steps: DflowExecutionNodeInfo[];
};

export type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};

type DflowNodeConnection = { sourceId: DflowId; targetId: DflowId };

type DflowGraphRunOptions = { verbose: boolean };

type DflowGraphConstructorArg = {
  nodesCatalog: DflowNodesCatalog;
};

/**
 * `DflowGraph` represents a program.
 * I can have nodes and edges. It executes all nodes, sorted by their connections.
 */
export class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;

  readonly nodesMap: Map<DflowId, DflowNode> = new Map();

  readonly edgesMap: Map<DflowId, DflowEdge> = new Map();

  runOptions: DflowGraphRunOptions = { verbose: false };

  runStatus: DflowGraphRunStatus | null = null;

  executionReport: DflowGraphExecutionReport | null = null;

  constructor({ nodesCatalog }: DflowGraphConstructorArg) {
    this.nodesCatalog = { ...nodesCatalog, ...coreNodesCatalog };
  }

  static executionNodeInfo = (
    { id, kind, outputs }: DflowSerializableNode,
    error?: string,
  ): DflowExecutionNodeInfo => {
    const obj: DflowExecutionNodeInfo = {
      id,
      kind,
      outputs: outputs?.map(({ id, data, name }) => ({ id, data, name })),
    };

    if (error) obj.error = error;

    return obj;
  };

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
    if (parentsNodeIds.length === 0) return 0;

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
    if (parentsNodeIds.length === 0) return [];
    return parentsNodeIds.reduce<DflowId[]>(
      (accumulator, parentNodeId, index, array) => {
        const ancestors = DflowGraph.ancestorsOfNodeId(
          parentNodeId,
          nodeConnections,
        );

        const result = accumulator.concat(ancestors);

        // On last iteration, remove duplicates
        return index === array.length - 1
          ? [...new Set(array.concat(result))]
          : result;
      },
      [],
    );
  }

  static sortNodesByLevel(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};

    for (const nodeId of nodeIds) {
      levelOf[nodeId] = DflowGraph.levelOfNodeId(nodeId, nodeConnections);
    }

    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  get nodeConnections(): DflowNodeConnection[] {
    return [...this.edgesMap.values()].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0],
    }));
  }

  get nodeIdsInsideFunctions(): DflowId[] {
    const ancestorsOfReturnNodes = [];

    // Find all "return" nodes and get their ancestors.
    for (const node of [...this.nodesMap.values()]) {
      if (node.kind === "return") {
        ancestorsOfReturnNodes.push(
          DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections),
        );
      }
    }

    // Flatten and deduplicate results.
    return [...new Set(ancestorsOfReturnNodes.flat())];
  }

  async run(runOptions?: DflowGraphRunOptions) {
    const { verbose } = runOptions ?? this.runOptions;

    // Set runStatus to running if there was some unhandled error in a previous run.
    this.runStatus = "running";

    const executionReport: DflowGraphExecutionReport = {
      status: this.runStatus,
      start: new Date().toJSON(),
      end: new Date().toJSON(),
      steps: [],
    };

    // Get nodeIds
    // 1. filtered by nodes inside functions
    // 2. sorted by graph hierarchy
    const nodeIdsExcluded = this.nodeIdsInsideFunctions;
    const nodeIds = DflowGraph.sortNodesByLevel(
      [...this.nodesMap.keys()].filter((nodeId) =>
        !nodeIdsExcluded.includes(nodeId)
      ),
      this.nodeConnections,
    );

    for (const nodeId of nodeIds) {
      const node = this.nodesMap.get(nodeId) as DflowNode;

      try {
        // If some input data is not valid.
        if (!node.inputsDataAreValid) {
          // Notify into execution report.
          if (verbose) {
            const error = new DflowErrorInvalidInputData({ nodeId });
            executionReport.steps.push(
              DflowGraph.executionNodeInfo(
                node.toObject(),
                error.message,
              ),
            );
          }
          // Cleanup outputs and go to next node.
          node.clearOutputs();
          continue;
        }

        if (
          node.run.constructor.name === "AsyncFunction"
        ) {
          await node.run();
        } else {
          node.run();
        }

        if (verbose) {
          executionReport.steps.push(
            DflowGraph.executionNodeInfo(node.toObject()),
          );
        }
      } catch (error) {
        console.error(error);
        this.runStatus = "failure";
      }
    }

    // Set runStatus to success if there was no error.
    if (this.runStatus === "running") this.runStatus = "success";

    executionReport.status = this.runStatus;
    executionReport.end = new Date().toJSON();

    this.executionReport = executionReport;
  }

  toObject(): DflowSerializableGraph {
    return {
      nodes: [...this.nodesMap.values()].map((item) => item.toObject()),
      edges: [...this.edgesMap.values()].map((item) => item.toObject()),
    };
  }
}

// DflowHost
// ////////////////////////////////////////////////////////////////////

type DflowNewItem = Partial<Pick<DflowSerializableItem, "id">>;

type DflowNewInput = DflowNewItem;

type DflowNewOutput =
  & DflowNewItem
  & Partial<Pick<DflowOutputConstructorArg, "data">>;

type DflowNewNode = DflowNewItem & Pick<DflowSerializableNode, "kind"> & {
  inputs?: DflowNewInput[];
  outputs?: DflowNewOutput[];
};

type DflowNewEdge =
  & DflowNewItem
  & Pick<DflowSerializableEdge, "source" | "target">;

export type DflowHostConstructorArg = DflowGraphConstructorArg;

export class DflowHost {
  readonly #graph: DflowGraph;

  readonly context: Record<string, unknown>;

  constructor(arg: DflowHostConstructorArg) {
    this.#graph = new DflowGraph(arg);
    this.context = {};
  }

  get executionReport() {
    return this.#graph.executionReport;
  }

  get edges() {
    return [...this.#graph.edgesMap.values()].map((item) => item.toObject());
  }

  get nodes() {
    return [...this.#graph.nodesMap.values()].map((item) => item.toObject());
  }

  get nodesCatalog(): DflowNodesCatalog {
    return this.#graph.nodesCatalog;
  }

  get runStatus() {
    return this.#graph.runStatus;
  }

  set verbose(option: DflowGraphRunOptions["verbose"]) {
    this.#graph.runOptions.verbose = option;
  }

  clearGraph() {
    this.#graph.nodesMap.clear();
    this.#graph.edgesMap.clear();
  }

  /**
   * Connect node A to node B.
   *
   * @example
   * ```ts
   * dflow.connect(nodeA).to(nodeB);
   * ```
   *
   * Both `connect()` and `to()` accept an optional second parameter which defaults to 0.
   * It is the pin position.
   *
   * @example
   * ```ts
   * dflow.connect(nodeA, outputPosition).to(nodeB, inputPosition);
   * ```
   *
   * @throws DflowErrorItemNotFound
   */
  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const sourcePin = sourceNode.output(sourcePosition);
        const targetPin = targetNode.input(targetPosition);
        this.newEdge({
          source: [sourceNode.id, sourcePin.id],
          target: [targetNode.id, targetPin.id],
        });
      },
    };
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  deleteEdge(edgeId: DflowId) {
    const edge = this.getEdgeById(edgeId);
    if (!edge) return;

    // 1. Cleanup target pin.
    const [targetNodeId, targetPinId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.disconnect();

    // 2. Delete edge.
    this.#graph.edgesMap.delete(edgeId);
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  deleteNode(nodeId: DflowId) {
    const node = this.getNodeById(nodeId);

    // 1. Delete all edges connected to node.
    for (const edge of this.edges) {
      const {
        source: [sourceNodeId],
        target: [targetNodeId],
      } = edge;
      if (sourceNodeId === node.id || targetNodeId === node.id) {
        this.deleteEdge(edge.id);
      }
    }

    // 2. Delete node.
    this.#graph.nodesMap.delete(nodeId);
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
        return index === array.length ? [...new Set(result)] : result;
      },
      [],
    );

    // 1. get nodeIds sorted by graph hierarchy
    // 2. if it is an argument node, inject input data
    // 3. if if is a return node, output data
    // 4. otherwise run node
    const nodeIds = DflowGraph.sortNodesByLevel(
      [...returnNodeIds, ...nodeIdsInsideFunction],
      nodeConnections,
    );
    for (const nodeId of nodeIds) {
      const node = this.getNodeById(nodeId) as DflowNode;

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
            if (node.run.constructor.name === "AsyncFunction") {
              throw new Error(
                "dflow executeFunction() cannot execute async functions",
              );
            } else {
              node.run();
            }

            if (verbose) {
              this.executionReport?.steps?.push(
                DflowGraph.executionNodeInfo(node.toObject()),
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getEdgeById(id: DflowId): DflowEdge {
    const item = this.#graph.edgesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "edge", id });
    return item;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getNodeById(id: DflowId): DflowNode {
    const item = this.#graph.nodesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "node", id });
    return item;
  }

  newNode(obj: DflowNewNode): DflowNode {
    const numNodes = this.#graph.nodesMap.size;

    const generateNodeId = (i = numNodes): DflowId => {
      const id = `n${i}`;
      return this.#graph.nodesMap.has(id) ? generateNodeId(i + 1) : id;
    };

    const NodeClass = this.nodesCatalog[obj.kind] ?? DflowNodeUnknown;

    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateNodeId();

    const inputs = NodeClass.inputs?.map((pin, i) => {
      const objPin = obj.inputs?.[i] ?? {} as Partial<DflowNewInput>;
      const id = DflowData.isDflowId(objPin?.id) ? objPin.id : `i${i}`;
      return {
        id,
        ...objPin,
        ...pin,
      };
    }) ?? [];

    const outputs = NodeClass.outputs?.map((pin, i) => {
      const objPin = obj.outputs?.[i] ?? {} as Partial<DflowNewOutput>;
      const id = DflowData.isDflowId(objPin?.id) ? objPin.id : `o${i}`;
      return {
        id,
        ...objPin,
        ...pin,
      };
    }) ?? [];

    const node = new NodeClass({
      node: { ...obj, id, inputs, outputs },
      host: this,
    });

    this.#graph.nodesMap.set(node.id, node);

    return node;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  newEdge(obj: DflowNewEdge): DflowEdge {
    const numEdges = this.#graph.edgesMap.size;

    const generateEdgeId = (i = numEdges): DflowId => {
      const id = `e${i}`;
      return this.#graph.edgesMap.has(id) ? generateEdgeId(i + 1) : id;
    };

    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateEdgeId();

    const edge = new DflowEdge({ ...obj, id });

    this.#graph.edgesMap.set(edge.id, edge);

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;

    const sourceNode = this.getNodeById(sourceNodeId);
    const targetNode = this.getNodeById(targetNodeId);
    const sourcePin = sourceNode.getOutputById(sourcePinId);
    const targetPin = targetNode.getInputById(targetPinId);

    targetPin.connectTo(sourcePin);

    return edge;
  }

  toObject() {
    return this.#graph.toObject();
  }

  async run() {
    await this.#graph.run();
  }
}

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

const { input, output } = DflowNode;

class DflowNodeArgument extends DflowNode {
  static kind = "argument";
  static inputs = [input("number", { name: "position", optional: true })];
  static outputs = [output()];
}

class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [output()];
  constructor({ node: { outputs, ...node }, host }: DflowNodeConstructorArg) {
    super({
      node: {
        ...node,
        outputs: outputs?.map((output) => ({
          ...output,
          types:
            (function inferDflowDataType(data?: DflowValue): DflowDataType[] {
              switch (true) {
                case DflowData.isBoolean(data):
                  return ["boolean"];
                case DflowData.isNumber(data):
                  return ["number"];
                case DflowData.isString(data):
                  return ["string"];
                case DflowData.isArray(data):
                  return ["array"];
                case DflowData.isObject(data):
                  return ["object"];
                default:
                  return [];
              }
            })(output.data),
        })),
      },
      host,
    });
  }
}

class DflowNodeFunction extends DflowNode {
  static kind = "function";
  static outputs = [output("DflowId", { name: "id" })];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.output(0).data = this.id;
  }
}

class DflowNodeReturn extends DflowNode {
  static kind = "return";
  static inputs = [
    input("DflowId", { name: "functionId" }),
    input([], { name: "value" }),
  ];
}

// The "unknown" node is not included in core nodes catalog.
export class DflowNodeUnknown extends DflowNode {}

const coreNodesCatalog: DflowNodesCatalog = {
  [DflowNodeArgument.kind]: DflowNodeArgument,
  [DflowNodeData.kind]: DflowNodeData,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeReturn.kind]: DflowNodeReturn,
};

// Dflow errors
// ////////////////////////////////////////////////////////////////////

const dflowErrors = [
  "CannotConnectPins",
  "InvalidInputData",
  "ItemNotFound",
] as const;
type DflowErrorName = typeof dflowErrors[number];

/**
 * DflowError is an abstract class extending Error.
 * Its message is a JSON string.
 */
export class DflowError extends Error {
  constructor(arg: DflowObject, errorName: DflowErrorName) {
    super(JSON.stringify({ error: errorName, ...arg }));
  }
}

// DflowErrorCannotConnectPins

export type DflowSerializableErrorCannotConnectPins = {
  source: DflowSerializableOutput;
  target: DflowSerializableInput;
};

export class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg: DflowSerializableErrorCannotConnectPins) {
    super(arg, "CannotConnectPins");
  }
}

// DflowErrorInvalidInputData

export type DflowSerializableErrorInvalidInputData = {
  nodeId: DflowSerializableNode["id"];
};

export class DflowErrorInvalidInputData extends DflowError {
  constructor(arg: DflowSerializableErrorInvalidInputData) {
    super(arg, "InvalidInputData");
  }
}

// DflowErrorItemNotFound

export type DflowSerializableErrorItemNotFound = {
  kind: DflowItemKind;
  id?: DflowId;
  nodeId?: DflowId;
  position?: number;
};

export class DflowErrorItemNotFound extends DflowError {
  constructor(arg: DflowSerializableErrorItemNotFound) {
    super(arg, "ItemNotFound");
  }
}
