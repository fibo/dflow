import { DflowNode } from "../engine.ts";

class DflowLogicAnd extends DflowNode.Task {
  static kind = "and";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return this.input(0).data && this.input(1).data;
  }
}

class DflowLogicNot extends DflowNode.Task {
  static kind = "not";
  static inputs = DflowNode.in(["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return !this.input(0).data;
  }
}

class DflowLogicOr extends DflowNode.Task {
  static kind = "or";
  static inputs = DflowNode.ins(2, ["boolean"]);
  static outputs = DflowNode.out(["boolean"]);
  task() {
    return this.input(0).data || this.input(1).data;
  }
}

export const catalog = {
  [DflowLogicAnd.kind]: DflowLogicAnd,
  [DflowLogicNot.kind]: DflowLogicNot,
  [DflowLogicOr.kind]: DflowLogicOr,
};
