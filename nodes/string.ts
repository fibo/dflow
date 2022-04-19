import { DflowNode } from "../engine.ts";

class DflowStringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = DflowNode.in(["string"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as string).length;
  }
}

class DflowSubstring extends DflowNode {
  static kind = "substring";
  static inputs = [
    ...DflowNode.in(["string"]),
    ...DflowNode.in(["number"], { name: "start" }),
    ...DflowNode.in(["number"], { name: "end", optional: true }),
  ];
  static outputs = DflowNode.out(["string"]);
  run() {
    const str = this.input(0).data as string;
    const start = this.input(1).data as number;
    const end = this.input(2).data as number;
    this.output(0).data = str.substring(start, end);
  }
}

export const catalog = {
  [DflowStringLength.kind]: DflowStringLength,
  [DflowSubstring.kind]: DflowSubstring,
};
