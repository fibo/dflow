import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class DflowNodeStringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run() {
    this.output(0).data = (this.input(0).data as string).length;
  }
}

class DflowNodeSubstring extends DflowNode {
  static kind = "substring";
  static inputs = [
    input("string"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true })
  ];
  static outputs = [output("string")];
  run() {
    const str = this.input(0).data as string;
    const start = this.input(1).data as number;
    const end = this.input(2).data as number;
    this.output(0).data = str.substring(start, end);
  }
}

export const catalog = {
  [DflowNodeSubstring.kind]: DflowNodeSubstring,
  [DflowNodeStringLength.kind]: DflowNodeStringLength
};
