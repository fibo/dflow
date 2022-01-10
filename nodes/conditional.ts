import { DflowNode } from "../engine.ts";

class DflowIf extends DflowNode.Task {
  static kind = "if";
  static inputs = [
    ...DflowNode.in(["boolean"], { name: "condition" }),
    ...DflowNode.in([], { name: "then" }),
    ...DflowNode.in([], { name: "else" }),
  ];
  static outputs = DflowNode.out();
  task() {
    const condition = this.input(0).data;

    return condition ? this.input(1).data : this.input(2).data;
  }
}

export const catalog = {
  [DflowIf.kind]: DflowIf,
};
