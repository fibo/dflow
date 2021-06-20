import { DflowNode, DflowSerializedNode } from "../engine.ts";
import {
  DflowAbstractOneNumInOneNumOut,
  DflowAbstractTwoNumInOneNumOut,
  oneNumOut,
} from "./abstract.ts";

class DflowMathCos extends DflowAbstractOneNumInOneNumOut {
  static kind = "mathCos";

  task(num: number) {
    return Math.cos(num);
  }
}

class DflowMathCosh extends DflowAbstractOneNumInOneNumOut {
  static kind = "mathCosh";

  task(num: number) {
    return Math.cosh(num);
  }
}

class DflowMathPI extends DflowNode {
  static kind = "mathPI";
  static metadata = { isConstant: true };

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneNumOut(Math.PI)] }, DflowMathPI.metadata);
  }
}

class DflowMathSin extends DflowAbstractOneNumInOneNumOut {
  static kind = "mathSin";

  task(num: number) {
    return Math.sin(num);
  }
}

class DflowMathSinh extends DflowAbstractOneNumInOneNumOut {
  static kind = "mathSinh";

  task(num: number) {
    return Math.sinh(num);
  }
}

class DflowMathSum extends DflowAbstractTwoNumInOneNumOut {
  static kind = "mathSum";

  task(num1: number, num2: number) {
    return num1 + num2;
  }
}

export const catalog = {
  [DflowMathCos.kind]: DflowMathCos,
  [DflowMathCosh.kind]: DflowMathCosh,
  [DflowMathPI.kind]: DflowMathPI,
  [DflowMathSin.kind]: DflowMathSin,
  [DflowMathSinh.kind]: DflowMathSinh,
  [DflowMathSum.kind]: DflowMathSum,
};
