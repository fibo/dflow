import { DflowNode, DflowSerializedNode } from "../engine.ts";

export class DflowAbstractZeroInOneOut extends DflowNode {
  constructor({ id, kind }: DflowSerializedNode) {
    super({ id, kind, outputs: [{ id: "out" }] });
  }
}

export class DflowAbstractOneInOneOut extends DflowNode {
  constructor({ id, kind }: DflowSerializedNode) {
    super({ id, kind, inputs: [{ id: "in" }], outputs: [{ id: "out" }] });
  }
}

export class DflowAbstractUnaryNumericOperator
  extends DflowAbstractOneInOneOut {
  operation(_num: number): number {
    throw new Error(`Unimplemented operation nodeKind=${this.kind}`);
  }

  run() {
    const num = this.getInputByPosition(0).getData();

    if (typeof num === "number") {
      const result = this.operation(num);

      this.getOutputByPosition(0).setData(result);
    }
  }
}
