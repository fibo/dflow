import { DflowNode } from "../dflow.ts";

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

class DflowIsDefined extends DflowNode {
  static kind = "isDefined";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    this.output(0).data = typeof data !== "undefined";
  }
}

class DflowIsUndefined extends DflowNode {
  static kind = "isUndefined";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    this.output(0).data = typeof data === "undefined";
  }
}

export const catalog = {
  [DflowData.kind]: DflowData,
  [DflowIsDefined.kind]: DflowIsDefined,
  [DflowIsUndefined.kind]: DflowIsUndefined,
  [DflowArray.kind]: DflowArray,
  [DflowBoolean.kind]: DflowBoolean,
  [DflowNumber.kind]: DflowNumber,
  [DflowObject.kind]: DflowObject,
  [DflowString.kind]: DflowString,
};
