/**
[Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
*/
import {
  DflowAbstractTwoNumInOneBoolOut,
  DflowAbstractTwoNumInOneNumOut,
} from "./abstract.ts";

class DflowAddition extends DflowAbstractTwoNumInOneNumOut {
  static kind = "addition";

  task(num1: number, num2: number) {
    return num1 + num2;
  }
}

class DflowLessThan extends DflowAbstractTwoNumInOneBoolOut {
  static kind = "lessThan";

  task(input1: number, input2: number) {
    return input1 < input2;
  }
}

class DflowLessThanOrEqual extends DflowAbstractTwoNumInOneBoolOut {
  static kind = "lessThanOrEqual";

  task(input1: number, input2: number) {
    return input1 <= input2;
  }
}

class DflowGreaterThan extends DflowAbstractTwoNumInOneBoolOut {
  static kind = "greaterThan";

  task(input1: number, input2: number) {
    return input1 > input2;
  }
}

class DflowGreaterThanOrEqual extends DflowAbstractTwoNumInOneBoolOut {
  static kind = "greaterThanOrEqual";

  task(input1: number, input2: number) {
    return input1 >= input2;
  }
}

class DflowSubtraction extends DflowAbstractTwoNumInOneNumOut {
  static kind = "subtraction";

  task(num1: number, num2: number) {
    return num1 - num2;
  }
}

export const catalog = {
  [DflowAddition.kind]: DflowAddition,
  [DflowGreaterThan.kind]: DflowGreaterThan,
  [DflowGreaterThanOrEqual.kind]: DflowGreaterThanOrEqual,
  [DflowLessThan.kind]: DflowLessThan,
  [DflowLessThanOrEqual.kind]: DflowLessThanOrEqual,
  [DflowSubtraction.kind]: DflowSubtraction,
};
