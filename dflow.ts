//! github.com/fibo/dflow

// DflowData
// ////////////////////////////////////////////////////////////////////

/**
 * Includes JSON data types and `undefined`.
 *
 * @see {@link https://fibo.github.io/dflow/#dflowdata}
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

/**
 * Dflow data types represent values that can be serialized as JSON.
 *
 * @see {@link https://fibo.github.io/dflow/#dflowdatatype}
 */
export type DflowDataType =
  | "null"
  | "boolean"
  | "number"
  | "string"
  | "array"
  | "object";

const isUndefined = (arg: unknown) => arg === undefined;

const isNull = (arg: unknown): arg is null => arg === null;

const isBoolean = (arg: unknown): arg is boolean => typeof arg === "boolean";

const isString = (arg: unknown): arg is string => typeof arg === "string";

const isNumber = (arg: unknown): arg is number =>
  typeof arg == "number" && !isNaN(arg) && Number.isFinite(arg);

const isArray = (arg: unknown): arg is DflowArray =>
  Array.isArray(arg) && arg.every(isData);

const isObject = (arg: unknown): arg is DflowObject =>
  typeof arg == "object" &&
  !isNull(arg) &&
  !Array.isArray(arg) &&
  Object.values(arg).every(isData);

const validators: Record<DflowDataType, (data: unknown) => data is DflowData> =
  {
    null: isNull,
    boolean: isBoolean,
    string: isString,
    number: isNumber,
    object: isObject,
    array: isArray
  };

const isData = (arg: unknown): arg is Exclude<DflowData, undefined> => {
  if (isUndefined(arg)) return false;
  return Object.values(validators).some((isValid) => isValid(arg));
};

const isValidData = (types: DflowDataType[], data: unknown) => {
  if (!types.length) return isUndefined(data) || isData(data);
  return types.some((dataType) => validators[dataType]?.(data));
};

// Inputs, outputs, links and nodes.
// ////////////////////////////////////////////////////////////////////

/**
 * Connects two nodes in the graph.
 *
 * @see {@link https://fibo.github.io/dflow/#dflowlink}
 */
export type DflowLink = [
  sourceNodeId: string,
  sourceOutputIndex: number,
  targetNodeId: string,
  targetInputIndex: number
];

/**
 * Defines a node input.
 *
 * @example
 *
 * ```json
 * { "name": "label", "types": ["string"] }
 * ```
 *
 * @see {@link https://fibo.github.io/dflow/#dflowinput}
 */
