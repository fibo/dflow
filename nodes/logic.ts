import { DflowNode } from "../dflow.ts";

class DflowNodeAnd extends DflowNode {
  static kind = "and";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = this.input(0).data && this.input(1).data;
  }
}

class DflowNodeNot extends DflowNode {
  static kind = "not";
  static inputs = DflowNode.in(["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = !this.input(0).data;
  }
}

class DflowNodeNullishCoaleshing extends DflowNode {
  static kind = "??";
  static inputs = [...DflowNode.in(), ...DflowNode.in()];
  static outputs = DflowNode.out();
  run() {
    this.output(0).data = this.input(0).data ?? this.input(1).data;
  }
}

class DflowNodeOr extends DflowNode {
  static kind = "or";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
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
