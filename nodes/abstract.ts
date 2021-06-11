import {
  DflowNode,
  DflowSerializedNode,
  DflowSerializedPin,
} from "../engine.ts";

export const inNum = (): DflowSerializedPin => ({
  id: "in",
  types: ["number"],
});

export const outNum = (data?: number): DflowSerializedPin => ({
  id: "out",
  types: ["number"],
  data,
});

export class DflowAbstractUnaryNumericOperator extends DflowNode {
  constructor(arg: DflowSerializedNode) {
    super({ ...arg, inputs: [inNum()], outputs: [outNum()] });
  }

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
