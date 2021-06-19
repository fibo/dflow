import { DflowValue } from "../engine.ts";
import {
  DflowAbstractOneAnyInOneBoolOut,
  DflowAbstractOneNumInOneBoolOut,
  DflowAbstractOneStrInOneNumOut,
} from "./abstract.ts";

class DflowIsFinite extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isFinite";

  task(input: number) {
    return Number.isFinite(input);
  }
}

class DflowIsInteger extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isInteger";

  task(input: number) {
    return Number.isInteger(input);
  }
}

class DflowIsNaN extends DflowAbstractOneAnyInOneBoolOut {
  static kind = "isNaN";

  task(input: DflowValue) {
    return Number.isNaN(input);
  }
}

class DflowParseFloat extends DflowAbstractOneStrInOneNumOut {
  static kind = "parseFloat";

  task(input: string) {
    return Number.parseFloat(input);
  }
}

class DflowParseInt extends DflowAbstractOneStrInOneNumOut {
  static kind = "parseInt";

  task(input: string) {
    return Number.parseInt(input);
  }
}

export const catalog = {
  [DflowIsFinite.kind]: DflowIsFinite,
  [DflowIsInteger.kind]: DflowIsInteger,
  [DflowIsNaN.kind]: DflowIsNaN,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
