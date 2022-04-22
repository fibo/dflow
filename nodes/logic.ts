import { DflowNode } from "../dflow.ts";

class DflowLogicAnd extends DflowNode {
  static kind = "and";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = this.input(0).data && this.input(1).data;
  }
}

class DflowLogicNot extends DflowNode {
  static kind = "not";
  static inputs = DflowNode.in(["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = !this.input(0).data;
  }
}

class DflowLogicOr extends DflowNode {
  static kind = "or";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  run() {
    this.output(0).data = this.input(0).data || this.input(1).data;
  }
}

export const catalog = {
  [DflowLogicAnd.kind]: DflowLogicAnd,
  [DflowLogicNot.kind]: DflowLogicNot,
  [DflowLogicOr.kind]: DflowLogicOr,
};
