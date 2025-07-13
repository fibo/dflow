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
  sourceOutputPosition: number,
  targetNodeId: string,
  targetInputPosition: number
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
  /** nodes */
  n: Record<
    string,
    {
      /** Node kind */
      k: string;
      /** Node outputs */
      o?: Array<{
        /** data */
        d?: DflowData;
      }>;
      /** Last error message. */
      err?: string;
    }
  >;
  /** links */
  l: Record<string, DflowLinkPath>;
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and links.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  /** Dflow node definitions indexed by node kind. */
  #nodeDefinitions: Map<string, DflowNodeDefinition> = new Map();

  /** Dflow node instances indexed by node id. */
  #nodesMap: Map<string, DflowNode> = new Map();

  /** Dflow links indexed by link id. */
  #linksMap: Map<string, DflowLinkPath> = new Map();

  /** Key is nodeId, value is an error message. */
  #errorsMap: Map<string, string> = new Map();

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

  constructor(nodeDefinitions: Array<DflowNodeDefinition>) {
    // Add given node definitions, followed by builtin nodes.
    for (const nodeDefinition of [...nodeDefinitions, DflowNodeData])
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
    const nodeIds = Array.from(this.#nodesMap.keys());
    const nodeConnections = [...this.#linksMap.values()].map((link) => ({
      sourceId: link[0],
      targetId: link[2]
    }));
    const levelOf: Record<string, number> = {};
    for (const nodeId of nodeIds)
      levelOf[nodeId] = this.#levelOfNode(nodeId, nodeConnections);
    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  /** Delete node or link with given id. */
  delete(id: string) {
    // Delete node.
    if (this.#nodesMap.delete(id)) {
      // Delete all links connected to node.
      for (const [linkId, link] of this.#linksMap.entries())
        if (link[0] === id || link[2] === id) this.delete(linkId);
    }
    // Delete link.
    const link = this.#linksMap.get(id);
    if (!link) return;
    this.#linksMap.delete(id);
    // Disconnect target input.
    const targetInput = this.#nodesMap.get(link[2])?.inputs[link[3]];
    if (targetInput) targetInput.source = undefined;
  }

  /** Create a new node. Returns node id. */
  node(
    kind: string,
    arg: {
      id?: string;
      outputs?: { data?: DflowData }[];
    } = {}
  ): string {
    const NodeClass = this.#nodeDefinitions.get(kind) ?? DflowNodeUnknown;

    const id = newId(this.#nodesMap, "n", arg.id);

    this.#nodesMap.set(
      id,
      new NodeClass({
        kind,
        host: this,
        inputs: NodeClass.inputs ?? [],
        outputs:
          NodeClass.outputs?.map((definition, i) => {
            const obj = arg.outputs?.[i];
            return { ...obj, ...definition };
          }) ?? []
      })
    );

    return id;
  }

  /**
   * Create a new data node. Returns node id.
   * @remarks If provided `value` is not a valid `DflowData`, it will set to `undefined`.
   */
  data(value: unknown, wantedId?: string): string {
    return this.node("data", {
      outputs: [{ data: Dflow.isDflowData(value) ? value : undefined }],
      id: wantedId
    });
  }

  /**
   * Create a new link and connect two nodes. Returns link id.
   * If source or target position is omitted, then it defaults to `0`.
   */
  link(
    source: string | [nodeId: string, outputPosition: number],
    target: string | [nodeId: string, inputPosition: number],
    wantedId?: string
  ): string {
    const id = newId(this.#linksMap, "l", wantedId);

    const sourceNodeId = typeof source === "string" ? source : source[0];
    const sourceOutputPosition = typeof source === "string" ? 0 : source[1];
    const targetNodeId = typeof target === "string" ? target : target[0];
    const targetPosition = typeof target === "string" ? 0 : target[1];

    const sourceNode = this.#nodesMap.get(sourceNodeId);
    const targetNode = this.#nodesMap.get(targetNodeId);

    if (sourceNode && targetNode) {
      const source = sourceNode.outputs[sourceOutputPosition];
      const target = targetNode.inputs[targetPosition];

      if (source && target) {
        if (Dflow.canConnect(source.types, target.types)) {
          this.#linksMap.set(id, [
            sourceNodeId,
            sourceOutputPosition,
            targetNodeId,
            targetPosition
          ]);
          // Connect target input to source output.
          target.source = source;
          return id;
        }
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
    this.#errorsMap.clear();
    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const node = this.#nodesMap.get(nodeId)!;

      // Check if inputs data are valid.
      let inputsDataAreValid = true;
      for (const { source, types, optional } of node.inputs) {
        // Ignore optional inputs with no data.
        if (optional && source?.data === undefined) continue;
        // Validate input data.
        if (Dflow.isValidData(types, source?.data)) continue;
        // Some input is not valid.
        inputsDataAreValid = false;
      }
      // If some input data is not valid, then skip.
      if (!inputsDataAreValid) {
        node.outputs.forEach((output) => output.clear());
        continue;
      }

      const inputData: Array<DflowData | undefined> = node.inputs.map(
        (input) => input.source?.data
      );
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
        this.#errorsMap.set(nodeId, message);
        node.outputs.forEach((output) => output.clear());
        continue;
      }
      // If result is undefined or not a valid Dflow data,
      // then clear the node outputs.
      if (result === undefined || !Dflow.isDflowData(result)) {
        node.outputs.forEach((output) => output.clear());
        continue;
      }
      // Copy result into node outputs.
      if (node.outputs.length === 1) node.outputs[0].data = result;
      if (node.outputs.length > 1)
        for (let position = 0; position < node.outputs.length; position++)
          node.outputs[position].data = (result as DflowArray)[position];
    }
  }

  /**
   * Dflow graph contains information about nodes, links, data outputs and errors.
   * It is updated on every run.
   */
  get graph(): DflowGraph {
    const n: DflowGraph["n"] = {};
    for (const [nodeId, node] of this.#nodesMap.entries()) {
      const outputs: Array<{ d?: DflowData }> = [];
      for (const output of node.outputs) {
        const obj: { d?: DflowData } = {};
        if (output.data !== undefined) obj.d = output.data;
        outputs.push(obj);
      }
      n[nodeId] = {
        k: node.kind,
        o: outputs
      };
      const err = this.#errorsMap.get(nodeId);
      if (err) n[nodeId].err = err;
    }
    return { n, l: Object.fromEntries(this.#linksMap.entries()) };
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

  /** Type guard for a valid number, i.e. finite and not `NaN`. */
  static isNumber(arg: unknown): arg is number {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }

  /** Type guard for `DflowData`. */
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

  /** Validate that data belongs to some of given types. */
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

// DflowNode
// ////////////////////////////////////////////////////////////////////

/**
 * A class extending `DflowNode` must implement `DflowNodeDefinition` interface.
 */
type DflowNodeDefinition = {
  new (arg: ConstructorParameters<typeof DflowNode>[0]): DflowNode;
  kind: string;
  inputs?: DflowInput[];
  outputs?: DflowOutput[];
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
 *   run(a: number, b: number) {
 *     return a + b;
 *   }
 * }
 * ```
 *
 */
export class DflowNode {
  inputs: _DflowInput[] = [];
  outputs: _DflowOutput[] = [];

  /**
   * `DflowNode.input()` is a helper to define inputs.
   *
   * Input with `number` type.
   *
   * @example
   *
   * ```ts
   * DflowNode.input("number")
   * ```
   *
   * Optional `number` input.
   *
   * @example
   *
   * ```ts
   * DflowNode.input("number", { optional: true })
   * ```
   *
   * Input that accepts both `number` and `string` type.
   *
   * @example
   *
   * ```ts
   * DflowNode.input(["number", "string"])
   * ```
   *
   * Input with any type.
   *
   * @example
   *
   * ```ts
   * DflowNode.input()
   * ```
   *
   * Input with type `array` and name.
   *
   * @example
   *
   * ```ts
   * DflowNode.input("array", { name: "list" })
   * ```
   *
   * Input with any type and named "foo".
   *
   * @example
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

  /**
   * Every dflow node must have its own `kind` that is used as a *unique key*.
   */
  readonly kind: string;

  /**
   * `DflowNode` has a reference to its `Dflow` host.
   */
  readonly host: Dflow;

  constructor({
    kind,
    host,
    inputs,
    outputs
  }: Pick<DflowNode, "kind" | "host"> & {
    inputs: DflowInput[];
    outputs: Array<{
      data?: DflowData;
      types: DflowDataType[];
    }>;
  }) {
    this.host = host;
    this.kind = kind;

    // Inputs.
    for (const input of inputs) this.inputs.push({ ...input });

    // Outputs.
    for (const obj of outputs) {
      let { data, types } = obj;
      this.outputs.push({
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
            (types.length === 0 && Dflow.isDflowData(arg)) ||
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
  }

  /**
   * Every `DflowNode` can implement `run()` method.
   * Arguments are node inputs data.
   * Return value is the output data.
   */
  run(..._args: Array<DflowData | undefined>): unknown | Promise<unknown> {
    return;
  }
}

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [{ types: [] }];
  value: DflowData | undefined;
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
    this.value = outputs?.[0]?.data;
  }
  run() {
    return this.value;
  }
}

// This class is used to instantiate a new node which `kind` was not found.
class DflowNodeUnknown extends DflowNode {
  static inputs = [];
  static outputs = [];
}
