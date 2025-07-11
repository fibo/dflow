import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class Addition extends DflowNode {
  static kind = "addition";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) + (this.input(1).data as number);
  }
}

class Division extends DflowNode {
  static kind = "division";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    if (this.input(1).data) {
      this.output(0).data =
        (this.input(0).data as number) / (this.input(1).data as number);
    } else {
      this.output(0).clear();
    }
  }
}

class Equality extends DflowNode {
  static kind = "equality";
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data == this.input(1).data;
  }
}

class LessThan extends DflowNode {
  static kind = "lessThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) < (this.input(1).data as number);
  }
}

class LessThanOrEqual extends DflowNode {
  static kind = "lessThanOrEqual";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) <= (this.input(1).data as number);
  }
}

class GreaterThan extends DflowNode {
  static kind = "greaterThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) > (this.input(1).data as number);
  }
}

class GreaterThanOrEqual extends DflowNode {
  static kind = "greaterThanOrEqual";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) >= (this.input(1).data as number);
  }
}

class Inequality extends DflowNode {
  static kind = "inequality";
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data != this.input(1).data;
  }
}

class Multiplication extends DflowNode {
  static kind = "multiplication";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) * (this.input(1).data as number);
  }
}

class Subtraction extends DflowNode {
  static kind = "subtraction";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run() {
    this.output(0).data =
      (this.input(0).data as number) - (this.input(1).data as number);
  }
}

export default [
  Addition,
  Division,
  Equality,
  GreaterThan,
  GreaterThanOrEqual,
  LessThan,
  LessThanOrEqual,
  Inequality,
  Multiplication,
  Subtraction
];
