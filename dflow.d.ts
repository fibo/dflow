export declare type DflowId = string;
export declare type DflowNewItem<Item> = Omit<Item, "id"> & {
  id?: DflowId;
};
export declare type DflowNodeMetadata = {
  isAsync?: boolean;
  isConstant?: boolean;
};
export declare type DflowPinKind = "input" | "output";
export declare type DflowPinType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "DflowId";
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
  | DflowObject
  | DflowSerializableGraph;
export declare type DflowNodesCatalog = Record<
  DflowNode["kind"],
  typeof DflowNode
>;
export declare type DflowSerializableItem = {
  id: DflowId;
  name?: string;
};
export declare type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };
export declare type DflowSerializablePin = DflowSerializableItem & {
  types?: DflowPinType[];
};
export declare type DflowSerializableInput = DflowSerializablePin & {
  multi?: boolean;
  optional?: boolean;
};
export declare type DflowSerializableOutput = DflowSerializablePin & {
  data?: DflowValue;
};
export declare type DflowSerializablePinPath = [
  nodeId: DflowId,
  pinId: DflowId,
];
export declare type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};
export declare type DflowSerializableGraph = DflowSerializableItem & {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};
export declare type DflowNewGraph = DflowNewItem<DflowSerializableGraph>;
export declare type DflowNewEdge = DflowNewItem<DflowSerializableEdge>;
export declare type DflowNewInput = DflowNewItem<DflowSerializableInput>;
export declare type DflowNewOutput = DflowNewItem<DflowSerializableOutput>;
export declare type DflowNewNode =
  & Omit<DflowNewItem<DflowSerializableNode>, "inputs" | "outputs">
  & {
    inputs?: DflowNewInput[];
    outputs?: DflowNewOutput[];
  };
