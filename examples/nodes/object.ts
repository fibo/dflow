import { Dflow, type DflowObject, type DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

const ObjectKeys: DflowNode = {
  kind: "objectKeys",
  inputs: [input("object")],
  outputs: [output("array")],
  run(input: DflowObject) {
    return Object.keys(input);
  }
};

const ObjectValues: DflowNode = {
  kind: "objectValues",
  inputs: [input("object")],
  outputs: [output("array")],
  run(input: DflowObject) {
    return Object.values(input);
  }
};

export default [ObjectKeys, ObjectValues];
