import { DflowNode } from "../../dflow.ts";
import type { DflowArray } from "../../dflow.ts";

const { input, output } = DflowNode;

class MathAbs extends DflowNode {
  static kind = "mathAbs";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    return Math.abs(input);
  }
}

class MathCos extends DflowNode {
  static kind = "mathCos";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    return Math.cos(input);
  }
}

class MathMax extends DflowNode {
  static kind = "mathMax";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run(array: DflowArray) {
    return Math.max(...(array as number[]));
  }
}

class MathMin extends DflowNode {
  static kind = "mathMin";
  static inputs = [input("array")];
  static outputs = [output("number")];
  run(array: DflowArray) {
    return Math.min(...(array as number[]));
  }
}

class MathPI extends DflowNode {
  static kind = "mathPI";
  static outputs = [output("number", { name: "π" })];
  run() {
    return Math.PI;
  }
}

class MathRound extends DflowNode {
  static kind = "mathRound";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    return Math.round(input);
  }
}

class MathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = [input("number")];
  static outputs = [output("number")];
  run(input: number) {
    return Math.sin(input);
  }
}

export default [MathAbs, MathCos, MathMax, MathMin, MathPI, MathRound, MathSin];
