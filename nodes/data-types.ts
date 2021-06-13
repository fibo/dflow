import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { oneNumOut, oneStrOut } from "./abstract.ts";

class DflowNum extends DflowNode {
  static kind = "num";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneNumOut()] });
  }

  run() {}
}

class DflowStr extends DflowNode {
  static kind = "str";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneStrOut()] });
  }

  run() {}
}

export const catalog = {
  [DflowNum.kind]: DflowNum,
  [DflowStr.kind]: DflowStr,
};
