import { Dflow, type DflowData, type DflowNode } from "../../../dflow.ts";

const { input, output } = Dflow;

const NodeIf: DflowNode = {
  kind: "if",
  inputs: [
    input([], { name: "condition" }),
    input([], { name: "then" }),
    input([], { name: "else" })
  ],
  outputs: [output()],
  run(condition: DflowData, then: DflowData, elseValue: DflowData) {
    return condition ? then : elseValue;
  }
};

export default [NodeIf];
