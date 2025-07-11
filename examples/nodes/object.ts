import { DflowNode } from "../../dflow.ts";
import type { DflowObject } from "../../dflow.ts";

const { input, output } = DflowNode;

class ObjectKeys extends DflowNode {
  static kind = "objectKeys";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run(input: DflowObject) {
    return Object.keys(input);
  }
}

class ObjectValues extends DflowNode {
  static kind = "objectValues";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run(input: DflowObject) {
    return Object.values(input);
  }
}

export default [ObjectKeys, ObjectValues];
