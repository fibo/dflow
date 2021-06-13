import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { DflowAbstractOneNumInOneNumOut, oneNumOut } from "./abstract.ts";

class DflowMathCos extends DflowAbstractOneNumInOneNumOut {
  static kind = "cos";

  task(num: number) {
    return Math.cos(num);
  }
}

class DflowMathCosh extends DflowAbstractOneNumInOneNumOut {
  static kind = "cosh";

  task(num: number) {
    return Math.cosh(num);
  }
}

class DflowMathPI extends DflowNode {
  static kind = "PI";
  static isConstant = true;

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneNumOut(Math.PI)] }, {
      isConstant: DflowMathPI.isConstant,
    });
  }
}

class DflowMathSin extends DflowAbstractOneNumInOneNumOut {
  static kind = "sin";

  task(num: number) {
    return Math.sin(num);
  }
}

class DflowMathSinh extends DflowAbstractOneNumInOneNumOut {
  static kind = "sinh";

  task(num: number) {
    return Math.sinh(num);
  }
}

export const catalog = {
  [DflowMathCos.kind]: DflowMathCos,
  [DflowMathCosh.kind]: DflowMathCosh,
  [DflowMathPI.kind]: DflowMathPI,
  [DflowMathSin.kind]: DflowMathSin,
  [DflowMathSinh.kind]: DflowMathSinh,
};
