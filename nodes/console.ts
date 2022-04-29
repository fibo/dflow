import { DflowNode } from "../dflow.ts";

const { input } = DflowNode;

class DflowConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run() {
    console.log(this.input(0).data);
  }
}

export const catalog = {
  [DflowConsoleLog.kind]: DflowConsoleLog,
};
