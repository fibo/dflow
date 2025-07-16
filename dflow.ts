//! github.com/fibo/dflow

// DflowData
// ////////////////////////////////////////////////////////////////////

/**
 * Includes JSON data types and `undefined`.
 */
export type DflowData =
  | undefined
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

/** Connects two nodes in the graph. */
export type DflowLink = [
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
  /** An input can be connected to an output only if the data types match. */
  types: DflowDataType[];
  /**
   * Any input is **required** by default, i.e. not optional.
   * If an input is not optional and it has no data,
   * then its node will not be executed.
   * If an input is optional,
   * then its node will be executed even if the input has no data.
   */
  optional?: boolean;
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

// DflowNode
// ////////////////////////////////////////////////////////////////////

/** Defines a block of code: it can have inputs and outputs. */
export type DflowNode = {
  kind: string;
  inputs?: DflowInput[];
  outputs?: DflowOutput[];
  run(..._args: DflowArray): unknown | Promise<unknown>;
};

// Dflow
// ////////////////////////////////////////////////////////////////////

export type DflowGraph = {
  /** Key is node id, value is node kind. */
  node: Record<string, string>;
  /** Key is link id. */
  link: Record<string, DflowLink>;
  /** Data nodes: key is node id, value is data. */
  data: Record<string, DflowData>;
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and links.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  /** Node definitions indexed by node kind. */
  #nodeDefinitions: Map<string, DflowNode> = new Map();

  /** Node kinds indexed by node id. */
  #kinds: Map<string, string> = new Map();

  /** Node run functions indexed by node id. */
  #runs: Map<string, DflowNode["run"]> = new Map();

  /** Links indexed by link id. */
  #links: Map<string, DflowLink> = new Map();

  /** Key is nodeId, value is an error message. */
  #errors: Map<string, string> = new Map();

  /** Node inputs indexed by node id. */
  #inputs: Map<
    string,
    Array<
      DflowInput & {
        source?: {
          data: DflowData;
        };
      }
    >
  > = new Map();

  /** Node outputs indexed by node id. */
  #outputs: Map<
    string,
    Array<
      DflowOutput & {
        data: DflowData;
        clear(): void;
      }
    >
  > = new Map();

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

  /** Helper to generate an id unique in its scope. */
  #newId(
    itemMap: Map<string, unknown>,
    prefix: string,
    wantedId?: string
  ): string {
    if (wantedId && !itemMap.has(wantedId)) return wantedId;
    const id = `${prefix}${itemMap.size}`;
    return itemMap.has(id) ? this.#newId(itemMap, prefix) : id;
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
    const nodeIds = Array.from(this.#kinds.keys());
    const nodeConnections = [...this.#links.values()].map((link) => ({
      sourceId: link[0],
      targetId: link[2]
    }));
    const levelOf: Record<string, number> = {};
    for (const nodeId of nodeIds)
      levelOf[nodeId] = this.#levelOfNode(nodeId, nodeConnections);
    return nodeIds.sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  /** Check that source types are compatible with target types. */
  canConnect([
    sourceNodeId,
    sourcePosition,
    targetNodeId,
    targetPosition
  ]: DflowLink): boolean {
    const sourceNodeKind = this.#kinds.get(sourceNodeId);
    const targetNodeKind = this.#kinds.get(targetNodeId);
    if (!sourceNodeKind || !targetNodeKind) return false;
    // Input types are stored in node definitions.
    const targetNodeDef = this.#nodeDefinitions.get(targetNodeKind);
    const targetTypes = targetNodeDef?.inputs?.[targetPosition].types;
    if (!targetTypes) return false;
    // Output types are stored in output items.
    const sourceOutput = this.#outputs.get(sourceNodeId)?.[sourcePosition];
    if (!sourceOutput) return false;
    const sourceTypes = sourceOutput.types;

    // If source can have any type or
    // target can have any type,
    // then source and target are compatible.
    if (sourceTypes.length === 0 || targetTypes.length === 0) return true;

    // Check if target accepts some of the `dataType` source can have.
    return targetTypes.some((dataType) => sourceTypes.includes(dataType));
  }

  /** Create a new node. Returns node id. */
  node(kind: string, wantedId?: string): string {
    const nodeDef = this.#nodeDefinitions.get(kind);
    if (!nodeDef) throw new Error("Cannot create node", { cause: { kind } });

    const id = this.#newId(this.#kinds, "n", wantedId);

    // Inputs.
    const inputs = [];
    for (const input of nodeDef.inputs ?? []) inputs.push({ ...input });
    this.#inputs.set(id, inputs);

    // Outputs.
    const outputs = [];
    for (const { types } of nodeDef.outputs ?? []) {
      let data: DflowData;
      outputs.push({
        types,
        get data(): DflowData {
          return data;
        },
        clear() {
          data = undefined;
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

    this.#runs.set(id, nodeDef.run.bind(this.context));
    this.#kinds.set(id, nodeDef.kind);

    return id;
  }

  /** Delete node or link with given id. */
  delete(id: string) {
    // Delete node.
    if (this.#kinds.delete(id)) {
      // Delete functions or output data, if any.
      this.#runs.delete(id);
      this.#outputs.delete(id);
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

  /** Create a new data node. Returns node id. */
  data(value: unknown, wantedId?: string): string {
    const id = this.#newId(this.#kinds, "n", wantedId);
    this.#kinds.set(id, "data");
    const data = Dflow.isData(value) ? value : undefined;
    // Infer data type
    let types: DflowDataType[] = [];
    if (data === null) types = ["null"];
    if (typeof data === "boolean") types = ["boolean"];
    if (typeof data === "string") types = ["string"];
    if (Dflow.isNumber(data)) types = ["number"];
    if (Dflow.isArray(data)) types = ["array"];
    if (Dflow.isObject(data)) types = ["object"];
    // Set output.
    this.#outputs.set(id, [{ data, clear() {}, types }]);
    return id;
  }

  /** Create a new link and connect two nodes. Returns link id. */
  link(
    source: string | [nodeId: string, position: number],
    target: string | [nodeId: string, position: number],
    wantedId?: string
  ): string {
    const id = this.#newId(this.#links, "l", wantedId);

    const sourceNodeId = typeof source === "string" ? source : source[0];
    const sourcePosition = typeof source === "string" ? 0 : source[1];
    const targetNodeId = typeof target === "string" ? target : target[0];
    const targetPosition = typeof target === "string" ? 0 : target[1];

    if (
      this.canConnect([
        sourceNodeId,
        sourcePosition,
        targetNodeId,
        targetPosition
      ])
    ) {
      const sourceOutput = this.#outputs.get(sourceNodeId)?.[sourcePosition];
      const targetInput = this.#inputs.get(targetNodeId)?.[targetPosition];
      if (sourceOutput && targetInput) {
        // Create link.
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
      const kind = this.#kinds.get(nodeId)!;

      if (kind === "data") continue;

      const run = this.#runs.get(nodeId)!;

      const nodeInputs = this.#inputs.get(nodeId) ?? [];
      const nodeOutputs = this.#outputs.get(nodeId) ?? [];
      const numOutputs = nodeOutputs.length;

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
        if (run.constructor.name === "Function") {
          result = run(...inputData);
        }
        if (run.constructor.name === "AsyncFunction") {
          result = await run(...inputData);
        }
      } catch (err) {
        this.ERR?.(err);
        // Store error message and clear node outputs.
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
      // Copy result into node .
      if (numOutputs === 1) nodeOutputs[0].data = result;
      if (numOutputs > 1)
        for (let position = 0; position < numOutputs; position++)
          nodeOutputs[position].data = (result as DflowArray)[position];
    }
  }

  /**
   * Dflow graph contains nodes and links.
   */
  get graph(): DflowGraph {
    const node: DflowGraph["node"] = {};
    const data: DflowGraph["data"] = {};
    for (const [id, kind] of this.#kinds.entries()) {
      if (kind === "data")
        data[id] = this.#outputs.get(id)?.[0]?.data as DflowData;
      node[id] = kind;
    }
    return {
      node,
      link: Object.fromEntries(this.#links.entries()),
      data
    };
  }

  /** Get error messages from last run, indexed by node id. */
  get error(): Record<string, string> {
    return Object.fromEntries(this.#errors.entries());
  }

  /** Get output data of last run, indexed by node id. */
  get out(): Record<string, DflowArray> {
    const out: Record<string, DflowArray> = {};
    for (const nodeId of this.#kinds.keys()) {
      const outputs = this.#outputs.get(nodeId)!;
      out[nodeId] = [];
      for (const output of outputs) out[nodeId].push(output.data);
    }
    return out;
  }

  /**
   * Helper to define inputs.
   *
   * @example Input with `number` type.
   *
   * ```ts
   * Dflow.input("number")
   * ```
   *
   * @example Optional `number` input.
   *
   * ```ts
   * Dflow.input("number", { optional: true })
   * ```
   *
   * @example Input that accepts both `number` and `string` type.
   *
   * ```ts
   * Dflow.input(["number", "string"])
   * ```
   *
   * @example Input with any type.
   *
   * ```ts
   * Dflow.input()
   * ```
   *
   * @example Input with type `array` and name.
   *
   * ```ts
   * Dflow.input("array", { name: "list" })
   * ```
   *
   * @example Input with any type and named "foo".
   *
   * ```ts
   * Dflow.input([], { name: "foo" })
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
   * Helper to define outputs.
   *
   * @example Named output with `number` type.
   *
   * ```ts
   * Dflow.output("number", { name: "amount" })
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
  static isData(arg: unknown): arg is Exclude<DflowData, undefined> {
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
