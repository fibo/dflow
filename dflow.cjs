var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);
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
  DflowItem: () => DflowItem,
  DflowNode: () => DflowNode,
  DflowNodeUnknown: () => DflowNodeUnknown,
  DflowOutput: () => DflowOutput,
  DflowPin: () => DflowPin
});
var _source, _sources, _data, _inputs, _outputs, _inputPosition, _outputPosition, _graph;
class DflowError extends Error {
  constructor(arg, errorClassName) {
    super(JSON.stringify(__spreadValues({
      error: errorClassName
    }, arg)));
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
const _executionNodeInfo = ({ id: id1, kind, outputs }, error) => {
  const obj = {
    id: id1,
    kind,
    outputs: outputs == null ? void 0 : outputs.map(({ id, data, name }) => ({
      id,
      data,
      name
    }))
  };
  if (error) {
    obj.error = error;
  }
  return obj;
};
const _DflowData = class {
  static isArray(data) {
    if (!Array.isArray(data))
      return false;
    return true;
  }
  static isBoolean(data) {
    return typeof data === "boolean";
  }
  static isDflowId(data) {
    return typeof data === "string" && data !== "";
  }
  static isObject(data) {
    if (typeof data !== "object" || !data || Array.isArray(data))
      return false;
    return true;
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
    if (types.length === 0) {
      return true;
    }
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
__publicField(DflowData, "types", [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId"
]);
class DflowItem {
  constructor({ id }) {
    __publicField(this, "id");
    this.id = id;
  }
  toObject() {
    return {
      id: this.id
    };
  }
}
class DflowPin extends DflowItem {
  constructor({ id, name, types = [] }) {
    super({
      id
    });
    __publicField(this, "name");
    __publicField(this, "types");
    if (name) {
      this.name = name;
    }
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
  constructor(_a) {
    var _b = _a, { multi, optional } = _b, pin = __objRest(_b, ["multi", "optional"]);
    super(pin);
    __publicField(this, "multi");
    __publicField(this, "optional");
    __privateAdd(this, _source, void 0);
    __privateAdd(this, _sources, void 0);
    if (multi) {
      this.multi = multi;
    }
    if (optional) {
      this.optional = optional;
    }
  }
  get data() {
    var _a, _b;
    if (this.multi) {
      const sources = Array.from((_a = __privateGet(this, _sources)) != null ? _a : []);
      return sources.length ? sources.map((output1) => output1.data) : void 0;
    } else {
      return (_b = __privateGet(this, _source)) == null ? void 0 : _b.data;
    }
  }
  get isConnected() {
    var _a;
    return this.multi ? Array.from((_a = __privateGet(this, _sources)) != null ? _a : []).length > 0 : typeof __privateGet(this, _source) === "undefined";
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
    if (this.multi) {
      if (!__privateGet(this, _sources)) {
        __privateSet(this, _sources, /* @__PURE__ */ new Set());
      }
      __privateGet(this, _sources).add(pin);
    } else {
      __privateSet(this, _source, pin);
    }
  }
  disconnect() {
    var _a;
    this.multi ? (_a = __privateGet(this, _sources)) == null ? void 0 : _a.clear() : __privateSet(this, _source, void 0);
  }
  toObject() {
    return super.toObject();
  }
}
_source = new WeakMap();
_sources = new WeakMap();
class DflowOutput extends DflowPin {
  constructor(_c) {
    var _d = _c, { data } = _d, pin = __objRest(_d, ["data"]);
    super(pin);
    __privateAdd(this, _data, void 0);
    __privateSet(this, _data, data);
  }
  clear() {
    __privateSet(this, _data, void 0);
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
  toObject() {
    const obj = super.toObject();
    if (typeof __privateGet(this, _data) !== "undefined") {
      obj.data = __privateGet(this, _data);
    }
    return obj;
  }
}
_data = new WeakMap();
class DflowNode extends DflowItem {
  constructor(_e) {
    var _f = _e, { node: _g } = _f, _h = _g, { kind, inputs = [], outputs = [] } = _h, item = __objRest(_h, ["kind", "inputs", "outputs"]), { host } = _f;
    super(item);
    __privateAdd(this, _inputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _outputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _inputPosition, []);
    __privateAdd(this, _outputPosition, []);
    __publicField(this, "kind");
    __publicField(this, "host");
    this.kind = kind;
    this.host = host;
    const generateInputId = (i) => {
      const id = `i${i}`;
      return __privateGet(this, _inputs).has(id) ? generateInputId(i + 1) : id;
    };
    for (const obj of inputs) {
      const numInputs = __privateGet(this, _inputs).size;
      const id = DflowData.isDflowId(obj.id) ? obj.id : generateInputId(numInputs);
      const pin = new DflowInput(__spreadProps(__spreadValues({}, obj), {
        id
      }));
      __privateGet(this, _inputs).set(id, pin);
      __privateGet(this, _inputPosition).push(id);
    }
    const generateOutputId = (i) => {
      const id = `o${i}`;
      return __privateGet(this, _outputs).has(id) ? generateOutputId(i + 1) : id;
    };
    for (const obj1 of outputs) {
      const numOutputs = __privateGet(this, _outputs).size;
      const id = DflowData.isDflowId(obj1.id) ? obj1.id : generateOutputId(numOutputs);
      const pin = new DflowOutput(__spreadProps(__spreadValues({}, obj1), {
        id
      }));
      __privateGet(this, _outputs).set(id, pin);
      __privateGet(this, _outputPosition).push(id);
    }
  }
  static input(typing = [], rest) {
    return __spreadValues({
      types: typeof typing === "string" ? [
        typing
      ] : typing
    }, rest);
  }
  static output(typing = [], rest) {
    return __spreadValues({
      types: typeof typing === "string" ? [
        typing
      ] : typing
    }, rest);
  }
  get inputs() {
    return __privateGet(this, _inputs).values();
  }
  get outputs() {
    return __privateGet(this, _outputs).values();
  }
  clearOutputs() {
    for (const output2 of this.outputs) {
      output2.clear();
    }
  }
  getInputById(id) {
    const item = __privateGet(this, _inputs).get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({
        kind: "input",
        id
      });
    }
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
    if (!item) {
      throw new DflowErrorItemNotFound({
        kind: "output",
        id
      });
    }
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
    const obj = __spreadProps(__spreadValues({}, super.toObject()), {
      kind: this.kind
    });
    const inputs = [];
    const outputs = [];
    for (const input1 of this.inputs) {
      inputs.push(input1.toObject());
    }
    if (inputs.length > 0) {
      obj.inputs = inputs;
    }
    for (const output3 of this.outputs) {
      outputs.push(output3.toObject());
    }
    if (outputs.length > 0) {
      obj.outputs = outputs;
    }
    return obj;
  }
}
_inputs = new WeakMap();
_outputs = new WeakMap();
_inputPosition = new WeakMap();
_outputPosition = new WeakMap();
__publicField(DflowNode, "kind");
__publicField(DflowNode, "isAsync");
__publicField(DflowNode, "isConstant");
__publicField(DflowNode, "inputs");
__publicField(DflowNode, "outputs");
class DflowEdge extends DflowItem {
  constructor(_i) {
    var _j = _i, { source, target } = _j, item = __objRest(_j, ["source", "target"]);
    super(item);
    __publicField(this, "source");
    __publicField(this, "target");
    this.source = source;
    this.target = target;
  }
  toObject() {
    return __spreadProps(__spreadValues({}, super.toObject()), {
      source: this.source,
      target: this.target
    });
  }
}
class DflowGraph {
  constructor({ nodesCatalog = {} } = {}) {
    __publicField(this, "nodesCatalog");
    __publicField(this, "nodes", /* @__PURE__ */ new Map());
    __publicField(this, "edges", /* @__PURE__ */ new Map());
    __publicField(this, "runOptions", {
      verbose: false
    });
    __publicField(this, "runStatus", null);
    __publicField(this, "executionReport", null);
    this.nodesCatalog = __spreadValues(__spreadValues({}, nodesCatalog), coreNodesCatalog);
  }
  static childrenOfNodeId(nodeId, nodeConnections) {
    return nodeConnections.filter(({ sourceId }) => nodeId === sourceId).map(({ targetId }) => targetId);
  }
  static parentsOfNodeId(nodeId, nodeConnections) {
    return nodeConnections.filter(({ targetId }) => nodeId === targetId).map(({ sourceId }) => sourceId);
  }
  static levelOfNodeId(nodeId, nodeConnections) {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0) {
      return 0;
    }
    let maxLevel = 0;
    for (const parentNodeId of parentsNodeIds) {
      const level = DflowGraph.levelOfNodeId(parentNodeId, nodeConnections);
      maxLevel = Math.max(level, maxLevel);
    }
    return maxLevel + 1;
  }
  static ancestorsOfNodeId(nodeId, nodeConnections) {
    const parentsNodeIds = DflowGraph.parentsOfNodeId(nodeId, nodeConnections);
    if (parentsNodeIds.length === 0) {
      return [];
    } else {
      return parentsNodeIds.reduce((accumulator, parentNodeId, index, array) => {
        const ancestors = DflowGraph.ancestorsOfNodeId(parentNodeId, nodeConnections);
        const result = accumulator.concat(ancestors);
        return index === array.length - 1 ? Array.from(new Set(array.concat(result))) : result;
      }, []);
    }
  }
  static sortNodesByLevel(nodeIds, nodeConnections) {
    const levelOf = {};
    for (const nodeId of nodeIds) {
      levelOf[nodeId] = DflowGraph.levelOfNodeId(nodeId, nodeConnections);
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
        ancestorsOfReturnNodes.push(DflowGraph.ancestorsOfNodeId(node.id, this.nodeConnections));
      }
    }
    return Array.from(new Set(ancestorsOfReturnNodes.flat()));
  }
  async run() {
    var _a, _b, _c;
    const { verbose } = this.runOptions;
    this.runStatus = "waiting";
    this.executionReport = {
      status: this.runStatus,
      start: new Date()
    };
    if (verbose) {
      this.executionReport.steps = [];
    }
    const nodeIdsExcluded = this.nodeIdsInsideFunctions;
    const nodeIds = DflowGraph.sortNodesByLevel([
      ...this.nodes.keys()
    ].filter((nodeId) => !nodeIdsExcluded.includes(nodeId)), this.nodeConnections);
    NODES_LOOP:
      for (const nodeId1 of nodeIds) {
        const node = this.nodes.get(nodeId1);
        const NodeClass = (_a = this.nodesCatalog[node.kind]) != null ? _a : DflowNodeUnknown;
        const { isAsync, isConstant } = NodeClass;
        try {
          if (!isConstant) {
            INPUTS_LOOP:
              for (const { id, data, types, optional } of node.inputs) {
                if (optional && typeof data === "undefined") {
                  continue INPUTS_LOOP;
                }
                if (DflowData.isValidDataType(types, data)) {
                  continue INPUTS_LOOP;
                }
                if (verbose) {
                  (_b = this.executionReport.steps) == null ? void 0 : _b.push(_executionNodeInfo(node.toObject(), `invalid input data nodeId=${nodeId1} inputId=${id} data=${data}`));
                }
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
            (_c = this.executionReport.steps) == null ? void 0 : _c.push(_executionNodeInfo(node.toObject()));
          }
        } catch (error) {
          console.error(error);
          this.runStatus = "failure";
        }
      }
    if (this.runStatus === "waiting") {
      this.runStatus = "success";
    }
    this.executionReport.status = this.runStatus;
    this.executionReport.end = new Date();
  }
  toObject() {
    const obj = {
      nodes: [],
      edges: []
    };
    for (const node of this.nodes.values()) {
      obj.nodes.push(node.toObject());
    }
    for (const edge of this.edges.values()) {
      obj.edges.push(edge.toObject());
    }
    return obj;
  }
}
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
  get runStatusIsSuccess() {
    return __privateGet(this, _graph).runStatus === "success";
  }
  get runStatusIsWaiting() {
    return __privateGet(this, _graph).runStatus === "waiting";
  }
  get runStatusIsFailure() {
    return __privateGet(this, _graph).runStatus === "failure";
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
    var _a, _b, _c;
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
      const node = this.getNodeById(nodeId);
      const NodeClass = (_a = this.nodesCatalog[node.kind]) != null ? _a : DflowNodeUnknown;
      const { isAsync, isConstant } = NodeClass;
      try {
        switch (node.kind) {
          case DflowNodeArgument.kind: {
            const position = node.input(0).data;
            const index = typeof position === "number" && !isNaN(position) ? Math.max(position, 0) : 0;
            node.output(0).data = args[index];
            break;
          }
          case DflowNodeReturn.kind: {
            return node.input(1).data;
          }
          default: {
            if (!isConstant && !isAsync) {
              node.run();
            }
            if (verbose) {
              (_c = (_b = this.executionReport) == null ? void 0 : _b.steps) == null ? void 0 : _c.push(_executionNodeInfo(node.toObject()));
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
    if (!item) {
      throw new DflowErrorItemNotFound({
        kind: "edge",
        id
      });
    }
    return item;
  }
  getNodeById(id) {
    const item = __privateGet(this, _graph).nodes.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound({
        kind: "node",
        id
      });
    }
    return item;
  }
  newNode(obj) {
    var _a, _b, _c, _d, _e;
    const numNodes = __privateGet(this, _graph).nodes.size;
    const generateNodeId = (i = numNodes) => {
      const id = `n${i}`;
      return __privateGet(this, _graph).nodes.has(id) ? generateNodeId(i + 1) : id;
    };
    const NodeClass = (_a = this.nodesCatalog[obj.kind]) != null ? _a : DflowNodeUnknown;
    const id2 = DflowData.isDflowId(obj.id) ? obj.id : generateNodeId();
    const inputs = (_c = (_b = NodeClass.inputs) == null ? void 0 : _b.map((pin, i) => {
      var _a2, _b2;
      const objPin = (_b2 = (_a2 = obj.inputs) == null ? void 0 : _a2[i]) != null ? _b2 : {};
      const id = DflowData.isDflowId(objPin == null ? void 0 : objPin.id) ? objPin.id : `i${i}`;
      return __spreadValues(__spreadValues({
        id
      }, objPin), pin);
    })) != null ? _c : [];
    const outputs = (_e = (_d = NodeClass.outputs) == null ? void 0 : _d.map((pin, i) => {
      var _a2, _b2;
      const objPin = (_b2 = (_a2 = obj.outputs) == null ? void 0 : _a2[i]) != null ? _b2 : {};
      const id = DflowData.isDflowId(objPin == null ? void 0 : objPin.id) ? objPin.id : `o${i}`;
      return __spreadValues(__spreadValues({
        id
      }, objPin), pin);
    })) != null ? _e : [];
    const node = new NodeClass({
      node: __spreadProps(__spreadValues({}, obj), {
        id: id2,
        inputs,
        outputs
      }),
      host: this
    });
    __privateGet(this, _graph).nodes.set(node.id, node);
    return node;
  }
  newEdge(obj) {
    const numEdges = __privateGet(this, _graph).edges.size;
    const generateEdgeId = (i = numEdges) => {
      const id = `e${i}`;
      return __privateGet(this, _graph).edges.has(id) ? generateEdgeId(i + 1) : id;
    };
    const id3 = DflowData.isDflowId(obj.id) ? obj.id : generateEdgeId();
    const edge = new DflowEdge(__spreadProps(__spreadValues({}, obj), {
      id: id3
    }));
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
__publicField(DflowNodeArgument, "isConstant", true);
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
  constructor(_k) {
    var _l = _k, { node: _m } = _l, _n = _m, { outputs } = _n, node = __objRest(_n, ["outputs"]), { host } = _l;
    super({
      node: __spreadProps(__spreadValues({}, node), {
        outputs: outputs == null ? void 0 : outputs.map((output4) => __spreadProps(__spreadValues({}, output4), {
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
          }(output4.data)
        }))
      }),
      host
    });
  }
}
__publicField(DflowNodeData, "kind", "data");
__publicField(DflowNodeData, "isConstant", true);
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
__publicField(DflowNodeFunction, "isConstant", true);
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
__publicField(DflowNodeReturn, "isConstant", true);
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
module.exports = __toCommonJS(stdin_exports);
