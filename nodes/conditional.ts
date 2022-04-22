import { DflowNode } from "../dflow.ts";

class DflowIf extends DflowNode {
  static kind = "if";
  static inputs = [
    ...DflowNode.in(["boolean"], { name: "condition" }),
    ...DflowNode.in([], { name: "then" }),
    ...DflowNode.in([], { name: "else" }),
  ];
  static outputs = DflowNode.out();
  run() {
    this.output(0).data = this.input(0).data
      ? this.input(1).data
      : this.input(2).data;
  }
}

export const catalog = {
  [DflowIf.kind]: DflowIf,
};
