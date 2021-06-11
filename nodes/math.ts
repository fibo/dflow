import { DflowAbstractOneInOneOut } from "./abstract.ts";

export class DflowMathSin extends DflowAbstractOneInOneOut {
  static kind = "mathSin";

  run() {
    const num = this.getInputByPosition(0).getData();

    if (typeof num === "number") {
      this.getOutputByPosition(0).setData(Math.sin(num));
    }
  }
}

export const catalog = {
  [DflowMathSin.kind]: DflowMathSin,
};
