import { DflowAbstractNumericUnaryOperator } from "./abstract.ts";

export class DflowMathSin extends DflowAbstractNumericUnaryOperator {
  static kind = "Math.sin";

  run() {
    const num = this.getInputData();
    console.log("num", num);

    if (typeof num === "number") {
      this.setOutputData(Math.sin(num));
    }
  }
}

export const catalog = {
  [DflowMathSin.kind]: DflowMathSin,
};
