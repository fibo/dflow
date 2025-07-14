import { Dflow, type DflowData, type DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

const Addition: DflowNode = {
  kind: "addition",
  inputs: [input("number"), input("number")],
  outputs: [output("number")],
  run(a: number, b: number) {
    return a + b;
  }
};

const Division: DflowNode = {
  kind: "division",
  inputs: [input("number"), input("number")],
  outputs: [output("number")],
  run(a: number, b: number) {
    if (b) return a / b;
  }
};

const Equality: DflowNode = {
  kind: "equality",
  inputs: [input(), input()],
  outputs: [output("boolean")],
  run(a: DflowData, b: DflowData) {
    return a == b;
  }
};

const LessThan: DflowNode = {
  kind: "lessThan",
  inputs: [input("number"), input("number")],
  outputs: [output("boolean")],
  run(a: number, b: number) {
    return a < b;
  }
};

const GreaterThan: DflowNode = {
  kind: "greaterThan",
  inputs: [input("number"), input("number")],
  outputs: [output("boolean")],
  run(a: number, b: number) {
    return a > b;
  }
};

const Inequality: DflowNode = {
  kind: "inequality",
  inputs: [input(), input()],
  outputs: [output("boolean")],
  run(a: DflowData, b: DflowData) {
    return a != b;
  }
};

const Multiplication: DflowNode = {
  kind: "multiplication",
  inputs: [input("number"), input("number")],
  outputs: [output("number")],
  run(a: number, b: number) {
    return a * b;
  }
};

const Subtraction: DflowNode = {
  kind: "subtraction",
  inputs: [input("number"), input("number")],
  outputs: [output("number")],
  run(a: number, b: number) {
    return a - b;
  }
};

export default [
  Addition,
  Division,
  Equality,
  GreaterThan,
  LessThan,
  Inequality,
  Multiplication,
  Subtraction
];
