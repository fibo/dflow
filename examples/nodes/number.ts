import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class DflowIsFinite extends DflowNode {
  static kind = "isFinite";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = Number.isFinite(this.input(0).data);
  }
}

class DflowIsInteger extends DflowNode {
  static kind = "isInteger";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = Number.isInteger(this.input(0).data);
  }
}

class DflowParseFloat extends DflowNode {
  static kind = "parseFloat";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = parseFloat(this.input(0).data as string);
  }
}

class DflowParseInt extends DflowNode {
  static kind = "parseInt";
  static inputs = [input(["number", "string"])];
  static outputs = [output("number")];
  run() {
    this.output(0).data = parseInt(this.input(0).data as string);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsInteger.kind]: DflowIsInteger,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
