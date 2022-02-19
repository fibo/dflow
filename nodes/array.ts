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

class DflowArrayIncludes extends DflowNode {
  static kind = "arrayIncludes";
  static inputs = [
    ...DflowNode.in(["array"], { name: "array" }),
    ...DflowNode.in(["string"], { name: "element" }),
  ];
  static outputs = DflowNode.out(["boolean"]);
  run() {
    const data = this.input(0).data;
    const element = this.input(1).data;

    if (Array.isArray(data)) {
      this.output(0).data = data.includes(element);
    }
  }
}

class DflowArrayJoin extends DflowNode {
  static kind = "arrayJoin";
  static inputs = [
    ...DflowNode.in(["array"], { name: "array" }),
    ...DflowNode.in(["string"], { name: "separator", optional: true }),
  ];
  static outputs = DflowNode.out(["string"]);
  run() {
    const data = this.input(0).data;
    const separator = this.input(1).data ?? ",";

    if (Array.isArray(data)) {
      this.output(0).data = data.join(separator as string);
    }
  }
}

class DflowArrayLength extends DflowNode {
  static kind = "arrayLength";
  static inputs = DflowNode.in(["array"]);
  static outputs = DflowNode.out(["number"]);
  run() {
    const data = this.input(0).data;
    if (Array.isArray(data)) {
      this.output(0).data = data.length;
    } else {
      this.output(0).clear;
    }
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

class DflowArrayPop extends DflowNode {
  static kind = "arrayPop";
  static inputs = DflowNode.in(["array"], { name: "array" });
  static outputs = [
    ...DflowNode.out([], { name: "element" }),
    ...DflowNode.out(["array"], { name: "rest" }),
  ];
  run() {
    const array = (this.input(0).data as DflowArray).slice();
    const element = array.pop();
    this.output(0).data = element;
    this.output(1).data = array;
  }
}

export const catalog = {
  [DflowArrayFilter.kind]: DflowArrayFilter,
  [DflowArrayIncludes.kind]: DflowArrayIncludes,
  [DflowArrayJoin.kind]: DflowArrayJoin,
  [DflowArrayLength.kind]: DflowArrayLength,
  [DflowArrayMap.kind]: DflowArrayMap,
  [DflowArrayPop.kind]: DflowArrayPop,
};
