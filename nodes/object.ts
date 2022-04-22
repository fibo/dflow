import { DflowNode, DflowObject } from "../dflow.ts";

class DflowObjectKeys extends DflowNode {
  static kind = "objectKeys";
  static inputs = DflowNode.in(["object"]);
  static outputs = DflowNode.out(["array"]);
  run() {
    this.output(0).data = Object.keys(this.input(0).data as DflowObject);
  }
}

class DflowObjectValues extends DflowNode {
  static kind = "objectValues";
  static inputs = DflowNode.in(["object"]);
  static outputs = DflowNode.out(["array"]);
  run() {
    this.output(0).data = Object.values(this.input(0).data as DflowObject);
  }
}

export const catalog = {
  [DflowObjectKeys.kind]: DflowObjectKeys,
  [DflowObjectValues.kind]: DflowObjectValues,
};
