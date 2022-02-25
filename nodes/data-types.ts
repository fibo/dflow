import { DflowNode } from "../engine.ts";

class DflowData extends DflowNode {
  static kind = "data";
  static isConstant = true;
  static outputs = DflowNode.out();
}

class DflowArray extends DflowNode {
  static kind = "array";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["array"]);
  run() {
    const data = this.input(0).data;
    if (Array.isArray(data)) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowBoolean extends DflowNode {
  static kind = "boolean";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    if (typeof data === "boolean") {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowNumber extends DflowNode {
  static kind = "number";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["number"]);
  run() {
    const data = this.input(0).data;
    if (typeof data === "number") {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowObject extends DflowNode {
  static kind = "object";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["object"]);
  run() {
    const data = this.input(0).data;
    if (typeof data === "object" && data !== null) {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
}

class DflowString extends DflowNode {
  static kind = "string";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["string"]);
  run() {
    const data = this.input(0).data;
    if (typeof data === "string") {
      this.output(0).data = data;
    } else {
      this.output(0).clear();
    }
  }
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
