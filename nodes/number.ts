import { DflowNode } from "../engine.ts";

class DflowIsFinite extends DflowNode.Task {
  static kind = "isFinite";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return Number.isFinite(this.input(0).data);
  }
}

class DflowIsInteger extends DflowNode.Task {
  static kind = "isInteger";
  static inputs = DflowNode.in([]);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return Number.isInteger(this.input(0).data);
  }
}

class DflowIsNaN extends DflowNode.Task {
  static kind = "isNaN";
  static inputs = DflowNode.in([]);
  static outputs = DflowNode.out(["boolean"]);

  task() {
    return Number.isNaN(this.input(0).data);
  }
}

class DflowParseFloat extends DflowNode.Task {
  static kind = "parseFloat";
  static inputs = DflowNode.in(["string"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return parseFloat(this.input(0).data as string);
  }
}

class DflowParseInt extends DflowNode.Task {
  static kind = "parseInt";
  static inputs = DflowNode.in(["number", "string"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return parseInt(this.input(0).data as string);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsInteger.kind]: DflowIsInteger,
  [DflowIsNaN.kind]: DflowIsNaN,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
