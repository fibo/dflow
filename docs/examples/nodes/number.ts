import { Dflow, type DflowNode } from "../../../dflow.ts";

const { input, output } = Dflow;

const IsFinite: DflowNode = {
  kind: "isFinite",
  inputs: [input("number")],
  outputs: [output("boolean")],
  run(input: number) {
    return Number.isFinite(input);
  }
};

const IsInteger: DflowNode = {
  kind: "isInteger",
  inputs: [input()],
  outputs: [output("boolean")],
  run(input: number) {
    return Number.isInteger(input);
  }
};

const ParseFloat: DflowNode = {
  kind: "parseFloat",
  inputs: [input("string")],
  outputs: [output("number")],
  run(input: string) {
    return parseFloat(input);
  }
};

export default [IsFinite, IsInteger, ParseFloat];
