import { DflowNode, DflowNodeUnary, DflowObject } from "../engine.ts";

class DflowObjectKeys extends DflowNodeUnary {
  static kind = "objectKeys";
  static inputs = DflowNode.in(["object"]);
  static outputs = DflowNode.out(["array"]);
  task() {
    return Object.keys(this.input(0).data as DflowObject);
  }
}

class DflowObjectValues extends DflowNodeUnary {
  static kind = "objectValues";
  static inputs = DflowNode.in(["object"]);
  static outputs = DflowNode.out(["array"]);
  task() {
    return Object.values(this.input(0).data as DflowObject);
  }
}

export const catalog = {
  [DflowObjectKeys.kind]: DflowObjectKeys,
  [DflowObjectValues.kind]: DflowObjectValues,
};
