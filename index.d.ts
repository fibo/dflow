export declare type DflowId = string;
export declare type DflowNewItem<Item> = Omit<Item, "id"> & {
  id?: DflowId;
};
export declare type DflowNodeMetadata = {
  label?: string;
  isAsync?: boolean;
  isConstant?: boolean;
};
export declare type DflowPinKind = "input" | "output";
export declare type DflowPinType =
  | "string"
  | "number"
  | "boolean"
  | "null"
  | "object"
  | "array"
  | "DflowId"
  | "DflowGraph"
  | "DflowType";
export declare type DflowRunStatus = "waiting" | "success" | "failure";
declare type DflowExecutionNodeInfo = Pick<
  DflowSerializableNode,
  "id" | "kind" | "outputs"
>;
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
  | null
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
export declare type DflowNewNode = DflowNewItem<DflowSerializableNode>;
export declare type DflowNodeConnections = {
  sourceId: DflowId;
  targetId: DflowId;
}[];
declare type DflowRunOptions = {
  verbose: boolean;
};
export declare class DflowData {
  static isArray(data: DflowValue): boolean;
  static isBoolean(data: DflowValue): boolean;
  static isDflowGraph(data: DflowValue): boolean;
  static isDflowId(data: DflowValue): boolean;
  static isDflowType(data: DflowValue): boolean;
  static isObject(data: DflowValue): boolean;
  static isNull(data: DflowValue): boolean;
  static isNumber(data: DflowValue): boolean;
  static isString(data: DflowValue): boolean;
  static isStringNotEmpty(data: DflowValue): boolean;
  static isUndefined(data: DflowValue): boolean;
  static validate(data: DflowValue, types: DflowPinType[]): boolean;
}
export declare class DflowItem {
  readonly id: DflowId;
  name?: string;
  static isDflowItem({ id, name }: DflowSerializableItem): boolean;
  constructor({ id, name }: DflowSerializablePin);
  toObject(): DflowSerializableItem;
}
export declare class DflowPin extends DflowItem {
  readonly kind: DflowPinKind;
  readonly types: DflowPinType[];
  static types: string[];
  static isDflowPin({ types, ...item }: DflowSerializablePin): boolean;
  static isDflowPinType(pinType: DflowPinType): void;
  constructor(kind: DflowPinKind, { types, ...pin }: DflowSerializablePin);
  get hasTypeAny(): boolean;
  get hasTypeDflowId(): boolean;
  get hasTypeDflowGraph(): boolean;
  get hasTypeDflowType(): boolean;
  get hasTypeString(): boolean;
  get hasTypeNumber(): boolean;
  get hasTypeBoolean(): boolean;
  get hasTypeNull(): boolean;
  get hasTypeObject(): boolean;
  get hasTypeArray(): boolean;
  addType(pinType: DflowPinType): void;
  removeType(pinType: DflowPinType): void;
}
export declare class DflowInput extends DflowPin {
  #private;
  static isDflowInput({ id, types }: DflowSerializableInput): boolean;
  constructor({ optional, ...pin }: DflowSerializableInput);
  get data(): DflowValue;
  get isConnected(): boolean;
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
  set data(data: DflowValue);
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
  static label?: DflowNodeMetadata["label"];
  static inputs?: DflowNewInput[];
  static outputs?: DflowNewOutput[];
  static generateInputIds(pins?: DflowNewInput[]): {
    id: string;
    optional?: boolean | undefined;
    name?: string | undefined;
    types?: DflowPinType[] | undefined;
  }[];
  static generateOutputIds(pins?: DflowNewOutput[]): {
    id: string;
    data?: DflowValue;
    name?: string | undefined;
    types?: DflowPinType[] | undefined;
  }[];
  static in(
    types?: DflowPinType[],
    rest?: Omit<DflowNewInput, "types">,
  ): DflowNewInput[];
  static ins(num: number, types?: DflowPinType[]): DflowNewOutput[];
  static out(
    types?: DflowPinType[],
    rest?: Omit<DflowNewOutput, "types">,
  ): DflowNewOutput[];
  static outs(num: number, types?: DflowPinType[]): DflowNewOutput[];
  static outputNumber(obj: Omit<DflowNewOutput, "types">): DflowNewOutput;
  static isDflowNode(
    { kind, inputs, outputs, ...item }: DflowSerializableNode,
  ): boolean;
  constructor(
    { kind, inputs, outputs, ...item }: DflowSerializableNode,
    host: DflowHost,
    { isAsync, isConstant, label }?: DflowNodeMetadata,
  );
  get label(): string;
  get inputs(): IterableIterator<DflowInput>;
  get outputs(): IterableIterator<DflowOutput>;
  get numInputs(): number;
  get numOutputs(): number;
  generateInputId(i?: number): DflowId;
  generateOutputId(i?: number): DflowId;
  getInputById(pinId: DflowId): DflowInput;
  input(position: number): DflowInput;
  getOutputById(pinId: DflowId): DflowOutput;
  output(position: number): DflowOutput;
  deleteInput(pinId: DflowId): void;
  deleteOutput(pinId: DflowId): void;
  /**
     The `onBeforeConnectInput()` method is a hook run just before edge creation
     when a node output is connected to another node input.
     */
  onBeforeConnectInput(_sourceNode: DflowNode, _sourcePosition: number): void;
  /**
     The `onCreate()` method is a hook run after node instance is created.
     */
  onCreate(): void;
  newInput(obj: DflowNewInput): DflowInput;
  newOutput(obj: DflowNewOutput): DflowOutput;
  run(): void;
  toObject(): DflowSerializableNode;
}
export declare class DflowUnknownNode extends DflowNode {
  static kind: string;
  constructor(obj: DflowSerializableNode, host: DflowHost);
  run(): void;
}
export declare class DflowEdge extends DflowItem {
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;
  static isDflowEdge(
    { source, target, ...item }: DflowSerializableEdge,
    graph: DflowSerializableGraph,
  ): false | DflowSerializableNode | undefined;
  constructor({ source, target, ...item }: DflowSerializableEdge);
  toObject(): DflowSerializableEdge;
}
export declare class DflowGraph extends DflowItem {
  #private;
  runOptions: DflowRunOptions;
  runStatus: DflowRunStatus | null;
  executionReport: DflowExecutionReport | null;
  static isDflowGraph(graph: DflowSerializableGraph): boolean;
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
    nodeConnections: DflowNodeConnections,
  ): number;
  static ancestorsOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnections,
  ): DflowId[];
  static sort(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnections,
  ): DflowId[];
  get edges(): IterableIterator<DflowEdge>;
  get nodes(): IterableIterator<DflowNode>;
  get nodeConnections(): DflowNodeConnections;
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
export const catalog: DflowNodesCatalog;
