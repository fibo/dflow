import { Dflow, type DflowData, type DflowNode } from "dflow";

const { input, output } = Dflow;

const And: DflowNode = {
  kind: "and",
  inputs: [input("boolean"), input("boolean")],
  outputs: [output("boolean")],
  run(a: boolean, b: boolean) {
    return a && b;
  }
};

const Not: DflowNode = {
  kind: "not",
  inputs: [input("boolean")],
  outputs: [output("boolean")],
  run(a: boolean) {
    return !a;
  }
};

const NullishCoaleshing: DflowNode = {
  kind: "??",
  inputs: [input([], { optional: true }), input([], { optional: true })],
  outputs: [output()],
  run(a: DflowData, b: DflowData) {
    return a ?? b;
  }
};

const Or: DflowNode = {
  kind: "or",
  inputs: [input("boolean"), input("boolean")],
  outputs: [output("boolean")],
  run(a: boolean, b: boolean) {
    return a || b;
  }
};

export default [And, Not, NullishCoaleshing, Or];
