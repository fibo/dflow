import { DflowNode } from "../engine.ts";

class DflowFunction extends DflowNode {
  static kind = "dflowFunction";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      inputs: [
        /**
          Defines the function signature.
          For example if data = 1 there is a single argument.
         */
        { id: "in", types: ["number"], name: "arguments" },
      ],
      outputs: [{ id: "out", types: ["DflowGraph"] }, { id: "arg1" }],
    });
  }

  run() {
    // 1. Get the trees starting from argument outputs.
  }
}

export const catalog = {
  [DflowFunction.kind]: DflowFunction,
};
