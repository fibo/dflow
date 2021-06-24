import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";

class DflowIf extends DflowNode {
  static kind = "if";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({
      ...arg,
      inputs: [{ id: "i1", name: "condition", types: ["boolean"] }, {
        id: "i2",
        name: "then",
      }, { id: "i3", name: "else" }],
      outputs: [{ id: "o1" }],
    }, host);
  }

  run() {
    const conditionData = this.input(0).data;
    const thenData = this.input(1).data;
    const elseData = this.input(2).data;
    const output = this.output(0);

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
