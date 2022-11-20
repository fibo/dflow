// DflowItem
// ////////////////////////////////////////////////////////////////////

/**
 * Every dflow item has an identifier unique in its scope.
 * A node or edge id is unique in its graph.
 * An input or output id is unique in its node.
 */
export type DflowId = string;

/**
 * Every dflow item, e.g. `DflowNode`, `DflowEdge`, etc. is
 * serializable into JSON and must implement `DflowItem` interface.
 */
export interface DflowItem<Serializable extends DflowData> {
  /** Item identifier. */
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
 * A `DflowData` represents any data that can be serialized into JSON.
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

  /**
   * Infer `DflowDataType` of given argument.
   */
  static inferDataType(arg: unknown): DflowDataType[] {
    if (Dflow.isBoolean(arg)) return ["boolean"];
    if (Dflow.isNumber(arg)) return ["number"];
    if (Dflow.isString(arg)) return ["string"];
    if (Dflow.isArray(arg)) return ["array"];
    if (Dflow.isObject(arg)) return ["object"];
    return [];
  }

  /**
   * Type guard for `DflowArray`.
   * It checks recursively that every element is some `DflowData`.
   */
  static isArray(arg: unknown): arg is DflowArray {
    return Array.isArray(arg) && arg.every(Dflow.isDflowData);
  }

  /**
   * Type guard for `boolean`.
   */
  static isBoolean(arg: unknown): arg is boolean {
    return typeof arg === "boolean";
  }

  /**
   * Type guard for `DflowId`.
   */
  static isDflowId(arg: unknown): arg is DflowId {
    return typeof arg === "string" && arg !== "";
  }

  /**
   * Type guard for `DflowObject`.
   * It checks recursively that every value is some `DflowData`.
   */
  static isObject(arg: unknown): arg is DflowObject {
    return typeof arg === "object" && arg !== null && !Array.isArray(arg) &&
      Object.values(arg).every(Dflow.isDflowData);
  }

  /**
   * Type guard for a valid dflow `number`, i.e. finite and not `NaN`.
   */
  static isNumber(arg: unknown): arg is number {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }

  /**
   * Type guard for `string`.
   */
  static isString(arg: unknown): arg is string {
    return typeof arg === "string";
  }

  /**
   * Type guard for `DflowData`.
   */
  static isDflowData(arg: unknown): arg is DflowData {
    if (arg === undefined) return false;
    return (
      Dflow.isString(arg) ||
      Dflow.isBoolean(arg) ||
      Dflow.isNumber(arg) ||
      Dflow.isObject(arg) ||
      Dflow.isArray(arg) ||
      Dflow.isDflowId(arg)
    );
  }

  /**
   * Validate that data belongs to some of given types.
   */
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
    });
  }
}

// DflowPin
// ////////////////////////////////////////////////////////////////////

/**
 * `DflowPin` is a base class for `DflowInput` and `DflowOutput`.
 */
export class DflowPin {
  readonly name?: string;

  readonly nodeId: DflowId;

  readonly types: DflowDataType[];

  constructor(
    { nodeId, name, types = [] }:
      & Pick<DflowPin, "nodeId" | "types">
      & Partial<
        Pick<DflowPin, "name">
      >,
  ) {
    if (name) this.name = name;
    this.types = types;
    this.nodeId = nodeId;
  }

  /**
   * Check that types of output source are compatible with types of input target.
   */
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

  /**
   * If `types` is an empty list, it is equivalent to an `any` type.
   */
  get hasTypeAny() {
    return this.types.length === 0;
  }

  /**
   * Check that given type is compatible with pin types.
   */
  hasType(type: DflowDataType) {
    return this.hasTypeAny || this.types.includes(type);
  }
}

// DflowInput
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowNode` describes its inputs as a list of `DflowInputDefinition`.
 * @example
 * ```json
 *   {
 *     "name": "label",
 *     "types": ["string"],
 *     "optional": true
 *   }
 * ```
 */
export type DflowInputDefinition = {
  name?: string;
  types: DflowDataType[];
  optional?: boolean;
};

export type DflowSerializableInput = {
  id: DflowId;
};

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
   * By default an input is **not** `optional`.
   * If an input is not `optional` and its data is not defined then its node will not be executed.
   * If an input is `optional`, then its node will be executed even if the inputs has no data.
   */
  optional?: boolean;

  constructor(
    { id, optional, ...pin }:
      & { id: DflowId; nodeId: DflowId }
      & DflowInputDefinition,
  ) {
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
    return this.source !== undefined;
  }

  /**
   * Connect input to given output.
   */
  connectTo(pin: DflowOutput) {
    if (!DflowPin.canConnect(pin.types, this.types)) {
      throw new DflowErrorCannotConnectPins({
        source: [pin.nodeId, pin.id],
        target: [this.nodeId, this.id],
      });
    }
    this.source = pin;
  }

  /**
   * Disconnect from current output.
   */
  disconnect() {
    this.source = undefined;
  }

  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableInput {
    return { id: this.id };
  }
}

// DflowOutput
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowNode` describes its outputs as a list of `DflowOutputDefinition`.
 * @example
 * ```json
 *   {
 *     "name": "sum",
 *     "types": ["number"],
 *   }
 * ```
 */
