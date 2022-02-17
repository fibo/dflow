/**
[Operators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators)
*/
import { DflowNode } from "../engine.ts";

class DflowAddition extends DflowNode {
  static kind = "addition";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as number) +
      (this.input(1).data as number);
  }
}

class DflowDivision extends DflowNode {
  static kind = "division";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    if (this.input(1).data) {
      this.output(0).data = (this.input(0).data as number) /
        (this.input(1).data as number);
    } else {
      this.output(0).clear();
    }
  }
}

class DflowEquality extends DflowNode {
  static kind = "equality";
  static inputs = DflowNode.ins(2);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = this.input(0).data == this.input(1).data;
  }
}

class DflowLessThan extends DflowNode {
  static kind = "lessThan";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data =
      (this.input(0).data as number) < (this.input(1).data as number);
  }
}

class DflowLessThanOrEqual extends DflowNode {
  static kind = "lessThanOrEqual";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data =
      (this.input(0).data as number) <= (this.input(1).data as number);
  }
}

class DflowGreaterThan extends DflowNode {
  static kind = "greaterThan";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data =
      (this.input(0).data as number) > (this.input(1).data as number);
  }
}

class DflowGreaterThanOrEqual extends DflowNode {
  static kind = "greaterThanOrEqual";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data =
      (this.input(0).data as number) >= (this.input(1).data as number);
  }
}

class DflowInequality extends DflowNode {
  static kind = "inequality";
  static inputs = DflowNode.ins(2);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = this.input(0).data != this.input(1).data;
  }
}

class DflowMultiplication extends DflowNode {
  static kind = "multiplication";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as number) *
      (this.input(1).data as number);
  }
}

class DflowSubtraction extends DflowNode {
  static kind = "subtraction";
  static inputs = DflowNode.ins(2, ["number"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as number) -
      (this.input(1).data as number);
  }
}

export const catalog = {
  [DflowAddition.kind]: DflowAddition,
  [DflowDivision.kind]: DflowDivision,
  [DflowEquality.kind]: DflowEquality,
  [DflowGreaterThan.kind]: DflowGreaterThan,
  [DflowGreaterThanOrEqual.kind]: DflowGreaterThanOrEqual,
  [DflowLessThan.kind]: DflowLessThan,
  [DflowLessThanOrEqual.kind]: DflowLessThanOrEqual,
  [DflowInequality.kind]: DflowInequality,
  [DflowMultiplication.kind]: DflowMultiplication,
  [DflowSubtraction.kind]: DflowSubtraction,
};
