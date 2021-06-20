import { DflowValue } from "../engine.ts";
import {
  DflowAbstractOneAnyInOneBoolOut,
  DflowAbstractOneNumInOneBoolOut,
  DflowAbstractOneStrInOneNumOut,
  DflowAbstractTwoNumInOneBoolOut,
} from "./abstract.ts";

class DflowIsFinite extends DflowAbstractOneNumInOneBoolOut {
  static kind = "isFinite";

  task(input: number) {
    return Number.isFinite(input);
  }
}

class DflowIsGreaterThen extends DflowAbstractTwoNumInOneBoolOut {
  static kind = "isGreaterThen";

  task(input1: number, input2: number) {
    return input1 > input2;
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
  [DflowIsGreaterThen.kind]: DflowIsGreaterThen,
  [DflowIsNaN.kind]: DflowIsNaN,
  [DflowParseFloat.kind]: DflowParseFloat,
  [DflowParseInt.kind]: DflowParseInt,
};
