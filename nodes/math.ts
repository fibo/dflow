import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { DflowAbstractUnaryNumericOperator, outNum } from "./abstract.ts";

export class DflowMathCos extends DflowAbstractUnaryNumericOperator {
  static kind = "mathCos";

  operation(num: number) {
    return Math.cos(num);
  }
}

export class DflowMathCosh extends DflowAbstractUnaryNumericOperator {
  static kind = "mathCosh";

  operation(num: number) {
    return Math.cosh(num);
  }
}

export class DflowMathPI extends DflowNode {
  static kind = "mathPI";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [outNum(Math.PI)] });
  }
}

export class DflowMathSin extends DflowAbstractUnaryNumericOperator {
  static kind = "mathSin";

  operation(num: number) {
    return Math.sin(num);
  }
}

export class DflowMathSinh extends DflowAbstractUnaryNumericOperator {
  static kind = "mathSinh";

  operation(num: number) {
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
