import { DflowNode } from "../engine.ts";

class Dflow extends DflowNode {
  static kind = "dflow";
  static outputs = DflowNode.out(["array"], { name: "nodeKinds" });

  run() {
    const nodeKinds = this.output(0);
    nodeKinds.data = this.host.nodeKinds;
  }
}

class DflowArgument extends DflowNode {
  static kind = "argument";
  static isConstant = true;
  static outputs = DflowNode.out();
}

export class DflowFunction extends DflowNode {
  static kind = "function";
  static isConstant = true;
  static outputs = Dflow.out(["DflowId"], { name: "id" });
  onCreate() {
    this.output(0).data = this.id;
  }
}

class DflowReturn extends DflowNode {
  static kind = "return";
  static isConstant = true;
  static inputs = [
    ...Dflow.in(["DflowId"], { name: "functionId" }),
    ...Dflow.in([], { name: "value" }),
  ];
}

export const catalog = {
  [Dflow.kind]: Dflow,
  [DflowArgument.kind]: DflowArgument,
  [DflowFunction.kind]: DflowFunction,
  [DflowReturn.kind]: DflowReturn,
};
