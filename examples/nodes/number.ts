import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class IsFinite extends DflowNode {
  static kind = "isFinite";
  static inputs = [input("number")];
  static outputs = [output("boolean")];
  run(input: number) {
    this.output(0).data = Number.isFinite(input);
  }
}

class IsInteger extends DflowNode {
  static kind = "isInteger";
  static inputs = [input()];
  static outputs = [output("boolean")];
  run(input: number) {
    this.output(0).data = Number.isInteger(input);
  }
}

class ParseFloat extends DflowNode {
  static kind = "parseFloat";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run(input: string) {
    this.output(0).data = parseFloat(input);
  }
}

export default [IsFinite, IsInteger, ParseFloat];
