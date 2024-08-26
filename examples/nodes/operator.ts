import { Dflow, DflowNode } from "../../dflow.js";

const { input, output } = Dflow;

class DflowAddition extends DflowNode {
  static kind = "addition";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = (this.input(0).data as number) +
      (this.input(1).data as number);
  }
}

class DflowDivision extends DflowNode {
  static kind = "division";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
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
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data == this.input(1).data;
  }
}

class DflowLessThan extends DflowNode {
  static kind = "lessThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) < (this.input(1).data as number);
  }
}

class DflowLessThanOrEqual extends DflowNode {
  static kind = "lessThanOrEqual";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) <= (this.input(1).data as number);
  }
}

class DflowGreaterThan extends DflowNode {
  static kind = "greaterThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) > (this.input(1).data as number);
  }
}

class DflowGreaterThanOrEqual extends DflowNode {
  static kind = "greaterThanOrEqual";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) >= (this.input(1).data as number);
  }
}

class DflowInequality extends DflowNode {
  static kind = "inequality";
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data != this.input(1).data;
  }
}

class DflowMultiplication extends DflowNode {
  static kind = "multiplication";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = (this.input(0).data as number) *
      (this.input(1).data as number);
  }
}

class DflowSubtraction extends DflowNode {
  static kind = "subtraction";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
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
