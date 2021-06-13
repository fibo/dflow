import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { oneNumOut } from "./abstract.ts";

class DflowNum extends DflowNode {
  static kind = "num";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneNumOut()] });
  }

  run() {}
}

export const catalog = {
  [DflowNum.kind]: DflowNum,
};
