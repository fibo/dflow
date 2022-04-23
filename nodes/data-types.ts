import { DflowNode } from "../dflow.ts";

// TODO consider remove nodes isDefined and isUndefined
class DflowIsDefined extends DflowNode {
  static kind = "isDefined";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    this.output(0).data = typeof data !== "undefined";
  }
}

class DflowIsUndefined extends DflowNode {
  static kind = "isUndefined";
  static inputs = DflowNode.in();
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    this.output(0).data = typeof data === "undefined";
  }
}

export const catalog = {
  [DflowIsDefined.kind]: DflowIsDefined,
  [DflowIsUndefined.kind]: DflowIsUndefined,
};
