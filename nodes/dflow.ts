import { DflowNode } from "../engine.ts";

class DflowInput extends DflowNode {
  static kind = "dflowInput";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      inputs: [{ id: "in", types: ["number"] }],
      outputs: [{ id: "out" }],
    });
  }

  run() {}
}

class DflowFunction extends DflowNode {
  static kind = "dflowFunction";

  run() {}
}

class DflowReturn extends DflowNode {
  static kind = "dflowReturn";

  run() {}
}

export const catalog = {
  [DflowInput.kind]: DflowInput,
  [DflowFunction.kind]: DflowFunction,
  [DflowReturn.kind]: DflowReturn,
};
