import { DflowNode } from "../../dflow.ts";
import type { DflowData } from "../../dflow.ts";

const { input } = DflowNode;

class ConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run(data: DflowData) {
    console.log(data);
  }
}

export default [ConsoleLog];
