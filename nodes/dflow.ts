import { DflowNode, DflowPinType } from "../dflow.ts";

class DflowArgument extends DflowNode {
  static kind = "argument";
  static isConstant = true;
  static inputs = [
    ...DflowNode.in(["DflowType"], { name: "type" }),
    ...DflowNode.in(["number"], { name: "position" }),
  ];
  static outputs = DflowNode.out();
  onBeforeConnectInput(sourceNode: DflowNode, sourcePosition: number) {
    const pinType = sourceNode.output(sourcePosition).data as DflowPinType;
    this.output(0).addType(pinType);
  }
}

export const catalog = {
  [DflowArgument.kind]: DflowArgument,
};
