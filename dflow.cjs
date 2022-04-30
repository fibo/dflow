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
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var stdin_exports = {};
__export(stdin_exports, {
  DflowData: () => DflowData,
  DflowEdge: () => DflowEdge,
  DflowGraph: () => DflowGraph,
  DflowHost: () => DflowHost,
  DflowInput: () => DflowInput,
  DflowItem: () => DflowItem,
  DflowNode: () => DflowNode,
  DflowOutput: () => DflowOutput,
  DflowPin: () => DflowPin
});
var _multi, _optional, _source, _sources, _data, _host, _inputs, _outputs, _inputPosition, _outputPosition, _graph, _generateInputIds, generateInputIds_fn, _generateOutputIds, generateOutputIds_fn;
class DflowErrorItemNotFound extends Error {
  constructor(kind, id) {
    super(`${kind} not found id=${id}`);
  }
}
const _missingString = (stringName) => `${stringName} must be a string`;
const _missingPin = (nodeId, kind) => `${kind} pin not found nodeId=${nodeId}`;
const _missingPinAtPosition = (nodeId, kind, position) => `${_missingPin(nodeId, kind)} position=${position}`;
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
class DflowData {
  static isArray(data) {
    if (!Array.isArray(data))
      return false;
    return true;
  }
  static isBoolean(data) {
    return typeof data === "boolean";
  }
  static isDflowId(data) {
    return DflowData.isStringNotEmpty(data);
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
  static isStringNotEmpty(data) {
    return DflowData.isString(data) && data !== "";
  }
  static validate(data, types) {
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
class DflowItem {
  constructor({ id, name }) {
    __publicField(this, "id");
    __publicField(this, "name");
    this.id = id;
    this.name = name;
  }
  toObject() {
    const obj = {
      id: this.id
    };
    if (typeof this.name === "string") {
      obj.name = this.name;
    }
    return obj;
  }
}
class DflowPin extends DflowItem {
  constructor(kind, _a) {
    var _b = _a, { types = [] } = _b, pin = __objRest(_b, ["types"]);
    super(pin);
    __publicField(this, "kind");
    __publicField(this, "types");
    this.kind = kind;
    this.types = types;
  }
  get hasTypeAny() {
    return this.types.length === 0;
  }
  hasType(type) {
    return this.hasTypeAny || this.types.includes(type);
  }
  toObject() {
    const obj = super.toObject();
    if (this.types.length > 0) {
      obj.types = this.types;
    }
    return obj;
  }
}
__publicField(DflowPin, "types", [
  "string",
  "number",
  "boolean",
  "object",
  "array",
  "DflowId"
]);
class DflowInput extends DflowPin {
  constructor(_c) {
    var _d = _c, { multi, optional } = _d, pin = __objRest(_d, ["multi", "optional"]);
    super("input", pin);
    __privateAdd(this, _multi, void 0);
    __privateAdd(this, _optional, void 0);
    __privateAdd(this, _source, void 0);
    __privateAdd(this, _sources, void 0);
    __privateSet(this, _multi, multi);
    __privateSet(this, _optional, optional);
  }
  get data() {
    var _a, _b;
    if (__privateGet(this, _multi)) {
      const sources = Array.from((_a = __privateGet(this, _sources)) != null ? _a : []);
      return sources.length ? sources.map((output1) => output1.data) : void 0;
    } else {
      return (_b = __privateGet(this, _source)) == null ? void 0 : _b.data;
    }
  }
  get isConnected() {
    var _a;
    return __privateGet(this, _multi) ? Array.from((_a = __privateGet(this, _sources)) != null ? _a : []).length > 0 : typeof __privateGet(this, _source) === "undefined";
  }
  get isMulti() {
    return __privateGet(this, _multi);
  }
  get isOptional() {
    return __privateGet(this, _optional);
  }
  connectTo(pin) {
    const { hasTypeAny: targetHasTypeAny, types: targetTypes } = this;
    const { types: sourceTypes } = pin;
    const canConnect = targetHasTypeAny || targetTypes.some((pinType) => sourceTypes.includes(pinType));
    if (canConnect) {
      if (__privateGet(this, _multi)) {
        if (!__privateGet(this, _sources)) {
          __privateSet(this, _sources, /* @__PURE__ */ new Set());
        }
        __privateGet(this, _sources).add(pin);
      } else {
        __privateSet(this, _source, pin);
      }
    } else {
      throw new Error(`mismatching pinTypes, source has types [${sourceTypes.join()}] and target has types [${targetTypes.join()}]`);
    }
  }
  disconnect() {
    var _a;
    __privateGet(this, _multi) ? (_a = __privateGet(this, _sources)) == null ? void 0 : _a.clear() : __privateSet(this, _source, void 0);
  }
  toObject() {
    return super.toObject();
  }
}
_multi = new WeakMap();
_optional = new WeakMap();
_source = new WeakMap();
_sources = new WeakMap();
class DflowOutput extends DflowPin {
  constructor(_e) {
    var _f = _e, { data } = _f, pin = __objRest(_f, ["data"]);
    super("output", pin);
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
        throw new Error(`could not set data pinTypes=${JSON.stringify(this.types)} typeof data is ${typeof data}`);
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
  constructor(_g) {
    var _h = _g, { node: _i } = _h, _j = _i, { kind, inputs = [], outputs = [] } = _j, item = __objRest(_j, ["kind", "inputs", "outputs"]), { host, meta } = _h;
    super(item);
    __privateAdd(this, _host, void 0);
    __privateAdd(this, _inputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _outputs, /* @__PURE__ */ new Map());
    __privateAdd(this, _inputPosition, []);
    __privateAdd(this, _outputPosition, []);
    __publicField(this, "kind");
    __publicField(this, "isAsync");
    __publicField(this, "isConstant");
    __privateSet(this, _host, host);
    this.kind = kind;
    if ((meta == null ? void 0 : meta.isConstant) === true) {
      this.isConstant = meta.isConstant;
    }
    if ((meta == null ? void 0 : meta.isAsync) === true) {
      this.isAsync = meta.isAsync;
    }
    for (const pin of inputs) {
      this.newInput(pin);
    }
    for (const pin1 of outputs) {
      this.newOutput(pin1);
    }
  }
  static input(typing = [], rest) {
    if (typeof typing === "string") {
      return __spreadValues({
        types: [
          typing
        ]
      }, rest);
    }
    return __spreadValues({
      types: typing
    }, rest);
  }
  static output(typing = [], rest) {
    if (typeof typing === "string") {
      return __spreadValues({
        types: [
          typing
        ]
      }, rest);
    }
    return __spreadValues({
      types: typing
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
      throw new DflowErrorItemNotFound("input", id);
    }
    return item;
  }
  input(position) {
    const pinId = __privateGet(this, _inputPosition)[position];
    if (!pinId) {
      throw new Error(_missingPinAtPosition(this.id, "input", position));
    }
    return this.getInputById(pinId);
  }
  getOutputById(id) {
    const item = __privateGet(this, _outputs).get(id);
    if (!item) {
      throw new DflowErrorItemNotFound("output", id);
    }
    return item;
  }
  output(position) {
    const pinId = __privateGet(this, _outputPosition)[position];
    if (!pinId) {
      throw new Error(_missingPinAtPosition(this.id, "output", position));
    }
    return this.getOutputById(pinId);
  }
  deleteInput(pinId) {
    __privateGet(this, _host).deleteEdgesConnectedToPin([
      this.id,
      pinId
    ]);
    __privateGet(this, _inputs).delete(pinId);
    __privateGet(this, _inputPosition).splice(__privateGet(this, _inputPosition).indexOf(pinId), 1);
  }
  deleteOutput(pinId) {
    __privateGet(this, _host).deleteEdgesConnectedToPin([
      this.id,
      pinId
    ]);
    __privateGet(this, _outputs).delete(pinId);
    __privateGet(this, _outputPosition).splice(__privateGet(this, _outputPosition).indexOf(pinId), 1);
  }
  newInput(obj) {
    const numInputs = __privateGet(this, _inputs).size;
    const generateInputId = (i = numInputs) => {
      const id = `i${i}`;
      return __privateGet(this, _inputs).has(id) ? generateInputId(i + 1) : id;
    };
    const id2 = DflowData.isDflowId(obj.id) ? obj.id : generateInputId();
    const pin = new DflowInput(__spreadProps(__spreadValues({}, obj), {
      id: id2
    }));
    __privateGet(this, _inputs).set(id2, pin);
    __privateGet(this, _inputPosition).push(id2);
    return pin;
  }
  newOutput(obj) {
    const numOutputs = __privateGet(this, _outputs).size;
    const generateOutputId = (i = numOutputs) => {
      const id = `o${i}`;
      return __privateGet(this, _outputs).has(id) ? generateOutputId(i + 1) : id;
    };
    const id3 = DflowData.isDflowId(obj.id) ? obj.id : generateOutputId();
    const pin = new DflowOutput(__spreadProps(__spreadValues({}, obj), {
      id: id3
    }));
    __privateGet(this, _outputs).set(id3, pin);
    __privateGet(this, _outputPosition).push(id3);
    return pin;
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
_host = new WeakMap();
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
  constructor(_k) {
    var _l = _k, { source, target } = _l, item = __objRest(_l, ["source", "target"]);
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
  constructor() {
    __publicField(this, "nodes", /* @__PURE__ */ new Map());
    __publicField(this, "edges", /* @__PURE__ */ new Map());
    __publicField(this, "runOptions", {
      verbose: false
    });
    __publicField(this, "runStatus", null);
    __publicField(this, "executionReport", null);
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
    var _a, _b;
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
        try {
          if (!node.isConstant) {
            let someInputIsNotValid = false;
            INPUTS_LOOP:
              for (const { id, data, types, isOptional } of node.inputs) {
                if (isOptional && typeof data === "undefined") {
                  continue INPUTS_LOOP;
                }
                if (!DflowData.validate(data, types)) {
                  someInputIsNotValid = true;
                  if (verbose) {
                    (_a = this.executionReport.steps) == null ? void 0 : _a.push(_executionNodeInfo(node.toObject(), `invalid input data nodeId=${nodeId1} inputId=${id} data=${data}`));
                  }
                  break INPUTS_LOOP;
                }
              }
            if (someInputIsNotValid) {
              for (const output4 of node.outputs) {
                output4.clear();
              }
              continue NODES_LOOP;
            }
            if (node.isAsync) {
              await node.run();
            } else {
              node.run();
            }
          }
          if (verbose) {
            (_b = this.executionReport.steps) == null ? void 0 : _b.push(_executionNodeInfo(node.toObject()));
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
const _DflowHost = class {
  constructor(nodesCatalog = {}) {
    __privateAdd(this, _graph, void 0);
    __publicField(this, "nodesCatalog");
    __publicField(this, "context");
    this.nodesCatalog = __spreadValues(__spreadValues({}, nodesCatalog), coreNodesCatalog);
    __privateSet(this, _graph, new DflowGraph());
    this.context = {};
  }
  get executionReport() {
    return __privateGet(this, _graph).executionReport;
  }
  get edges() {
    return Array.from(__privateGet(this, _graph).edges.values());
  }
  get nodes() {
    return Array.from(__privateGet(this, _graph).nodes.values());
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
    if (typeof edgeId !== "string") {
      throw new TypeError(_missingString("edgeId"));
    }
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
    if (typeof nodeId !== "string") {
      throw new TypeError(_missingString("nodeId"));
    }
    const node = this.getNodeById(nodeId);
    if (node) {
      for (const edge of this.edges) {
        const { source: [sourceNodeId], target: [targetNodeId] } = edge;
        if (sourceNodeId === node.id || targetNodeId === node.id) {
          this.deleteEdge(edge.id);
        }
      }
      __privateGet(this, _graph).nodes.delete(nodeId);
    } else {
      throw new Error(`DflowNode not found, id=${nodeId}`);
    }
  }
  deleteEdgesConnectedToPin([nodeId, pinId]) {
    for (const edge of this.edges) {
      const [sourceNodeId, sourcePinId] = edge.source;
      const [targetNodeId, targetPinId] = edge.target;
      if (sourceNodeId === nodeId && sourcePinId === pinId || targetNodeId === nodeId && targetPinId === pinId) {
        this.deleteEdge(edge.id);
      }
    }
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
      const node = this.getNodeById(nodeId);
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
            if (!node.isConstant && !node.isAsync) {
              node.run();
            }
            if (verbose) {
              (_b = (_a = this.executionReport) == null ? void 0 : _a.steps) == null ? void 0 : _b.push(_executionNodeInfo(node.toObject()));
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
      throw new DflowErrorItemNotFound("edge", id);
    }
    return item;
  }
  getNodeById(id) {
    const item = __privateGet(this, _graph).nodes.get(id);
    if (!item) {
      throw new DflowErrorItemNotFound("node", id);
    }
    return item;
  }
  newNode(obj) {
    var _a, _b, _c, _d, _e, _f, _g;
    const numNodes = __privateGet(this, _graph).nodes.size;
    const generateNodeId = (i = numNodes) => {
      const id = `n${i}`;
      return __privateGet(this, _graph).nodes.has(id) ? generateNodeId(i + 1) : id;
    };
    const NodeClass = (_a = this.nodesCatalog[obj.kind]) != null ? _a : DflowNodeUnknown;
    const id4 = DflowData.isDflowId(obj.id) ? obj.id : generateNodeId();
    const meta = {
      isAsync: NodeClass.isAsync,
      isConstant: NodeClass.isConstant
    };
    const inputs = Array.isArray(obj.inputs) ? __privateMethod(_b = _DflowHost, _generateInputIds, generateInputIds_fn).call(_b, obj.inputs) : __privateMethod(_d = _DflowHost, _generateInputIds, generateInputIds_fn).call(_d, (_c = NodeClass.inputs) != null ? _c : []);
    const outputs = Array.isArray(obj.outputs) ? __privateMethod(_e = _DflowHost, _generateOutputIds, generateOutputIds_fn).call(_e, obj.outputs) : __privateMethod(_g = _DflowHost, _generateOutputIds, generateOutputIds_fn).call(_g, (_f = NodeClass.outputs) != null ? _f : []);
    const node = new NodeClass({
      node: __spreadProps(__spreadValues({}, obj), {
        id: id4,
        inputs,
        outputs
      }),
      host: this,
      meta
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
    const id5 = DflowData.isDflowId(obj.id) ? obj.id : generateEdgeId();
    const edge = new DflowEdge(__spreadProps(__spreadValues({}, obj), {
      id: id5
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
  newInput(nodeId, obj) {
    const node = this.getNodeById(nodeId);
    return node.newInput(obj);
  }
  newOutput(nodeId, obj) {
    const node = this.getNodeById(nodeId);
    return node.newOutput(obj);
  }
  toObject() {
    return __privateGet(this, _graph).toObject();
  }
  async run() {
    await __privateGet(this, _graph).run();
  }
};
let DflowHost = _DflowHost;
_graph = new WeakMap();
_generateInputIds = new WeakSet();
generateInputIds_fn = function(pins = []) {
  return pins.map((pin, i) => __spreadProps(__spreadValues({}, pin), {
    id: DflowData.isDflowId(pin.id) ? pin.id : `i${i}`
  }));
};
_generateOutputIds = new WeakSet();
generateOutputIds_fn = function(pins1 = []) {
  return pins1.map((pin, i) => __spreadProps(__spreadValues({}, pin), {
    id: DflowData.isDflowId(pin.id) ? pin.id : `o${i}`
  }));
};
__privateAdd(DflowHost, _generateInputIds);
__privateAdd(DflowHost, _generateOutputIds);
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
class DflowNodeArray extends DflowNode {
  run() {
    const data = this.input(0).data;
    if (DflowData.isArray(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}
__publicField(DflowNodeArray, "kind", "array");
__publicField(DflowNodeArray, "inputs", [
  input()
]);
__publicField(DflowNodeArray, "outputs", [
  output("array")
]);
class DflowNodeBoolean extends DflowNode {
  run() {
    const data = this.input(0).data;
    if (DflowData.isBoolean(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}
__publicField(DflowNodeBoolean, "kind", "boolean");
__publicField(DflowNodeBoolean, "inputs", [
  input()
]);
__publicField(DflowNodeBoolean, "outputs", [
  output("boolean")
]);
class DflowNodeData extends DflowNode {
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
class DflowNodeNumber extends DflowNode {
  run() {
    const data = this.input(0).data;
    if (DflowData.isNumber(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}
__publicField(DflowNodeNumber, "kind", "number");
__publicField(DflowNodeNumber, "inputs", [
  input()
]);
__publicField(DflowNodeNumber, "outputs", [
  output("number")
]);
class DflowNodeObject extends DflowNode {
  run() {
    const data = this.input(0).data;
    if (DflowData.isObject(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}
__publicField(DflowNodeObject, "kind", "object");
__publicField(DflowNodeObject, "inputs", [
  input()
]);
__publicField(DflowNodeObject, "outputs", [
  output("object")
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
class DflowNodeString extends DflowNode {
  run() {
    const data = this.input(0).data;
    if (DflowData.isString(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}
__publicField(DflowNodeString, "kind", "string");
__publicField(DflowNodeString, "inputs", [
  input()
]);
__publicField(DflowNodeString, "outputs", [
  output("string")
]);
class DflowNodeUnknown extends DflowNode {
}
const coreNodesCatalog = {
  [DflowNodeArgument.kind]: DflowNodeArgument,
  [DflowNodeArray.kind]: DflowNodeArray,
  [DflowNodeBoolean.kind]: DflowNodeBoolean,
  [DflowNodeData.kind]: DflowNodeData,
  [DflowNodeIsUndefined.kind]: DflowNodeIsUndefined,
  [DflowNodeNumber.kind]: DflowNodeNumber,
  [DflowNodeObject.kind]: DflowNodeObject,
  [DflowNodeFunction.kind]: DflowNodeFunction,
  [DflowNodeString.kind]: DflowNodeString,
  [DflowNodeReturn.kind]: DflowNodeReturn
};
module.exports = __toCommonJS(stdin_exports);
