import { DflowNode } from "../engine.ts";

class DflowMathCos extends DflowNode {
  static kind = "mathCos";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = Math.cos(this.input(0).data as number);
  }
}

class DflowMathCosh extends DflowNode {
  static kind = "mathCosh";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = Math.cosh(this.input(0).data as number);
  }
}

class DflowMathPI extends DflowNode {
  static kind = "mathPI";
  static isConstant = true;
  static outputs = DflowNode.out(["number"], { data: Math.PI });
}

class DflowMathSin extends DflowNode {
  static kind = "mathSin";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = Math.sin(this.input(0).data as number);
  }
}

class DflowMathSinh extends DflowNode {
  static kind = "mathSinh";
  static inputs = DflowNode.in(["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = Math.sinh(this.input(0).data as number);
  }
}

export const catalog = {
  [DflowMathCos.kind]: DflowMathCos,
  [DflowMathCosh.kind]: DflowMathCosh,
  [DflowMathPI.kind]: DflowMathPI,
  [DflowMathSin.kind]: DflowMathSin,
  [DflowMathSinh.kind]: DflowMathSinh,
};
