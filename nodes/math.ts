import { DflowNode } from "../dflow.ts";

export class MathSin extends DflowNode {
  static kind = "Math.sin";

  run() {}
}

export const catalog = {
  [MathSin.kind]: MathSin,
};
