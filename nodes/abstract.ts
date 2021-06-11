import { DflowNode, DflowPin, DflowSerializedNode } from "../dflow.ts";

export class DflowAbstractZeroInOneOut extends DflowNode {
  constructor({ id, kind }: DflowSerializedNode) {
    super({ id, kind, outputs: [{ id: "out" }] });
  }

  getOutputData() {
    const output = this.getOutputByPosition(0) as DflowPin;
    return output.getData();
  }
}

export class DflowAbstractOneInOneOut extends DflowNode {
  constructor({ id, kind }: DflowSerializedNode) {
    super({ id, kind, inputs: [{ id: "in" }], outputs: [{ id: "out" }] });
  }

  getInputData() {
    const input = this.getInputByPosition(0) as DflowPin;

    return input.getData();
  }
}

export class DflowAbstractNumericUnaryOperator
  extends DflowAbstractOneInOneOut {
  setOutputData(data: number) {
    const output = this.getOutputByPosition(0) as DflowPin;

    if (typeof data === "number") {
      return output.setData(data);
    }
  }
}