export type DflowOutputDefinition = {
  name?: string;
  types: DflowDataType[];
  data?: DflowData;
};

export type DflowSerializableOutput = {
  id: DflowId;
  /** data */
  d?: DflowData;
};

/**
 * A `DflowOutput` is a node output pin.
 *
 * @implements DflowItem<DflowSerializableOutput>
 */
export class DflowOutput extends DflowPin
  implements DflowItem<DflowSerializableOutput> {
  readonly id: DflowId;

  private value: DflowData | undefined;

  constructor(
    { id, data, ...pin }:
      & { id: DflowId; nodeId: DflowId }
      & DflowOutputDefinition,
  ) {
    super(pin);
    this.id = id;
    this.value = data;
  }

  get data(): DflowData | undefined {
    return this.value;
  }

  set data(arg: unknown) {
    if (arg === undefined) {
      this.clear();
      return;
    }
    if (
      (this.hasType("string") && Dflow.isString(arg)) ||
      (this.hasType("number") && Dflow.isNumber(arg)) ||
      (this.hasType("boolean") && Dflow.isBoolean(arg)) ||
      (this.hasType("object") && Dflow.isObject(arg)) ||
      (this.hasType("array") && Dflow.isArray(arg)) ||
      (this.hasType("DflowId") && Dflow.isDflowId(arg)) ||
      (this.hasTypeAny && Dflow.isDflowData(arg))
    ) {
      this.value = arg;
    } else this.clear();
  }

  clear() {
    this.value = undefined;
  }

  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableOutput {
    const obj: DflowSerializableOutput = { id: this.id };
    if (this.value !== undefined) obj.d = this.value;
    return obj;
  }
}

// DflowNode
// ////////////////////////////////////////////////////////////////////

export type DflowSerializableNode = {
  id: DflowId;
  /** kind */
  k: DflowNode["kind"];
  /** inputs */
  i?: DflowSerializableInput[];
  /** outputs */
  o?: DflowSerializableOutput[];
};

/**
 * `DflowNode` constructor accepts a single argument.
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
export type DflowNodeConstructorArg =
  & Pick<DflowNode, "id" | "kind" | "host">
  & {
    inputs?: ({ id?: DflowId } & DflowInputDefinition)[];
    outputs?: ({ id?: DflowId } & DflowOutputDefinition)[];
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

  /**
   * Every dflow node must have its own `kind` that is used as *key*
   * to address it in the nodes catalog.
   */
  readonly kind: string;

  /**
   * `DflowNode` has a reference to its `DflowHost`.
   * It can be used in the node `run()` implementation.
   */
  readonly host: DflowHost;

  constructor({
    id,
    kind,
    inputs = [],
    outputs = [],
    host,
  }: DflowNodeConstructorArg) {
    this.id = id;
    this.host = host;
    this.kind = kind;

    // Inputs.
    for (const obj of inputs) {
      const id = obj.id ?? generateItemId(this.inputsMap, "i");
      const input = new DflowInput({ ...obj, id, nodeId: this.id });
      this.inputsMap.set(id, input);
      this.inputPosition.push(id);
    }

    // Outputs.
    for (const obj of outputs) {
      const id = obj.id ?? generateItemId(this.outputsMap, "o");
      const output = new DflowOutput({ ...obj, id, nodeId: this.id });
      this.outputsMap.set(id, output);
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
      if (optional && data === undefined) continue;
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
    if (!item) throw new DflowErrorItemNotFound("input", { id });
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
      throw new DflowErrorItemNotFound(
        "input",
        {
          id: this.id,
          nodeId: this.id,
          position,
        },
      );
    }
    return this.getInputById(pinId);
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getOutputById(id: DflowId): DflowOutput {
    const item = this.outputsMap.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound("output", { id, nodeId: this.id });
    }
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
      throw new DflowErrorItemNotFound(
        "output",
        {
          nodeId: this.id,
          position,
        },
      );
    }
    return this.getOutputById(pinId);
  }

  /** @ignore this method, it should be overridden. */
  run(): void | Promise<void> {}

  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableNode {
    const obj: DflowSerializableNode = {
      id: this.id,
      k: this.kind,
    };

    const inputs = [...this.inputsMap.values()].map((item) => item.toObject());
    if (inputs.length > 0) obj.i = inputs;

    const outputs = [...this.outputsMap.values()].map((item) =>
      item.toObject()
    );
    if (outputs.length > 0) obj.o = outputs;

    return obj;
  }
}

// DflowEdge
// ////////////////////////////////////////////////////////////////////

export type DflowSerializableEdge = {
  id: DflowId;
  s: DflowEdge["source"];
  t: DflowEdge["target"];
};

/**
 * `DflowEdge` connects an `DflowOutput` to a `DflowInput`.
 *
 * @implements DflowItem<DflowSerializableEdge>
 */
export class DflowEdge implements DflowItem<DflowSerializableEdge> {
  readonly id: DflowId;

