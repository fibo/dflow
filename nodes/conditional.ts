import { DflowNode, DflowSerializedNode } from "../engine.ts";

class DflowIf extends DflowNode {
  static kind = "if";

  constructor(arg: DflowSerializedNode) {
    super({
      ...arg,
      inputs: [{ id: "i1", name: "condition", types: ["boolean"] }, {
        id: "i2",
        name: "then",
      }, { id: "i3", name: "else" }],
      outputs: [{ id: "o1" }],
    });
  }

  run() {
    const conditionData = this.getInputByPosition(0).data;
    const thenData = this.getInputByPosition(1).data;
    const elseData = this.getInputByPosition(2).data;
    const output = this.getOutputByPosition(0);

    if (conditionData) {
      output.data = thenData;
    } else {
      output.data = elseData;
    }
  }
}

export const catalog = {
  [DflowIf.kind]: DflowIf,
};
