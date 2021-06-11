import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { outNum } from "./abstract.ts";

export class DflowNum extends DflowNode {
  static kind = "num";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [outNum()] });
  }

  run() {}
}

export const catalog = {
  [DflowNum.kind]: DflowNum,
};
