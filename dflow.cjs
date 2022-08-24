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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var stdin_exports = {};
__export(stdin_exports, {
  DflowData: () => DflowData,
  DflowEdge: () => DflowEdge,
  DflowError: () => DflowError,
  DflowErrorCannotConnectPins: () => DflowErrorCannotConnectPins,
  DflowErrorItemNotFound: () => DflowErrorItemNotFound,
  DflowGraph: () => DflowGraph,
  DflowHost: () => DflowHost,
  DflowInput: () => DflowInput,
  DflowNode: () => DflowNode,
  DflowNodeUnknown: () => DflowNodeUnknown,
  DflowOutput: () => DflowOutput,
  DflowPin: () => DflowPin
});
module.exports = __toCommonJS(stdin_exports);
var _source, _data, _inputs, _outputs, _inputPosition, _outputPosition, _graph;
const dflowDataTypes = [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId"
];
const _DflowData = class {
  static isArray(data) {
    return Array.isArray(data);
  }
  static isBoolean(data) {
    return typeof data === "boolean";
  }
  static isDflowId(data) {
    return typeof data === "string" && data !== "";
  }
  static isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  static isNumber(data) {
    return typeof data === "number" && !isNaN(data);
  }
  static isString(data) {
    return typeof data === "string";
  }
  static isDflowData(data) {
    if (typeof data === "undefined")
      return false;
    return _DflowData.isString(data) || _DflowData.isBoolean(data) || _DflowData.isNumber(data) || _DflowData.isObject(data) || _DflowData.isArray(data) || _DflowData.isDflowId(data);
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
    __privateAdd(this, _source, void 0);
    __publicField(this, "optional");
    this.id = id;
    if (optional)
      this.optional = optional;
  }
  get data() {
    var _a;
    return (_a = __privateGet(this, _source)) == null ? void 0 : _a.data;
  }
  get isConnected() {
    return typeof __privateGet(this, _source) === "undefined";
  }
  connectTo(pin) {
    const { types: targetTypes } = this;
    const { types: sourceTypes } = pin;
    const canConnect = DflowPin.canConnect(sourceTypes, targetTypes);
    if (!canConnect) {
      throw new DflowErrorCannotConnectPins({
        source: pin.toObject(),
        target: this.toObject()
      });
    }
    __privateSet(this, _source, pin);
  }
  disconnect() {
    __privateSet(this, _source, void 0);
  }
  toObject() {
    return {
      id: this.id
    };
  }
}
_source = new WeakMap();
class DflowOutput extends DflowPin {
  constructor({ id, data, ...pin }) {
    super(pin);
    __publicField(this, "id");
    __privateAdd(this, _data, void 0);
    this.id = id;
    __privateSet(this, _data, data);
  }
  get data() {
    return __privateGet(this, _data);
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
        __privateSet(this, _data, data);
        break;
      }
      default: {
        this.clear();
        break;
      }
    }
  }
  clear() {
    __privateSet(this, _data, void 0);
  }
  toObject() {
    const obj = {
      id: this.id
    };
    if (typeof __privateGet(this, _data) !== "undefined")
      obj.data = __privateGet(this, _data);
    return obj;
  }
}
_data = new WeakMap();
class DflowNode {
  constructor({ node: { id, kind, inputs = [], outputs = [] }, host }) {
    __publicField(this, "id");
    __privateAdd(this, _inputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _outputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _inputPosition, []);
    __privateAdd(this, _outputPosition, []);
    __publicField(this, "kind");
    __publicField(this, "host");
    this.id = id;
    this.host = host;
    this.kind = kind;
    const generateInputId = (i) => {
      const id2 = `i${i}`;
      return __privateGet(this, _inputs).has(id2) ? generateInputId(i + 1) : id2;
    };
    for (const obj of inputs) {
      const numInputs = __privateGet(this, _inputs).size;
      const id1 = DflowData.isDflowId(obj.id) ? obj.id : generateInputId(numInputs);
      const pin = new DflowInput({
        ...obj,
        id: id1
      });
      __privateGet(this, _inputs).set(id1, pin);
      __privateGet(this, _inputPosition).push(id1);
    }
    const generateOutputId = (i) => {
      const id2 = `o${i}`;
      return __privateGet(this, _outputs).has(id2) ? generateOutputId(i + 1) : id2;
    };
    for (const obj1 of outputs) {
      const numOutputs = __privateGet(this, _outputs).size;
      const id2 = DflowData.isDflowId(obj1.id) ? obj1.id : generateOutputId(numOutputs);
      const pin1 = new DflowOutput({
        ...obj1,
        id: id2
      });
      __privateGet(this, _outputs).set(id2, pin1);
      __privateGet(this, _outputPosition).push(id2);
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
  get inputs() {
    return __privateGet(this, _inputs).values();
  }
  get outputs() {
    return __privateGet(this, _outputs).values();
  }
  clearOutputs() {
    for (const output2 of this.outputs)
      output2.clear();
  }
  getInputById(id) {
    const item = __privateGet(this, _inputs).get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "input",
        id
      });
    return item;
  }
  input(position) {
    const pinId = __privateGet(this, _inputPosition)[position];
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
    const item = __privateGet(this, _outputs).get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "output",
        id
      });
    return item;
  }
  output(position) {
    const pinId = __privateGet(this, _outputPosition)[position];
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
    const inputs = Array.from(__privateGet(this, _inputs).values()).map((input2) => input2.toObject());
    if (inputs.length > 0)
      obj.inputs = inputs;
    const outputs = Array.from(__privateGet(this, _outputs).values()).map((output2) => output2.toObject());
    if (outputs.length > 0)
      obj.outputs = outputs;
    return obj;
  }
}
_inputs = new WeakMap();
_outputs = new WeakMap();
_inputPosition = new WeakMap();
_outputPosition = new WeakMap();
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
    __publicField(this, "nodes", /* @__PURE__ */ new Map());
    __publicField(this, "edges", /* @__PURE__ */ new Map());
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
  static ancestorsOfNodeId(nodeId, nodeConnections) {
    const parentsNodeIds = _DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0)
      return [];
    return parentsNodeIds.reduce((accumulator, parentNodeId, index, array) => {
      const ancestors = _DflowGraph.ancestorsOfNodeId(parentNodeId, nodeConnections);
      const result = accumulator.concat(ancestors);
      return index === array.length - 1 ? Array.from(new Set(array.concat(result))) : result;
    }, []);
  }
  static sortNodesByLevel(nodeIds, nodeConnections) {
    const levelOf = {};
    for (const nodeId of nodeIds) {
      levelOf[nodeId] = _DflowGraph.levelOfNodeId(nodeId, nodeConnections);
    }
    return nodeIds.slice().sort((a, b) => levelOf[a] <= levelOf[b] ? -1 : 1);
  }
  get nodeConnections() {
    return [
      ...this.edges.values()
    ].map((edge) => ({
      sourceId: edge.source[0],
      targetId: edge.target[0]
    }));
  }
  get nodeIdsInsideFunctions() {
    const ancestorsOfReturnNodes = [];
    for (const node of [
      ...this.nodes.values()
    ]) {
      if (node.kind === "return") {
        ancestorsOfReturnNodes.push(_DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections));
      }
    }
    return Array.from(new Set(ancestorsOfReturnNodes.flat()));
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
      ...this.nodes.keys()
    ].filter((nodeId) => !nodeIdsExcluded.includes(nodeId)), this.nodeConnections);
    NODES_LOOP:
      for (const nodeId of nodeIds) {
        const node = this.nodes.get(nodeId);
        try {
          INPUTS_LOOP:
            for (const { id, data, types, optional } of node.inputs) {
              if (optional && typeof data === "undefined")
                continue INPUTS_LOOP;
              if (DflowData.isValidDataType(types, data))
                continue INPUTS_LOOP;
              if (verbose) {
                executionReport.steps.push(_DflowGraph.executionNodeInfo(node.toObject(), `invalid input data nodeId=${nodeId} inputId=${id} data=${data}`));
              }
              node.clearOutputs();
              continue NODES_LOOP;
            }
          if (node.run.constructor.name === "AsyncFunction") {
            await node.run();
          } else {
            node.run();
          }
          if (verbose) {
            executionReport.steps.push(_DflowGraph.executionNodeInfo(node.toObject()));
          }
        } catch (error) {
          console.error(error);
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
      nodes: Array.from(this.nodes.values()).map((item) => item.toObject()),
      edges: Array.from(this.edges.values()).map((item) => item.toObject())
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
    __privateAdd(this, _graph, void 0);
    __publicField(this, "context");
    __privateSet(this, _graph, new DflowGraph(arg));
    this.context = {};
  }
  get executionReport() {
    return __privateGet(this, _graph).executionReport;
  }
  get edges() {
    return Array.from(__privateGet(this, _graph).edges.values()).map((item) => item.toObject());
  }
  get nodes() {
    return Array.from(__privateGet(this, _graph).nodes.values()).map((item) => item.toObject());
  }
  get nodesCatalog() {
    return __privateGet(this, _graph).nodesCatalog;
  }
  get runStatus() {
    return __privateGet(this, _graph).runStatus;
  }
  set verbose(option) {
    __privateGet(this, _graph).runOptions.verbose = option;
  }
  clearGraph() {
    __privateGet(this, _graph).nodes.clear();
    __privateGet(this, _graph).edges.clear();
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
    if (!edge)
      return;
    const [targetNodeId, targetPinId] = edge.target;
    const targetNode = this.getNodeById(targetNodeId);
    const targetPin = targetNode.getInputById(targetPinId);
    targetPin.disconnect();
    __privateGet(this, _graph).edges.delete(edgeId);
  }
  deleteNode(nodeId) {
    const node = this.getNodeById(nodeId);
    for (const edge of this.edges) {
      const { source: [sourceNodeId], target: [targetNodeId] } = edge;
      if (sourceNodeId === node.id || targetNodeId === node.id) {
        this.deleteEdge(edge.id);
      }
    }
    __privateGet(this, _graph).nodes.delete(nodeId);
  }
  executeFunction(functionId, args) {
    var _a, _b;
    const { verbose } = __privateGet(this, _graph).runOptions;
    const nodeConnections = __privateGet(this, _graph).nodeConnections;
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
      return index === array.length ? Array.from(new Set(result)) : result;
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
    const item = __privateGet(this, _graph).edges.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "edge",
        id
      });
    return item;
  }
  getNodeById(id) {
    const item = __privateGet(this, _graph).nodes.get(id);
    if (!item)
      throw new DflowErrorItemNotFound({
        kind: "node",
        id
      });
    return item;
  }
  newNode(obj) {
    var _a, _b, _c, _d, _e;
    const numNodes = __privateGet(this, _graph).nodes.size;
    const generateNodeId = (i = numNodes) => {
      const id2 = `n${i}`;
      return __privateGet(this, _graph).nodes.has(id2) ? generateNodeId(i + 1) : id2;
    };
    const NodeClass = (_a = this.nodesCatalog[obj.kind]) != null ? _a : DflowNodeUnknown;
    const id = DflowData.isDflowId(obj.id) ? obj.id : generateNodeId();
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
    __privateGet(this, _graph).nodes.set(node.id, node);
    return node;
  }
  newEdge(obj) {
    const numEdges = __privateGet(this, _graph).edges.size;
    const generateEdgeId = (i = numEdges) => {
      const id2 = `e${i}`;
      return __privateGet(this, _graph).edges.has(id2) ? generateEdgeId(i + 1) : id2;
    };
    const id = DflowData.isDflowId(obj.id) ? obj.id : generateEdgeId();
    const edge = new DflowEdge({
      ...obj,
      id
    });
    __privateGet(this, _graph).edges.set(edge.id, edge);
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
    return __privateGet(this, _graph).toObject();
  }
  async run() {
    await __privateGet(this, _graph).run();
  }
}
_graph = new WeakMap();
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
class DflowNodeIsUndefined extends DflowNode {
  run() {
    this.output(0).data = typeof this.input(0).data === "undefined";
  }
}
__publicField(DflowNodeIsUndefined, "kind", "isUndefined");
__publicField(DflowNodeIsUndefined, "inputs", [
  input()
]);
__publicField(DflowNodeIsUndefined, "outputs", [
  output("boolean")
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
  [DflowNodeIsUndefined.kind]: DflowNodeIsUndefined,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeReturn.kind]: DflowNodeReturn
};
class DflowError extends Error {
  constructor(arg, errorClassName) {
    super(JSON.stringify({
      error: errorClassName,
      ...arg
    }));
  }
}
class DflowErrorCannotConnectPins extends DflowError {
  constructor(arg) {
    super(arg, "DflowErrorCannotConnectPins");
  }
}
class DflowErrorItemNotFound extends DflowError {
  constructor(arg) {
    super(arg, "DflowErrorItemNotFound");
  }
}
