import { DflowAbstractOneNumInOneBoolOut } from "./abstract.ts";

class DflowIsFinite extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isFinite";

  task(num: number) {
    return Number.isFinite(num);
  }
}

class DflowIsInteger extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isInteger";

  task(num: number) {
    return Number.isInteger(num);
  }
}

class DflowIsNaN extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isNaN";

  task(num: number) {
    return Number.isNaN(num);
  }
}

class DflowParseFloat extends DflowAbstractOneNumInOneNumOut {
  static kind = "parseFloat";

  task(num: number) {
    return Number.parseFloat(num);
  }
}

class DflowParseInt extends DflowAbstractOneNumInOneNumOut {
  static kind = "parseInt";

  task(num: number) {
    return Number.parseInt(num);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsInteger.kind]: DflowIsInteger,
  [DflowIsNaN.kind]: DflowIsNaN,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
