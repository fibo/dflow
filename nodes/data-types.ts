import { DflowNode, DflowSerializedNode } from "../engine.ts";
import { oneAnyOut, oneNumOut, oneStrOut } from "./abstract.ts";

class DflowData extends DflowNode {
  static kind = "data";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneAnyOut()] });
  }

  run() {}
}

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
  [DflowData.kind]: DflowData,
  [DflowNum.kind]: DflowNum,
  [DflowStr.kind]: DflowStr,
};
