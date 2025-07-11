import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class And extends DflowNode {
  static kind = "and";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data && this.input(1).data;
  }
}

class Not extends DflowNode {
  static kind = "not";
  static inputs = [input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = !this.input(0).data;
  }
}

class NullishCoaleshing extends DflowNode {
  static kind = "??";
  static inputs = [input(), input()];
  static outputs = [output()];
  run() {
    this.output(0).data = this.input(0).data ?? this.input(1).data;
  }
}

class Or extends DflowNode {
  static kind = "or";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data || this.input(1).data;
  }
}

export default [And, Not, NullishCoaleshing, Or];
