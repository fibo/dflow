import { Dflow, DflowNode } from "../../dflow.ts";
import type { DflowArray } from "../../dflow.ts";

const { input, output } = Dflow;

class MathAbs extends DflowNode {
  static kind = "mathAbs";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    this.output(0).data = Math.abs(input);
  }
}

class MathCos extends DflowNode {
  static kind = "mathCos";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    this.output(0).data = Math.cos(input);
  }
}

class MathMax extends DflowNode {
  static kind = "mathMax";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run(array: DflowArray) {
    if (array.every((item) => Dflow.isNumber(item)))
      this.output(0).data = Math.max(...array);
  }
}

class MathMin extends DflowNode {
  static kind = "mathMin";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run(array: DflowArray) {
    if (array.every((item) => Dflow.isNumber(item)))
      this.output(0).data = Math.min(...array);
  }
}

class MathPI extends DflowNode {
  static kind = "mathPI";
  static outputs = [output("number", { name: "π", data: Math.PI })];
}

class MathRound extends DflowNode {
  static kind = "mathRound";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    this.output(0).data = Math.round(input);
  }
}

class MathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    this.output(0).data = Math.sin(input);
  }
}

export default [MathAbs, MathCos, MathMax, MathMin, MathPI, MathRound, MathSin];
