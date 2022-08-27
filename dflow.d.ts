/**
 * Every DflowItem has an identifier unique in its scope.
 * A node or edge id is unique in its graph.
 * An input or output id is unique in its node.
 */
export declare type DflowId = string;
/**
 * A pin can be of kind "input" or "output"
 */
declare type DflowPinKind = "input" | "output";
/**
 * An item can be a pin, node or edge
 */
declare type DflowItemKind = DflowPinKind | "node" | "edge";
declare type DflowSerializableItem = {
  id: DflowId;
};
declare type DflowItemConstructorArg = DflowSerializableItem;
interface DflowItem<Serializable extends DflowValue> {
  readonly id: DflowId;
  /**
   * Return serializable item,
   * i.e. an object that can be converted to JSON format.
   */
  toObject(): Serializable;
}
export declare type DflowValue =
  | string
  | number
  | boolean
  | DflowArray
  | DflowObject;
export declare type DflowObject = {
  [Key in string]?: DflowValue;
};
export declare type DflowArray = Array<DflowValue>;
declare const dflowDataTypes: readonly [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId",
];
export declare type DflowDataType = typeof dflowDataTypes[number];
export declare class DflowData {
  static types: readonly [
    "string",
    "number",
    "boolean",
    "object",
    "array",
    "DflowId",
  ];
  static isArray(data: unknown): data is DflowArray;
  static isBoolean(data: unknown): data is boolean;
  static isDflowId(data: unknown): data is DflowId;
  static isObject(data: unknown): data is DflowObject;
  static isNumber(data: unknown): data is number;
  static isString(data: unknown): data is string;
  static isDflowData(data: unknown): boolean;
  static isValidDataType(types: DflowDataType[], data: unknown): boolean;
}
declare type DflowSerializablePin =
  & DflowSerializableItem
  & Partial<Pick<DflowPin, "name">>;
declare type DflowPinDefinition =
  & Pick<DflowPin, "types">
  & Partial<Pick<DflowPin, "name">>;
declare type DflowPinConstructorArg = Partial<Pick<DflowPin, "name" | "types">>;
export declare class DflowPin {
  readonly name?: string;
  readonly types: DflowDataType[];
  constructor({ name, types }: DflowPinConstructorArg);
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ): boolean;
  get hasTypeAny(): boolean;
  hasType(type: DflowDataType): boolean;
}
declare type DflowInputDefinition =
  & DflowPinDefinition
  & Partial<Pick<DflowInput, "optional">>;
declare type DflowInputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & Pick<DflowInputDefinition, "optional">;
export declare type DflowSerializableInput = DflowSerializablePin;
/**
 * @implements DflowItem<DflowSerializableInput>
 */
export declare class DflowInput extends DflowPin
  implements DflowItem<DflowSerializableInput> {
  #private;
  readonly id: DflowId;
  /**
   * By default an input is not optional; in this case if its data
   * is not defined then its node will not be executed.
   */
  optional?: boolean;
  constructor({ id, optional, ...pin }: DflowInputConstructorArg);
  get data(): DflowValue | undefined;
  get isConnected(): boolean;
  connectTo(pin: DflowOutput): void;
  disconnect(): void;
  toObject(): DflowSerializableInput;
}
declare type DflowOutputDefinition = DflowPinDefinition & {
  data?: DflowValue;
};
export declare type DflowSerializableOutput =
  & DflowSerializablePin
  & Partial<Pick<DflowOutput, "data">>;
declare type DflowOutputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & {
    data?: DflowValue;
  };
/**
 * @implements DflowItem<DflowSerializableOutput>
 */
export declare class DflowOutput extends DflowPin
  implements DflowItem<DflowSerializableOutput> {
  #private;
  readonly id: DflowId;
  constructor({ id, data, ...pin }: DflowOutputConstructorArg);
  get data(): DflowValue | undefined;
  set data(data: unknown);
  clear(): void;
  toObject(): DflowSerializableOutput;
}
export declare type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };
/**
 * DflowNode constructor accepts a single argument.
 *
 * You can import this type as a helper, for example if you need to create a DflowNode that does something in the constructor.
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
export declare type DflowNodeConstructorArg = {
  node: DflowSerializableNode;
  host: DflowHost;
};
/**
 * DflowNode represents a block of code: it can have inputs and outputs.
 *
 * Extend this class to create a node.
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
export declare class DflowNode implements DflowItem<DflowSerializableNode> {
  #private;
  readonly id: DflowId;
  readonly kind: string;
  readonly host: DflowHost;
  constructor(
    { node: { id, kind, inputs, outputs }, host }: DflowNodeConstructorArg,
  );
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
   */
  static output(
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition;
  get inputsDataAreValid(): boolean;
  clearOutputs(): void;
  /**
   * @throws DflowErrorItemNotFound
   */
  getInputById(id: DflowId): DflowInput;
  /**
   * Get input by position.
   *
   * @throws DflowErrorItemNotFound
   */
  input(position: number): DflowInput;
  /**
   * @throws DflowErrorItemNotFound
   */
  getOutputById(id: DflowId): DflowOutput;
  /**
   * Get output by position.
   *
   * @throws DflowErrorItemNotFound
   */
  output(position: number): DflowOutput;
  run(): void | Promise<void>;
  toObject(): DflowSerializableNode;
}
declare type DflowSerializablePinPath = [nodeId: DflowId, pinId: DflowId];
export declare type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};
declare type DflowEdgeConstructorArg = DflowSerializableEdge;
/**
 * `DflowEdge` connects an input to an output.
 *
 * @implements DflowItem<DflowSerializableEdge>
 */
