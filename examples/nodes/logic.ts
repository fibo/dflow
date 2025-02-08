import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class DflowNodeAnd extends DflowNode {
  static kind = "and";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data && this.input(1).data;
  }
}

class DflowNodeNot extends DflowNode {
  static kind = "not";
  static inputs = [input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = !this.input(0).data;
  }
}

class DflowNodeNullishCoaleshing extends DflowNode {
  static kind = "??";
  static inputs = [input(), input()];
  static outputs = [output()];
  run() {
    this.output(0).data = this.input(0).data ?? this.input(1).data;
  }
}

class DflowNodeOr extends DflowNode {
  static kind = "or";
  static inputs = [input("boolean"), input("boolean")];
  static outputs = [output("boolean")];
  run() {
    this.output(0).data = this.input(0).data || this.input(1).data;
  }
}

export const catalog = {
  [DflowNodeAnd.kind]: DflowNodeAnd,
  [DflowNodeNot.kind]: DflowNodeNot,
  [DflowNodeNullishCoaleshing.kind]: DflowNodeNullishCoaleshing,
  [DflowNodeOr.kind]: DflowNodeOr,
};
