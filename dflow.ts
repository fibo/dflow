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

const UNIMPLEMENTED = Symbol();

// Helper to generate an id unique in its scope.
const newId = (
  itemMap: Map<string, unknown>,
  idPrefix: string,
  wantedId?: string
): string => {
  if (wantedId && !itemMap.has(wantedId)) return wantedId;
  const id = `${idPrefix}${itemMap.size}`;
  return itemMap.has(id) ? newId(itemMap, idPrefix) : id;
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
  l: Record<
    string,
    [
      sourceNodeId: string,
      sourceOutputPosition: number,
      targetNodeId: string,
      targetInputPosition: number
    ]
  >;
};

/**
 * A `Dflow` represents a program as an executable graph.
 * A graph can contain nodes and links.
 * Nodes are executed, sorted by their connections.
 */
export class Dflow {
  readonly context: Record<string, unknown>;

  #nodeDefinitions: Map<string, DflowNodeDefinition> = new Map();

  #nodesMap: Map<string, DflowNode> = new Map();

  #linksMap: Map<string, DflowLink> = new Map();

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
    const nodeConnections = [...this.#linksMap.values()].map((link) => ({
      sourceId: link.s[0],
      targetId: link.t[0]
    }));
    const levelOf: Record<string, number> = {};
    for (const nodeId of nodeIds)
      levelOf[nodeId] = this.#levelOfNodeId(nodeId, nodeConnections);
    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  /**
   * Delete node or link with given id.
   */
  delete(id: string) {
    // Delete node.
    if (this.#nodesMap.delete(id)) {
      // Delete all links connected to node.
      for (const link of this.#linksMap.values())
        if (link.s[0] === id || link.t[0] === id) this.delete(link.id);
    }
    // Delete link.
    const link = this.#linksMap.get(id);
    if (!link) return;
    this.#linksMap.delete(id);
    // Cleanup target input.
    const targetInput = this.#nodesMap.get(link.t[0])?.inputs[link.t[1]];
    if (targetInput) targetInput.source = undefined;
  }

  /**
   * Create a new node. Returns node id.
   */
  node(
    kind: string,
    arg: {
      id?: string;
      // TODO remove inputs arg
      inputs?: { id?: string }[];
      outputs?: { id?: string; data?: DflowData }[];
    } = {}
  ): string {
    const NodeClass = this.#nodeDefinitions.get(kind) ?? DflowNodeUnknown;

    const id = newId(this.#nodesMap, "n", arg.id);

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
      kind,
      host: this,
      inputs,
      outputs
    });

    this.#nodesMap.set(node.id, node);

    return id;
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

    const link: DflowLink = {
      id,
      s: typeof source === "string" ? [source, 0] : source,
      t: typeof target === "string" ? [target, 0] : target
    };

    const sourceNode = this.#nodesMap.get(link.s[0]);
    const targetNode = this.#nodesMap.get(link.t[0]);

    if (sourceNode && targetNode) {
      const source = sourceNode.outputs[link.s[1]];
      const target = targetNode.inputs[link.t[1]];

      if (source && target) {
        if (Dflow.canConnect(source.types, target.types)) {
          this.#linksMap.set(link.id, link);
          target.source = source;
          return id;
        }
      }
    }

    throw new Error("Cannot create link", { cause: { link } });
  }

  /**
   * Execute all nodes, sorted by their connections.
   */
  async run(): Promise<void> {
    // Loop over nodeIds sorted by graph hierarchy.
    for (const nodeId of this.#sortedNodesIds()) {
      const node = this.#nodesMap.get(nodeId) as DflowNode;

      // If some input data is not valid.
      if (!node.inputsDataAreValid) {
        node.clearOutputs();
        continue;
      }

      const inputData: Array<DflowData | undefined> = node.inputs.map(
        (input) => input.source?.data
      );
      let result: unknown;
      if (node.run.constructor.name === "Function") {
        result = node.run(...inputData) as DflowData | undefined;
      }
      if (node.run.constructor.name === "AsyncFunction") {
        result = (await node.run(...inputData)) as DflowData | undefined;
      }
      // If run() is not implemented, then it is a constant node.
      if (result === UNIMPLEMENTED) {
        continue;
      }
      if (result === undefined || !Dflow.isDflowData(result)) {
        node.clearOutputs();
        continue;
      }
      if (node.outputs.length === 1) node.outputs[0].data = result;
      if (node.outputs.length > 1)
        for (let position = 0; position < node.outputs.length; position++)
          node.outputs[position].data = (result as DflowArray)[position];
    }
  }

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
    }
    const l: DflowGraph["l"] = {};
    for (const [linkId, link] of this.#linksMap.entries()) {
      l[linkId] = [
        link.s[0], // source node id
        link.s[1], // source output position
        link.t[0], // target node id
        link.t[1] // target input position
      ];
    }
    return { n, l };
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
  /** Ignored by Dflow, but could be used by UI. */
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
  nodeId: string;
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
  /** Ignored by Dflow, but could be used by UI. */
  name?: string;
  types: DflowDataType[];
  data?: DflowData;
};

/**
 * A `DflowOutput` is a node output.
 */
type DflowOutput = {
  id: string;
  nodeId: string;
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
type DflowNodeDefinition = {
  new (arg: ConstructorParameters<typeof DflowNode>[0]): DflowNode;
  kind: string;
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
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
  id: string;

  inputs: DflowInput[] = [];
  outputs: DflowOutput[] = [];

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
    rest?: Omit<DflowInputDefinition, "types">
  ): DflowInputDefinition {
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
   *   static outputs = [output("number", { name: "π", data: Math.PI })];
   * }
   * ```
   *
   * Named output with `number` type.
   *
   * @example
   *
   * ```ts
   * DflowNode.output("number", { name: "answer" })
   * ```
   *
   * @see {@link DflowNode.input} for other similar examples.
   *
   * `DflowOutputDefinition` has also an optional `data` attribute.
   *
   * @example
   *
   * ```ts
   * DflowNode.output("number", { data: 42, name: "answer" })
   * ```
   */
  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutputDefinition, "types">
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
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
      this.inputs.push({
        ...obj,
        nodeId: this.id,
        get data() {
          return this.source?.data;
        }
      });
    }

    // Outputs.
    for (const obj of outputs) {
      let { data: _data, types, ...rest } = obj;
      this.outputs.push({
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
            _data = arg;
        }
      });
    }
  }

  get inputsDataAreValid(): boolean {
    for (const { data, types, optional } of this.inputs) {
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
    for (const output of this.outputs) output.clear();
  }

  /**
   * Every `DflowNode` can implement `run()` method.
   * Arguments are node inputs data.
   * Return value is the output data.
   * If `run()` is not implemented, then the node is a constant node.
   */
  run(..._args: Array<DflowData | undefined>): unknown | Promise<unknown> {
    return UNIMPLEMENTED;
  }
}

// DflowLink
// ////////////////////////////////////////////////////////////////////

/**
 * `DflowLink` connects an `DflowOutput` to a `DflowInput`.
 */
type DflowLink = {
  id: string;

  /**
   * Source output coordinates.
   */
  s: [nodeId: string, outputPosition: number];

  /**
   * Target input coordinates.
   */
  t: [nodeId: string, inputPosition: number];
};

// Dflow core nodes
// ////////////////////////////////////////////////////////////////////

class DflowNodeData extends DflowNode {
  static kind = "data";
  static outputs = [DflowNode.output()];
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

// This class is used to instantiate a new node which `kind` was not found.
class DflowNodeUnknown extends DflowNode {
  static inputs = [];
  static outputs = [];
}
