var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var stdin_exports = {};
__export(stdin_exports, {
  DflowData: () => DflowData,
  DflowEdge: () => DflowEdge,
  DflowError: () => DflowError,
  DflowErrorCannotConnectPins: () => DflowErrorCannotConnectPins,
  DflowErrorInvalidInputData: () => DflowErrorInvalidInputData,
  DflowErrorItemNotFound: () => DflowErrorItemNotFound,
  DflowGraph: () => DflowGraph,
  DflowHost: () => DflowHost,
  DflowInput: () => DflowInput,
  DflowNode: () => DflowNode,
  DflowNodeUnknown: () => DflowNodeUnknown,
  DflowOutput: () => DflowOutput,
  DflowPin: () => DflowPin,
  coreNodesCatalog: () => coreNodesCatalog
});
module.exports = __toCommonJS(stdin_exports);
const generateItemId = (itemMap, idPrefix, i) => {
  const n = i != null ? i : itemMap.size;
  const id = `${idPrefix}${n}`;
  return itemMap.has(id) ? generateItemId(itemMap, idPrefix, n + 1) : id;
};
const dflowDataTypes = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId"
];
const _DflowData = class {
  static isArray(arg) {
    return Array.isArray(arg);
  }
  static isBoolean(arg) {
    return typeof arg === "boolean";
  }
  static isDflowId(arg) {
    return typeof arg === "string" && arg !== "";
  }
  static isObject(arg) {
    return typeof arg === "object" && arg !== null && !Array.isArray(arg);
  }
  static isNumber(arg) {
    return typeof arg === "number" && !isNaN(arg) && Number.isFinite(arg);
  }
  static isString(arg) {
    return typeof arg === "string";
  }
  static isDflowData(arg) {
    if (typeof arg === "undefined")
      return false;
    return _DflowData.isString(arg) || _DflowData.isBoolean(arg) || _DflowData.isNumber(arg) || _DflowData.isObject(arg) || _DflowData.isArray(arg) || _DflowData.isDflowId(arg);
  }
  static isValidDataType(types, data) {
    const isAnyType = types.length === 0;
    if (isAnyType)
      return true;
    return types.some((pinType) => {
      switch (pinType) {
        case "array":
          return _DflowData.isArray(data);
        case "boolean":
          return _DflowData.isBoolean(data);
        case "number":
          return _DflowData.isNumber(data);
        case "object":
          return _DflowData.isObject(data);
        case "string":
          return _DflowData.isString(data);
        case "DflowId":
          return _DflowData.isDflowId(data);
        default:
          return false;
      }
    }, true);
  }
};
let DflowData = _DflowData;
__publicField(DflowData, "types", dflowDataTypes);
class DflowPin {
  constructor({ name, types = [] }) {
    __publicField(this, "name");
    __publicField(this, "types");
    if (name)
      this.name = name;
    this.types = types;
  }
  static canConnect(sourceTypes, targetTypes) {
    const sourceHasTypeAny = sourceTypes.length === 0;
    if (sourceHasTypeAny)
      return true;
    const targetHasTypeAny = targetTypes.length === 0;
    if (targetHasTypeAny)
      return true;
    return targetTypes.some((pinType) => sourceTypes.includes(pinType));
  }
  get hasTypeAny() {
    return this.types.length === 0;
  }
  hasType(type) {
    return this.hasTypeAny || this.types.includes(type);
  }
}
class DflowInput extends DflowPin {
  constructor({ id, optional, ...pin }) {
    super(pin);
    __publicField(this, "id");
    __publicField(this, "source");
    __publicField(this, "optional");
    this.id = id;
    if (optional)
      this.optional = optional;
  }
  get data() {
    var _a;
    return (_a = this.source) == null ? void 0 : _a.data;
  }
  get isConnected() {
    return typeof this.source === "undefined";
  }
  connectTo(pin) {
    if (DflowPin.canConnect(pin.types, this.types))
      this.source = pin;
    else {
      throw new DflowErrorCannotConnectPins({
        source: pin.toObject(),
        target: this.toObject()
      });
    }
  }
  disconnect() {
    this.source = void 0;
  }
  toObject() {
    return {
      id: this.id
    };
  }
}
class DflowOutput extends DflowPin {
  constructor({ id, data, ...pin }) {
    super(pin);
    __publicField(this, "id");
    __publicField(this, "value");
    this.id = id;
    this.value = data;
  }
  get data() {
    return this.value;
  }
  set data(data) {
    switch (true) {
      case typeof data === "undefined":
        this.clear();
        break;
      case this.hasTypeAny:
      case (this.hasType("string") && DflowData.isString(data)):
      case (this.hasType("number") && DflowData.isNumber(data)):
      case (this.hasType("boolean") && DflowData.isBoolean(data)):
      case (this.hasType("object") && DflowData.isObject(data)):
      case (this.hasType("array") && DflowData.isArray(data)):
      case (this.hasType("DflowId") && DflowData.isDflowId(data)): {
        this.value = data;
        break;
      }
      default: {
        this.clear();
        break;
      }
    }
  }
  clear() {
    this.value = void 0;
  }
  toObject() {
    const obj = {
      id: this.id
    };
    if (typeof this.value !== "undefined")
      obj.data = this.value;
    return obj;
  }
}
class DflowNode {
  constructor({ node: { id, kind, inputs = [], outputs = [] }, host }) {
    __publicField(this, "id");
    __publicField(this, "inputsMap", /* @__PURE__ */ new Map());
    __publicField(this, "outputsMap", /* @__PURE__ */ new Map());
    __publicField(this, "inputPosition", []);
    __publicField(this, "outputPosition", []);
    __publicField(this, "kind");
    __publicField(this, "host");
    this.id = id;
    this.host = host;
    this.kind = kind;
    for (const obj of inputs) {
      const id1 = DflowData.isDflowId(obj.id) ? obj.id : generateItemId(this.inputsMap, "i");
      const pin = new DflowInput({
        ...obj,
        id: id1
      });
      this.inputsMap.set(id1, pin);
      this.inputPosition.push(id1);
    }
    for (const obj1 of outputs) {
      const id2 = DflowData.isDflowId(obj1.id) ? obj1.id : generateItemId(this.outputsMap, "o");
      const pin1 = new DflowOutput({
        ...obj1,
        id: id2
      });
      this.outputsMap.set(id2, pin1);
      this.outputPosition.push(id2);
    }
  }
  static input(typing = [], rest) {
    return {
      types: typeof typing === "string" ? [
        typing
      ] : typing,
      ...rest
    };
  }
  static output(typing = [], rest) {
    return {
      types: typeof typing === "string" ? [
        typing
      ] : typing,
      ...rest
    };
  }
  get inputsDataAreValid() {
    for (const { data, types, optional } of this.inputsMap.values()) {
      if (optional && typeof data === "undefined")
        continue;
      if (DflowData.isValidDataType(types, data))
        continue;
      return false;
    }
    return true;
  }
  clearOutputs() {
    for (const output2 of this.outputsMap.values())
      output2.clear();
  }
  getInputById(id) {
    const item = this.inputsMap.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "input",
        id
      });
    return item;
  }
  input(position) {
    const pinId = this.inputPosition[position];
    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "input",
        nodeId: this.id,
        position
      });
    }
    return this.getInputById(pinId);
  }
  getOutputById(id) {
    const item = this.outputsMap.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "output",
        id
      });
    return item;
  }
  output(position) {
    const pinId = this.outputPosition[position];
    if (!pinId) {
      throw new DflowErrorItemNotFound({
        kind: "output",
        nodeId: this.id,
        position
      });
    }
    return this.getOutputById(pinId);
  }
  run() {
  }
  toObject() {
    const obj = {
      id: this.id,
      kind: this.kind
    };
    const ins = [
      ...this.inputsMap.values()
    ].map((item) => item.toObject());
    if (ins.length > 0)
      obj.inputs = ins;
    const outs = [
      ...this.outputsMap.values()
    ].map((item) => item.toObject());
    if (outs.length > 0)
      obj.outputs = outs;
    return obj;
  }
}
class DflowEdge {
  constructor({ source, target, id }) {
    __publicField(this, "id");
    __publicField(this, "source");
    __publicField(this, "target");
    this.id = id;
    this.source = source;
    this.target = target;
  }
  toObject() {
    return {
      id: this.id,
      source: this.source,
      target: this.target
    };
  }
}
const _DflowGraph = class {
  constructor({ nodesCatalog }) {
    __publicField(this, "nodesCatalog");
    __publicField(this, "nodesMap", /* @__PURE__ */ new Map());
    __publicField(this, "edgesMap", /* @__PURE__ */ new Map());
    __publicField(this, "runOptions", {
      verbose: false
    });
    __publicField(this, "runStatus", null);
    __publicField(this, "executionReport", null);
    this.nodesCatalog = {
      ...nodesCatalog,
      ...coreNodesCatalog
    };
  }
  static childrenOfNodeId(nodeId, nodeConnections) {
    return nodeConnections.filter(({ sourceId }) => nodeId === sourceId).map(({ targetId }) => targetId);
  }
  static parentsOfNodeId(nodeId, nodeConnections) {
    return nodeConnections.filter(({ targetId }) => nodeId === targetId).map(({ sourceId }) => sourceId);
  }
  static ancestorsOfNodeId(nodeId, nodeConnections) {
    const parentsNodeIds = _DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0)
      return [];
    return parentsNodeIds.reduce((accumulator, parentNodeId, index, array) => {
      const ancestors = _DflowGraph.ancestorsOfNodeId(parentNodeId, nodeConnections);
      const result = accumulator.concat(ancestors);
      return index === array.length - 1 ? [
        ...new Set(array.concat(result))
      ] : result;
    }, []);
  }
  static levelOfNodeId(nodeId, nodeConnections) {
    const parentsNodeIds = _DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0)
      return 0;
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds) {
      const level = _DflowGraph.levelOfNodeId(parentNodeId, nodeConnections);
      maxLevel = Math.max(level, maxLevel);
    }
    return maxLevel + 1;
  }
  get nodeConnections() {
    return [
      ...this.edgesMap.values()
    ].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0]
    }));
  }
  get nodeIdsInsideFunctions() {
    const ancestorsOfReturnNodes = [];
    for (const node of [
      ...this.nodesMap.values()
    ])
      if (node.kind === "return")
        ancestorsOfReturnNodes.push(_DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections));
    return [
      ...new Set(ancestorsOfReturnNodes.flat())
    ];
  }
  static sortNodesByLevel(nodeIds, nodeConnections) {
    const levelOf = {};
    for (const nodeId of nodeIds) {
      levelOf[nodeId] = _DflowGraph.levelOfNodeId(nodeId, nodeConnections);
    }
    return nodeIds.slice().sort((a, b) => levelOf[a] <= levelOf[b] ? -1 : 1);
  }
  async run(runOptions) {
    const { verbose } = runOptions != null ? runOptions : this.runOptions;
    this.runStatus = "running";
    const executionReport = {
      status: this.runStatus,
      start: new Date().toJSON(),
      end: new Date().toJSON(),
      steps: []
    };
    const nodeIdsExcluded = this.nodeIdsInsideFunctions;
    const nodeIds = _DflowGraph.sortNodesByLevel([
      ...this.nodesMap.keys()
    ].filter((nodeId) => !nodeIdsExcluded.includes(nodeId)), this.nodeConnections);
    for (const nodeId of nodeIds) {
      const node = this.nodesMap.get(nodeId);
      try {
        if (!node.inputsDataAreValid) {
          if (verbose) {
            const error = new DflowErrorInvalidInputData({
              nodeId
            });
            executionReport.steps.push(_DflowGraph.executionNodeInfo(node.toObject(), error.message));
          }
          node.clearOutputs();
          continue;
        }
        if (node.run.constructor.name === "AsyncFunction") {
          await node.run();
        } else {
          node.run();
        }
        if (verbose) {
          executionReport.steps.push(_DflowGraph.executionNodeInfo(node.toObject()));
        }
      } catch (error1) {
        console.error(error1);
        this.runStatus = "failure";
      }
    }
    if (this.runStatus === "running")
      this.runStatus = "success";
    executionReport.status = this.runStatus;
    executionReport.end = new Date().toJSON();
    this.executionReport = executionReport;
  }
  toObject() {
    return {
      nodes: [
        ...this.nodesMap.values()
      ].map((item) => item.toObject()),
      edges: [
        ...this.edgesMap.values()
      ].map((item) => item.toObject())
    };
  }
};
let DflowGraph = _DflowGraph;
__publicField(DflowGraph, "executionNodeInfo", ({ id, kind, outputs }, error) => {
  const obj = {
    id,
    kind,
    outputs: outputs == null ? void 0 : outputs.map(({ id: id2, data, name }) => ({
      id: id2,
      data,
      name
    }))
  };
  if (error)
    obj.error = error;
  return obj;
});
class DflowHost {
  constructor(arg) {
    __publicField(this, "graph");
    __publicField(this, "context");
    this.graph = new DflowGraph(arg);
    this.context = {};
  }
  get executionReport() {
    return this.graph.executionReport;
  }
  get edges() {
    return [
      ...this.graph.edgesMap.values()
    ].map((item) => item.toObject());
  }
  get nodes() {
    return [
      ...this.graph.nodesMap.values()
    ].map((item) => item.toObject());
  }
  get nodesCatalog() {
    return this.graph.nodesCatalog;
  }
  get runStatus() {
    return this.graph.runStatus;
  }
  set verbose(option) {
    this.graph.runOptions.verbose = option;
  }
  clearGraph() {
    this.graph.nodesMap.clear();
    this.graph.edgesMap.clear();
  }
  connect(sourceNode, sourcePosition = 0) {
    return {
      to: (targetNode, targetPosition = 0) => {
        const sourcePin = sourceNode.output(sourcePosition);
        const targetPin = targetNode.input(targetPosition);
        this.newEdge({
          source: [
            sourceNode.id,
            sourcePin.id
          ],
          target: [
            targetNode.id,
            targetPin.id
          ]
        });
      }
    };
  }
  deleteEdge(edgeId) {
    const edge = this.getEdgeById(edgeId);
    const [targetNodeId, targetPinId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.disconnect();
    this.graph.edgesMap.delete(edgeId);
  }
  deleteNode(nodeId) {
    const node = this.getNodeById(nodeId);
    for (const edge of this.edges) {
      const { source: [sourceNodeId], target: [targetNodeId] } = edge;
      if (sourceNodeId === node.id || targetNodeId === node.id) {
        this.deleteEdge(edge.id);
      }
    }
    this.graph.nodesMap.delete(nodeId);
  }
  executeFunction(functionId, args) {
    var _a, _b;
    const { verbose } = this.graph.runOptions;
    const nodeConnections = this.graph.nodeConnections;
    const childrenNodeIds = DflowGraph.childrenOfNodeId(functionId, nodeConnections);
    const returnNodeIds = [];
    for (const childrenNodeId of childrenNodeIds) {
      const node = this.getNodeById(childrenNodeId);
      if (node.kind === DflowNodeReturn.kind) {
        returnNodeIds.push(node.id);
      }
    }
    const nodeIdsInsideFunction = returnNodeIds.reduce((accumulator, returnNodeId, index, array) => {
      const ancestors = DflowGraph.ancestorsOfNodeId(returnNodeId, nodeConnections);
      const result = accumulator.concat(ancestors);
      return index === array.length ? [
        ...new Set(result)
      ] : result;
    }, []);
    const nodeIds = DflowGraph.sortNodesByLevel([
      ...returnNodeIds,
      ...nodeIdsInsideFunction
    ], nodeConnections);
    for (const nodeId of nodeIds) {
      const node1 = this.getNodeById(nodeId);
      try {
        switch (node1.kind) {
          case DflowNodeArgument.kind: {
            const position = node1.input(0).data;
            const index = typeof position === "number" && !isNaN(position) ? Math.max(position, 0) : 0;
            node1.output(0).data = args[index];
            break;
          }
          case DflowNodeReturn.kind: {
            return node1.input(1).data;
          }
          default: {
            if (node1.run.constructor.name === "AsyncFunction") {
              throw new Error("dflow executeFunction() cannot execute async functions");
            } else {
              node1.run();
            }
            if (verbose) {
              (_b = (_a = this.executionReport) == null ? void 0 : _a.steps) == null ? void 0 : _b.push(DflowGraph.executionNodeInfo(node1.toObject()));
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  getEdgeById(id) {
    const item = this.graph.edgesMap.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "edge",
        id
      });
    return item;
  }
  getNodeById(id) {
    const item = this.graph.nodesMap.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "node",
        id
      });
    return item;
  }
  newNode(obj) {
    var _a, _b, _c, _d, _e;
    const NodeClass = (_a = this.nodesCatalog[obj.kind]) != null ? _a : DflowNodeUnknown;
    const id = DflowData.isDflowId(obj.id) ? obj.id : generateItemId(this.graph.nodesMap, "n");
    const inputs = (_c = (_b = NodeClass.inputs) == null ? void 0 : _b.map((pin, i) => {
      var _a2, _b2;
      const objPin = (_b2 = (_a2 = obj.inputs) == null ? void 0 : _a2[i]) != null ? _b2 : {};
      const id2 = DflowData.isDflowId(objPin == null ? void 0 : objPin.id) ? objPin.id : `i${i}`;
      return {
        id: id2,
        ...objPin,
        ...pin
      };
    })) != null ? _c : [];
    const outputs = (_e = (_d = NodeClass.outputs) == null ? void 0 : _d.map((pin, i) => {
      var _a2, _b2;
      const objPin = (_b2 = (_a2 = obj.outputs) == null ? void 0 : _a2[i]) != null ? _b2 : {};
      const id2 = DflowData.isDflowId(objPin == null ? void 0 : objPin.id) ? objPin.id : `o${i}`;
      return {
        id: id2,
        ...objPin,
        ...pin
      };
    })) != null ? _e : [];
    const node = new NodeClass({
      node: {
        ...obj,
        id,
        inputs,
        outputs
      },
      host: this
    });
    this.graph.nodesMap.set(node.id, node);
    return node;
  }
  newEdge(obj) {
    const id = DflowData.isDflowId(obj.id) ? obj.id : generateItemId(this.graph.edgesMap, "e");
    const edge = new DflowEdge({
      ...obj,
      id
    });
    this.graph.edgesMap.set(edge.id, edge);
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
    return this.graph.toObject();
  }
  async run() {
    await this.graph.run();
  }
}
const { input, output } = DflowNode;
class DflowNodeArgument extends DflowNode {
}
__publicField(DflowNodeArgument, "kind", "argument");
__publicField(DflowNodeArgument, "inputs", [
  input("number", {
    name: "position",
    optional: true
  })
]);
__publicField(DflowNodeArgument, "outputs", [
  output()
]);
class DflowNodeData extends DflowNode {
  constructor({ node: { outputs, ...node }, host }) {
    super({
      node: {
        ...node,
        outputs: outputs == null ? void 0 : outputs.map((output2) => ({
          ...output2,
          types: function inferDflowDataType(data) {
            switch (true) {
              case DflowData.isBoolean(data):
                return [
                  "boolean"
                ];
              case DflowData.isNumber(data):
                return [
                  "number"
                ];
              case DflowData.isString(data):
                return [
                  "string"
                ];
              case DflowData.isArray(data):
                return [
                  "array"
                ];
              case DflowData.isObject(data):
                return [
                  "object"
                ];
              default:
                return [];
            }
          }(output2.data)
        }))
      },
      host
    });
  }
}
__publicField(DflowNodeData, "kind", "data");
__publicField(DflowNodeData, "outputs", [
  output()
]);
class DflowNodeFunction extends DflowNode {
  constructor(arg) {
    super(arg);
    this.output(0).data = this.id;
  }
}
__publicField(DflowNodeFunction, "kind", "function");
__publicField(DflowNodeFunction, "outputs", [
  output("DflowId", {
    name: "id"
  })
]);
class DflowNodeReturn extends DflowNode {
}
__publicField(DflowNodeReturn, "kind", "return");
__publicField(DflowNodeReturn, "inputs", [
  input("DflowId", {
    name: "functionId"
  }),
  input([], {
    name: "value"
  })
]);
class DflowNodeUnknown extends DflowNode {
}
const coreNodesCatalog = {
  [DflowNodeArgument.kind]: DflowNodeArgument,
  [DflowNodeData.kind]: DflowNodeData,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeReturn.kind]: DflowNodeReturn
};
class DflowError extends Error {
  constructor(arg, errorName) {
    super(JSON.stringify({
      error: errorName,
      ...arg
    }));
  }
}
class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg) {
    super(arg, "CannotConnectPins");
  }
}
class DflowErrorInvalidInputData extends DflowError {
  constructor(arg) {
    super(arg, "InvalidInputData");
  }
}
class DflowErrorItemNotFound extends DflowError {
  constructor(arg) {
    super(arg, "ItemNotFound");
  }
}
