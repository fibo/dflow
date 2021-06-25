/**
[Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
*/
import { DflowNode } from "../engine.ts";

class DflowAddition extends DflowNode.Task {
  static kind = "addition";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) + (this.input(1).data as number);
  }
}

class DflowEquality extends DflowNode.Task {
  static kind = "equality";
  static inputs = DflowNode.ins(2);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return this.input(0).data == this.input(1).data;
  }
}

class DflowLessThan extends DflowNode.Task {
  static kind = "lessThan";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) < (this.input(1).data as number);
  }
}

class DflowLessThanOrEqual extends DflowNode.Task {
  static kind = "lessThanOrEqual";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) <= (this.input(1).data as number);
  }
}

class DflowGreaterThan extends DflowNode.Task {
  static kind = "greaterThan";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) > (this.input(1).data as number);
  }
}

class DflowGreaterThanOrEqual extends DflowNode.Task {
  static kind = "greaterThanOrEqual";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) >= (this.input(1).data as number);
  }
}

class DflowInequality extends DflowNode.Task {
  static kind = "inequality";
  static inputs = DflowNode.ins(2);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return this.input(0).data != this.input(1).data;
  }
}

class DflowSubtraction extends DflowNode.Task {
  static kind = "subtraction";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as number) - (this.input(1).data as number);
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
