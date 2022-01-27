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
export declare type DflowPinType = "string" | "number" | "boolean" | "null" | "object" | "array" | "DflowId" | "DflowGraph" | "DflowType";
export declare type DflowRunStatus = "waiting" | "success" | "failure";
export declare type DflowObject = {
    [Key in string]?: DflowValue;
};
export declare type DflowArray = Array<DflowValue>;
export declare type DflowValue = string | number | boolean | null | undefined | DflowArray | DflowObject | DflowSerializedGraph;
export declare type DflowNodesCatalog = Record<DflowNode["kind"], typeof DflowNode>;
export declare type DflowSerializedItem = {
    id: DflowId;
    name?: string;
};
export declare type DflowSerializedNode = DflowSerializedItem & Pick<DflowNode, "kind"> & {
    inputs?: DflowSerializedInput[];
    outputs?: DflowSerializedOutput[];
};
export declare type DflowSerializedPin = DflowSerializedItem & {
    types?: DflowPinType[];
};
export declare type DflowSerializedInput = DflowSerializedPin;
export declare type DflowSerializedOutput = DflowSerializedPin & {
    data?: DflowValue;
};
export declare type DflowSerializedPinPath = [nodeId: DflowId, pinId: DflowId];
export declare type DflowSerializedEdge = DflowSerializedItem & {
    source: DflowSerializedPinPath;
    target: DflowSerializedPinPath;
};
export declare type DflowSerializedGraph = DflowSerializedItem & {
    nodes: DflowSerializedNode[];
    edges: DflowSerializedEdge[];
};
export declare type DflowNewGraph = DflowNewItem<DflowSerializedGraph>;
export declare type DflowNewEdge = DflowNewItem<DflowSerializedEdge>;
export declare type DflowNewInput = DflowNewItem<DflowSerializedInput>;
export declare type DflowNewOutput = DflowNewItem<DflowSerializedOutput>;
export declare type DflowNewNode = DflowNewItem<DflowSerializedNode>;
export declare type DflowNodeConnections = {
    sourceId: DflowId;
    targetId: DflowId;
}[];
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
    static isDflowItem({ id, name }: DflowSerializedItem): boolean;
    constructor({ id, name }: DflowSerializedPin);
    toJSON(): string;
    toObject(): DflowSerializedItem;
}
export declare class DflowPin extends DflowItem {
    readonly kind: DflowPinKind;
    readonly types: DflowPinType[];
    static types: string[];
    static isDflowPin({ types, ...item }: DflowSerializedPin): boolean;
    static isDflowPinType(pinType: DflowPinType): void;
    constructor(kind: DflowPinKind, { types, ...pin }: DflowSerializedPin);
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
    static isDflowInput({ id, types }: DflowSerializedInput): boolean;
    constructor(pin: DflowSerializedInput);
    get data(): DflowValue;
    get isConnected(): boolean;
    connectTo(pin: DflowOutput): void;
    disconnect(): void;
    toObject(): DflowSerializedInput;
}
export declare class DflowOutput extends DflowPin {
    #private;
    static isDflowOutput({ id, data, types }: DflowSerializedOutput): boolean;
    constructor({ data, ...pin }: DflowSerializedOutput);
    clear(): void;
    get data(): DflowValue;
    set data(data: DflowValue);
    toObject(): DflowSerializedOutput;
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
        name?: string | undefined;
        types?: DflowPinType[] | undefined;
    }[];
    static generateOutputIds(pins?: DflowNewOutput[]): {
        id: string;
        data?: DflowValue;
        name?: string | undefined;
        types?: DflowPinType[] | undefined;
    }[];
    static in(types?: DflowPinType[], rest?: Omit<DflowNewInput, "types">): DflowNewInput[];
    static ins(num: number, types?: DflowPinType[]): DflowNewOutput[];
    static out(types?: DflowPinType[], rest?: Omit<DflowNewOutput, "types">): DflowNewOutput[];
    static outs(num: number, types?: DflowPinType[]): DflowNewOutput[];
    static outputNumber(obj: Omit<DflowNewOutput, "types">): DflowNewOutput;
    static isDflowNode({ kind, inputs, outputs, ...item }: DflowSerializedNode): boolean;
    constructor({ kind, inputs, outputs, ...item }: DflowSerializedNode, host: DflowHost, { isAsync, isConstant, label }?: DflowNodeMetadata);
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
    toObject(): DflowSerializedNode;
}
export declare class DflowUnknownNode extends DflowNode {
    static kind: string;
    constructor(obj: DflowSerializedNode, host: DflowHost);
    run(): void;
}
export declare class DflowEdge extends DflowItem {
    readonly source: DflowSerializedPinPath;
    readonly target: DflowSerializedPinPath;
    static isDflowEdge({ source, target, ...item }: DflowSerializedEdge, graph: DflowSerializedGraph): false | DflowSerializedNode | undefined;
    constructor({ source, target, ...item }: DflowSerializedEdge);
    toObject(): DflowSerializedEdge;
}
export declare class DflowGraph extends DflowItem {
    #private;
    static isDflowGraph(graph: DflowSerializedGraph): boolean;
    static childrenOfNodeId(nodeId: DflowId, nodeConnections: {
        sourceId: DflowId;
        targetId: DflowId;
    }[]): string[];
    static parentsOfNodeId(nodeId: DflowId, nodeConnections: {
        sourceId: DflowId;
        targetId: DflowId;
    }[]): string[];
    static levelOfNodeId(nodeId: DflowId, nodeConnections: DflowNodeConnections): number;
    static ancestorsOfNodeId(nodeId: DflowId, nodeConnections: DflowNodeConnections): DflowId[];
    static sort(nodeIds: DflowId[], nodeConnections: DflowNodeConnections): DflowId[];
    get edges(): IterableIterator<DflowEdge>;
    get nodes(): IterableIterator<DflowNode>;
    get nodeConnections(): DflowNodeConnections;
    get edgeIds(): string[];
    get nodeIds(): string[];
    get numEdges(): number;
    get numNodes(): number;
    get runStatusIsSuccess(): boolean;
    get runStatusIsWaiting(): boolean;
    get runStatusIsFailure(): boolean;
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
    toObject(): DflowSerializedGraph;
}
export declare class DflowHost {
    #private;
    constructor(nodesCatalog?: DflowNodesCatalog);
    get edges(): IterableIterator<DflowEdge>;
    get nodes(): IterableIterator<DflowNode>;
    get numEdges(): number;
    get numNodes(): number;
    get nodeKinds(): string[];
    get runStatusIsSuccess(): boolean;
    get runStatusIsWaiting(): boolean;
    get runStatusIsFailure(): boolean;
    clearGraph(): void;
    connect(sourceNode: DflowNode, sourcePosition?: number): {
        to: (targetNode: DflowNode, targetPosition?: number) => void;
    };
    deleteEdge(edgeId: DflowId): void;
    deleteNode(nodeId: DflowId): void;
    deleteEdgesConnectedToPin([nodeId, pinId]: DflowSerializedPinPath): void;
    executeFunction(functionId: DflowId, args: DflowArray): DflowValue;
    getEdgeById(edgeId: DflowId): DflowEdge;
    getNodeById(nodeId: DflowId): DflowNode;
    newNode(obj: DflowNewNode): DflowNode;
    newEdge(obj: DflowNewEdge): DflowEdge;
    newInput(nodeId: DflowId, obj: DflowNewInput): DflowInput;
    newOutput(nodeId: DflowId, obj: DflowNewOutput): DflowOutput;
    toJSON(): string;
    toObject(): DflowSerializedGraph;
    run(): Promise<void>;
}
export const catalog: DflowNodesCatalog;
