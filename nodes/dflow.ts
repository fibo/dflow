import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";

class Dflow extends DflowNode {
  static kind = "dflow";
  static outputs = DflowNode.out(["array"], { name: "nodeKinds" });

  run() {
    const nodeKinds = this.output(0);
    nodeKinds.data = this.host.nodeKinds;
  }
}

class DflowArgument extends DflowNode {
  static kind = "argument";
  static outputs = DflowNode.out();

  run() {
  }
}

class DflowFunction extends DflowNode {
  static kind = "function";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      inputs: [
        { id: "in1", name: "arguments", types: ["DflowArguments"] },
        { id: "in2", name: "return" },
      ],
      outputs: [{ id: "o1", types: ["DflowGraph"] }],
    }, host);
  }

  run() {
  }
}

export const catalog = {
  [Dflow.kind]: Dflow,
  [DflowArgument.kind]: DflowArgument,
  [DflowFunction.kind]: DflowFunction,
};
