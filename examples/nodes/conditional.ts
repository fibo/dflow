import { DflowNode } from "../../dflow.ts";
import type { DflowData } from "../../dflow.ts";

const { input, output } = DflowNode;

class NodeIf extends DflowNode {
  static kind = "if";
  static inputs = [
    input([], { name: "condition" }),
    input([], { name: "then" }),
    input([], { name: "else" })
  ];
  static outputs = [output()];
  run(condition: DflowData, then: DflowData, elseValue: DflowData) {
    return condition ? then : elseValue;
  }
}

export default [NodeIf];
