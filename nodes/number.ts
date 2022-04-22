import { DflowNode } from "../dflow.ts";

class DflowIsFinite extends DflowNode {
  static kind = "isFinite";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = Number.isFinite(this.input(0).data);
  }
}

class DflowIsInteger extends DflowNode {
  static kind = "isInteger";
  static inputs = DflowNode.in([]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = Number.isInteger(this.input(0).data);
  }
}

class DflowIsNaN extends DflowNode {
  static kind = "isNaN";
  static inputs = DflowNode.in([]);
  static outputs = DflowNode.out(["boolean"]);

  run() {
    this.output(0).data = Number.isNaN(this.input(0).data);
  }
}

class DflowParseFloat extends DflowNode {
  static kind = "parseFloat";
  static inputs = DflowNode.in(["string"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = parseFloat(this.input(0).data as string);
  }
}

class DflowParseInt extends DflowNode {
  static kind = "parseInt";
  static inputs = DflowNode.in(["number", "string"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = parseInt(this.input(0).data as string);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsInteger.kind]: DflowIsInteger,
  [DflowIsNaN.kind]: DflowIsNaN,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
