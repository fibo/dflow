/**
 * Every dflow item has an identifier unique in its scope.
 * A node or edge id is unique in its graph.
 * An input or output id is unique in its node.
 */
export type DflowId = string;
/**
 * A `DflowData` represents any data that can be serialized into JSON.
 */
export type DflowData = string | number | boolean | DflowArray | DflowObject;
/** @ignore */
export type DflowObject = {
  [Key in string]?: DflowData;
};
/** @ignore */
export type DflowArray = DflowData[];
export type DflowDataType = typeof Dflow.dataTypes[number];
/**
 * Every dflow item (`DflowNode`, `DflowEdge`, etc.) and
 * every dflow error (`DflowErrorItemNotFound`, `DflowErrorInvalidInputData`, etc.)
 * is serializable into JSON.
 */
export interface DflowSerializable<Data extends DflowData> {
  /**
   * Return serializable data,
   * i.e. an object that can be converted to JSON format.
   */
  toObject(): Data;
}
/**
 * `Dflow` is a static class with methods to handle Dflow data.
 */
export declare class Dflow {
  static dataTypes: string[];
  /**
   * Infer `DflowDataType` of given argument.
   */
  static inferDataType(arg: unknown): DflowDataType[];
  /**
   * Type guard for `DflowArray`.
   * It checks recursively that every element is some `DflowData`.
   */
  static isArray(arg: unknown): arg is DflowArray;
  /**
   * Type guard for `boolean`.
   */
  static isBoolean(arg: unknown): arg is boolean;
  /**
   * Type guard for `DflowId`.
   */
  static isDflowId(arg: unknown): arg is DflowId;
  /**
   * Type guard for `DflowObject`.
   * It checks recursively that every value is some `DflowData`.
   */
  static isObject(arg: unknown): arg is DflowObject;
  /**
   * Type guard for a valid dflow `number`, i.e. finite and not `NaN`.
   */
  static isNumber(arg: unknown): arg is number;
  /**
   * Type guard for `string`.
   */
  static isString(arg: unknown): arg is string;
  /**
   * Type guard for `DflowData`.
   */
  static isDflowData(arg: unknown): arg is DflowData;
  /**
   * Validate that data belongs to some of given types.
   */
  static isValidDataType(types: DflowDataType[], data: unknown): boolean;
}
/**
 * `DflowPin` is a base class for `DflowInput` and `DflowOutput`.
 */
export declare class DflowPin {
  readonly name?: string;
  readonly nodeId: DflowId;
  readonly types: DflowDataType[];
  constructor(
    { nodeId, name, types }:
      & Pick<DflowPin, "nodeId" | "types">
      & Partial<Pick<DflowPin, "name">>,
  );
  /**
   * Check that types of output source are compatible with types of input target.
   */
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ): boolean;
  /**
   * If `types` is an empty list, it is equivalent to an `any` type.
   */
  get hasTypeAny(): boolean;
  /**
   * Check that given type is compatible with pin types.
   */
  hasType(type: DflowDataType): boolean;
}
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
 * @implements DflowSerializable<DflowSerializableInput>
 */
export declare class DflowInput extends DflowPin
  implements DflowSerializable<DflowSerializableInput> {
  readonly id: DflowId;
  private source?;
  /**
   * By default an input is **not** `optional`.
   * If an input is not `optional` and its data is not defined then its node will not be executed.
   * If an input is `optional`, then its node will be executed even if the inputs has no data.
   */
  optional?: boolean;
  constructor({ id, optional, ...pin }: {
    id: DflowId;
    nodeId: DflowId;
  } & DflowInputDefinition);
  /**
   * An input data is a reference to its connected output data, if any.
   */
  get data(): DflowData | undefined;
  get isConnected(): boolean;
  /**
   * Connect input to given output.
   */
  connectTo(pin: DflowOutput): void;
  /**
   * Disconnect from current output.
   */
  disconnect(): void;
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableInput;
}
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
 * @implements DflowSerializable<DflowSerializableOutput>
 */
export declare class DflowOutput extends DflowPin
  implements DflowSerializable<DflowSerializableOutput> {
  readonly id: DflowId;
  private value;
  constructor({ id, data, ...pin }: {
    id: DflowId;
    nodeId: DflowId;
  } & DflowOutputDefinition);
  get data(): DflowData | undefined;
  set data(arg: unknown);
  clear(): void;
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableOutput;
}
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
    inputs?: ({
      id?: DflowId;
    } & DflowInputDefinition)[];
    outputs?: ({
      id?: DflowId;
    } & DflowOutputDefinition)[];
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
 * @implements DflowSerializable<DflowSerializableNode>
 */
