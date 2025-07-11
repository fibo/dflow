import { DflowNode } from "../../dflow.ts";
import type { DflowData } from "../../dflow.ts";

const { input, output } = DflowNode;

class Addition extends DflowNode {
  static kind = "addition";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run(a: number, b: number) {
    return a + b;
  }
}

class Division extends DflowNode {
  static kind = "division";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run(a: number, b: number) {
    if (b) return a / b;
  }
}

class Equality extends DflowNode {
  static kind = "equality";
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run(a: DflowData, b: DflowData) {
    return a == b;
  }
}

class LessThan extends DflowNode {
  static kind = "lessThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run(a: number, b: number) {
    return a < b;
  }
}

class GreaterThan extends DflowNode {
  static kind = "greaterThan";
  static inputs = [input("number"), input("number")];
  static outputs = [output("boolean")];
  run(a: number, b: number) {
    return a > b;
  }
}

class Inequality extends DflowNode {
  static kind = "inequality";
  static inputs = [input(), input()];
  static outputs = [output("boolean")];
  run(a: DflowData, b: DflowData) {
    return a != b;
  }
}

class Multiplication extends DflowNode {
  static kind = "multiplication";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run(a: number, b: number) {
    return a * b;
  }
}

class Subtraction extends DflowNode {
  static kind = "subtraction";
  static inputs = [input("number"), input("number")];
  static outputs = [output("number")];
  run(a: number, b: number) {
    return a - b;
  }
}

export default [
  Addition,
  Division,
  Equality,
  GreaterThan,
  LessThan,
  Inequality,
  Multiplication,
  Subtraction
];
