import { DflowNode } from "../dflow.ts";

const { input, output } = DflowNode;

export class DflowNodeStringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = (this.input(0).data as string).length;
  }
}

export class DflowNodeSubstring extends DflowNode {
  static kind = "substring";
  static inputs = [
    input("string"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true }),
  ];
  static outputs = DflowNode.out(["string"]);
  run() {
    const str = this.input(0).data as string;
    const start = this.input(1).data as number;
    const end = this.input(2).data as number;
    this.output(0).data = str.substring(start, end);
  }
}
