// DflowData
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowData` represents any data that can be serialized into JSON.
 */
export type DflowData =
  | null
  | boolean
  | number
  | string
  | DflowArray
  | DflowObject;

export type DflowObject = { [Key in string]?: DflowData };

export type DflowArray = DflowData[];

export type DflowDataType =
  | "null"
  | "boolean"
  | "number"
  | "string"
  | "array"
  | "object";

/**
 * Every dflow item (`DflowNode`, `DflowEdge`, etc.) is serializable into JSON.
 */
interface Serializable<Data extends DflowData> {
  /**
   * Return serializable data,
   * i.e. an object that can be converted to JSON format.
   * It will be called by `JSON.stringify`.
   */
  toJSON(): Data;
}

// Dflow
// ////////////////////////////////////////////////////////////////////

// Helper to generate an id unique in its scope.
const generateItemId = (
  itemMap: Map<string, unknown>,
  idPrefix: string,
  wantedId?: string
): string => {
  if (wantedId && !itemMap.has(wantedId)) return wantedId;
  const id = `${idPrefix}${itemMap.size}`;
  return itemMap.has(id) ? generateItemId(itemMap, idPrefix) : id;
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and edges.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  readonly context: Record<string, unknown>;

  readonly nodesCatalog: DflowNodesCatalog;

  #nodesMap: Map<string, DflowNode> = new Map();

  #edgesMap: Map<string, DflowEdge> = new Map();

  executionReport: DflowExecutionReport | null = null;

  constructor(nodesCatalog: DflowNodesCatalog) {
    this.nodesCatalog = {
      ...nodesCatalog,
      [DflowNodeData.kind]: DflowNodeData
    };
    this.context = {};
  }

  #executionNodeInfo(node: DflowNode, error?: string): DflowExecutionNodeInfo {
    const { id, k, o } = node.toJSON();
    const info: DflowExecutionNodeInfo = { id, k };
    if (o) info.o = o;
    if (error) info.err = error;
    return info;
  }

  #levelOfNodeId(nodeId: string, nodeConnections: DflowNodeConnection[]) {
    const parentsNodeIds = nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
    // 1. A node with no parent as level zero.
    if (parentsNodeIds.length === 0) return 0;
    // 2. Otherwise its level is the max level of its parents plus one.
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds)
      maxLevel = Math.max(
        this.#levelOfNodeId(parentNodeId, nodeConnections),
        maxLevel
      );
    return maxLevel + 1;
  }

  // Sort node ids by their level in the graph.
  #sortedNodesIds(): string[] {
    const nodeIds = Array.from(this.#nodesMap.keys());
    const nodeConnections: DflowNodeConnection[] = [
      ...this.#edgesMap.values()
    ].map((edge) => ({ sourceId: edge.s[0], targetId: edge.t[0] }));
    const levelOf: Record<string, number> = {};
    for (const nodeId of nodeIds)
      levelOf[nodeId] = this.#levelOfNodeId(nodeId, nodeConnections);
    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  getEdgeById(id: string): DflowEdge | undefined {
    return this.#edgesMap.get(id);
  }

  getNodeById(id: string): DflowNode | undefined {
    return this.#nodesMap.get(id);
  }

  /**
   * Connect node A to node B.
   *
   * @example
   *
   * ```ts
   * dflow.connect(nodeA).to(nodeB);
   * ```
   *
   * Both `connect()` and `to()` accept an optional second parameter:
   * the *position*, which defaults to 0.
   *
   * @example
   *
   * ```ts
   * dflow.connect(nodeA, outputPosition).to(nodeB, inputPosition);
   * ```
   */
  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const sourceOutput = sourceNode.output(sourcePosition);
        const targetInput = targetNode.input(targetPosition);
        this.newEdge({
          source: [sourceNode.id, sourceOutput.id],
          target: [targetNode.id, targetInput.id]
        });
      }
    };
  }

  /**
   * Delete edge with given id.
   */
  deleteEdge(edgeId: string) {
    const edge = this.#edgesMap.get(edgeId);
    if (!edge) return;
    // Delete edge.
    this.#edgesMap.delete(edgeId);
    // Cleanup target input.
    const targetInput = this.#nodesMap.get(edge.t[0])?.getInputById(edge.t[1]);
    if (targetInput) targetInput.source = undefined;
  }

  /**
   * Delete node with given id.
   */
  deleteNode(nodeId: string) {
    // 1. Finally, delete node.
    const node = this.#nodesMap.get(nodeId);
    if (!node) return;
    this.#nodesMap.delete(nodeId);
    // 2. Delete all edges connected to node.
    for (const edge of this.#edgesMap.values())
      if (edge.s[0] === node.id || edge.t[0] === node.id)
        this.deleteEdge(edge.id);
  }

  newNode(arg: {
    kind: string;
    id?: string;
    inputs?: { id?: string }[];
    outputs?: { id?: string; data?: DflowData }[];
  }): DflowNode {
    const NodeClass = this.nodesCatalog[arg.kind] ?? DflowNodeUnknown;

    const id = generateItemId(this.#nodesMap, "n", arg.id);

    const inputs =
      NodeClass.inputs?.map((definition, i) => {
        const obj = arg.inputs?.[i];
        const id = obj?.id ?? `i${i}`;
        return { id, ...obj, ...definition };
      }) ?? [];

    const outputs =
      NodeClass.outputs?.map((definition, i) => {
        const obj = arg.outputs?.[i];
        const id = obj?.id ?? `o${i}`;
        return { id, ...obj, ...definition };
      }) ?? [];

    const node = new NodeClass({
      id,
      kind: arg.kind,
      host: this,
      inputs,
      outputs
    });

    this.#nodesMap.set(node.id, node);

    return node;
  }

  /**
   * Create a new edge.
   */
  newEdge(arg: {
    id?: string;
    source: [nodeId: string, outputId: string];
    target: [nodeId: string, inputId: string];
  }): DflowEdge {
    const id = generateItemId(this.#edgesMap, "e", arg.id);

    const edge: DflowEdge = { id, s: arg.source, t: arg.target };

    const sourceNode = this.#nodesMap.get(edge.s[0]);
    const targetNode = this.#nodesMap.get(edge.t[0]);

    if (sourceNode && targetNode) {
      const sourceOutput = sourceNode.getOutputById(edge.s[1]);
      const targetInput = targetNode.getInputById(edge.t[1]);

      if (
        sourceOutput &&
        targetInput &&
        Dflow.canConnect(sourceOutput.types, targetInput.types)
      ) {
        this.#edgesMap.set(edge.id, edge);
        targetInput.source = sourceOutput;
        return edge;
      }
    }

    throw new Error(`Cannot create edge ${JSON.stringify(arg)}`);
  }

  /**
   * Execute all nodes, sorted by their connections.
   */
  async run() {
    const executionReport: DflowExecutionReport = {
      start: performance.now(),
      end: performance.now(),
      steps: []
    };

    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const node = this.#nodesMap.get(nodeId) as DflowNode;

      // If some input data is not valid.
      if (!node.inputsDataAreValid) {
        // Notify into execution report.
        executionReport.steps.push(
          this.#executionNodeInfo(node, "Invalid input")
        );
        // Cleanup outputs and go to next node.
        node.clearOutputs();
        continue;
      }

      if (node.run.constructor.name === "Function") {
        node.run();
      } else if (node.run.constructor.name === "AsyncFunction") {
        await node.run();
      }

      executionReport.steps.push(this.#executionNodeInfo(node));
    }

    executionReport.end = performance.now();

    this.executionReport = executionReport;
  }

  toJSON(): { graph: DflowGraph } {
    return {
      graph: {
        n: [...this.#nodesMap.values()].map((item) => item.toJSON()),
        e: [...this.#edgesMap.values()]
      }
    };
  }

  /**
   * Check that source types are compatible with target types.
   */
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[]
  ) {
    // If source can have any type or
    // target can have any type,
    // then source and target are compatible.
    if (sourceTypes.length === 0 || targetTypes.length === 0) return true;
    // Check if target accepts some of the `dataType` source can have.
    return targetTypes.some((dataType) => sourceTypes.includes(dataType));
  }

  /**
   * Infer `DflowDataType` of given argument.
   */
  static inferDataType(arg: unknown): DflowDataType[] {
    if (arg === null) return ["null"];
    if (typeof arg === "boolean") return ["boolean"];
    if (typeof arg === "string") return ["string"];
    if (Dflow.isNumber(arg)) return ["number"];
    if (Dflow.isArray(arg)) return ["array"];
    if (Dflow.isObject(arg)) return ["object"];
    return [];
  }

  /**
   * `Dlow.input()` is a `DflowInputDefinition` helper.
   *
   * @example
   *
   * ```ts
   * const { input } = Dflow;
   *
   * export class Echo extends DflowNode {
   *   static kind = "echo";
   *   static inputs = [input("string")];
   *   run () {
   *     console.log(this.input(0).data);
   *   }
   * }
   * ```
   *
   * Input with `number` type.
   *
   * @example
   *
   * ```ts
   * Dflow.input("number")
   * ```
   *
   * Optional `number` input.
   *
   * @example
   *
   * ```ts
   * Dflow.input("number", { optional: true })
   * ```
   *
   * Input that accepts both `number` and `string` type.
   *
   * @example
   *
   * ```ts
   * Dflow.input(["number", "string"])
   * ```
   *
   * Input with any type.
   *
   * @example
   *
   * ```ts
   * Dflow.input()
   * ```
   *
   * Input with type `array` and name.
   *
   * @example
   *
   * ```ts
   * Dflow.input("array", { name: "list" })
   * ```
   *
   * Input with any type and named "foo".
   *
   * @example
   *
   * ```ts
   * Dflow.input([], { name: "foo" })
   * ```
   */
  static input(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowInputDefinition, "types">
  ): DflowInputDefinition {
    return {
      types: typeof typing === "string" ? [typing] : typing,
      ...rest
    };
  }

  /**
   * `Dflow.output()` is a `DflowOutputDefinition` helper.
   *
   * @example
   *
   * ```ts
   * const { output } = Dflow;
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
   *
   * ```ts
   * Dflow.output("number", { name: "answer" })
   * ```
   *
   * @see {@link Dflow.input} for other similar examples.
   *
   * `DflowOutputDefinition` has also an optional `data` attribute.
   *
   * @example
   *
   * ```ts
   * Dflow.output("number", { data: 42, name: "answer" })
   * ```
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutputDefinition, "types">
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  /**
   * Type guard for `DflowArray`.
   * It checks recursively that every element is some `DflowData`.
   */
  static isArray(arg: unknown): arg is DflowArray {
    return Array.isArray(arg) && arg.every(Dflow.isDflowData);
  }

  /**
   * Type guard for `DflowObject`.
   * It checks recursively that every value is some `DflowData`.
   */
  static isObject(arg: unknown): arg is DflowObject {
    return (
      typeof arg === "object" &&
      arg !== null &&
      !Array.isArray(arg) &&
      Object.values(arg).every(Dflow.isDflowData)
    );
  }

  /**
   * Type guard for a valid number, i.e. finite and not `NaN`.
   */
  static isNumber(arg: unknown): arg is number {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }

  /**
   * Type guard for `DflowData`.
   */
  static isDflowData(arg: unknown): arg is DflowData {
    if (arg === undefined) return false;
    return (
      arg === null ||
      typeof arg === "boolean" ||
      typeof arg === "string" ||
      Dflow.isNumber(arg) ||
      Dflow.isObject(arg) ||
      Dflow.isArray(arg)
    );
  }

  /**
   * Validate that data belongs to some of given types.
   */
  static isValidData(types: DflowDataType[], data: unknown) {
    if (types.length === 0)
      return data === undefined || Dflow.isDflowData(data);
    return types.some((dataType) =>
      dataType === "null"
        ? data === null
        : dataType === "boolean"
          ? typeof data === "boolean"
          : dataType === "string"
            ? typeof data === "string"
            : dataType === "number"
              ? Dflow.isNumber(data)
              : dataType === "object"
                ? Dflow.isObject(data)
                : dataType === "array"
                  ? Dflow.isArray(data)
                  : false
    );
  }
}