export type DflowInput = {
  /** Ignored by Dflow, but could be used by UI. */
  name?: string;
  /** An input can be connected to an output only if the data types match. */
  types: DflowDataType[];
  /**
   * An input is **required** by default.
   * If it is not connected or the data passed is not valid according to its types,
   * then its node will not be executed.
   * If an input is **optional** the checks are skipped.
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
 *
 * @see {@link https://fibo.github.io/dflow/#dflowoutput}
 */
export type DflowOutput = {
  /** Ignored by Dflow, but could be used by UI. */
  name?: string;
  /** An output can be connected to an input only if the data types match. */
  types: DflowDataType[];
};

/**
 * Defines a block of code: it can have inputs and outputs.
 *
 * @see {@link https://fibo.github.io/dflow/#dflownode}
 */
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
 *
 * @see {@link https://fibo.github.io/dflow/#api}
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

  /**
   * Dflow context is bound to every node at runtime,
   * hence it is accessible via `this` inside node `run`.
   *
   * @example
   *
   * ```ts
   * type Context = {
   *   foo: string;
   * }
   *
   * const node: DflowNode & Partial<Context> = {
   *   kind: "example",
   *   run() {
   *     console.log(this.foo)
   *   }
   * }
   *
   * const dflow = new Dflow([node])
   * dflow.context.foo = "bar"
   * dflow.run() // Outputs "bar"
   * ```
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.context}
   */
  readonly context: Record<string, unknown>;

  /**
   * Optional error logger.
   *
   * @example
   *
   * ```ts
   * dflow.ERR = console.error
   * ```
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.err}
   */
  ERR?: (arg: any) => void;

  /**
   * Dflow constructor requires a list of node definitions which is an `Array<DflowNode>`.
   *
   * @see {@link https://fibo.github.io/dflow/#constructor}
   */
  constructor(nodeDefinitions: Array<DflowNode>) {
    // Add given node definitions, followed by builtin nodes.
    for (const nodeDefinition of nodeDefinitions)
      this.#nodeDefinitions.set(nodeDefinition.kind, nodeDefinition);
    // Initialize empty context.
    this.context = {};
  }

  // Dflow private methods
  // //////////////////////////////////////////////////////////////////

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
      .filter(({ targetId }) => nodeId == targetId)
      .map(({ sourceId }) => sourceId);
    // A node with no parent as level zero.
    if (!parentsNodeIds.length) return 0;
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

  // Dflow public methods
  // //////////////////////////////////////////////////////////////////

  /** Check that source types are compatible with target types. */
  canConnect([
    sourceNodeId,
    sourceOutputIndex,
    targetNodeId,
    targetInputIndex
  ]: DflowLink): boolean {
    const sourceNodeKind = this.#kinds.get(sourceNodeId);
    const targetNodeKind = this.#kinds.get(targetNodeId);
    if (!sourceNodeKind || !targetNodeKind) return false;
    // Input types are stored in node definitions.
    const targetNodeDef = this.#nodeDefinitions.get(targetNodeKind);
    const targetTypes = targetNodeDef?.inputs?.[targetInputIndex].types;
    if (!targetTypes) return false;
    // Output types are stored in output items.
    const sourceOutput = this.#outputs.get(sourceNodeId)?.[sourceOutputIndex];
    if (!sourceOutput) return false;
    // If source can have any type or target can have any type,
    // then source and target are compatible.
    if (!sourceOutput.types.length || !targetTypes.length) return true;
    // Check if target accepts some of the `dataType` source can have.
    return targetTypes.some((dataType) =>
      sourceOutput.types.includes(dataType)
    );
  }

  /**
   * Create a new node. Returns node id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.node}
   */
  node(kind: string, wantedId?: string): string {
    const nodeDef = this.#nodeDefinitions.get(kind);
    if (!nodeDef) {
      const error = new Error("Cannot create node", {
        cause: `Unknown kind ${kind}`
      });
      this.ERR?.(error);
      throw error;
    }

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
            (!types.length && isData(arg)) ||
            // ... or output type corresponds to `arg` type.
            types.some((type) => validators[type](arg))
          )
            data = arg as DflowData;
        }
      });
    }
    this.#outputs.set(id, outputs);

    this.#runs.set(id, nodeDef.run.bind(this.context));
    this.#kinds.set(id, nodeDef.kind);

    return id;
  }

  /**
   * Delete node or link with given id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.delete}
   */
  delete(id: string) {
    // Delete node.
    if (this.#kinds.delete(id)) {
      // Delete functions or output data, if any.
      this.#runs.delete(id);
      this.#outputs.delete(id);
      // Delete all links connected to node.
      for (const [linkId, link] of this.#links.entries())
        if (link[0] == id || link[2] == id) this.delete(linkId);
    }
    // Delete link.
    const link = this.#links.get(id);
    if (!link) return;
    this.#links.delete(id);
    // Disconnect target input.
    const targetInput = this.#inputs.get(link[2])?.[link[3]];
    if (targetInput) targetInput.source = undefined;
  }

  /**
   * Create a new data node. Returns node id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.data}
   */
  data(value: unknown, wantedId?: string): string {
    const id = this.#newId(this.#kinds, "n", wantedId);
    this.#kinds.set(id, "data");
    const data = isData(value) ? value : undefined;
    // Infer data type
    let types: DflowDataType[] = [];
    for (const [type, isValid] of Object.entries(validators)) {
      if (isValid(data)) {
        types = [type as DflowDataType];
        break;
      }
    }
    // Set output.
    this.#outputs.set(id, [{ data, clear() {}, types }]);
    return id;
  }

  /**
   * Create a new link and connect two nodes. Returns link id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.link}
   */
  link(
    source: string | [nodeId: string, index: number],
    target: string | [nodeId: string, index: number],
    wantedId?: string
  ): string {
    const id = this.#newId(this.#links, "l", wantedId);

    const sourceNodeId = isString(source) ? source : source[0];
    const sourceOutputIndex = isString(source) ? 0 : source[1];
    const targetNodeId = isString(target) ? target : target[0];
    const targetInputIndex = isString(target) ? 0 : target[1];

    if (
      this.canConnect([
        sourceNodeId,
        sourceOutputIndex,
        targetNodeId,
        targetInputIndex
      ])
    ) {
      const sourceOutput = this.#outputs.get(sourceNodeId)?.[sourceOutputIndex];
      const targetInput = this.#inputs.get(targetNodeId)?.[targetInputIndex];
      if (sourceOutput && targetInput) {
        // Create link.
        this.#links.set(id, [
          sourceNodeId,
          sourceOutputIndex,
          targetNodeId,
          targetInputIndex
        ]);
        // Connect target input to source output.
        targetInput.source = sourceOutput;
        return id;
      }
    }

    const error = new Error("Cannot create link", {
      cause: `Source ${source} can't connect to target ${target}`
    });
    this.ERR?.(error);
    throw error;
  }

  /**
   * Execute all nodes, sorted by their connections.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.run}
   */
  async run(): Promise<void> {
    // Reset errors.
    this.#errors.clear();
    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const kind = this.#kinds.get(nodeId)!;

      if (kind == "data") continue;

      const run = this.#runs.get(nodeId)!;

      const nodeInputs = this.#inputs.get(nodeId) ?? [];
      const nodeOutputs = this.#outputs.get(nodeId) ?? [];
      const numOutputs = nodeOutputs.length;

      // Check if inputs data are valid.
      let inputsDataAreValid = true;
      for (const { source, types, optional } of nodeInputs) {
        // Ignore optional inputs with no data.
        if (optional && isUndefined(source?.data)) continue;
        // Validate input data.
        if (isValidData(types, source?.data)) continue;
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
        if (run.constructor.name == "Function") {
          result = run(...inputData);
        }
        if (run.constructor.name == "AsyncFunction") {
          result = await run(...inputData);
        }
      } catch (err) {
        this.ERR?.(err);
        // Store error message and clear node outputs.
        this.#errors.set(nodeId, err instanceof Error ? err.message : `${err}`);
        nodeOutputs.forEach((output) => output.clear());
        continue;
      }
      // If result is undefined or not a valid Dflow data,
      // then clear the node outputs.
      if (isUndefined(result) || !isData(result)) {
        nodeOutputs.forEach((output) => output.clear());
        continue;
      }
      // Copy result into node .
      if (numOutputs == 1) nodeOutputs[0].data = result;
      if (numOutputs > 1)
        for (let index = 0; index < numOutputs; index++)
          nodeOutputs[index].data = (result as DflowArray)[index];
    }
  }

  // Dflow getters
  // //////////////////////////////////////////////////////////////////

  /**
   * A graph contains nodes and links.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.graph}
   */
  get graph(): DflowGraph {
    const node: DflowGraph["node"] = {};
    const data: DflowGraph["data"] = {};
    for (const [id, kind] of this.#kinds.entries()) {
      if (kind == "data")
        data[id] = this.#outputs.get(id)?.[0]?.data as DflowData;
      node[id] = kind;
    }
    return {
      node,
      link: Object.fromEntries(this.#links.entries()),
      data
    };
  }

  /**
   * Get error messages from last run, indexed by node id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.error}
   */
  get error(): Record<string, string> {
    return Object.fromEntries(this.#errors.entries());
  }

  /**
   * Get output data of last run, indexed by node id.
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.out}
   */
  get out(): Record<string, DflowArray> {
    const out: Record<string, DflowArray> = {};
    for (const nodeId of this.#kinds.keys()) {
      const outputs = this.#outputs.get(nodeId)!;
      out[nodeId] = [];
      for (const output of outputs) out[nodeId].push(output.data);
    }
    return out;
  }

  // Dflow static methods
  // //////////////////////////////////////////////////////////////////

  /**
   * Helper to define inputs.
   *
   * @example Input with type `array` and name.
   *
   * ```ts
   * Dflow.input("array", { name: "list" })
   * ```
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.input} for more examples.
   */
  static input(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowInput, "types">
  ): DflowInput {
    return {
      types: isString(typing) ? [typing] : typing,
      ...rest
    };
  }

  /**
   * Helper to define outputs.
   *
   * @example Output with type `number` type and named "count".
   *
   * ```ts
   * Dflow.output("number", { name: "count" })
   * ```
   *
   * @see {@link https://fibo.github.io/dflow/#dflow.output} for more examples.
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutput, "types">
  ): DflowOutput {
    return {
      types: isString(typing) ? [typing] : typing,
      ...rest
    };
  }

  /**
   * Type guard for `DflowArray`.
   * It checks recursively that every element is some `DflowData`.
   */
  static isArray(arg: unknown): arg is DflowArray {
    return isArray(arg);
  }

  /**
   * Type guard for `DflowObject`.
   * It checks recursively that every value is some `DflowData`.
   */
  static isObject(arg: unknown): arg is DflowObject {
    return isObject(arg);
  }

  /** Type guard for a valid number, i.e. finite and not `NaN`. */
  static isNumber(arg: unknown): arg is number {
    return isNumber(arg);
  }

  /** Type guard for `DflowData`. */
  static isData(arg: unknown): arg is Exclude<DflowData, undefined> {
    return isData(arg);
  }

  /** Validate that data belongs to some of given types. */
  static isValidData(types: DflowDataType[], data: unknown) {
    return isValidData(types, data);
  }
}
