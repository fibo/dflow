import { DflowNode } from "../engine.ts";

class DflowData extends DflowNode {
  static kind = "data";
  static outputs = DflowNode.out();
  static isConstant = true;
}

class DflowArray extends DflowNode {
  static kind = "array";
  static outputs = DflowNode.out(["array"]);
  static isConstant = true;
}

class DflowBoolean extends DflowNode {
  static kind = "boolean";
  static outputs = DflowNode.out(["boolean"]);
  static isConstant = true;
}

class DflowNumber extends DflowNode {
  static kind = "number";
  static outputs = DflowNode.out(["number"]);
  static isConstant = true;
}

class DflowObject extends DflowNode {
  static kind = "object";
  static outputs = DflowNode.out(["object"]);
  static isConstant = true;
}

class DflowString extends DflowNode {
  static kind = "string";
  static outputs = DflowNode.out(["string"]);
  static isConstant = true;
}

class DflowIsArray extends DflowNode {
  static kind = "isArray";
  static inputs = DflowNode.out();
  static outputs = DflowNode.out(["boolean"]);

  run() {
    const data = this.input(0).data;
    this.output(0).data = Array.isArray(data);
  }
}

export const catalog = {
  [DflowData.kind]: DflowData,
  [DflowArray.kind]: DflowArray,
  [DflowBoolean.kind]: DflowBoolean,
  [DflowNumber.kind]: DflowNumber,
  [DflowObject.kind]: DflowObject,
  [DflowString.kind]: DflowString,
  [DflowIsArray.kind]: DflowIsArray,
};
