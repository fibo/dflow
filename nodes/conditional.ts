import { DflowNode } from "../dflow.ts";

class DflowNodeIf extends DflowNode {
  static kind = "if";
  static inputs = [
    ...DflowNode.in([], { name: "condition" }),
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
  [DflowNodeIf.kind]: DflowNodeIf,
};
