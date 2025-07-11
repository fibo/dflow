import { Dflow, DflowNode } from "../../dflow.ts";
import type { DflowObject } from "../../dflow.ts";

const { input, output } = Dflow;

class ObjectKeys extends DflowNode {
  static kind = "objectKeys";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run() {
    this.output(0).data = Object.keys(this.input(0).data as DflowObject);
  }
}

class ObjectValues extends DflowNode {
  static kind = "objectValues";
  static inputs = [input("object")];
  static outputs = [output("array")];
  run() {
    this.output(0).data = Object.values(this.input(0).data as DflowObject);
  }
}

export default [ObjectKeys, ObjectValues];
