export type DflowId = string;

export type DflowNodeMetadata = {
  isAsync: boolean;
  isConstant: boolean;
};

export type DflowDataType =
  | "array"
  | "boolean"
  | "number"
  | "object"
  | "string"
  | "DflowId";

export type DflowPinKind = "input" | "output";

export type DflowRunStatus = "waiting" | "success" | "failure";

type DflowExecutionNodeInfo =
  & Pick<
    DflowSerializableNode,
    "id" | "kind" | "outputs"
  >
  & { error?: string };

export type DflowExecutionReport = {
  status: DflowRunStatus;
  start: Date;
  end?: Date;
  steps?: DflowExecutionNodeInfo[];
};

export type DflowObject = { [Key in string]?: DflowValue };
export type DflowArray = Array<DflowValue>;
export type DflowValue =
  | string
  | number
  | boolean
  | undefined
  | DflowArray
  | DflowObject;

export type DflowNodesCatalog = Record<DflowNode["kind"], typeof DflowNode>;

export type DflowSerializableItem = {
  id: DflowId;
};

export type DflowSerializablePin =
  & DflowSerializableItem
  & Partial<Pick<DflowPin, "name">>;

export type DflowSerializableInput = DflowSerializablePin;

export type DflowSerializableOutput =
  & DflowSerializablePin
  & Partial<Pick<DflowOutput, "data">>;

export type DflowSerializableNode =
  & DflowSerializableItem
  & Pick<DflowNode, "kind">
  & {
    inputs?: DflowSerializableInput[];
    outputs?: DflowSerializableOutput[];
  };

export type DflowSerializablePinPath = [nodeId: DflowId, pinId: DflowId];

export type DflowSerializableEdge = DflowSerializableItem & {
  source: DflowSerializablePinPath;
  target: DflowSerializablePinPath;
};

export type DflowSerializableGraph = {
  nodes: DflowSerializableNode[];
  edges: DflowSerializableEdge[];
};

type DflowNodeConnection = { sourceId: DflowId; targetId: DflowId };

type DflowPinDefinition =
  & Pick<DflowPin, "types">
  & Partial<Pick<DflowPin, "id" | "name">>;

type DflowInputDefinition =
  & DflowPinDefinition
  & Partial<Pick<DflowInput, "optional" | "multi">>;

type DflowOutputDefinition = DflowPinDefinition & {
  data?: DflowValue;
};

type DflowItemConstructorArg = DflowSerializableItem;

type DflowPinConstructorArg =
  & DflowItemConstructorArg
  & Partial<Pick<DflowPin, "name" | "types">>;

type DflowInputConstructorArg =
  & DflowPinConstructorArg
  & Pick<DflowInputDefinition, "optional" | "multi">;

type DflowOutputConstructorArg = DflowPinConstructorArg & {
  data?: DflowValue;
};

type DflowNewItem = Partial<Pick<DflowSerializableItem, "id">>;
type DflowNewInput = DflowNewItem;
type DflowNewOutput =
  & DflowNewItem
  & Partial<Pick<DflowOutputConstructorArg, "data">>;
type DflowNewNode = DflowNewItem & Pick<DflowSerializableNode, "kind"> & {
  inputs?: DflowNewInput[];
  outputs?: DflowNewOutput[];
};
type DflowNewEdge =
  & DflowNewItem
  & Pick<DflowSerializableEdge, "source" | "target">;

export type DflowNodeConstructorArg = {
  node: DflowSerializableNode;
  host: DflowHost;
};

type DflowGraphConstructorArg = {
  nodesCatalog?: DflowNodesCatalog;
};

export type DflowHostConstructorArg = DflowGraphConstructorArg;

type DflowRunOptions = { verbose: boolean };

type DflowItemKind = DflowPinKind | "node" | "edge";

export type DflowSerializableErrorCannotConnectPins = {
  source: DflowSerializableOutput;
  target: DflowSerializableInput;
};

export type DflowSerializableErrorItemNotFound = {
  kind: DflowItemKind;
  id?: DflowId;
  nodeId?: DflowId;
  position?: number;
};

/**
 * DflowError is an abstract class extending Error.
 * Its message is a JSON string.
 */
export class DflowError extends Error {
  constructor(arg: DflowObject, errorClassName: string) {
    super(JSON.stringify({ error: errorClassName, ...arg }));
  }
}

