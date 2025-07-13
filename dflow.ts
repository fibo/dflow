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

// Inputs, outputs and links.
// ////////////////////////////////////////////////////////////////////

export type DflowLinkPath = [
  sourceNodeId: string,
  sourcePosition: number,
  targetNodeId: string,
  targetPosition: number
];

/**
 * Defines a node input.
 *
 * @example
 *
 * ```json
 * { "name": "label", "types": ["string"] }
 * ```
 */
export type DflowInput = {
  /** Ignored by Dflow, but could be used by UI. */
  name?: string;
  /** An output can be connected to an input only if the data types match. */
  types: DflowDataType[];
  /**
   * Any input is **required** by default, i.e. not optional.
   * If an input is not `optional` and it has no data,
   * then its node will not be executed.
   * If an input is `optional`,
   * then its node will be executed even if the input has no data.
   */
  optional?: boolean;
};

/**
 * @internal `_DflowInput` is a reference to a `_DflowOutput` source, if connected.
 */
type _DflowInput = Pick<DflowInput, "types" | "optional"> & {
  source?: _DflowOutput;
};

/**
 * Defines a node output.
 *
 * @example
 *
 * ```json
 * { "name": "sum", "types": ["number"] }
 * ```
 */
export type DflowOutput = {
  /** Ignored by Dflow, but could be used by UI. */
  name?: string;
  /** An output can be connected to an input only if the data types match. */
  types: DflowDataType[];
};

/** @internal `_DflowOutput` holds the data that a node run() returns. */
type _DflowOutput = Pick<DflowOutput, "types"> & {
  data: DflowData | undefined;
  /** Cleanup output data. */
  clear(): void;
};

// DflowNode
// ////////////////////////////////////////////////////////////////////

/**
 * `DflowNode` represents a block of code: it can have inputs and outputs.
 *
 * @example
 *
 * ```ts
 * import { Dflow, type DflowNode } from "dflow";
 *
 * const Sum: DflowNode = {
 *   kind: "sum",
 *   inputs: [Dflow.input("number"), Dflow.input("number")];
 *   outputs: [Dflow.output("number")];
 *   run(a: number, b: number) {
 *     return a + b;
 *   }
 * }
 * ```
 *
 */
export type DflowNode = {
  kind: string;
  run(..._args: Array<DflowData | undefined>): unknown | Promise<unknown>;
  inputs?: DflowInput[];
  outputs?: DflowOutput[];
};

// Dflow
// ////////////////////////////////////////////////////////////////////

/** @internal Helper to generate an id unique in its scope. */
const newId = (
  itemMap: Map<string, unknown>,
  prefix: string,
  wantedId?: string
): string => {
  if (wantedId && !itemMap.has(wantedId)) return wantedId;
  const id = `${prefix}${itemMap.size}`;
  return itemMap.has(id) ? newId(itemMap, prefix) : id;
};