  /**
   * Path to output pin.
   */
  readonly source: [nodeId: DflowId, pinId: DflowId];

  /**
   * Path to input pin.
   */
  readonly target: [nodeId: DflowId, pinId: DflowId];

  constructor(
    { source, target, id }: Pick<DflowEdge, "id" | "source" | "target">,
  ) {
    this.id = id;
    this.source = source;
    this.target = target;
  }

  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableEdge {
    return {
      id: this.id,
      s: this.source,
      t: this.target,
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
    "id" | "k" | "o"
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

  /** @ignore */
  static executionNodeInfo = (
    node: DflowSerializableNode,
    error?: string,
  ): DflowExecutionNodeInfo => {
    return error ? { ...node, error } : node;
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
  async run() {
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
          const error = new DflowErrorInvalidInputData(nodeId);
          executionReport.steps.push(
            DflowGraph.executionNodeInfo(node.toObject(), error.message),
          );
          // Cleanup outputs and go to next node.
          node.clearOutputs();
          continue;
        }

        if (node.run.constructor.name === "AsyncFunction") {
          await node.run();
        } else {
          node.run();
        }

        executionReport.steps.push(
          DflowGraph.executionNodeInfo(node.toObject()),
        );
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

  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableGraph {
    return {
      nodes: [...this.nodesMap.values()].map((item) => item.toObject()),
      edges: [...this.edgesMap.values()].map((item) => item.toObject()),
    };
  }
}

// DflowHost
// ////////////////////////////////////////////////////////////////////

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

  /**
   * List edge objects.
   */
  get edges(): Pick<DflowEdge, "id" | "source" | "target">[] {
    return [...this.graph.edgesMap.values()].map(({ id, source, target }) => ({
      id,
      source,
      target,
    }));
  }

  /**
   * List node objects.
   */
  get nodes(): DflowSerializableNode[] {
    return [...this.graph.nodesMap.values()].map((item) => item.toObject());
  }

  get nodesCatalog(): DflowNodesCatalog {
    return this.graph.nodesCatalog;
  }

  get runStatus() {
    return this.graph.runStatus;
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

            this.executionReport?.steps?.push(
              DflowGraph.executionNodeInfo(node.toObject()),
            );
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
    if (!item) throw new DflowErrorItemNotFound("edge", { id });
    return item;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getNodeById(id: DflowId): DflowNode {
    const item = this.graph.nodesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound("node", { id });
    return item;
  }

  newNode(arg: {
    kind: string;
    id?: DflowId;
    inputs?: { id?: DflowId }[];
    outputs?: { id?: DflowId; data?: DflowData }[];
  }): DflowNode {
    const NodeClass = this.nodesCatalog[arg.kind] ?? DflowNodeUnknown;

    const id = Dflow.isDflowId(arg.id)
      ? (arg.id as DflowId)
      : generateItemId(this.graph.nodesMap, "n");

    const inputs = NodeClass.inputs?.map((definition, i) => {
      const obj = arg.inputs?.[i];
      const id = obj?.id ?? `i${i}`;
      return {
        id,
        ...obj,
        ...definition,
      };
    }) ?? [];

    const outputs = NodeClass.outputs?.map((definition, i) => {
      const obj = arg.outputs?.[i];
      const id = obj?.id ?? `o${i}`;
      return {
        id,
        ...obj,
        ...definition,
      };
    }) ?? [];

    const node = new NodeClass({
      id,
      kind: arg.kind,
      host: this,
      inputs,
      outputs,
    });

    this.graph.nodesMap.set(node.id, node);

    return node;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  newEdge(
    arg: { id?: DflowId } & Pick<DflowEdge, "source" | "target">,
  ): DflowEdge {
    const id = Dflow.isDflowId(arg.id)
      ? (arg.id as DflowId)
      : generateItemId(this.graph.edgesMap, "e");

    const edge = new DflowEdge({ ...arg, id });

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

  /**
   * Return serializable item.
   */
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
  constructor({ outputs, ...rest }: DflowNodeConstructorArg) {
    super({
      outputs: outputs?.map((output) => ({
        ...output,
        types: Dflow.inferDataType(output.data),
      })),
      ...rest,
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

export class DflowErrorCannotConnectPins extends Error {
  constructor({ source, target }: Pick<DflowEdge, "source" | "target">) {
    super(`Cannot connect source ${source.join()} to target ${target.join()}`);
  }
}

export class DflowErrorInvalidInputData extends Error {
  constructor(nodeId: DflowId) {
    super(`Invalid input data in node ${nodeId}`);
  }
}

export class DflowErrorItemNotFound extends Error {
  constructor(
    item: "node" | "edge" | "input" | "output",
    { id, nodeId, position }: Partial<{
      id: DflowId;
      nodeId: DflowId;
      position: number;
    }>,
  ) {
    super(
      `Not Found ${item} ${
        [
          id ? `id=${id}` : "",
          nodeId ? `nodeId=${nodeId}` : "",
          position ? `position=${position}` : "",
        ].join()
      }`,
    );
  }
}
