import { DflowNode } from "../../dflow.ts";

const { input, output } = DflowNode;

class StringLength extends DflowNode {
  static kind = "stringLength";
  static inputs = [input("string")];
  static outputs = [output("number")];
  run(input: string) {
    return input.length;
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
    return input.substring(start, end);
  }
}

export default [Substring, StringLength];
