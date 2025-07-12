import { DflowNode } from "../../dflow.ts";
import type { DflowData } from "../../dflow.ts";

const { input } = DflowNode;

class ConsoleInfo extends DflowNode {
  static kind = "consoleInfo";
  static inputs = [input()];
  run(data: DflowData) {
    console.info(data);
  }
}

export default [ConsoleInfo];