export type DflowGraph = {
  /** Nodes: key is node id, value is node kind. */
  node: Record<string, string>;
  /** Links: key is link id. */
  link: Record<string, DflowLinkPath>;
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and links.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  /** Dflow node definitions indexed by node kind. */
  #nodeDefinitions: Map<string, DflowNode> = new Map();

  /** Node instances indexed by node id. */
  #nodes: Map<string, Pick<DflowNode, "kind" | "run">> = new Map();

  /** Links indexed by link id. */
  #links: Map<string, DflowLinkPath> = new Map();

  /** Key is nodeId, value is an error message. */
  #errors: Map<string, string> = new Map();

  /** Node inputs indexed by node id. */
  #inputs: Map<string, _DflowInput[]> = new Map();

  /** Node outputs indexed by node id. */
  #outputs: Map<string, _DflowOutput[]> = new Map();

  readonly context: Record<string, unknown>;

  /**
   * Optional error logger. Output should go to STDERR.
   *
   * @example
   *
   * ```ts
   * dflow.ERR = console.error
   * ```
   */
  ERR?: (...data: any[]) => void;

  constructor(nodeDefinitions: Array<DflowNode>) {
    // Add given node definitions, followed by builtin nodes.
    for (const nodeDefinition of nodeDefinitions)
      this.#nodeDefinitions.set(nodeDefinition.kind, nodeDefinition);
    // Initialize empty context.
    this.context = {};
  }

  /**
   * Every node has a level in the graph, given by its connections.
   * Nodes with no parent has level zero.
   */
  #levelOfNode(
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
        this.#levelOfNode(parentNodeId, nodeConnections),
        maxLevel
      );
    return maxLevel + 1;
  }

  /** Sort node ids by their level in the graph. */
  #sortedNodesIds(): string[] {
    const nodeIds = Array.from(this.#nodes.keys());
    const nodeConnections = [...this.#links.values()].map((link) => ({
      sourceId: link[0],
      targetId: link[2]
    }));
    const levelOf: Record<string, number> = {};
    for (const nodeId of nodeIds)
      levelOf[nodeId] = this.#levelOfNode(nodeId, nodeConnections);
    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  #createNode(id: string, nodeDef: DflowNode) {
    // Inputs.
    const inputs: _DflowInput[] = [];
    for (const input of nodeDef.inputs ?? []) inputs.push({ ...input });
    this.#inputs.set(id, inputs);

    // Outputs.
    const outputs: _DflowOutput[] = [];
    for (const { types } of nodeDef.outputs ?? []) {
      let data: DflowData | undefined;
      outputs.push({
        types,
        clear() {
          data = undefined;
        },
        get data(): DflowData | undefined {
          return data;
        },
        set data(arg: unknown) {
          if (
            // Has any type and `arg` is some valid data...
            (types.length === 0 && Dflow.isData(arg)) ||
            // ... or output type corresponds to `arg` type.
            (types.includes("null") && arg === null) ||
            (types.includes("boolean") && typeof arg === "boolean") ||
            (types.includes("string") && typeof arg === "string") ||
            (types.includes("number") && Dflow.isNumber(arg)) ||
            (types.includes("object") && Dflow.isObject(arg)) ||
            (types.includes("array") && Dflow.isArray(arg))
          )
            data = arg;
        }
      });
    }
    this.#outputs.set(id, outputs);

    this.#nodes.set(id, {
      kind: nodeDef.kind,
      run: nodeDef.run.bind(this.context)
    });

    return id;
  }

  /** Delete node or link with given id. */
  delete(id: string) {
    // Delete node.
    if (this.#nodes.delete(id)) {
      // Delete all links connected to node.
      for (const [linkId, link] of this.#links.entries())
        if (link[0] === id || link[2] === id) this.delete(linkId);
    }
    // Delete link.
    const link = this.#links.get(id);
    if (!link) return;
    this.#links.delete(id);
    // Disconnect target input.
    const targetInput = this.#inputs.get(link[2])?.[link[3]];
    if (targetInput) targetInput.source = undefined;
  }

  /** Create a new node. Returns node id. */
  node(kind: string, wantedId?: string): string {
    const nodeDef = this.#nodeDefinitions.get(kind);
    if (!nodeDef) throw new Error("Unknown node", { cause: { kind } });
    return this.#createNode(newId(this.#nodes, "n", wantedId), nodeDef);
  }

  /**
   * Create a new data node. Returns node id.
   * @remarks If provided `arg` is not a valid `DflowData`, return value will be `undefined`.
   */
  data(arg: unknown, wantedId?: string): string {
    const value = Dflow.isData(arg) ? arg : undefined;
    return this.#createNode(newId(this.#nodes, "n", wantedId), {
      kind: "data",
      outputs: [{ types: Dflow.inferDataType(value) }],
      run() {
        return value;
      }
    });
  }

  /**
   * Create a new link and connect two nodes. Returns link id.
   * If source or target position is omitted, then it defaults to `0`.
   */
  link(
    source: string | [nodeId: string, position: number],
    target: string | [nodeId: string, position: number],
    wantedId?: string
  ): string {
    const id = newId(this.#links, "l", wantedId);

    const sourceNodeId = typeof source === "string" ? source : source[0];
    const sourcePosition = typeof source === "string" ? 0 : source[1];
    const targetNodeId = typeof target === "string" ? target : target[0];
    const targetPosition = typeof target === "string" ? 0 : target[1];

    const sourceOutput = this.#outputs.get(sourceNodeId)?.[sourcePosition];
    const targetInput = this.#inputs.get(targetNodeId)?.[targetPosition];

    if (sourceOutput && targetInput) {
      if (Dflow.canConnect(sourceOutput.types, targetInput.types)) {
        this.#links.set(id, [
          sourceNodeId,
          sourcePosition,
          targetNodeId,
          targetPosition
        ]);
        // Connect target input to source output.
        targetInput.source = sourceOutput;
        return id;
      }
    }

    const error = new Error("Cannot create link", {
      cause: { source, target }
    });
    this.ERR?.(error);
    throw error;
  }

  /** Execute all nodes, sorted by their connections. */
  async run(): Promise<void> {
    // Reset errors.
    this.#errors.clear();
    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const node = this.#nodes.get(nodeId)!;
      const nodeInputs = this.#inputs.get(nodeId) ?? [];
      const nodeOutputs = this.#outputs.get(nodeId) ?? [];

      // Check if inputs data are valid.
      let inputsDataAreValid = true;
      for (const { source, types, optional } of nodeInputs) {
        // Ignore optional inputs with no data.
        if (optional && source?.data === undefined) continue;
        // Validate input data.
        if (Dflow.isValidData(types, source?.data)) continue;
        // Some input is not valid.
        inputsDataAreValid = false;
      }
      // If some input data is not valid, then skip.
      if (!inputsDataAreValid) {
        nodeOutputs.forEach((output) => output.clear());
        continue;
      }

      const inputData = nodeInputs.map((input) => input.source?.data);
      let result: unknown;
      try {
        if (node.run.constructor.name === "Function") {
          result = node.run(...inputData);
        }
        if (node.run.constructor.name === "AsyncFunction") {
          result = await node.run(...inputData);
        }
      } catch (err) {
        this.ERR?.(err);
        // Store error message and cleanup node outputs.
        const message = err instanceof Error ? err.message : String(err);
        this.#errors.set(nodeId, message);
        nodeOutputs.forEach((output) => output.clear());
        continue;
      }
      // If result is undefined or not a valid Dflow data,
      // then clear the node outputs.
      if (result === undefined || !Dflow.isData(result)) {
        nodeOutputs.forEach((output) => output.clear());
        continue;
      }
      // Copy result into node outputs.
      if (nodeOutputs.length === 1) nodeOutputs[0].data = result;
      if (nodeOutputs.length > 1)
        for (let position = 0; position < nodeOutputs.length; position++)
          nodeOutputs[position].data = (result as DflowArray)[position];
    }
  }

  /**
   * Dflow graph contains nodes and links.
   */
  get graph(): DflowGraph {
    const node: DflowGraph["node"] = {};
    for (const [id, { kind }] of this.#nodes.entries()) node[id] = kind;
    return { node, link: Object.fromEntries(this.#links.entries()) };
  }

  /** Get error messages from last run, indexed by node id. */
  get error(): Record<string, string> {
    return Object.fromEntries(this.#errors.entries());
  }

  /** Get output data of last run, indexed by node id. */
  get out(): Record<string, Array<DflowData | undefined>> {
    const outputs: Record<string, Array<DflowData | undefined>> = {};
    for (const nodeId of this.#nodes.keys())
      outputs[nodeId] = this.#outputs.get(nodeId)!.map((output) => output.data);
    return outputs;
  }

  /**
   * `DflowNode.input()` is a helper to define inputs.
   *
   * @example Input with `number` type.
   *
   * ```ts
   * DflowNode.input("number")
   * ```
   *
   * @example Optional `number` input.
   *
   * ```ts
   * DflowNode.input("number", { optional: true })
   * ```
   *
   * @example Input that accepts both `number` and `string` type.
   *
   * ```ts
   * DflowNode.input(["number", "string"])
   * ```
   *
   * @example Input with any type.
   *
   * ```ts
   * DflowNode.input()
   * ```
   *
   * @example Input with type `array` and name.
   *
   * ```ts
   * DflowNode.input("array", { name: "list" })
   * ```
   *
   * @example Input with any type and named "foo".
   *
   * ```ts
   * DflowNode.input([], { name: "foo" })
   * ```
   */
  static input(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowInput, "types">
  ): DflowInput {
    return {
      types: typeof typing === "string" ? [typing] : typing,
      ...rest
    };
  }

  /**
   * `DflowNode.output()` is a helper to define outputs.
   *
   * @example
   *
   * ```ts
   * const { output } = DflowNode;
   *
   * export class MathPI extends DflowNode {
   *   static kind = "mathPI";
   *   static outputs = [output("number", { name: "π" })];
   *   run() {
   *     return Math.PI;
   *   }
   * }
   * ```
   *
   * @example Named output with `number` type.
   *
   * ```ts
   * DflowNode.output("number", { name: "amount" })
   * ```
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutput, "types">
  ): DflowOutput {
    return {
      types: typeof typing === "string" ? [typing] : typing,
      ...rest
    };
  }

  /** Check that source types are compatible with target types. */
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

  /** Infer `DflowDataType` of given argument. */
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
   * Type guard for `DflowArray`.
   * It checks recursively that every element is some `DflowData`.
   */
  static isArray(arg: unknown): arg is DflowArray {
    return Array.isArray(arg) && arg.every(Dflow.isData);
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
      Object.values(arg).every(Dflow.isData)
    );
  }

  /** Type guard for a valid number, i.e. finite and not `NaN`. */
  static isNumber(arg: unknown): arg is number {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }

  /** Type guard for `DflowData`. */
  static isData(arg: unknown): arg is DflowData {
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

  /** Validate that data belongs to some of given types. */
  static isValidData(types: DflowDataType[], data: unknown) {
    if (types.length === 0) return data === undefined || Dflow.isData(data);
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
