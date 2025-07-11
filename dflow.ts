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

export type DflowObject = { [Key in string]: DflowData };

export type DflowArray = DflowData[];

export type DflowDataType =
  | "null"
  | "boolean"
  | "number"
  | "string"
  | "array"
  | "object";

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

export type DflowGraph = {
  /** nodes */
  n: DflowNodeObj[];
  /** edges */
  e: DflowEdge[];
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and edges.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  readonly context: Record<string, unknown>;

  #nodeDefinitions: Map<string, DflowNodeDefinition> = new Map();

  #nodesMap: Map<string, DflowNode> = new Map();

  #edgesMap: Map<string, DflowEdge> = new Map();

  constructor(nodeDefinitions: Array<DflowNodeDefinition>) {
    // Define core nodes.
    this.#nodeDefinitions.set(DflowNodeData.kind, DflowNodeData);
    // Add given node definitions.
    for (const nodeDefinition of nodeDefinitions)
      this.#nodeDefinitions.set(nodeDefinition.kind, nodeDefinition);
    this.context = {};
  }

  #levelOfNodeId(
    nodeId: string,
    nodeConnections: Array<{ sourceId: string; targetId: string }>
  ): number {
    const parentsNodeIds = nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
    // A node with no parent as level zero.
    if (parentsNodeIds.length === 0) return 0;
    // Otherwise its level is the max level of its parents plus one.
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
    const nodeConnections = [...this.#edgesMap.values()].map((edge) => ({
      sourceId: edge.s[0],
      targetId: edge.t[0]
    }));
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
    // Delete node.
    const node = this.#nodesMap.get(nodeId);
    if (!node) return;
    this.#nodesMap.delete(nodeId);
    // Delete all edges connected to node.
    for (const edge of this.#edgesMap.values())
      if (edge.s[0] === node.id || edge.t[0] === node.id)
        this.deleteEdge(edge.id);
  }

  /**
   * Create a new edge.
   */
  newNode(arg: {
    kind: string;
    id?: string;
    inputs?: { id?: string }[];
    outputs?: { id?: string; data?: DflowData }[];
  }): DflowNode {
    const NodeClass = this.#nodeDefinitions.get(arg.kind) ?? DflowNodeUnknown;

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
    const cause = { code: "", edge };

    const sourceNode = this.#nodesMap.get(edge.s[0]);
    const targetNode = this.#nodesMap.get(edge.t[0]);

    if (sourceNode && targetNode) {
      const sourceOutput = sourceNode.getOutputById(edge.s[1]);
      const targetInput = targetNode.getInputById(edge.t[1]);

      if (sourceOutput && targetInput) {
        if (Dflow.canConnect(sourceOutput.types, targetInput.types)) {
          this.#edgesMap.set(edge.id, edge);
          targetInput.source = sourceOutput;
          return edge;
        } else {
          cause.code = "IncompatibleTypes";
        }
      } else {
        cause.code = "SourceOrTargetNotFound";
      }
    }

    throw new Error("Cannot create edge", { cause });
  }

  /**
   * Execute all nodes, sorted by their connections.
   */
  async run() {
    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const node = this.#nodesMap.get(nodeId) as DflowNode;

      // If some input data is not valid.
      if (!node.inputsDataAreValid) {
        // Cleanup outputs and go to next node.
        node.clearOutputs();
        continue;
      }

      if (node.run.constructor.name === "Function") {
        node.run();
      } else if (node.run.constructor.name === "AsyncFunction") {
        await node.run();
      }
    }
  }

  get graph(): DflowGraph {
    return {
      n: [...this.#nodesMap.values()].map((item) => item.toJSON()),
      e: [...this.#edgesMap.values()]
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

/**
 * A `DflowInput` is a reference to a `DflowOutput` source, if connected.
 */
type DflowInput = {
  id: string;
  nodeId: string;
  name?: string;
  optional?: boolean;
  types: DflowDataType[];
  readonly data: DflowData | undefined;
  source?: DflowOutput;
};

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
  types: DflowDataType[];
  name?: string;
  data?: DflowData;
};

/**
 * A `DflowOutput` is a node output.
 */
type DflowOutput = {
  id: string;
  nodeId: string;
  name?: string;
  types: DflowDataType[];
  data?: DflowData;
  /** Cleanup output data. */
  clear(): void;
};

// DflowNode
// ////////////////////////////////////////////////////////////////////

/**
 * A class extending `DflowNode` must implement `DflowNodeDefinition` interface.
 */
export interface DflowNodeDefinition {
  new (arg: ConstructorParameters<typeof DflowNode>[0]): DflowNode;
  kind: string;
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}

type DflowNodeObj = {
  id: string;
  /** kind */
  k: string;
  /** inputs */
  i?: Array<{ id: string }>;
  /** outputs */
  o?: Array<{
    id: string;
    /** data */
    d?: DflowData;
  }>;
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
export class DflowNode {
  readonly id: string;

  #inputsMap: Map<string, DflowInput> = new Map();

  #outputsMap: Map<string, DflowOutput> = new Map();

  #inputPosition: string[] = [];

  #outputPosition: string[] = [];

  /**
   * Every dflow node must have its own `kind` that is used as a *unique key* to find it in the set of node definitions.
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
      this.#inputPosition.push(id);
      this.#inputsMap.set(id, {
        ...obj,
        id,
        nodeId: this.id,
        get data() {
          return this.source?.data;
        }
      });
    }

    // Outputs.
    for (const obj of outputs) {
      const id = generateItemId(this.#outputsMap, "o", obj.id);
      this.#outputPosition.push(id);
      let { data: _data, types, ...rest } = obj;
      this.#outputsMap.set(id, {
        ...rest,
        id,
        nodeId: this.id,
        types,
        clear() {
          _data = undefined;
        },
        get data(): DflowData | undefined {
          return _data;
        },
        set data(arg: DflowData) {
          if (arg === undefined) {
            _data = undefined;
            return;
          }
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
            _data = arg;
        }
      });
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

    const inputs = [...this.#inputsMap.values()].map((item) => ({
      id: item.id
    }));
    if (inputs.length > 0) obj.i = inputs;

    const outputs = [...this.#outputsMap.values()].map((item) => {
      const obj: { id: string; d?: DflowData } = { id: item.id };
      if (item.data !== undefined) obj.d = item.data;
      return obj;
    });
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
class DflowNodeUnknown extends DflowNode {
  static inputs = [];
  static outputs = [];
}
