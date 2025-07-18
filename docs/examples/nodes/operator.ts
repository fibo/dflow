import { Dflow, type DflowNode } from "../../../dflow.ts";

const { input, output } = Dflow;

const Equality: DflowNode = {
  kind: "equality",
  inputs: [input(), input()],
  outputs: [output("boolean")],
  run: (a: unknown, b: unknown) => a == b
};

const binaryOperatorInputs = [
  input(["number", "string"]),
  input(["number", "string"])
];

const coerceBinaryOperatorArgs = (a: number | string, b: number | string) => {
  const aNum = Number(a);
  const bNum = Number(b);
  return {
    aNum,
    bNum,
    areValid: Dflow.isNumber(aNum) && Dflow.isNumber(bNum)
  };
};

const Addition: DflowNode = {
  kind: "addition",
  inputs: binaryOperatorInputs,
  outputs: [output("number")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    return aNum + bNum;
  }
};

const Subtraction: DflowNode = {
  kind: "subtraction",
  inputs: binaryOperatorInputs,
  outputs: [output("number")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    return aNum - bNum;
  }
};

const Multiplication: DflowNode = {
  kind: "multiplication",
  inputs: binaryOperatorInputs,
  outputs: [output("number")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    return aNum * bNum;
  }
};

const Division: DflowNode = {
  kind: "division",
  inputs: binaryOperatorInputs,
  outputs: [output("number")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    if (bNum) return aNum / bNum;
  }
};

const LessThan: DflowNode = {
  kind: "lessThan",
  inputs: binaryOperatorInputs,
  outputs: [output("boolean")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    return aNum < bNum;
  }
};

const GreaterThan: DflowNode = {
  kind: "greaterThan",
  inputs: binaryOperatorInputs,
  outputs: [output("boolean")],
  run(a: number | string, b: number | string) {
    const { areValid, aNum, bNum } = coerceBinaryOperatorArgs(a, b);
    if (!areValid) return;
    return aNum > bNum;
  }
};

export default [
  Equality,
  Addition,
  Subtraction,
  Multiplication,
  Division,
  GreaterThan,
  LessThan
];