export declare type DflowNodeConnection = {
  sourceId: DflowId;
  targetId: DflowId;
};
declare type DflowRunOptions = {
  verbose: boolean;
};
export declare class DflowData {
  static isArray(data: unknown): data is DflowArray;
  static isBoolean(data: unknown): data is boolean;
  static isDflowId(data: unknown): data is DflowId;
  static isObject(data: unknown): data is DflowObject;
  static isNumber(data: unknown): data is number;
  static isString(data: unknown): data is string;
  static isStringNotEmpty(data: unknown): boolean;
  static validate(data: unknown, types: DflowPinType[]): boolean;
}
export declare class DflowItem {
  readonly id: DflowId;
  name?: string;
  static isDflowItem(item: unknown): item is DflowSerializableItem;
  constructor({ id, name }: DflowSerializablePin);
  toObject(): DflowSerializableItem;
}
export declare class DflowPin extends DflowItem {
  readonly kind: DflowPinKind;
  readonly types: DflowPinType[];
  static types: string[];
  static isDflowPin(pin: unknown): pin is DflowSerializablePin;
  static isDflowPinType(type: unknown): type is DflowPinType;
  static isDflowPinTypes(types: unknown): types is DflowPinType[];
  constructor(kind: DflowPinKind, { types, ...pin }: DflowSerializablePin);
  get hasTypeAny(): boolean;
  hasType(type: DflowPinType): boolean;
  toObject(): DflowSerializablePin;
}
export declare class DflowInput extends DflowPin {
  #private;
  static isDflowInput(item: unknown): item is DflowSerializableInput;
  constructor({ multi, optional, ...pin }: DflowSerializableInput);
  get data(): DflowValue;
  get isConnected(): boolean;
  get isMulti(): boolean | undefined;
  get isOptional(): boolean | undefined;
  connectTo(pin: DflowOutput): void;
  disconnect(): void;
  toObject(): DflowSerializableInput;
}
export declare class DflowOutput extends DflowPin {
  #private;
  static isDflowOutput({ id, data, types }: DflowSerializableOutput): boolean;
  constructor({ data, ...pin }: DflowSerializableOutput);
  clear(): void;
  get data(): DflowValue;
  set data(data: unknown);
  toObject(): DflowSerializableOutput;
}
export declare class DflowNode extends DflowItem {
  #private;
  readonly kind: string;
  readonly meta: DflowNodeMetadata;
  readonly host: DflowHost;
  static kind: string;
  static isAsync?: DflowNodeMetadata["isAsync"];
  static isConstant?: DflowNodeMetadata["isConstant"];
  static inputs?: DflowNewInput[];
  static outputs?: DflowNewOutput[];
  static input(
    typing?: DflowPinType | DflowPinType[],
    rest?: Omit<DflowNewInput, "types">,
  ): DflowNewInput;
  static output(
    typing?: DflowPinType | DflowPinType[],
    rest?: Omit<DflowNewOutput, "types">,
  ): DflowNewOutput;
  /**
   * @deprecated Use DflowNode.input
   */
  static in(
    types?: DflowPinType[],
    rest?: Omit<DflowNewInput, "types">,
  ): DflowNewInput[];
  /**
   * @deprecated use DflowNode.output
   */
  static out(
    types?: DflowPinType[],
    rest?: Omit<DflowNewOutput, "types">,
  ): DflowNewOutput[];
  static isDflowNode(node: unknown): node is DflowSerializableNode;
  constructor(
    { kind, inputs, outputs, ...item }: DflowSerializableNode,
    host: DflowHost,
    { isAsync, isConstant }?: DflowNodeMetadata,
  );
  get inputs(): IterableIterator<DflowInput>;
  get outputs(): IterableIterator<DflowOutput>;
  get numInputs(): number;
  get numOutputs(): number;
  clearOutputs(): void;
  getInputById(pinId: DflowId): DflowInput;
  input(position: number): DflowInput;
  getOutputById(pinId: DflowId): DflowOutput;
  output(position: number): DflowOutput;
  deleteInput(pinId: DflowId): void;
  deleteOutput(pinId: DflowId): void;
  newInput(obj: DflowNewInput): DflowInput;
  newOutput(obj: DflowNewOutput): DflowOutput;
  run(): void;
  toObject(): DflowSerializableNode;
}
export declare class DflowEdge extends DflowItem {
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;
  static isDflowEdge(edge: unknown): edge is DflowSerializableEdge;
  constructor({ source, target, ...item }: DflowSerializableEdge);
  toObject(): DflowSerializableEdge;
}
export declare class DflowGraph extends DflowItem {
  #private;
  runOptions: DflowRunOptions;
  runStatus: DflowRunStatus | null;
  executionReport: DflowExecutionReport | null;
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
  /**
   * Sort nodes by their level.
   */
  static sort(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[];
  get edges(): IterableIterator<DflowEdge>;
  get nodes(): IterableIterator<DflowNode>;
  get nodeConnections(): DflowNodeConnection[];
  get edgeIds(): string[];
  get nodeIds(): string[];
  get numEdges(): number;
  get numNodes(): number;
  addEdge(edge: DflowEdge): void;
  addNode(node: DflowNode): void;
  clear(): void;
  deleteEdge(edgeId: DflowId): void;
  deleteNode(nodeId: DflowId): void;
  getNodeById(nodeId: DflowId): DflowNode;
  getEdgeById(edgeId: DflowId): DflowEdge;
  generateEdgeId(i?: number): DflowId;
  generateNodeId(i?: number): DflowId;
  nodeIdsInsideFunctions(): string[];
  run(): Promise<void>;
  toObject(): DflowSerializableGraph;
}
export declare class DflowHost {
  #private;
  readonly nodesCatalog: DflowNodesCatalog;
  readonly context: Record<string, unknown>;
  constructor(nodesCatalog?: DflowNodesCatalog);
  get executionReport(): DflowExecutionReport | null;
  get edges(): IterableIterator<DflowEdge>;
  get nodes(): IterableIterator<DflowNode>;
  get numEdges(): number;
  get numNodes(): number;
  get nodeKinds(): string[];
  get runStatusIsSuccess(): boolean;
  get runStatusIsWaiting(): boolean;
  get runStatusIsFailure(): boolean;
  set verbose(option: DflowRunOptions["verbose"]);
  clearGraph(): void;
  connect(sourceNode: DflowNode, sourcePosition?: number): {
    to: (targetNode: DflowNode, targetPosition?: number) => void;
  };
  deleteEdge(edgeId: DflowId): void;
  deleteNode(nodeId: DflowId): void;
  deleteEdgesConnectedToPin([nodeId, pinId]: DflowSerializablePinPath): void;
  executeFunction(functionId: DflowId, args: DflowArray): DflowValue;
  getEdgeById(edgeId: DflowId): DflowEdge;
  getNodeById(nodeId: DflowId): DflowNode;
  newNode(obj: DflowNewNode): DflowNode;
  newEdge(obj: DflowNewEdge): DflowEdge;
  newInput(nodeId: DflowId, obj: DflowNewInput): DflowInput;
  newOutput(nodeId: DflowId, obj: DflowNewOutput): DflowOutput;
  toObject(): DflowSerializableGraph;
  run(): Promise<void>;
}
export {};
