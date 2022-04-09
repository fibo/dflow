import { DflowNode } from "../engine.ts";

class DflowDateNow extends DflowNode {
  static kind = "now";
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = Date.now();
  }
}

export const catalog = {
  [DflowDateNow.kind]: DflowDateNow,
};
