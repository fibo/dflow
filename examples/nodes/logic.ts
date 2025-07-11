import { DflowNode } from "../../dflow.ts";
import type { DflowData } from "../../dflow.ts";

const { input, output } = DflowNode;

class And extends DflowNode {
  static kind = "and";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run(a: boolean, b: boolean) {
    return a && b;
  }
}

class Not extends DflowNode {
  static kind = "not";
  static inputs = [input("boolean")];
  static outputs = [output("boolean")];
  run(a: boolean) {
    return !a;
  }
}

class NullishCoaleshing extends DflowNode {
  static kind = "??";
  static inputs = [input(), input()];
  static outputs = [output()];
  run(a: DflowData, b: DflowData) {
    return a ?? b;
  }
}

class Or extends DflowNode {
  static kind = "or";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run(a: boolean, b: boolean) {
    return a || b;
  }
}

export default [And, Not, NullishCoaleshing, Or];
