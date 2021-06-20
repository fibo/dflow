import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";

class DflowNodeHost extends DflowNode {
  static kind = "dflowHost";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      outputs: [{ id: "o1", name: "nodeKinds", types: ["array"] }],
    });
  }

  run(host: DflowHost) {
    const nodeKinds = this.getOutputByPosition(0);
    nodeKinds.data = host.nodeKinds;
  }
}

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
  [DflowNodeHost.kind]: DflowNodeHost,
};
