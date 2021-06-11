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
