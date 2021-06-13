import { DflowAbstractOneNumInOneBoolOut } from "./abstract.ts";

class DflowIsFinite extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isFinite";

  task(num: number) {
    return Number.isFinite(num);
  }
}

class DflowIsNaN extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isNaN";

  task(num: number) {
    return Number.isNaN(num);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsNaN.kind]: DflowIsNaN,
};
