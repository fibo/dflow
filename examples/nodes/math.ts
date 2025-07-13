import { Dflow } from "../../dflow.ts";
import type { DflowArray, DflowNode } from "../../dflow.ts";

const { input, output } = Dflow;

const MathAbs: DflowNode = {
  kind: "mathAbs",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input: number) {
    return Math.abs(input);
  }
};

const MathCos: DflowNode = {
  kind: "mathCos",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input: number) {
    return Math.cos(input);
  }
};

const MathMax: DflowNode = {
  kind: "mathMax",
  inputs: [input("array")],
  outputs: [output("number")],
  run(array: DflowArray) {
    return Math.max(...(array as number[]));
  }
};

const MathMin: DflowNode = {
  kind: "mathMin",
  inputs: [input("array")],
  outputs: [output("number")],
  run(array: DflowArray) {
    return Math.min(...(array as number[]));
  }
};

const MathPI: DflowNode = {
  kind: "mathPI",
  outputs: [output("number", { name: "π" })],
  run() {
    return Math.PI;
  }
};

const MathRound: DflowNode = {
  kind: "mathRound",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input: number) {
    return Math.round(input);
  }
};

const MathSin: DflowNode = {
  kind: "mathSin",
  inputs: [input("number")],
  outputs: [output("number")],
  run(input: number) {
    return Math.sin(input);
  }
};

export default [MathAbs, MathCos, MathMax, MathMin, MathPI, MathRound, MathSin];