/**
 * `DflowIO` is a base type for `DflowInput` and `DflowOutput`.
 */
type DflowIO = {
  readonly id: string;

  readonly name?: string;

  readonly nodeId: string;

  readonly types: DflowDataType[];
};

// DflowInput
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowNode` describes its inputs as a list of `DflowInputDefinition`.
 *
 * @example
 *
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
  /**
   * By default an input is **not** `optional`.
   * If an input is `optional`, then its node will be executed even if the inputs has no data.
   * If an input is not `optional` and its data is not defined then its node will not be executed.
   */
  optional?: boolean;
};

export type DflowInputObj = {
  id: string;
};

/**
 * A `DflowInput` is a node input.
 */
export class DflowInput
  implements DflowIO, DflowInputDefinition, Serializable<DflowInputObj>
{
  readonly id: string;

  readonly nodeId: string;

  source?: DflowOutput;

  // DflowInputDefinition
  name?: string;
  types: DflowDataType[];
  optional?: boolean;

  constructor({
    id,
    nodeId,
    // DflowInputDefinition
    name,
    optional,
    types
  }: { id: string; nodeId: string } & DflowInputDefinition) {
    this.nodeId = nodeId;
    this.id = id;
    // DflowInputDefinition
    this.name = name;
    this.types = types;
    this.optional = optional;
  }

  /**
   * An input data is a reference to its connected output data, if any.
   */
  get data(): DflowData | undefined {
    return this.source?.data;
  }

  toJSON(): DflowInputObj {
    return { id: this.id };
  }
}

// DflowOutput
// ////////////////////////////////////////////////////////////////////

/**
 * A `DflowNode` describes its outputs as a list of `DflowOutputDefinition`.
 *
 * @example
 *
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

export type DflowOutputObj = {
  id: string;
  /** data */
  d?: DflowData;
};

/**
 * A `DflowOutput` is a node output.
 */
export class DflowOutput
  implements DflowIO, DflowOutputDefinition, Serializable<DflowOutputObj>
{
  readonly id: string;

  readonly nodeId: string;

  // DflowOutputDefinition
  name?: string;
  types: DflowDataType[];
  // #value holds data
  #value: DflowData | undefined;

  constructor({
    id,
    data,
    name,
    nodeId,
    types
  }: { id: string; nodeId: string } & DflowOutputDefinition) {
    if (name) this.name = name;
    this.types = types;
    this.nodeId = nodeId;
    this.id = id;
    this.#value = data;
  }

  get data(): DflowData | undefined {
    return this.#value;
  }

  set data(arg: unknown) {
    if (arg === undefined) {
      this.#value === undefined;
      return;
    }
    const { types } = this;
    if (
      // Has any type and `arg` is some valid data...
      (types.length === 0 && Dflow.isDflowData(arg)) ||
      // ... or output type corresponds to `arg` type.
      (types.includes("null") && arg === null) ||
      (types.includes("boolean") && typeof arg === "boolean") ||
      (types.includes("string") && typeof arg === "string") ||
      (types.includes("number") && Dflow.isNumber(arg)) ||
      (types.includes("object") && Dflow.isObject(arg)) ||
      (types.includes("array") && Dflow.isArray(arg))
    )
      this.#value = arg;
  }

  clear() {
    this.#value = undefined;
  }

  toJSON(): DflowOutputObj {
    const obj: DflowOutputObj = { id: this.id };
    if (this.#value !== undefined) obj.d = this.#value;
    return obj;
  }
}

// DflowNode
// ////////////////////////////////////////////////////////////////////

export type DflowNodeObj = {
  id: string;
  /** kind */
  k: DflowNode["kind"];
  /** inputs */
  i?: DflowInputObj[];
  /** outputs */
  o?: DflowOutputObj[];
};

/**
 * `DflowNode` represents a block of code: it can have inputs and outputs.
 *
 * Extend it to create a node.
 *
 * @example
 *
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
 */
export class DflowNode implements Serializable<DflowNodeObj> {
  readonly id: string;

  #inputsMap: Map<string, DflowInput> = new Map();

  #outputsMap: Map<string, DflowOutput> = new Map();

  #inputPosition: string[] = [];

  #outputPosition: string[] = [];

  /**
   * Every dflow node must have its own `kind` that is used as *key*
   * to address it in the nodes catalog.
   */
  readonly kind: string;

  /**
   * `DflowNode` has a reference to its `Dflow` host.
   * It can be used in the node `run()` implementation.
   */
  readonly host: Dflow;

  constructor({
    id,
    kind,
    host,
    inputs = [],
    outputs = []
  }: Pick<DflowNode, "id" | "kind" | "host"> & {
    inputs?: ({ id?: string } & DflowInputDefinition)[];
    outputs?: ({ id?: string } & DflowOutputDefinition)[];
  }) {
    this.id = id;
    this.host = host;
    this.kind = kind;

    // Inputs.
    for (const obj of inputs) {
      const id = generateItemId(this.#inputsMap, "i", obj.id);
      this.#inputsMap.set(id, new DflowInput({ ...obj, id, nodeId: this.id }));
      this.#inputPosition.push(id);
    }

    // Outputs.
    for (const obj of outputs) {
      const id = generateItemId(this.#outputsMap, "o", obj.id);
      this.#outputsMap.set(
        id,
        new DflowOutput({ ...obj, id, nodeId: this.id })
      );
      this.#outputPosition.push(id);
    }
  }

  get inputsDataAreValid(): boolean {
    for (const { data, types, optional } of this.#inputsMap.values()) {
      // Ignore optional inputs with no data.
      if (optional && data === undefined) continue;
      // Validate input data.
      if (Dflow.isValidData(types, data)) continue;
      // Some input is not valid.
      return false;
    }
    return true;
  }

  clearOutputs() {
    for (const output of this.#outputsMap.values()) output.clear();
  }

  /**
   * Get input by id.
   */
  getInputById(id: string): DflowInput | undefined {
    return this.#inputsMap.get(id);
  }

  /**
   * Get output by id.
   */
  getOutputById(id: string): DflowOutput | undefined {
    return this.#outputsMap.get(id);
  }

  /**
   * Get input by position.
   * @remarks This should be called inside `DflowNode.run()`. There is no check that the position is valid.
   */
  input(position: number): DflowInput {
    return this.#inputsMap.get(this.#inputPosition[position]) as DflowInput;
  }

  /**
   * Get output by position.
   * @remarks This should be called inside `DflowNode.run()`. There is no check that the position is valid.
   */
  output(position: number): DflowOutput {
    return this.#outputsMap.get(this.#outputPosition[position]) as DflowOutput;
  }

  /** @ignore this method, it should be overridden. */
  run(): void | Promise<void> {}

  toJSON(): DflowNodeObj {
    const obj: DflowNodeObj = { id: this.id, k: this.kind };

    const inputs = [...this.#inputsMap.values()].map((item) => item.toJSON());
    if (inputs.length > 0) obj.i = inputs;

    const outputs = [...this.#outputsMap.values()].map((item) => item.toJSON());
    if (outputs.length > 0) obj.o = outputs;

    return obj;
  }
}

// DflowEdge
// ////////////////////////////////////////////////////////////////////

/**
 * `DflowEdge` connects an `DflowOutput` to a `DflowInput`.
 */
export type DflowEdge = {
  id: string;

  /**
   * Source output coordinates.
   */
  s: [nodeId: string, outputId: string];

  /**
   * Target input coordinates.
   */
  t: [nodeId: string, inputId: string];
};

// DflowNodesCatalog
// ////////////////////////////////////////////////////////////////////

/**
 * A class extending `DflowNode` must implement `DflowNodeDefinition` interface,
 * to be used as a value in a `DflowNodesCatalog`.
 */
export interface DflowNodeDefinition {
  new (arg: ConstructorParameters<typeof DflowNode>[0]): DflowNode;
  kind: DflowNode["kind"];
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}

/**
 * A `DflowNodesCatalog` is a record containing node classes indexed by their kind.
 *
 * @example
 *
 * ```ts
 * const nodesCatalog: DflowNodesCatalog = {
 *   [MyNodeClass.kind]: MyNodeClass
 * }
 * ```
 */
export type DflowNodesCatalog = Record<DflowNode["kind"], DflowNodeDefinition>;

/**
 * Contains info about node execution, that is:
 * the serialized node except its inputs; an error, if any.
 */
export type DflowExecutionNodeInfo = Omit<DflowNodeObj, "i"> & {
  /** Error message during execution */
  err?: string;
};

export type DflowExecutionReport = {
  start: number;
  end: number;
  steps: DflowExecutionNodeInfo[];
};

export type DflowGraph = {
  /** nodes */
  n: DflowNodeObj[];
  /** edges */
  e: DflowEdge[];
};

type DflowNodeConnection = { sourceId: string; targetId: string };

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [Dflow.output()];
  constructor({
    outputs,
    ...rest
  }: ConstructorParameters<typeof DflowNode>[0]) {
    super({
      outputs: outputs?.map((output) => ({
        ...output,
        types: Dflow.inferDataType(output.data)
      })),
      ...rest
    });
  }
}

// This class is used to instantiate a new node which `kind` was not found in `nodesCatalog`.
// The "unknown" node class is not included in `coreNodesCatalog`.
class DflowNodeUnknown extends DflowNode {}
