import { Dflow, DflowNode, DflowObject } from "../../dflow.js";

const { input, output } = Dflow;

class DflowObjectKeys extends DflowNode {
  static kind = "objectKeys";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run() {
    this.output(0).data = Object.keys(this.input(0).data as DflowObject);
  }
}

class DflowObjectValues extends DflowNode {
  static kind = "objectValues";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run() {
    this.output(0).data = Object.values(this.input(0).data as DflowObject);
  }
}

export const catalog = {
  [DflowObjectKeys.kind]: DflowObjectKeys,
  [DflowObjectValues.kind]: DflowObjectValues,
};
