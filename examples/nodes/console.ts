import { Dflow, DflowNode } from "../../dflow.ts";

const { input } = Dflow;

class ConsoleLog extends DflowNode {
  static kind = "consoleLog";
  static inputs = [input()];
  run() {
    console.log(this.input(0).data);
  }
}

export default [ConsoleLog];
