/**
[Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
*/
import { DflowData, DflowHost, DflowSerializedNode } from "../engine.ts";
import {
  DflowAbstractTwoInOneOut,
  DflowAbstractTwoNumInOneBoolOut,
  DflowAbstractTwoNumInOneNumOut,
} from "./abstract.ts";

class DflowAddition extends DflowAbstractTwoNumInOneNumOut {
  static kind = "addition";

  task(input1: number, input2: number) {
    return input1 + input2;
  }
}

class DflowEquality extends DflowAbstractTwoInOneOut {
  static kind = "equality";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      inputs: [{ id: "i1", types: ["number", "string"] }, {
        id: "i2",
        types: ["number", "string"],
      }],
      outputs: [{ id: "o1", types: ["boolean"] }],
    }, host);
  }

  run() {
    const { input1: { data: data1, types }, input2: { data: data2 }, output } =
      this;

    if (DflowData.isUndefined(data1) || (DflowData.isUndefined(data2))) {
      output.clear();
    } else {
      if (
        DflowData.validate(data1, types) && DflowData.validate(data2, types)
      ) {
        output.data = data1 == data2;
      }
    }
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

class DflowInequality extends DflowAbstractTwoInOneOut {
  static kind = "inequality";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      inputs: [{ id: "i1", types: ["number", "string"] }, {
        id: "i2",
        types: ["number", "string"],
      }],
      outputs: [{ id: "o1", types: ["boolean"] }],
    }, host);
  }

  run() {
    const { input1: { data: data1, types }, input2: { data: data2 }, output } =
      this;

    if (DflowData.isUndefined(data1) || (DflowData.isUndefined(data2))) {
      output.clear();
    } else {
      if (
        DflowData.validate(data1, types) && DflowData.validate(data2, types)
      ) {
        output.data = data1 != data2;
      }
    }
  }
}

class DflowSubtraction extends DflowAbstractTwoNumInOneNumOut {
  static kind = "subtraction";

  task(input1: number, input2: number) {
    return input1 - input2;
  }
}

export const catalog = {
  [DflowAddition.kind]: DflowAddition,
  [DflowEquality.kind]: DflowEquality,
  [DflowGreaterThan.kind]: DflowGreaterThan,
  [DflowGreaterThanOrEqual.kind]: DflowGreaterThanOrEqual,
  [DflowLessThan.kind]: DflowLessThan,
  [DflowLessThanOrEqual.kind]: DflowLessThanOrEqual,
  [DflowInequality.kind]: DflowInequality,
  [DflowSubtraction.kind]: DflowSubtraction,
};
