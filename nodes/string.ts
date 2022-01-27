import { DflowNode } from "../engine.ts";

class DflowStringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = DflowNode.in(["string"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as string).length;
  }
}

export const catalog = {
  [DflowStringLength.kind]: DflowStringLength,
};
