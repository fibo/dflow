import { DflowArray, DflowNode } from "../engine.ts";

class DflowArrayLength extends DflowNode.Task {
  static kind = "arrayLength";
  static inputs = DflowNode.in(["array"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as DflowArray).length;
  }
}

export const catalog = {
  [DflowArrayLength.kind]: DflowArrayLength,
};