export declare class DflowEdge implements DflowItem<DflowSerializableEdge> {
  readonly id: DflowId;
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;
  constructor({ source, target, id }: DflowEdgeConstructorArg);
  toObject(): DflowSerializableEdge;
}
export interface DflowNodeDefinition {
  new (arg: DflowNodeConstructorArg): DflowNode;
  kind: DflowNode["kind"];
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}
export declare type DflowNodesCatalog = Record<
  DflowNode["kind"],
  DflowNodeDefinition
>;
export declare type DflowGraphRunStatus = "running" | "success" | "failure";
export declare type DflowExecutionNodeInfo =
  & Pick<DflowSerializableNode, "id" | "kind" | "outputs">
  & {
    error?: string;
  };
export declare type DflowGraphExecutionReport = {
  status: DflowGraphRunStatus;
  start: string;
  end: string;
  steps: DflowExecutionNodeInfo[];
};
export declare type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};
declare type DflowNodeConnection = {
  sourceId: DflowId;
  targetId: DflowId;
};
declare type DflowGraphRunOptions = {
  verbose: boolean;
};
declare type DflowGraphConstructorArg = {
  nodesCatalog: DflowNodesCatalog;
};
/**
 * `DflowGraph` represents a program.
 * I can have nodes and edges. It executes all nodes, sorted by their connections.
 */
export declare class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;
  readonly nodesMap: Map<DflowId, DflowNode>;
  readonly edgesMap: Map<DflowId, DflowEdge>;
  runOptions: DflowGraphRunOptions;
  runStatus: DflowGraphRunStatus | null;
  executionReport: DflowGraphExecutionReport | null;
  constructor({ nodesCatalog }: DflowGraphConstructorArg);
  static executionNodeInfo: (
    { id, kind, outputs }: DflowSerializableNode,
    error?: string,
  ) => DflowExecutionNodeInfo;
  static childrenOfNodeId(nodeId: DflowId, nodeConnections: {
    sourceId: DflowId;
    targetId: DflowId;
  }[]): string[];
  static parentsOfNodeId(nodeId: DflowId, nodeConnections: {
    sourceId: DflowId;
    targetId: DflowId;
  }[]): string[];
  static levelOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): number;
  static ancestorsOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): DflowId[];
  static sortNodesByLevel(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[];
  get nodeConnections(): DflowNodeConnection[];
  get nodeIdsInsideFunctions(): DflowId[];
  run(runOptions?: DflowGraphRunOptions): Promise<void>;
  toObject(): DflowSerializableGraph;
}
declare type DflowNewItem = Partial<Pick<DflowSerializableItem, "id">>;
declare type DflowNewInput = DflowNewItem;
declare type DflowNewOutput =
  & DflowNewItem
  & Partial<Pick<DflowOutputConstructorArg, "data">>;
declare type DflowNewNode =
  & DflowNewItem
  & Pick<DflowSerializableNode, "kind">
  & {
    inputs?: DflowNewInput[];
    outputs?: DflowNewOutput[];
  };
declare type DflowNewEdge =
  & DflowNewItem
  & Pick<DflowSerializableEdge, "source" | "target">;
export declare type DflowHostConstructorArg = DflowGraphConstructorArg;
export declare class DflowHost {
  #private;
  readonly context: Record<string, unknown>;
  constructor(arg: DflowHostConstructorArg);
  get executionReport(): DflowGraphExecutionReport | null;
  get edges(): DflowSerializableEdge[];
  get nodes(): DflowSerializableNode[];
  get nodesCatalog(): DflowNodesCatalog;
  get runStatus(): DflowGraphRunStatus | null;
  set verbose(option: DflowGraphRunOptions["verbose"]);
  clearGraph(): void;
  connect(sourceNode: DflowNode, sourcePosition?: number): {
    to: (targetNode: DflowNode, targetPosition?: number) => void;
  };
  /**
   * @throws DflowErrorItemNotFound
   */
  deleteEdge(edgeId: DflowId): void;
  /**
   * @throws DflowErrorItemNotFound
   */
  deleteNode(nodeId: DflowId): void;
  executeFunction(
    functionId: DflowId,
    args: DflowArray,
  ): DflowValue | undefined;
  /**
   * @throws DflowErrorItemNotFound
   */
  getEdgeById(id: DflowId): DflowEdge;
  /**
   * @throws DflowErrorItemNotFound
   */
  getNodeById(id: DflowId): DflowNode;
  newNode(obj: DflowNewNode): DflowNode;
  /**
   * @throws DflowErrorItemNotFound
   */
  newEdge(obj: DflowNewEdge): DflowEdge;
  toObject(): DflowSerializableGraph;
  run(): Promise<void>;
}
export declare class DflowNodeUnknown extends DflowNode {
}
declare const dflowErrors: readonly [
  "CannotConnectPins",
  "InvalidInputData",
  "ItemNotFound",
];
declare type DflowErrorName = typeof dflowErrors[number];
/**
 * DflowError is an abstract class extending Error.
 * Its message is a JSON string.
 */
export declare class DflowError extends Error {
  constructor(arg: DflowObject, errorName: DflowErrorName);
}
export declare type DflowSerializableErrorCannotConnectPins = {
  source: DflowSerializableOutput;
  target: DflowSerializableInput;
};
export declare class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg: DflowSerializableErrorCannotConnectPins);
}
export declare type DflowSerializableErrorInvalidInputData = {
  nodeId: DflowSerializableNode["id"];
};
export declare class DflowErrorInvalidInputData extends DflowError {
  constructor(arg: DflowSerializableErrorInvalidInputData);
}
export declare type DflowSerializableErrorItemNotFound = {
  kind: DflowItemKind;
  id?: DflowId;
  nodeId?: DflowId;
  position?: number;
};
export declare class DflowErrorItemNotFound extends DflowError {
  constructor(arg: DflowSerializableErrorItemNotFound);
}
export {};
