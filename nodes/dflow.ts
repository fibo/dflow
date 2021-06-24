import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";

class Dflow extends DflowNode {
  static kind = "dflow";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      outputs: [{ id: "o1", name: "nodeKinds", types: ["array"] }],
    }, host);
  }

  run() {
    const nodeKinds = this.getOutputByPosition(0);
    nodeKinds.data = this.host.nodeKinds;
  }
}

class DflowArguments extends DflowNode {
  static kind = "arguments";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      inputs: [
        { id: "in", types: ["number"], name: "signature" },
      ],
      outputs: [{ id: "out", types: ["DflowArguments"] }],
    }, host);
  }

  get numArguments() {
    return this.signature.data ?? 0;
  }

  get signature() {
    return this.getInputByPosition(0);
  }

  run() {
    const { numArguments, numOutputs } = this;

    switch (true) {
      // No argument, delete all argument outputs.
      case numArguments === 0: {
        for (let i = 1; i < numOutputs; i++) {
          const output = this.getOutputByPosition(i);
          this.deleteOutput(output.id);
        }
        break;
      }

      case Number.isInteger(numArguments): {
        // Delete exceeding argument outputs.
        for (let i = numOutputs; i > 1; i--) {
          const output = this.getOutputByPosition(i);
          this.deleteOutput(output.id);
        }

        // Create missing argument outputs.
        for (let i = numOutputs - 1; i < numArguments; i++) {
          this.newOutput({ id: `a${i}`, name: `argument${i}` });
        }

        break;
      }

      default: {
        this.getOutputByPosition(0).clear();
      }
    }
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
  [DflowArguments.kind]: DflowArguments,
  [DflowFunction.kind]: DflowFunction,
};
