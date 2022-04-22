import { DflowNode } from "../dflow.ts";

class DflowConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [
    ...DflowNode.in([]),
  ];
  run() {
    console.log(this.input(0).data);
  }
}

export const catalog = {
  [DflowConsoleLog.kind]: DflowConsoleLog,
};
