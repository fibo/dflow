import { Dflow } from "../../dflow.ts";
import type { DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

const StringLength: DflowNode = {
  kind: "stringLength",
  inputs: [input("string")],
  outputs: [output("number")],
  run(input: string) {
    return input.length;
  }
};

const Substring: DflowNode = {
  kind: "substring",
  inputs: [
    input("string"),
    input("number", { name: "start" }),
    input("number", { name: "end", optional: true })
  ],
  outputs: [output("string")],
  run(input: string, start: number, end?: number) {
    return input.substring(start, end);
  }
};

export default [Substring, StringLength];
