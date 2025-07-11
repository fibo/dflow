import { Dflow, DflowNode } from "../../dflow.ts";
import type { DflowObject } from "../../dflow.ts";

const { input, output } = Dflow;

class ObjectKeys extends DflowNode {
  static kind = "objectKeys";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run(input: DflowObject) {
    this.output(0).data = Object.keys(input);
  }
}

class ObjectValues extends DflowNode {
  static kind = "objectValues";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run(input: DflowObject) {
    this.output(0).data = Object.values(input);
  }
}

export default [ObjectKeys, ObjectValues];
