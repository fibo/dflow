import { DflowNode } from "../engine.ts";

class DflowStringLength extends DflowNode.Task {
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
