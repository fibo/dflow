// DflowId
// ////////////////////////////////////////////////////////////////////

/**
 * Every dflow item has an identifier unique in its scope.
 * A node or edge id is unique in its graph.
 * An input or output id is unique in its node.
 */
export type DflowId = string;

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
 * Every dflow item (`DflowNode`, `DflowEdge`, etc.) and
 * every dflow error (`DflowErrorItemNotFound`, `DflowErrorInvalidInputData`, etc.)
 * is serializable into JSON.
 */
export interface DflowSerializable<Data extends DflowData> {
  /**
   * Return serializable data,
   * i.e. an object that can be converted to JSON format.
   * It will be called by `JSON.stringify`.
   */
  toJSON(): Data;
}

// Dflow
// ////////////////////////////////////////////////////////////////////

/**
 * `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and edges.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow implements DflowSerializable<DflowSerializableGraph> {
  readonly context: Record<string, unknown>;

  readonly nodesCatalog: DflowNodesCatalog;

  #nodesMap: Map<DflowId, DflowNode> = new Map();

  #edgesMap: Map<DflowId, DflowEdge> = new Map();

  executionReport: DflowExecutionReport | null = null;

  constructor(nodesCatalog: DflowNodesCatalog) {
    this.nodesCatalog = { ...nodesCatalog, ...coreNodesCatalog };
    this.context = {};
  }

  /**
   * Empty graph.
   */
  clear() {
    this.#nodesMap.clear();
    this.#edgesMap.clear();
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
   *
   * @throws {DflowErrorItemNotFound}
   */
  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const sourceOutput = sourceNode.output(sourcePosition);
        const targetInput = targetNode.input(targetPosition);
        this.newEdge({
          source: [sourceNode.id, sourceOutput.id],
          target: [targetNode.id, targetInput.id],
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
    // Cleanup target input.
    const [targetNodeId, targetInputId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetInput = targetNode.getInputById(targetInputId);
    // Disconnect target
    targetInput.source = undefined;
    // Delete edge.
    this.#edgesMap.delete(edgeId);
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
      if (sourceNodeId === node.id || targetNodeId === node.id)
        this.deleteEdge(edge.id);
    }
    // 3. Finally, delete node.
    this.#nodesMap.delete(nodeId);
  }

  /**
   * Helper to generate an id unique in its scope.
   */
  generateItemId(
    itemMap: Map<DflowId, unknown>,
    idPrefix: string,
    wantedId?: DflowId,
  ): DflowId {
    if (wantedId && !itemMap.has(wantedId)) return wantedId;
    const id = `${idPrefix}${itemMap.size}`;
    return itemMap.has(id) ? this.generateItemId(itemMap, idPrefix) : id;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getEdgeById(id: DflowId): DflowEdge {
    const item = this.#edgesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound("edge", { id });
    return item;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getNodeById(id: DflowId): DflowNode {
    const item = this.#nodesMap.get(id);
    if (!item) throw new DflowErrorItemNotFound("node", { nodeId: id });
    return item;
  }

  newNode(arg: {
    kind: string;
    id?: DflowId;
    inputs?: { id?: DflowId }[];
    outputs?: { id?: DflowId; data?: DflowData }[];
  }): DflowNode {
    const NodeClass = this.nodesCatalog[arg.kind] ?? DflowNodeUnknown;

    const id = this.generateItemId(this.#nodesMap, "n", arg.id);

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
      outputs,
    });

    this.#nodesMap.set(node.id, node);

    return node;
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  newEdge(
    arg: { id?: DflowId } & Pick<DflowEdge, "source" | "target">,
  ): DflowEdge {
    const id = this.generateItemId(this.#edgesMap, "e", arg.id);

    const edge = { ...arg, id };

    this.#edgesMap.set(edge.id, edge);

    const [sourceNodeId, sourceOutputId] = edge.source;
    const [targetNodeId, targetInputId] = edge.target;

    const sourceNode = this.getNodeById(sourceNodeId);
    const targetNode = this.getNodeById(targetNodeId);
    const sourceOutput = sourceNode.getOutputById(sourceOutputId);
    const targetInput = targetNode.getInputById(targetInputId);

    if (!Dflow.canConnect(sourceOutput.types, targetInput.types))
      throw new DflowErrorCannotConnectSourceToTarget({
        source: [sourceNode.id, sourceOutput.id],
        target: [targetNode.id, targetInput.id],
      });

    targetInput.source = sourceOutput;

    return edge;
  }
  /**
   * List edge objects.
   */
  get edges(): Pick<DflowEdge, "id" | "source" | "target">[] {
    return [...this.#edgesMap.values()].map(({ id, source, target }) => ({
      id,
      source,
      target,
    }));
  }

  /**
   * List node objects.
   */
  get nodes(): DflowSerializableNode[] {
    return [...this.#nodesMap.values()].map((item) => item.toJSON());
  }

  get nodeConnections(): DflowNodeConnection[] {
    return [...this.#edgesMap.values()].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0],
    }));
  }

  /**
   * Execute all nodes, sorted by their connections.
   */
  async run() {
    const executionReport: DflowExecutionReport = {
      start: performance.now(),
      end: performance.now(),
      steps: [],
    };

    // Loop over nodeIds sorted by graph hierarchy.
      for (const nodeId of Dflow.sortNodesByLevel( Array.from(this.#nodesMap.keys()), this.nodeConnections)) {
      const node = this.#nodesMap.get(nodeId) as DflowNode;

      // If some input data is not valid.
      if (!node.inputsDataAreValid) {
        // Notify into execution report.
        const error = new DflowErrorInvalidInputData(nodeId);
        executionReport.steps.push(
          Dflow.executionNodeInfo(node, error.toJSON()),
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

      executionReport.steps.push(Dflow.executionNodeInfo(node));
    }

    executionReport.end = performance.now();

    this.executionReport = executionReport;
  }

  toJSON(): DflowSerializableGraph {
    return {
      nodes: [...this.#nodesMap.values()].map((item) => item.toJSON()),
      edges: [...this.#edgesMap.values()].map(
        ({ id, source: s, target: t }) => ({ id, s, t }),
      ),
    };
  }

  /**
   * Check that source types are compatible with target types.
   */
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ) {
    // If source can have any type or
    // target can have any type,
    // then source and target are compatible.
    if (sourceTypes.length === 0 || targetTypes.length === 0) return true;
    // Check if target accepts some of the `dataType` source can have.
    return targetTypes.some((dataType) => sourceTypes.includes(dataType));
  }

  static executionNodeInfo(
    node: DflowNode,
    error?: DflowSerializableError,
  ): DflowExecutionNodeInfo {
    const { id, k, o } = node.toJSON();
    const info: DflowExecutionNodeInfo = { id, k };
    if (o) info.o = o;
    if (error) info.err = error;
    return info;
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

  static levelOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ) {
    const parentsNodeIds = Dflow.parentsOfNodeId(nodeId, nodeConnections);
    // 1. A node with no parent as level zero.
    if (parentsNodeIds.length === 0) return 0;
    // 2. Otherwise its level is the max level of its parents plus one.
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds) {
      const level = Dflow.levelOfNodeId(parentNodeId, nodeConnections);
      maxLevel = Math.max(level, maxLevel);
    }
    return maxLevel + 1;
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
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition {
    return {
      types: typeof typing === "string" ? [typing] : typing,
      ...rest,
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
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  static parentsOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
  }

  static sortNodesByLevel(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};
    for (const nodeId of nodeIds) {
      levelOf[nodeId] = Dflow.levelOfNodeId(nodeId, nodeConnections);
    }
    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
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
  static isValidDataType(types: DflowDataType[], data: unknown) {
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
                  : false,
    );
  }
}

/**
 * `DflowIO` is a base type for `DflowInput` and `DflowOutput`.
 */
type DflowIO = {
  readonly id: DflowId;

  readonly name?: string;

  readonly nodeId: DflowId;

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

export type DflowSerializableInput = {
  id: DflowId;
};

/**
 * A `DflowInput` is a node input.
 *
 * @implements DflowSerializable<DflowSerializableInput>
 */
export class DflowInput
  implements DflowIO, DflowInputDefinition, DflowSerializable<DflowSerializableInput>
{
  readonly id: DflowId;

  readonly nodeId: DflowId;

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
    types,
  }: { id: DflowId; nodeId: DflowId } & DflowInputDefinition) {
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

  toJSON(): DflowSerializableInput {
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

export type DflowSerializableOutput = {
  id: DflowId;
  /** data */
  d?: DflowData;
};

/**
 * A `DflowOutput` is a node output.
 *
 * @implements DflowSerializable<DflowSerializableOutput>
 */
export class DflowOutput
  implements DflowIO, DflowOutputDefinition, DflowSerializable<DflowSerializableOutput>
{
  readonly id: DflowId;


  readonly nodeId: DflowId;

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
    types,
  }: { id: DflowId; nodeId: DflowId } & DflowOutputDefinition) {
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
      // Has any type and `arg` is some valid data.
      (types.length === 0 && Dflow.isDflowData(arg)) ||
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

  toJSON(): DflowSerializableOutput {
    const obj: DflowSerializableOutput = { id: this.id };
    if (this.#value !== undefined) obj.d = this.#value;
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
 *
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
export type DflowNodeConstructorArg = Pick<
  DflowNode,
  "id" | "kind" | "host"
> & {
  inputs?: ({ id?: DflowId } & DflowInputDefinition)[];
  outputs?: ({ id?: DflowId } & DflowOutputDefinition)[];
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
 * @implements DflowSerializable<DflowSerializableNode>
 */
export class DflowNode implements DflowSerializable<DflowSerializableNode> {
  readonly id: DflowId;

  #inputsMap: Map<DflowId, DflowInput> = new Map();

  #outputsMap: Map<DflowId, DflowOutput> = new Map();

  #inputPosition: DflowId[] = [];

  #outputPosition: DflowId[] = [];

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
    inputs = [],
    outputs = [],
    host,
  }: DflowNodeConstructorArg) {
    this.id = id;
    this.host = host;
    this.kind = kind;

    // Inputs.
    for (const obj of inputs) {
      const id = host.generateItemId(this.#inputsMap, "i", obj.id);
      this.#inputsMap.set(id, new DflowInput({ ...obj, id, nodeId: this.id }));
      this.#inputPosition.push(id);
    }

    // Outputs.
    for (const obj of outputs) {
      const id = host.generateItemId(this.#outputsMap, "o", obj.id);
      this.#outputsMap.set(
        id,
        new DflowOutput({ ...obj, id, nodeId: this.id }),
      );
      this.#outputPosition.push(id);
    }
  }

  get inputsDataAreValid(): boolean {
    for (const { data, types, optional } of this.#inputsMap.values()) {
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
    for (const output of this.#outputsMap.values()) output.clear();
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getInputById(id: DflowId): DflowInput {
    const item = this.#inputsMap.get(id);
    if (!item) throw new DflowErrorItemNotFound("input", { id });
    return item;
  }

  /**
   * Get input by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  input(position: number): DflowInput {
    const id = this.#inputPosition[position];
    if (!id)
      throw new DflowErrorItemNotFound("input", {
        id: this.id,
        nodeId: this.id,
        position,
      });
    return this.getInputById(id);
  }

  /**
   * @throws {DflowErrorItemNotFound}
   */
  getOutputById(id: DflowId): DflowOutput {
    const item = this.#outputsMap.get(id);
    if (!item)
      throw new DflowErrorItemNotFound("output", { id, nodeId: this.id });
    return item;
  }

  /**
   * Get output by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  output(position: number): DflowOutput {
    const id = this.#outputPosition[position];
    if (!id)
      throw new DflowErrorItemNotFound("output", { nodeId: this.id, position });
    return this.getOutputById(id);
  }

  /** @ignore this method, it should be overridden. */
  run(): void | Promise<void> {}

  toJSON(): DflowSerializableNode {
    const obj: DflowSerializableNode = { id: this.id, k: this.kind };

    const inputs = [...this.#inputsMap.values()].map((item) => item.toJSON());
    if (inputs.length > 0) obj.i = inputs;

    const outputs = [...this.#outputsMap.values()].map((item) => item.toJSON());
    if (outputs.length > 0) obj.o = outputs;

    return obj;
  }
}

// DflowEdge
// ////////////////////////////////////////////////////////////////////

export type DflowSerializableEdge = {
  id: DflowId;
  /** source */
  s: DflowEdge["source"];
  /** target */
  t: DflowEdge["target"];
};

/**
 * `DflowEdge` connects an `DflowOutput` to a `DflowInput`.
 */
export type DflowEdge = {
  readonly id: DflowId;

  /**
   * Path to output.
   */
  readonly source: [nodeId: DflowId, outputId: DflowId];

  /**
   * Path to input.
   */
  readonly target: [nodeId: DflowId, inputId: DflowId];
};

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
export type DflowExecutionNodeInfo = Omit<DflowSerializableNode, "i"> & {
  /** Error during execution */
  err?: DflowSerializableError;
};

export type DflowExecutionReport = {
  start: number;
  end: number;
  steps: DflowExecutionNodeInfo[];
};

export type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};

type DflowNodeConnection = { sourceId: DflowId; targetId: DflowId };

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [Dflow.output()];
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

/**
 * This class is used to instantiate a new node which `kind` was not found in `nodesCatalog`.
 * The "unknown" node class is not included in `coreNodesCatalog`.
 */
export class DflowNodeUnknown extends DflowNode {}

/** Builtin nodes, always included in `nodesCatalog`. */
export const coreNodesCatalog: DflowNodesCatalog = {
  [DflowNodeData.kind]: DflowNodeData,
};

// Dflow errors
// ////////////////////////////////////////////////////////////////////

export type DflowSerializableErrorCode = {
  /** error code */
  _: string;
};

export type DflowSerializableError =
  | DflowSerializableErrorItemNotFound
  | DflowSerializableErrorInvalidInputData
  | DflowSerializableErrorCannotConnectSourceToTarget;

export type DflowSerializableErrorCannotConnectSourceToTarget =
  DflowSerializableErrorCode & {
    /** source */
    s: DflowErrorCannotConnectSourceToTarget["source"];
    /** target */
    t: DflowErrorCannotConnectSourceToTarget["target"];
  };

export class DflowErrorCannotConnectSourceToTarget
  extends Error
  implements
    DflowSerializable<DflowSerializableErrorCannotConnectSourceToTarget>
{
  readonly source: DflowEdge["source"];
  readonly target: DflowEdge["target"];
  static code = "01";
  static message({
    s,
    t,
  }: Omit<DflowSerializableErrorCannotConnectSourceToTarget, "_">) {
    return `Cannot connect source ${s.join()} to target ${t.join()}`;
  }
  constructor({
    source,
    target,
  }: Pick<DflowErrorCannotConnectSourceToTarget, "source" | "target">) {
    super(
      DflowErrorCannotConnectSourceToTarget.message({ s: source, t: target }),
    );
    this.source = source;
    this.target = target;
  }
  toJSON(): DflowSerializableErrorCannotConnectSourceToTarget {
    return {
      _: DflowErrorCannotConnectSourceToTarget.code,
      s: this.source,
      t: this.target,
    };
  }
}

export type DflowSerializableErrorInvalidInputData =
  DflowSerializableErrorCode & {
    /** nodeId */
    nId: DflowErrorInvalidInputData["nodeId"];
  };

export class DflowErrorInvalidInputData
  extends Error
  implements DflowSerializable<DflowSerializableErrorInvalidInputData>
{
  static code = "02";
  readonly nodeId: DflowId;
  static message({
    nId: nodeId,
  }: Omit<DflowSerializableErrorInvalidInputData, "_">) {
    return `Invalid input data in node ${nodeId}`;
  }
  constructor(nodeId: DflowErrorInvalidInputData["nodeId"]) {
    super(DflowErrorInvalidInputData.message({ nId: nodeId }));
    this.nodeId = nodeId;
  }
  toJSON(): DflowSerializableErrorInvalidInputData {
    return {
      _: DflowErrorInvalidInputData.code,
      nId: this.nodeId,
    };
  }
}

export type DflowSerializableErrorItemNotFound = DflowSerializableErrorCode & {
  item: DflowErrorItemNotFound["item"];
  id?: DflowErrorItemNotFound["info"]["id"];
  /** nodeId */
  nId?: DflowErrorItemNotFound["info"]["nodeId"];
  /** position */
  p?: DflowErrorItemNotFound["info"]["position"];
};

export class DflowErrorItemNotFound
  extends Error
  implements DflowSerializable<DflowSerializableErrorItemNotFound>
{
  static code = "03";
  readonly item: "node" | "edge" | "input" | "output";
  readonly info: Partial<{
    id: DflowId;
    nodeId: DflowId;
    position: number;
  }>;
  static message({
    item,
    id,
    nId: nodeId,
    p: position,
  }: Omit<DflowSerializableErrorItemNotFound, "_">) {
    return `Not found ${[
      `item=${item}`,
      id ? `id=${id}` : "",
      nodeId ? `nodeId=${nodeId}` : "",
      position ? `position=${position}` : "",
    ]
      .filter((str) => str !== "")
      .join()}`;
  }
  constructor(
    item: DflowErrorItemNotFound["item"],
    info: DflowErrorItemNotFound["info"] = {},
  ) {
    super(
      DflowErrorItemNotFound.message({
        item,
        id: info.id,
        nId: info.nodeId,
        p: info.position,
      }),
    );
    this.item = item;
    this.info = info;
  }
  toJSON(): DflowSerializableErrorItemNotFound {
    const {
      item,
      info: { id, nodeId, position },
    } = this;
    const obj: DflowSerializableErrorItemNotFound = {
      item,
      _: DflowErrorItemNotFound.code,
    };
    if (id) obj.id = id;
    if (nodeId) obj.nId = nodeId;
    if (position) obj.p = position;
    return obj;
  }
}
