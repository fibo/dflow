import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";

class Dflow extends DflowNode {
  static kind = "dflow";

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
  static kind = "function";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      inputs: [
        /**
          Defines the function signature.
          For example if data = 1 there is a single argument.
         */
        { id: "in", types: ["number"], name: "signature" },
      ],
      outputs: [{ id: "out", types: ["DflowGraph"] }],
    });
  }

  run() {}

  updateOutputs() {
    const signature = this.getInputByPosition(0);
    const numOutputs = this.outputs.size;

    switch (true) {
      // No argument, delete all argument outputs.
      case signature.data === 0: {
        for (let i = 1; i < numOutputs; i++) {
          const output = this.getInputByPosition(i);
          this.deleteOutput(output.id);
        }
        break;
      }

      case Number.isInteger(signature.data): {
        const numArguments = signature.data as number;

        // Create missing argument outputs.
        for (let i = numOutputs - 1; i < numArguments; i++) {
          this.newInput({});
        }

        // Delete exceeding argument outputs.
        for (let i = numOutputs; i > 1; i--) {
          const output = this.getInputByPosition(i);
          this.deleteOutput(output.id);
        }
        break;
      }
    }
  }
}

class DflowReturn extends DflowNode {
  static kind = "return";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      inputs: [{ id: "i1" }],
    });
  }

  run() {}
}

export const catalog = {
  [Dflow.kind]: Dflow,
  [DflowFunction.kind]: DflowFunction,
  [DflowReturn.kind]: DflowReturn,
};