export declare class DflowNode
  implements DflowSerializable<DflowSerializableNode> {
  readonly id: DflowId;
  /** @ignore */
  private inputsMap;
  /** @ignore */
  private outputsMap;
  /** @ignore */
  private inputPosition;
  /** @ignore */
  private outputPosition;
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
  constructor({ id, kind, inputs, outputs, host }: DflowNodeConstructorArg);
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
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition;
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
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition;
  get inputsDataAreValid(): boolean;
  clearOutputs(): void;
  /**
   * @throws {DflowErrorItemNotFound}
   */
  getInputById(id: DflowId): DflowInput;
  /**
   * Get input by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  input(position: number): DflowInput;
  /**
   * @throws {DflowErrorItemNotFound}
   */
  getOutputById(id: DflowId): DflowOutput;
  /**
   * Get output by position.
   *
   * @throws {DflowErrorItemNotFound}
   */
  output(position: number): DflowOutput;
  /** @ignore this method, it should be overridden. */
  run(): void | Promise<void>;
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableNode;
}
export type DflowSerializableEdge = {
  id: DflowId;
  s: DflowEdge["source"];
  t: DflowEdge["target"];
};
/**
 * `DflowEdge` connects an `DflowOutput` to a `DflowInput`.
 *
 * @implements DflowSerializable<DflowSerializableEdge>
 */
export declare class DflowEdge
  implements DflowSerializable<DflowSerializableEdge> {
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
  );
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableEdge;
}
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
/**
 * Contains info about node execution, that is:
 * the serialized node except its inputs; an error, if any.
 */
export type DflowExecutionNodeInfo = Omit<DflowSerializableNode, "i"> & {
  /** Error during execution */
  err?: DflowSerializableError;
};
export type DflowGraphExecutionReport = {
  status: Exclude<DflowGraph["runStatus"], null>;
  start: string;
  end: string;
  steps: DflowExecutionNodeInfo[];
};
export type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};
type DflowNodeConnection = {
  sourceId: DflowId;
  targetId: DflowId;
};
type DflowGraphConstructorArg = {
  nodesCatalog: DflowNodesCatalog;
};
/**
 * `DflowGraph` represents a program.
 * It can contain nodes and edges. Nodes are executed, sorted by their connections.
 */
export declare class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;
  /** @ignore */
  readonly nodesMap: Map<DflowId, DflowNode>;
  /** @ignore */
  readonly edgesMap: Map<DflowId, DflowEdge>;
  runStatus: "running" | "success" | "failure" | null;
  executionReport: DflowGraphExecutionReport | null;
  constructor({ nodesCatalog }: DflowGraphConstructorArg);
  /** @ignore */
  static childrenOfNodeId(nodeId: DflowId, nodeConnections: {
    sourceId: DflowId;
    targetId: DflowId;
  }[]): string[];
  /** @ignore */
  static executionNodeInfo: (
    node: DflowNode,
    error?: DflowSerializableError,
  ) => DflowExecutionNodeInfo;
  /** @ignore */
  static parentsOfNodeId(nodeId: DflowId, nodeConnections: {
    sourceId: DflowId;
    targetId: DflowId;
  }[]): string[];
  /** @ignore */
  static ancestorsOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): DflowId[];
  /** @ignore */
  static levelOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): number;
  /** @ignore */
  get nodeConnections(): DflowNodeConnection[];
  /** @ignore */
  get nodeIdsInsideFunctions(): DflowId[];
  /** @ignore */
  static sortNodesByLevel(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[];
  /**
   * Execute all nodes, sorted by their connections.
   */
  run(): Promise<void>;
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableGraph;
}
export type DflowHostConstructorArg = DflowGraphConstructorArg;
export declare class DflowHost {
  private graph;
  readonly context: Record<string, unknown>;
  constructor(arg: DflowHostConstructorArg);
  get executionReport(): DflowGraphExecutionReport | null;
  /**
   * List edge objects.
   */
  get edges(): Pick<DflowEdge, "id" | "source" | "target">[];
  /**
   * List node objects.
   */
  get nodes(): DflowSerializableNode[];
  get nodesCatalog(): DflowNodesCatalog;
  get runStatus(): "running" | "success" | "failure" | null;
  /**
   * Empty graph.
   *
   * @example
   * ```ts
   * const previousGraph = dflow.graph;
   * dflow.clearGraph();
   * ```
   */
  clearGraph(): void;
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
  connect(sourceNode: DflowNode, sourcePosition?: number): {
    to: (targetNode: DflowNode, targetPosition?: number) => void;
  };
  /**
   * Delete edge with given id.
   * @throws {DflowErrorItemNotFound}
   */
  deleteEdge(edgeId: DflowId): void;
  /**
   * Delete node with given id.
   * @throws {DflowErrorItemNotFound}
   */
  deleteNode(nodeId: DflowId): void;
  executeFunction(functionId: DflowId, args: DflowArray): DflowData | undefined;
  /**
   * @throws {DflowErrorItemNotFound}
   */
  getEdgeById(id: DflowId): DflowEdge;
  /**
   * @throws {DflowErrorItemNotFound}
   */
  getNodeById(id: DflowId): DflowNode;
  newNode(arg: {
    kind: string;
    id?: DflowId;
    inputs?: {
      id?: DflowId;
    }[];
    outputs?: {
      id?: DflowId;
      data?: DflowData;
    }[];
  }): DflowNode;
  /**
   * @throws {DflowErrorItemNotFound}
   */
  newEdge(
    arg: {
      id?: DflowId;
    } & Pick<DflowEdge, "source" | "target">,
  ): DflowEdge;
  /**
   * Return serializable item.
   */
  toObject(): DflowSerializableGraph;
  /** Execute graph. */
  run(): Promise<void>;
}
/**
 * This class is used to instantiate a new node which `kind` was not found in `nodesCatalog`.
 * The "unknown" node class is not included in `coreNodesCatalog`.
 */
