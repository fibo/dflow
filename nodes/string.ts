import { DflowNode, DflowNodeUnary } from "../engine.ts";

class DflowStringLength extends DflowNodeUnary {
  static kind = "stringLength";
  static inputs = DflowNode.in(["string"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as string).length;
  }
}

export const catalog = {
  [DflowStringLength.kind]: DflowStringLength,
};
