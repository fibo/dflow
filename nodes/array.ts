import { DflowArray, DflowId, DflowNode } from "../engine.ts";

class DflowArrayFilter extends DflowNode {
  static kind = "arrayFilter";
  static inputs = [
    ...DflowNode.in(["array"]),
    ...DflowNode.in(["DflowId"], { name: "functionId" }),
  ];
  static outputs = DflowNode.out(["array"]);
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).filter(
      (...args) =>
        this.host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

class DflowArrayLength extends DflowNode {
  static kind = "arrayLength";
  static inputs = DflowNode.in(["array"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).length;
  }
}

class DflowArrayMap extends DflowNode {
  static kind = "arrayMap";
  static inputs = [
    ...DflowNode.in(["array"]),
    ...DflowNode.in(["DflowId"], { name: "functionId" }),
  ];
  static outputs = DflowNode.out(["array"]);
  run() {
    this.output(0).data = (this.input(0).data as DflowArray).map(
      (...args) =>
        this.host.executeFunction(this.input(1).data as DflowId, args),
    );
  }
}

export const catalog = {
  [DflowArrayFilter.kind]: DflowArrayFilter,
  [DflowArrayLength.kind]: DflowArrayLength,
  [DflowArrayMap.kind]: DflowArrayMap,
};
