export declare type DflowId = string;
export declare type DflowNodeMetadata = {
  isAsync: boolean;
};
export declare type DflowDataType =
  | "array"
  | "boolean"
  | "number"
  | "object"
  | "string"
  | "DflowId";
export declare type DflowPinKind = "input" | "output";
export declare type DflowRunStatus = "waiting" | "success" | "failure";
declare type DflowExecutionNodeInfo =
  & Pick<DflowSerializableNode, "id" | "kind" | "outputs">
  & {
    error?: string;
  };
export declare type DflowExecutionReport = {
  status: DflowRunStatus;
  start: Date;
  end?: Date;
  steps?: DflowExecutionNodeInfo[];
};
export declare type DflowObject = {
  [Key in string]?: DflowValue;
};
export declare type DflowArray = Array<DflowValue>;
export declare type DflowValue =
  | string
  | number
  | boolean
  | undefined
  | DflowArray
  | DflowObject;
export declare type DflowNodesCatalog = Record<
  DflowNode["kind"],
  typeof DflowNode
>;
export declare type DflowSerializableItem = {
  id: DflowId;
};
export declare type DflowSerializablePin =
  & DflowSerializableItem
  & Partial<Pick<DflowPin, "name">>;
export declare type DflowSerializableInput = DflowSerializablePin;
export declare type DflowSerializableOutput =
  & DflowSerializablePin
  & Partial<Pick<DflowOutput, "data">>;
export declare type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };
export declare type DflowSerializablePinPath = [
  nodeId: DflowId,
  pinId: DflowId,
];
export declare type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};
export declare type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};
declare type DflowNodeConnection = {
  sourceId: DflowId;
  targetId: DflowId;
};
declare type DflowPinDefinition =
  & Pick<DflowPin, "types">
  & Partial<Pick<DflowPin, "id" | "name">>;
declare type DflowInputDefinition =
  & DflowPinDefinition
  & Partial<Pick<DflowInput, "optional" | "multi">>;
declare type DflowOutputDefinition = DflowPinDefinition & {
  data?: DflowValue;
};
declare type DflowItemConstructorArg = DflowSerializableItem;
declare type DflowPinConstructorArg =
  & DflowItemConstructorArg
  & Partial<Pick<DflowPin, "name" | "types">>;
declare type DflowInputConstructorArg =
  & DflowPinConstructorArg
  & Pick<DflowInputDefinition, "optional" | "multi">;
declare type DflowOutputConstructorArg = DflowPinConstructorArg & {
  data?: DflowValue;
};
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
export declare type DflowNodeConstructorArg = {
  node: DflowSerializableNode;
  host: DflowHost;
};
declare type DflowGraphConstructorArg = {
  nodesCatalog?: DflowNodesCatalog;
};
export declare type DflowHostConstructorArg = DflowGraphConstructorArg;
declare type DflowRunOptions = {
  verbose: boolean;
};
declare type DflowItemKind = DflowPinKind | "node" | "edge";
export declare type DflowSerializableErrorCannotConnectPins = {
  source: DflowSerializableOutput;
  target: DflowSerializableInput;
};
export declare type DflowSerializableErrorItemNotFound = {
  kind: DflowItemKind;
  id?: DflowId;
  nodeId?: DflowId;
  position?: number;
};
/**
 * DflowError is an abstract class extending Error.
 * Its message is a JSON string.
 */
export declare class DflowError extends Error {
  constructor(arg: DflowObject, errorClassName: string);
}
export declare class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg: DflowSerializableErrorCannotConnectPins);
}
export declare class DflowErrorItemNotFound extends DflowError {
  constructor(arg: DflowSerializableErrorItemNotFound);
}
export declare class DflowData {
  static types: DflowDataType[];
  static isArray(data: unknown): data is DflowArray;
  static isBoolean(data: unknown): data is boolean;
  static isDflowId(data: unknown): data is DflowId;
  static isObject(data: unknown): data is DflowObject;
  static isNumber(data: unknown): data is number;
  static isString(data: unknown): data is string;
  static isDflowData(data: unknown): boolean;
  static isValidDataType(types: DflowDataType[], data: unknown): boolean;
}
export declare class DflowItem {
  readonly id: DflowId;
  constructor({ id }: DflowItemConstructorArg);
  toObject(): DflowSerializableItem;
}
export declare class DflowPin extends DflowItem {
  readonly name?: string;
  readonly types: DflowDataType[];
  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ): boolean;
  constructor({ id, name, types }: DflowPinConstructorArg);
  get hasTypeAny(): boolean;
  hasType(type: DflowDataType): boolean;
}
export declare class DflowInput extends DflowPin {
  #private;
  multi?: boolean;
  optional?: boolean;
  constructor({ multi, optional, ...pin }: DflowInputConstructorArg);
  get data(): DflowValue;
  get isConnected(): boolean;
  connectTo(pin: DflowOutput): void;
  disconnect(): void;
  toObject(): DflowSerializableInput;
}
export declare class DflowOutput extends DflowPin {
  #private;
  constructor({ data, ...pin }: DflowOutputConstructorArg);
  clear(): void;
  get data(): DflowValue;
  set data(data: unknown);
  toObject(): DflowSerializableOutput;
}
export declare class DflowNode extends DflowItem {
  #private;
  readonly kind: string;
  readonly host: DflowHost;
  static kind: string;
  static isAsync?: DflowNodeMetadata["isAsync"];
  static inputs?: DflowInputDefinition[];
  static outputs?: DflowOutputDefinition[];
  constructor(
    { node: { kind, inputs, outputs, ...item }, host }: DflowNodeConstructorArg,
  );
  static input(
    typing?: DflowDataType | DflowDataType[],
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition;
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
export declare class DflowEdge extends DflowItem {
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;
  constructor({ source, target, ...item }: DflowSerializableEdge);
  toObject(): DflowSerializableEdge;
}
export declare class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;
  readonly nodes: Map<DflowId, DflowNode>;
  readonly edges: Map<DflowId, DflowEdge>;
  runOptions: DflowRunOptions;
  runStatus: DflowRunStatus | null;
  executionReport: DflowExecutionReport | null;
  constructor({ nodesCatalog }?: DflowGraphConstructorArg);
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
export declare class DflowHost {
  #private;
  readonly context: Record<string, unknown>;
  constructor(arg?: DflowHostConstructorArg);
  get executionReport(): DflowExecutionReport | null;
  get edges(): DflowSerializableEdge[];
  get nodes(): DflowSerializableNode[];
  get nodesCatalog(): DflowNodesCatalog;
  get runStatusIsSuccess(): boolean;
  get runStatusIsWaiting(): boolean;
  get runStatusIsFailure(): boolean;
  set verbose(option: DflowRunOptions["verbose"]);
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
  getEdgeById(id: DflowId): DflowEdge | undefined;
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
export {};