export class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg: DflowSerializableErrorCannotConnectPins) {
    super(arg, "DflowErrorCannotConnectPins");
  }
}

export class DflowErrorItemNotFound extends DflowError {
  constructor(arg: DflowSerializableErrorItemNotFound) {
    super(arg, "DflowErrorItemNotFound");
  }
}

const _executionNodeInfo = (
  { id, kind, outputs }: DflowSerializableNode,
  error?: string,
): DflowExecutionNodeInfo => {
  const obj = {
    id,
    kind,
    outputs: outputs?.map(({ id, data, name }) => ({ id, data, name })),
  } as DflowExecutionNodeInfo;

  if (error) {
    obj.error = error;
  }

  return obj;
};

export class DflowData {
  static types: DflowDataType[] = [
    "string",
    "number",
    "boolean",
    "object",
    "array",
    "DflowId",
  ];

  static isArray(data: unknown): data is DflowArray {
    if (!Array.isArray(data)) return false;
    return true;
  }

  static isBoolean(data: unknown): data is boolean {
    return typeof data === "boolean";
  }

  static isDflowId(data: unknown): data is DflowId {
    return typeof data === "string" && data !== "";
  }

  static isObject(data: unknown): data is DflowObject {
    if (typeof data !== "object" || !data || Array.isArray(data)) return false;
    return true;
  }

  static isNumber(data: unknown): data is number {
    return typeof data === "number" && !isNaN(data);
  }

  static isString(data: unknown): data is string {
    return typeof data === "string";
  }

  static isDflowData(data: unknown) {
    if (typeof data === "undefined") return false;
    return (
      DflowData.isString(data) ||
      DflowData.isBoolean(data) ||
      DflowData.isNumber(data) ||
      DflowData.isObject(data) ||
      DflowData.isArray(data) ||
      DflowData.isDflowId(data)
    );
  }

  static isValidDataType(types: DflowDataType[], data: unknown) {
    if (types.length === 0) {
      return true;
    }

    return types.some((pinType) => {
      switch (pinType) {
        case "array":
          return DflowData.isArray(data);
        case "boolean":
          return DflowData.isBoolean(data);
        case "number":
          return DflowData.isNumber(data);
        case "object":
          return DflowData.isObject(data);
        case "string":
          return DflowData.isString(data);
        case "DflowId":
          return DflowData.isDflowId(data);
        default:
          return false;
      }
    }, true);
  }
}

export class DflowItem {
  readonly id: DflowId;

  constructor({ id }: DflowItemConstructorArg) {
    this.id = id;
  }

  toObject(): DflowSerializableItem {
    return { id: this.id };
  }
}

export class DflowPin extends DflowItem {
  readonly name?: string;
  readonly types: DflowDataType[];

  static canConnect(
    sourceTypes: DflowDataType[],
    targetTypes: DflowDataType[],
  ) {
    // Source can have any type,
    // DflowHost.run() will validate data.
    const sourceHasTypeAny = sourceTypes.length === 0;
    if (sourceHasTypeAny) return true;
    // Target can have any type,
    // DflowNode.run() will validate data.
    const targetHasTypeAny = targetTypes.length === 0;
    if (targetHasTypeAny) return true;
    // Target pin handles some of the type source can have,
    // DflowNode.run() will validate date.
    return targetTypes.some((pinType) => sourceTypes.includes(pinType));
  }

  constructor(
    { id, name, types = [] }: DflowPinConstructorArg,
  ) {
    super({ id });

    if (name) {
      this.name = name;
    }

    this.types = types;
  }

  get hasTypeAny() {
    return this.types.length === 0;
  }

  hasType(type: DflowDataType) {
    return this.hasTypeAny || this.types.includes(type);
  }
}

export class DflowInput extends DflowPin {
  multi?: boolean;
  optional?: boolean;
  #source?: DflowOutput;
  #sources?: Set<DflowOutput>;

  constructor({ multi, optional, ...pin }: DflowInputConstructorArg) {
    super(pin);

    if (multi) {
      this.multi = multi;
    }
    if (optional) {
      this.optional = optional;
    }
  }

