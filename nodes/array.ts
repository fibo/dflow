import { DflowArray, DflowId, DflowNode, DflowNodeUnary } from "../engine.ts";

class DflowArrayFilter extends DflowNodeUnary {
  static kind = "arrayFilter";
  static inputs = [
    ...DflowNode.in(["array"]),
    ...DflowNode.in(["DflowId"], { name: "functionId" }),
  ];
  static outputs = DflowNode.out(["array"]);
  task() {
    return (this.input(0).data as DflowArray).filter(
      (...args) =>
        this.host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayLength extends DflowNodeUnary {
  static kind = "arrayLength";
  static inputs = DflowNode.in(["array"]);
  static outputs = DflowNode.out(["number"]);
  task() {
    return (this.input(0).data as DflowArray).length;
  }
}

export const catalog = {
  [DflowArrayFilter.kind]: DflowArrayFilter,
  [DflowArrayLength.kind]: DflowArrayLength,
};
