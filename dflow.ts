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

interface DflowItem<Serializable extends DflowData> {
  /** Item identifier */
  readonly id: DflowId;
  /**
   * Return serializable item,
   * i.e. an object that can be converted to JSON format.
   */
  toObject(): Serializable;
}

/**
 * Helper to generate unique id.
 * @ignore
 */
const generateItemId = (
  itemMap: Map<DflowId, unknown>,
  idPrefix: string,
  i?: number,
): DflowId => {
  const n = i ?? itemMap.size;
  const id = `${idPrefix}${n}`;
  return itemMap.has(id) ? generateItemId(itemMap, idPrefix, n + 1) : id;
};

// DflowData
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowData` represents input or output data and can be serialized into JSON.
 */
export type DflowData =
  | string
  | number
  | boolean
  | DflowArray
  | DflowObject;

/** @ignore */
export type DflowObject = { [Key in string]?: DflowData };

/** @ignore */
export type DflowArray = DflowData[];

export type DflowDataType = typeof Dflow.dataTypes[number];

/**
 * `Dflow` is a static class with methods to handle Dflow data.
 */
export class Dflow {
  static dataTypes = [
    "string",
    "number",
    "boolean",
    "object",
    "array",
    "DflowId",
  ];

  static inferDataType(data: unknown): DflowDataType[] {
    if (Dflow.isBoolean(data)) return ["boolean"];
    if (Dflow.isNumber(data)) return ["number"];
    if (Dflow.isString(data)) return ["string"];
    if (Dflow.isArray(data)) return ["array"];
    if (Dflow.isObject(data)) return ["object"];
    return [];
  }

  static isArray(arg: unknown): arg is DflowArray {
    return Array.isArray(arg) && arg.every(Dflow.isDflowData);
  }

  static isBoolean(arg: unknown): arg is boolean {
    return typeof arg === "boolean";
  }

  static isDflowId(arg: unknown): arg is DflowId {
    return typeof arg === "string" && arg !== "";
  }

  static isObject(arg: unknown): arg is DflowObject {
    return typeof arg === "object" && arg !== null && !Array.isArray(arg) &&
      Object.values(arg).every(Dflow.isDflowData);
  }

  static isNumber(arg: unknown): arg is number {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }

  static isString(arg: unknown): arg is string {
    return typeof arg === "string";
  }

  static isDflowData(arg: unknown): arg is DflowData {
    if (typeof arg === "undefined") return false;
    return (
      Dflow.isString(arg) ||
      Dflow.isBoolean(arg) ||
      Dflow.isNumber(arg) ||
      Dflow.isObject(arg) ||
      Dflow.isArray(arg) ||
      Dflow.isDflowId(arg)
    );
  }

  static isValidDataType(types: DflowDataType[], data: unknown) {
    const isAnyType = types.length === 0;
    if (isAnyType) return true;

    return types.some((pinType) => {
      switch (pinType) {
        case "array":
          return Dflow.isArray(data);
        case "boolean":
          return Dflow.isBoolean(data);
        case "number":
          return Dflow.isNumber(data);
        case "object":
          return Dflow.isObject(data);
        case "string":
          return Dflow.isString(data);
        case "DflowId":
          return Dflow.isDflowId(data);
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

  constructor({ name, types = [] }: DflowPinConstructorArg) {
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
    // Target pin accepts some of the type source can have,
    // DflowNode.run() will validate data.
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
 * A `DflowInput` is a node input pin.
 *
 * @implements DflowItem<DflowSerializableInput>
 */
export class DflowInput extends DflowPin
  implements DflowItem<DflowSerializableInput> {
  readonly id: DflowId;

  private source?: DflowOutput;

  /**
   * If an input is not optional and its data is not defined then its node will not be executed.
   * If an input is optional, then its node will be executed even if the inputs has no data.
   * By default an input is not optional.
   */
  optional?: boolean;

  constructor({ id, optional, ...pin }: DflowInputConstructorArg) {
    super(pin);
    this.id = id;
    if (optional) this.optional = optional;
  }

  /**
   * An input data is a reference to its connected output data, if any.
   */
  get data(): DflowData | undefined {
    return this.source?.data;
  }

  get isConnected() {
    return typeof this.source === "undefined";
  }

  connectTo(pin: DflowOutput) {
    if (DflowPin.canConnect(pin.types, this.types)) this.source = pin;
    else {
      throw new DflowErrorCannotConnectPins({
        source: pin.toObject(),
        target: this.toObject(),
      });
    }
  }

  disconnect() {
    this.source = undefined;
  }

  /** Return serializable item. */
  toObject(): DflowSerializableInput {
    return { id: this.id };
  }
}

// DflowOutput
// ////////////////////////////////////////////////////////////////////

type DflowOutputDefinition = DflowPinDefinition & {
  data?: DflowData;
};

type DflowOutputData = {
  data?: DflowData | undefined;
};
export type DflowSerializableOutput =
  & DflowSerializablePin
  & DflowOutputData;

type DflowOutputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & DflowOutputData;

/**
 * A `DflowOutput` is a node output pin.
 *
 * @implements DflowItem<DflowSerializableOutput>
 */
export class DflowOutput extends DflowPin
  implements DflowItem<DflowSerializableOutput> {
  readonly id: DflowId;

  private value: DflowData | undefined;

  constructor({ id, data, ...pin }: DflowOutputConstructorArg) {
    super(pin);
    this.id = id;
    this.value = data;
  }

  get data(): DflowData | undefined {
    return this.value;
  }

  set data(arg: unknown) {
    if (typeof arg === "undefined") {
      this.clear();
    } else if (
      (this.hasType("string") && Dflow.isString(arg)) ||
      (this.hasType("number") && Dflow.isNumber(arg)) ||
      (this.hasType("boolean") && Dflow.isBoolean(arg)) ||
      (this.hasType("object") && Dflow.isObject(arg)) ||
      (this.hasType("array") && Dflow.isArray(arg)) ||
      (this.hasType("DflowId") && Dflow.isDflowId(arg)) ||
      (this.hasTypeAny && Dflow.isDflowData(arg))
    ) {
      this.value = arg;
    } else {
      this.clear();
    }
  }

  clear() {
    this.value = undefined;
  }

  /** Return serializable item. */
  toObject(): DflowSerializableOutput {
    const obj: DflowSerializableOutput = { id: this.id };
    if (typeof this.value !== "undefined") obj.data = this.value;
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
 * You can import `DflowNodeConstructorArg` type as a helper,
 * for example if you need to create a node that does something in the constructor.
 *
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
 *
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

  /** @ignore */
  private inputsMap: Map<DflowId, DflowInput> = new Map();

  /** @ignore */
  private outputsMap: Map<DflowId, DflowOutput> = new Map();

  /** @ignore */
  private inputPosition: DflowId[] = [];

  /** @ignore */
  private outputPosition: DflowId[] = [];

  readonly kind: string;

  readonly host: DflowHost;

  constructor({
    node: { id, kind, inputs = [], outputs = [] },
    host,
  }: DflowNodeConstructorArg) {
    this.id = id;
    this.host = host;
    this.kind = kind;

    // Inputs.

    for (const obj of inputs) {
      const id = Dflow.isDflowId(obj.id)
        ? obj.id
        : generateItemId(this.inputsMap, "i");
      const pin = new DflowInput({ ...obj, id });
      this.inputsMap.set(id, pin);
      this.inputPosition.push(id);
    }

    // Outputs.

    for (const obj of outputs) {
      const id = Dflow.isDflowId(obj.id)
        ? obj.id
        : generateItemId(this.outputsMap, "o");
      const pin = new DflowOutput({ ...obj, id });
      this.outputsMap.set(id, pin);
      this.outputPosition.push(id);
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
   *
   * @example
   * ```ts
   * input("number")
   * ```
   *
   * Optional `number` input.
   *
   * @example
   *
   * ```ts
   * input("number", { optional: true })
   * ```
   *
   * Input that accepts both `number` and `string` type.
   *
   * @example
   *
   * ```ts
   * input(["number", "string"])
   * ```
   *
   * Input with any type.
   *
   * @example
   * ```ts
   * input()
   * ```
   *
   * Input with type `array` and name.
   *
   * @example
   * ```ts
   * input("array", { name: "list" })
   * ```
   *
   * Input with any type and named "foo".
   *
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
   *
   * Named output with `number` type.
   *
   * @example
   * ```ts
   * input("number", { name: "answer" })
   * ```
   *
   * @see {@link DflowNode.input} for other similar examples.
   *
   * `DflowOutputDefinition` has also an optional `data` attribute.
   *
   * @example
   * ```ts
   * input("number", { data: 42, name: "answer" })
   * ```
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  get inputsDataAreValid(): boolean {
    for (const { data, types, optional } of this.inputsMap.values()) {
      // Ignore optional inputs with no data.
      if (optional && typeof data === "undefined") continue;
      // Validate input data.
      if (Dflow.isValidDataType(types, data)) continue;
      // Some input is not valid.
      return false;
    }
    return true;
  }

  clearOutputs() {
    for (const output of this.outputsMap.values()) output.clear();
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getInputById(id: DflowId): DflowInput {
    const item = this.inputsMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "input", id });
    return item;
  }

  /**
   * Get input by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  input(position: number): DflowInput {
    const pinId = this.inputPosition[position];
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
   * @throws {DflowErrorItemNotFound}
   */
  getOutputById(id: DflowId): DflowOutput {
    const item = this.outputsMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "output", id });
    return item;
  }

  /**
   * Get output by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  output(position: number): DflowOutput {
    const pinId = this.outputPosition[position];
    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "output",
        nodeId: this.id,
        position,
      });
    }
    return this.getOutputById(pinId);
  }

  /** @ignore this method, it should be overridden. */
  run(): void | Promise<void> {}

  /** Return serializable item. */
  toObject(): DflowSerializableNode {
    const obj: DflowSerializableNode = {
      id: this.id,
      kind: this.kind,
    };

    const ins = [...this.inputsMap.values()].map((item) => item.toObject());
    if (ins.length > 0) obj.inputs = ins;

    const outs = [...this.outputsMap.values()].map((item) => item.toObject());
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

  /** Path to output pin. */
  readonly source: DflowSerializablePinPath;

  /** Path to input pin. */
  readonly target: DflowSerializablePinPath;

  constructor({ source, target, id }: DflowEdgeConstructorArg) {
    this.id = id;
    this.source = source;
    this.target = target;
  }

  /** Return serializable item. */
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

/**
 * A class extending `DflowNode` must implement `DflowNodeDefinition` interface,
 * to be used as a value in a `DflowNodesCatalog`.
 */
export interface DflowNodeDefinition {
  new (arg: DflowNodeConstructorArg): DflowNode;
  kind: DflowNode["kind"];
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}

/**
 * A `DflowNodesCatalog` is a record containing node classes indexed by their kind.
 *
 * @example
 * ```ts
 * const nodesCatalog: DflowNodesCatalog = {
 *   myNode: MyNodeClass
 * }
 * ```
 */
export type DflowNodesCatalog = Record<DflowNode["kind"], DflowNodeDefinition>;

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
 * It can contain nodes and edges. Nodes are executed, sorted by their connections.
 */
export class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;

  /** @ignore */
  readonly nodesMap: Map<DflowId, DflowNode> = new Map();

  /** @ignore */
  readonly edgesMap: Map<DflowId, DflowEdge> = new Map();

  runOptions: DflowGraphRunOptions = { verbose: false };

  runStatus: DflowGraphRunStatus | null = null;

  executionReport: DflowGraphExecutionReport | null = null;

  constructor({ nodesCatalog }: DflowGraphConstructorArg) {
    this.nodesCatalog = { ...nodesCatalog, ...coreNodesCatalog };
  }

  /** @ignore */
  static childrenOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ sourceId }) => nodeId === sourceId)
      .map(({ targetId }) => targetId);
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

  /** @ignore */
  static parentsOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
  }

  /** @ignore */
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

  /** @ignore */
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

  /** @ignore */
  get nodeConnections(): DflowNodeConnection[] {
    return [...this.edgesMap.values()].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0],
    }));
  }

  /** @ignore */
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

  /** @ignore */
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

  /**
   * Execute all nodes, sorted by their connections.
   */
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
      [...this.nodesMap.keys()].filter(
        (nodeId) => !nodeIdsExcluded.includes(nodeId),
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
              DflowGraph.executionNodeInfo(node.toObject(), error.message),
            );
          }
          // Cleanup outputs and go to next node.
          node.clearOutputs();
          continue;
        }

        if (node.run.constructor.name === "AsyncFunction") {
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

  /** Return serializable item. */
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

type DflowNewNode =
  & DflowNewItem
  & Pick<DflowSerializableNode, "kind">
  & {
    inputs?: DflowNewInput[];
    outputs?: DflowNewOutput[];
  };

type DflowNewEdge =
  & DflowNewItem
  & Pick<DflowSerializableEdge, "source" | "target">;

export type DflowHostConstructorArg = DflowGraphConstructorArg;

export class DflowHost {
  private graph: DflowGraph;

  readonly context: Record<string, unknown>;

  constructor(arg: DflowHostConstructorArg) {
    this.graph = new DflowGraph(arg);
    this.context = {};
  }

  get executionReport() {
    return this.graph.executionReport;
  }

  /** List edge objects. */
  get edges(): DflowSerializableEdge[] {
    return [...this.graph.edgesMap.values()].map((item) => item.toObject());
  }

  /** List node objects. */
  get nodes(): DflowSerializableNode[] {
    return [...this.graph.nodesMap.values()].map((item) => item.toObject());
  }

  get nodesCatalog(): DflowNodesCatalog {
    return this.graph.nodesCatalog;
  }

  get runStatus() {
    return this.graph.runStatus;
  }

  set verbose(option: DflowGraphRunOptions["verbose"]) {
    this.graph.runOptions.verbose = option;
  }

  /**
   * Empty graph.
   *
   * @example
   * ```ts
   * const previousGraph = dflow.graph;
   * dflow.clearGraph();
   * ```
   */
  clearGraph() {
    this.graph.nodesMap.clear();
    this.graph.edgesMap.clear();
  }

  /**
   * Connect node A to node B.
   *
   * @example
   * ```ts
   * dflow.connect(nodeA).to(nodeB);
   * ```
   *
   * Both `connect()` and `to()` accept an optional second parameter:
   * the *pin position*, which defaults to 0.
   *
   * @example
   * ```ts
   * dflow.connect(nodeA, outputPosition).to(nodeB, inputPosition);
   * ```
   *
   * @throws {DflowErrorItemNotFound}
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
   * Delete edge with given id.
   * @throws {DflowErrorItemNotFound}
   */
  deleteEdge(edgeId: DflowId) {
    const edge = this.getEdgeById(edgeId);
    // 1. Cleanup target pin.
    const [targetNodeId, targetPinId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.disconnect();
    // 2. Delete edge.
    this.graph.edgesMap.delete(edgeId);
  }

  /**
   * Delete node with given id.
   * @throws {DflowErrorItemNotFound}
   */
  deleteNode(nodeId: DflowId) {
    // 1. First of all, get node. It will throw if node does not exist.
    const node = this.getNodeById(nodeId);
    // 2. Then, delete all edges connected to node.
    for (const edge of this.edges) {
      const {
        source: [sourceNodeId],
        target: [targetNodeId],
      } = edge;
      if (sourceNodeId === node.id || targetNodeId === node.id) {
        this.deleteEdge(edge.id);
      }
    }
    // 3. Finally, delete node.
    this.graph.nodesMap.delete(nodeId);
  }

  executeFunction(functionId: DflowId, args: DflowArray) {
    const { verbose } = this.graph.runOptions;

    // Get all return nodes connected to function node.
    const nodeConnections = this.graph.nodeConnections;
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
              ? Math.max(position, 0)
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
   * @throws {DflowErrorItemNotFound}
   */
  getEdgeById(id: DflowId): DflowEdge {
    const item = this.graph.edgesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "edge", id });
    return item;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getNodeById(id: DflowId): DflowNode {
    const item = this.graph.nodesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound({ kind: "node", id });
    return item;
  }

  newNode(obj: DflowNewNode): DflowNode {
    const NodeClass = this.nodesCatalog[obj.kind] ?? DflowNodeUnknown;

    const id = Dflow.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateItemId(this.graph.nodesMap, "n");

    const inputs = NodeClass.inputs?.map((pin, i) => {
      const objPin = obj.inputs?.[i] ?? ({} as Partial<DflowNewInput>);
      const id = Dflow.isDflowId(objPin?.id) ? objPin.id : `i${i}`;
      return {
        id,
        ...objPin,
        ...pin,
      };
    }) ?? [];

    const outputs = NodeClass.outputs?.map((pin, i) => {
      const objPin = obj.outputs?.[i] ?? ({} as Partial<DflowNewOutput>);
      const id = Dflow.isDflowId(objPin?.id) ? objPin.id : `o${i}`;
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

    this.graph.nodesMap.set(node.id, node);

    return node;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  newEdge(obj: DflowNewEdge): DflowEdge {
    const id = Dflow.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateItemId(this.graph.edgesMap, "e");

    const edge = new DflowEdge({ ...obj, id });

    this.graph.edgesMap.set(edge.id, edge);

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;

    const sourceNode = this.getNodeById(sourceNodeId);
    const targetNode = this.getNodeById(targetNodeId);
    const sourcePin = sourceNode.getOutputById(sourcePinId);
    const targetPin = targetNode.getInputById(targetPinId);

    targetPin.connectTo(sourcePin);

    return edge;
  }

  /** Return serializable graph. */
  toObject(): DflowSerializableGraph {
    return this.graph.toObject();
  }

  /** Execute graph. */
  async run() {
    await this.graph.run();
  }
}

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

const { input, output } = DflowNode;

/** @ignore */
class DflowNodeArgument extends DflowNode {
  static kind = "argument";
  static inputs = [input("number", { name: "position", optional: true })];
  static outputs = [output()];
}

/** @ignore */
class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [output()];
  constructor({ node: { outputs, ...node }, host }: DflowNodeConstructorArg) {
    super({
      node: {
        ...node,
        outputs: outputs?.map((output) => ({
          ...output,
          types: Dflow.inferDataType(output.data),
        })),
      },
      host,
    });
  }
}

/** @ignore */
class DflowNodeFunction extends DflowNode {
  static kind = "function";
  static outputs = [output("DflowId", { name: "id" })];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.output(0).data = this.id;
  }
}

/** @ignore */
class DflowNodeReturn extends DflowNode {
  static kind = "return";
  static inputs = [
    input("DflowId", { name: "functionId" }),
    input([], { name: "value" }),
  ];
}

/**
 * This class is used to instantiate a new node which `kind` was not found in `nodesCatalog`.
 * The "unknown" node class is not included in `coreNodesCatalog`.
 */
export class DflowNodeUnknown extends DflowNode {}

/** Builtin nodes, always included in `nodesCatalog`. */
export const coreNodesCatalog: DflowNodesCatalog = {
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

export class DflowErrorInvalidInputData extends DflowError {
  constructor(arg: DflowSerializableErrorInvalidInputData) {
    super(arg, "InvalidInputData");
  }
}
export type DflowSerializableErrorInvalidInputData = {
  nodeId: DflowSerializableNode["id"];
};

export class DflowErrorItemNotFound extends DflowError {
  constructor(arg: DflowSerializableErrorItemNotFound) {
    super(arg, "ItemNotFound");
  }
}
export type DflowSerializableErrorItemNotFound = {
  kind: DflowItemKind;
  id?: DflowId;
  nodeId?: DflowId;
  position?: number;
};