  get data(): DflowValue {
    if (this.multi) {
      const sources = Array.from(this.#sources ?? []);
      return sources.length ? sources.map((output) => output.data) : undefined;
    } else {
      return this.#source?.data;
    }
  }

  get isConnected() {
    return this.multi
      ? ((Array.from(this.#sources ?? [])).length > 0)
      : typeof this.#source === "undefined";
  }

  connectTo(pin: DflowOutput) {
    const { types: targetTypes } = this;
    const { types: sourceTypes } = pin;

    const canConnect = DflowPin.canConnect(sourceTypes, targetTypes);

    if (!canConnect) {
      throw new DflowErrorCannotConnectPins({
        source: pin.toObject(),
        target: this.toObject(),
      });
    }

    if (this.multi) {
      if (!this.#sources) {
        this.#sources = new Set();
      }
      this.#sources.add(pin);
    } else {
      this.#source = pin;
    }
  }

  disconnect() {
    this.multi ? this.#sources?.clear() : this.#source = undefined;
  }

  toObject(): DflowSerializableInput {
    return super.toObject() as DflowSerializableInput;
  }
}

export class DflowOutput extends DflowPin {
  #data: DflowValue;

  constructor({ data, ...pin }: DflowOutputConstructorArg) {
    super(pin);

    this.#data = data;
  }

  clear() {
    this.#data = undefined;
  }

  get data(): DflowValue {
    return this.#data;
  }

  set data(data: unknown) {
    switch (true) {
      case typeof data === "undefined":
        this.clear();
        break;
      case this.hasTypeAny:
      case this.hasType("string") && DflowData.isString(data):
      case this.hasType("number") && DflowData.isNumber(data):
      case this.hasType("boolean") && DflowData.isBoolean(data):
      case this.hasType("object") && DflowData.isObject(data):
      case this.hasType("array") && DflowData.isArray(data):
      case this.hasType("DflowId") && DflowData.isDflowId(data): {
        this.#data = data as DflowValue;
        break;
      }
      default: {
        this.clear();
        break;
      }
    }
  }

  toObject(): DflowSerializableOutput {
    const obj = super.toObject() as DflowSerializableOutput;

    if (typeof this.#data !== "undefined") {
      obj.data = this.#data;
    }

    return obj;
  }
}

export class DflowNode extends DflowItem {
  readonly #inputs: Map<DflowId, DflowInput> = new Map();
  readonly #outputs: Map<DflowId, DflowOutput> = new Map();
  readonly #inputPosition: DflowId[] = [];
  readonly #outputPosition: DflowId[] = [];
  readonly kind: string;
  readonly host: DflowHost;

  static kind: string;
  static isAsync?: DflowNodeMetadata["isAsync"];
  static isConstant?: DflowNodeMetadata["isConstant"];
  static inputs?: DflowInputDefinition[];
  static outputs?: DflowOutputDefinition[];

  constructor(
    {
      node: { kind, inputs = [], outputs = [], ...item },
      host,
    }: DflowNodeConstructorArg,
  ) {
    super(item);

    this.kind = kind;
    this.host = host;

    // Inputs.

    const generateInputId = (i: number): DflowId => {
      const id = `i${i}`;
      return this.#inputs.has(id) ? generateInputId(i + 1) : id;
    };

    for (const obj of inputs) {
      const numInputs = this.#inputs.size;
      const id = DflowData.isDflowId(obj.id)
        ? obj.id
        : generateInputId(numInputs);
      const pin = new DflowInput({ ...obj, id });
      this.#inputs.set(id, pin);
      this.#inputPosition.push(id);
    }

    // Outputs.

    const generateOutputId = (i: number): DflowId => {
      const id = `o${i}`;
      return this.#outputs.has(id) ? generateOutputId(i + 1) : id;
    };

    for (const obj of outputs) {
      const numOutputs = this.#outputs.size;
      const id = DflowData.isDflowId(obj.id)
        ? obj.id
        : generateOutputId(numOutputs);
      const pin = new DflowOutput({ ...obj, id });
      this.#outputs.set(id, pin);
      this.#outputPosition.push(id);
    }
  }

  static input(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowInputDefinition, "types">,
  ): DflowInputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  static output(
    typing: DflowDataType | DflowDataType[] = [],
    rest?: Omit<DflowOutputDefinition, "types">,
  ): DflowOutputDefinition {
    return { types: typeof typing === "string" ? [typing] : typing, ...rest };
  }

  get inputs() {
    return this.#inputs.values();
  }

  get outputs() {
    return this.#outputs.values();
  }

  clearOutputs() {
    for (const output of this.outputs) {
      output.clear();
    }
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getInputById(id: DflowId): DflowInput {
    const item = this.#inputs.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({ kind: "input", id });
    }
    return item;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  input(position: number): DflowInput {
    const pinId = this.#inputPosition[position];

    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "input",
        nodeId: this.id,
        position,
      });
    }

    return this.getInputById(pinId);
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getOutputById(id: DflowId): DflowOutput {
    const item = this.#outputs.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({ kind: "output", id });
    }
    return item;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  output(position: number): DflowOutput {
    const pinId = this.#outputPosition[position];

    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "output",
        nodeId: this.id,
        position,
      });
    }

    return this.getOutputById(pinId);
  }

