import { Dflow, type DflowArray, type DflowNode } from "../../../dflow.ts";

const { input, output } = Dflow;

const MathPI: DflowNode = {
  kind: "Math.PI",
  outputs: [Dflow.output("number", { name: "π" })],
  run: () => Math.PI
};

const MathAbs: DflowNode = {
  kind: "Math.abs",
  inputs: [input("number")],
  outputs: [output("number")],
  run: Math.abs
};

const dynamicMathNodes = ["cos", "sin", "round"].map((method) => ({
  kind: `Math.${method}`,
  inputs: [input("number")],
  outputs: [output("number")],
  // @ts-expect-error: expression of type 'string' can't be used to index type 'Math'.
  run: Math[method]
}));

const MathMax: DflowNode = {
  kind: "Math.max",
  inputs: [input("array")],
  outputs: [output("number")],
  run(array: DflowArray) {
    if (array.every((item) => Dflow.isNumber(item))) return Math.max(...array);
  }
};

const MathMin: DflowNode = {
  kind: "Math.min",
  inputs: [input("array")],
  outputs: [output("number")],
  run(array: DflowArray) {
    if (array.every((item) => Dflow.isNumber(item))) return Math.min(...array);
  }
};

export default [MathAbs, MathMax, MathMin, MathPI, ...dynamicMathNodes];