export declare class DflowNodeUnknown extends DflowNode {
}
/** Builtin nodes, always included in `nodesCatalog`. */
export declare const coreNodesCatalog: DflowNodesCatalog;
export type DflowSerializableErrorCode = {
  /** error code */
  _: string;
};
export type DflowSerializableError =
  | DflowSerializableErrorItemNotFound
  | DflowSerializableErrorInvalidInputData
  | DflowSerializableErrorCannotConnectPins
  | DflowSerializableErrorCannotExecuteAsyncFunction;
export type DflowSerializableErrorCannotConnectPins =
  & DflowSerializableErrorCode
  & {
    /** source */
    s: DflowErrorCannotConnectPins["source"];
    /** target */
    t: DflowErrorCannotConnectPins["target"];
  };
export declare class DflowErrorCannotConnectPins extends Error
  implements DflowSerializable<DflowSerializableErrorCannotConnectPins> {
  readonly source: DflowEdge["source"];
  readonly target: DflowEdge["target"];
  static code: string;
  static message(
    { s, t }: Omit<DflowSerializableErrorCannotConnectPins, "_">,
  ): string;
  constructor(
    { source, target }: Pick<DflowErrorCannotConnectPins, "source" | "target">,
  );
  toObject(): DflowSerializableErrorCannotConnectPins;
}
export type DflowSerializableErrorInvalidInputData =
  & DflowSerializableErrorCode
  & {
    /** nodeId */
    nId: DflowErrorInvalidInputData["nodeId"];
  };
export declare class DflowErrorInvalidInputData extends Error
  implements DflowSerializable<DflowSerializableErrorInvalidInputData> {
  static code: string;
  readonly nodeId: DflowId;
  static message(
    { nId: nodeId }: Omit<DflowSerializableErrorInvalidInputData, "_">,
  ): string;
  constructor(nodeId: DflowErrorInvalidInputData["nodeId"]);
  toObject(): DflowSerializableErrorInvalidInputData;
}
export type DflowSerializableErrorItemNotFound = DflowSerializableErrorCode & {
  item: DflowErrorItemNotFound["item"];
  id?: DflowErrorItemNotFound["info"]["id"];
  /** nodeId */
  nId?: DflowErrorItemNotFound["info"]["nodeId"];
  /** position */
  p?: DflowErrorItemNotFound["info"]["position"];
};
export declare class DflowErrorItemNotFound extends Error
  implements DflowSerializable<DflowSerializableErrorItemNotFound> {
  static code: string;
  readonly item: "node" | "edge" | "input" | "output";
  readonly info: Partial<{
    id: DflowId;
    nodeId: DflowId;
    position: number;
  }>;
  static message(
    { item, id, nId: nodeId, p: position }: Omit<
      DflowSerializableErrorItemNotFound,
      "_"
    >,
  ): string;
  constructor(
    item: DflowErrorItemNotFound["item"],
    info?: DflowErrorItemNotFound["info"],
  );
  toObject(): DflowSerializableErrorItemNotFound;
}
export type DflowSerializableErrorCannotExecuteAsyncFunction =
  DflowSerializableErrorCode;
export declare class DflowErrorCannotExecuteAsyncFunction extends Error
  implements
    DflowSerializable<DflowSerializableErrorCannotExecuteAsyncFunction> {
  static code: string;
  static message(): string;
  constructor();
  toObject(): DflowSerializableErrorCode;
}
export {};