  run(): void | Promise<void> {}

  toObject(): DflowSerializableNode {
    const obj = {
      ...super.toObject(),
      kind: this.kind,
    } as DflowSerializableNode;

    const inputs = [];
    const outputs = [];

    for (const input of this.inputs) {
      inputs.push(input.toObject());
    }
    if (inputs.length > 0) {
      obj.inputs = inputs;
    }

    for (const output of this.outputs) {
      outputs.push(output.toObject());
    }
    if (outputs.length > 0) {
      obj.outputs = outputs;
    }

    return obj;
  }
}

export class DflowEdge extends DflowItem {
  readonly source: DflowSerializablePinPath;
  readonly target: DflowSerializablePinPath;

  constructor({ source, target, ...item }: DflowSerializableEdge) {
    super(item);

    this.source = source;
    this.target = target;
  }

  toObject(): DflowSerializableEdge {
    return {
      ...super.toObject(),
      source: this.source,
      target: this.target,
    };
  }
}

export class DflowGraph {
  readonly nodesCatalog: DflowNodesCatalog;
  readonly nodes: Map<DflowId, DflowNode> = new Map();
  readonly edges: Map<DflowId, DflowEdge> = new Map();
  runOptions: DflowRunOptions = { verbose: false };
  runStatus: DflowRunStatus | null = null;
  executionReport: DflowExecutionReport | null = null;

  constructor({ nodesCatalog = {} }: DflowGraphConstructorArg = {}) {
    this.nodesCatalog = { ...nodesCatalog, ...coreNodesCatalog };
  }

