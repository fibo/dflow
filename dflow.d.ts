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
interface DflowItem<Serializable> {
  readonly id: DflowId;
  toObject(): Serializable;
}
export declare type DflowValue =
  | string
  | number
  | boolean
  | undefined
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
  constructor({ name, types }: DflowPinConstructorArg);
  readonly name?: string;
  readonly types: DflowDataType[];
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ): boolean;
  get hasTypeAny(): boolean;
  hasType(type: DflowDataType): boolean;
}
declare type DflowInputDefinition =
  & DflowPinDefinition
  & Partial<Pick<DflowInput, "optional" | "multi">>;
declare type DflowInputConstructorArg =
  & DflowItemConstructorArg
  & DflowPinConstructorArg
  & Pick<DflowInputDefinition, "optional" | "multi">;
export declare type DflowSerializableInput = DflowSerializablePin;
export declare class DflowInput extends DflowPin
  implements DflowItem<DflowSerializableInput> {
  #private;
  readonly id: DflowId;
  multi?: boolean;
  optional?: boolean;
  constructor({ id, multi, optional, ...pin }: DflowInputConstructorArg);
  get data(): DflowValue;
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
export declare class DflowOutput extends DflowPin
  implements DflowItem<DflowSerializableOutput> {
  #private;
  readonly id: DflowId;
  constructor({ id, data, ...pin }: DflowOutputConstructorArg);
  get data(): DflowValue;
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
export declare type DflowNodeConstructorArg = {
  node: DflowSerializableNode;
  host: DflowHost;
};
export declare class DflowNode implements DflowItem<DflowSerializableNode> {
  #private;
  readonly id: DflowId;
  readonly kind: string;
  readonly host: DflowHost;
  constructor(
    { node: { id, kind, inputs, outputs }, host }: DflowNodeConstructorArg,
  );
  /**
   * DflowInputDefinition helper.
   */
  static input(
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition;
  /**
   * DflowOutputDefinition helper.
   */
  static output(
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition;
  get inputs(): IterableIterator<DflowInput>;
  get outputs(): IterableIterator<DflowOutput>;
  clearOutputs(): void;
  /**
   * @throws DflowErrorItemNotFound
   */
  getInputById(id: DflowId): DflowInput;
  /**
   * @throws DflowErrorItemNotFound
   */
  input(position: number): DflowInput;
  /**
   * @throws DflowErrorItemNotFound
   */
  getOutputById(id: DflowId): DflowOutput;
  /**
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
export declare class DflowEdge implements DflowItem<DflowSerializableEdge> {
  readonly id: DflowId;
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;
  constructor({ source, target, id }: DflowEdgeConstructorArg);
  toObject(): DflowSerializableEdge;
}
interface DflowNodeImplementation {
  new (arg: DflowNodeConstructorArg): DflowNode;
  kind: DflowNode["kind"];
  inputs?: DflowInputDefinition[];
  outputs?: DflowOutputDefinition[];
}
export declare type DflowNodesCatalog = Record<
  DflowNode["kind"],
  DflowNodeImplementation
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
export declare class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;
  readonly nodes: Map<DflowId, DflowNode>;
  readonly edges: Map<DflowId, DflowEdge>;
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
  run(): Promise<void>;
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
  executeFunction(functionId: DflowId, args: DflowArray): DflowValue;
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
/**
 * DflowError is an abstract class extending Error.
 * Its message is a JSON string.
 */
export declare class DflowError extends Error {
  constructor(arg: DflowObject, errorClassName: string);
}
export declare type DflowSerializableErrorCannotConnectPins = {
  source: DflowSerializableOutput;
  target: DflowSerializableInput;
};
export declare class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg: DflowSerializableErrorCannotConnectPins);
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
