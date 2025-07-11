import { Dflow, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

class StringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run(input: string) {
    this.output(0).data = input.length;
  }
}

class Substring extends DflowNode {
  static kind = "substring";
  static inputs = [
    input("string"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true })
  ];
  static outputs = [output("string")];
  run(input: string, start: number, end?: number) {
    this.output(0).data = input.substring(start, end);
  }
}

export default [Substring, StringLength];