  static childrenOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ sourceId }) => nodeId === sourceId)
      .map(({ targetId }) => targetId);
  }

  static parentsOfNodeId(
    nodeId: DflowId,
    nodeConnections: { sourceId: DflowId; targetId: DflowId }[],
  ) {
    return nodeConnections
      .filter(({ targetId }) => nodeId === targetId)
      .map(({ sourceId }) => sourceId);
  }

  static levelOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ) {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    // 1. A node with no parent as level zero.
    if (parentsNodeIds.length === 0) {
      return 0;
    }

    // 2. Otherwise its level is the max level of its parents plus one.
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds) {
      const level = DflowGraph.levelOfNodeId(parentNodeId, nodeConnections);
      maxLevel = Math.max(level, maxLevel);
    }
    return maxLevel + 1;
  }

  static ancestorsOfNodeId(
    nodeId: DflowId,
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0) {
      return [];
    } else {
      return parentsNodeIds.reduce<DflowId[]>(
        (accumulator, parentNodeId, index, array) => {
          const ancestors = DflowGraph.ancestorsOfNodeId(
            parentNodeId,
            nodeConnections,
          );

          const result = accumulator.concat(ancestors);

          // On last iteration, remove duplicates
          return index === array.length - 1
            ? Array.from(new Set(array.concat(result)))
            : result;
        },
        [],
      );
    }
  }

  static sortNodesByLevel(
    nodeIds: DflowId[],
    nodeConnections: DflowNodeConnection[],
  ): DflowId[] {
    const levelOf: Record<DflowId, number> = {};

    for (const nodeId of nodeIds) {
      levelOf[nodeId] = DflowGraph.levelOfNodeId(nodeId, nodeConnections);
    }

    return nodeIds.slice().sort((a, b) => (levelOf[a] <= levelOf[b] ? -1 : 1));
  }

  get nodeConnections(): DflowNodeConnection[] {
    return [...this.edges.values()].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0],
    }));
  }

  get nodeIdsInsideFunctions(): DflowId[] {
    const ancestorsOfReturnNodes = [];

    // Find all "return" nodes and get their ancestors.
    for (const node of [...this.nodes.values()]) {
      if (node.kind === "return") {
        ancestorsOfReturnNodes.push(
          DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections),
        );
      }
    }

    // Flatten and deduplicate results.
    return Array.from(new Set(ancestorsOfReturnNodes.flat()));
  }

  async run() {
    const { verbose } = this.runOptions;

    // Set runStatus to waiting if there was some unhandled error in a previous run.
    this.runStatus = "waiting";

    this.executionReport = {
      status: this.runStatus,
      start: new Date(),
    };

    if (verbose) {
      this.executionReport.steps = [];
    }

    // Get nodeIds
    // 1. filtered by nodes inside functions
    // 2. sorted by graph hierarchy
    const nodeIdsExcluded = this.nodeIdsInsideFunctions;
    const nodeIds = DflowGraph.sortNodesByLevel(
      [...this.nodes.keys()].filter((nodeId) =>
        !nodeIdsExcluded.includes(nodeId)
      ),
      this.nodeConnections,
    );

    // Two nested loops:
    //   1. NODES_LOOP
    //   2. INPUTS_LOOP
    //
    // For every node loop over their inputs and validate data.

    // 1. NODES_LOOP
    // /////////////
    NODES_LOOP:
    for (const nodeId of nodeIds) {
      const node = this.nodes.get(nodeId) as DflowNode;

      const NodeClass = this.nodesCatalog[node.kind] ?? DflowNodeUnknown;
      const { isAsync, isConstant } = NodeClass;

      try {
        if (!isConstant) {
          // 2. INPUTS_LOOP
          // //////////////
          INPUTS_LOOP:
          for (const { id, data, types, optional } of node.inputs) {
            // Ignore optional inputs with no data.
            if (optional && typeof data === "undefined") {
              continue INPUTS_LOOP;
            }

            // Validate input data.
            if (DflowData.isValidDataType(types, data)) {
              continue INPUTS_LOOP;
            }

            // Some input is not valid.

            // Notify into execution report.
            if (verbose) {
              this.executionReport.steps?.push(
                _executionNodeInfo(
                  node.toObject(),
                  `invalid input data nodeId=${nodeId} inputId=${id} data=${data}`,
                ),
              );
            }

            // Cleanup outputs and go to next node.
            node.clearOutputs();
            continue NODES_LOOP;
          }

          if (isAsync) {
            await node.run();
          } else {
            node.run();
          }
        }

        if (verbose) {
          this.executionReport.steps?.push(_executionNodeInfo(node.toObject()));
        }
      } catch (error) {
        console.error(error);
        this.runStatus = "failure";
      }
    }

    // Set runStatus to success if there was no error.
    if (this.runStatus === "waiting") {
      this.runStatus = "success";
    }

    this.executionReport.status = this.runStatus;
    this.executionReport.end = new Date();
  }

  toObject(): DflowSerializableGraph {
    const obj = {
      nodes: [],
      edges: [],
    } as DflowSerializableGraph;

    for (const node of this.nodes.values()) {
      obj.nodes.push(node.toObject());
    }
    for (const edge of this.edges.values()) {
      obj.edges.push(edge.toObject());
    }

    return obj;
  }
}

export class DflowHost {
  readonly #graph: DflowGraph;
  readonly context: Record<string, unknown>;

  constructor(arg?: DflowHostConstructorArg) {
    this.#graph = new DflowGraph(arg);
    this.context = {};
  }

  get executionReport() {
    return this.#graph.executionReport;
  }

  get edges() {
    return Array.from(this.#graph.edges.values()).map((item) =>
      item.toObject()
    );
  }

  get nodes() {
    return Array.from(this.#graph.nodes.values()).map((item) =>
      item.toObject()
    );
  }

  get nodesCatalog(): DflowNodesCatalog {
    return this.#graph.nodesCatalog;
  }

  get runStatusIsSuccess() {
    return this.#graph.runStatus === "success";
  }

  get runStatusIsWaiting() {
    return this.#graph.runStatus === "waiting";
  }

  get runStatusIsFailure() {
    return this.#graph.runStatus === "failure";
  }

  set verbose(option: DflowRunOptions["verbose"]) {
    this.#graph.runOptions.verbose = option;
  }

  clearGraph() {
    this.#graph.nodes.clear();
    this.#graph.edges.clear();
  }

  connect(sourceNode: DflowNode, sourcePosition = 0) {
    return {
      to: (targetNode: DflowNode, targetPosition = 0) => {
        const sourcePin = sourceNode.output(sourcePosition);
        const targetPin = targetNode.input(targetPosition);

        this.newEdge({
          source: [sourceNode.id, sourcePin.id],
          target: [targetNode.id, targetPin.id],
        });
      },
    };
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  deleteEdge(edgeId: DflowId) {
    const edge = this.getEdgeById(edgeId);
    if (!edge) return;

    // 1. Cleanup target pin.
    const [targetNodeId, targetPinId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.disconnect();

    // 2. Delete edge.
    this.#graph.edges.delete(edgeId);
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  deleteNode(nodeId: DflowId) {
    const node = this.getNodeById(nodeId);

    // 1. Delete all edges connected to node.
    for (const edge of this.edges) {
      const {
        source: [sourceNodeId],
        target: [targetNodeId],
      } = edge;
      if (sourceNodeId === node.id || targetNodeId === node.id) {
        this.deleteEdge(edge.id);
      }
    }

    // 2. Delete node.
    this.#graph.nodes.delete(nodeId);
  }

  executeFunction(functionId: DflowId, args: DflowArray) {
    const { verbose } = this.#graph.runOptions;

    // Get all return nodes connected to function node.
    const nodeConnections = this.#graph.nodeConnections;
    const childrenNodeIds = DflowGraph.childrenOfNodeId(
      functionId,
      nodeConnections,
    );
    const returnNodeIds = [];
    for (const childrenNodeId of childrenNodeIds) {
      const node = this.getNodeById(childrenNodeId);
      if (node.kind === DflowNodeReturn.kind) {
        returnNodeIds.push(node.id);
      }
    }

    // Get all nodes inside function.
    const nodeIdsInsideFunction = returnNodeIds.reduce<DflowId[]>(
      (accumulator, returnNodeId, index, array) => {
        const ancestors = DflowGraph.ancestorsOfNodeId(
          returnNodeId,
          nodeConnections,
        );

        const result = accumulator.concat(ancestors);

        // On last iteration, remove duplicates
        return index === array.length ? Array.from(new Set(result)) : result;
      },
      [],
    );

    // 1. get nodeIds sorted by graph hierarchy
    // 2. if it is an argument node, inject input data
    // 3. if if is a return node, output data
    // 4. otherwise run node
    const nodeIds = DflowGraph.sortNodesByLevel(
      [...returnNodeIds, ...nodeIdsInsideFunction],
      nodeConnections,
    );
    for (const nodeId of nodeIds) {
      const node = this.getNodeById(nodeId) as DflowNode;

      const NodeClass = this.nodesCatalog[node.kind] ?? DflowNodeUnknown;
      const { isAsync, isConstant } = NodeClass;

      try {
        switch (node.kind) {
          case DflowNodeArgument.kind: {
            const position = node.input(0).data;
            // Argument position default to 0, must be >= 0.
            const index = typeof position === "number" && !isNaN(position)
              ? Math.max(
                position,
                0,
              )
              : 0;
            node.output(0).data = args[index];
            break;
          }
          case DflowNodeReturn.kind: {
            return node.input(1).data;
          }
          default: {
            // Notice that executeFunction cannot execute async functions.
            if (!isConstant && !isAsync) {
              node.run();
            }

            if (verbose) {
              this.executionReport?.steps?.push(
                _executionNodeInfo(node.toObject()),
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getEdgeById(id: DflowId): DflowEdge | undefined {
    const item = this.#graph.edges.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({ kind: "edge", id });
    }
    return item;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  getNodeById(id: DflowId): DflowNode {
    const item = this.#graph.nodes.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({ kind: "node", id });
    }
    return item;
  }

  newNode(obj: DflowNewNode): DflowNode {
    const numNodes = this.#graph.nodes.size;

    const generateNodeId = (i = numNodes): DflowId => {
      const id = `n${i}`;
      return this.#graph.nodes.has(id) ? generateNodeId(i + 1) : id;
    };

    const NodeClass = this.nodesCatalog[obj.kind] ?? DflowNodeUnknown;

    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateNodeId();

    const inputs = NodeClass.inputs?.map((pin, i) => {
      const objPin = obj.inputs?.[i] ?? {} as Partial<DflowNewInput>;
      const id = DflowData.isDflowId(objPin?.id) ? objPin.id : `i${i}`;
      return {
        id,
        ...objPin,
        ...pin,
      };
    }) ?? [];

    const outputs = NodeClass.outputs?.map((pin, i) => {
      const objPin = obj.outputs?.[i] ?? {} as Partial<DflowNewOutput>;
      const id = DflowData.isDflowId(objPin?.id) ? objPin.id : `o${i}`;
      return {
        id,
        ...objPin,
        ...pin,
      };
    }) ?? [];

    const node = new NodeClass({
      node: { ...obj, id, inputs, outputs },
      host: this,
    });

    this.#graph.nodes.set(node.id, node);

    return node;
  }

  /**
   * @throws DflowErrorItemNotFound
   */
  newEdge(obj: DflowNewEdge): DflowEdge {
    const numEdges = this.#graph.edges.size;

    const generateEdgeId = (i = numEdges): DflowId => {
      const id = `e${i}`;
      return this.#graph.edges.has(id) ? generateEdgeId(i + 1) : id;
    };

    const id = DflowData.isDflowId(obj.id)
      ? (obj.id as DflowId)
      : generateEdgeId();

    const edge = new DflowEdge({ ...obj, id });

    this.#graph.edges.set(edge.id, edge);

    const [sourceNodeId, sourcePinId] = edge.source;
    const [targetNodeId, targetPinId] = edge.target;

    const sourceNode = this.getNodeById(sourceNodeId);
    const targetNode = this.getNodeById(targetNodeId);
    const sourcePin = sourceNode.getOutputById(sourcePinId);
    const targetPin = targetNode.getInputById(targetPinId);

    targetPin.connectTo(sourcePin);

    return edge;
  }

  toObject() {
    return this.#graph.toObject();
  }

  async run() {
    await this.#graph.run();
  }
}

// Core nodes.

const { input, output } = DflowNode;

class DflowNodeArgument extends DflowNode {
  static kind = "argument";
  static isConstant = true;
  static inputs = [input("number", { name: "position", optional: true })];
  static outputs = [output()];
}

class DflowNodeData extends DflowNode {
  static kind = "data";
  static isConstant = true;
  static outputs = [output()];
  constructor({ node: { outputs, ...node }, host }: DflowNodeConstructorArg) {
    super({
      node: {
        ...node,
        outputs: outputs?.map((output) => ({
          ...output,
          types:
            (function inferDflowDataType(data: DflowValue): DflowDataType[] {
              switch (true) {
                case DflowData.isBoolean(data):
                  return ["boolean"];
                case DflowData.isNumber(data):
                  return ["number"];
                case DflowData.isString(data):
                  return ["string"];
                case DflowData.isArray(data):
                  return ["array"];
                case DflowData.isObject(data):
                  return ["object"];
                default:
                  return [];
              }
            })(output.data),
        })),
      },
      host,
    });
  }
}

class DflowNodeFunction extends DflowNode {
  static kind = "function";
  static isConstant = true;
  static outputs = [output("DflowId", { name: "id" })];
  constructor(arg: DflowNodeConstructorArg) {
    super(arg);
    this.output(0).data = this.id;
  }
}

class DflowNodeIsUndefined extends DflowNode {
  static kind = "isUndefined";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = typeof this.input(0).data === "undefined";
  }
}

class DflowNodeReturn extends DflowNode {
  static kind = "return";
  static isConstant = true;
  static inputs = [
    input("DflowId", { name: "functionId" }),
    input([], { name: "value" }),
  ];
}

// The "unknown" node is not inclued in core nodes catalog.
export class DflowNodeUnknown extends DflowNode {}

const coreNodesCatalog: DflowNodesCatalog = {
  [DflowNodeArgument.kind]: DflowNodeArgument,
  [DflowNodeData.kind]: DflowNodeData,
  [DflowNodeIsUndefined.kind]: DflowNodeIsUndefined,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeReturn.kind]: DflowNodeReturn,
};
