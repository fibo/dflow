import {
  DflowArray,
  DflowData,
  DflowId,
  DflowNode,
  DflowPinType,
} from "../engine.ts";

class Dflow extends DflowNode {
  static kind = "dflow";
  static outputs = DflowNode.out(["array"], { name: "nodeKinds" });

  run() {
    const nodeKinds = this.output(0);
    nodeKinds.data = this.host.nodeKinds;
  }
}

class DflowComment extends DflowNode {
  static kind = "comment";
  static isConstant = true;
  static outputs = DflowNode.out(["string"]);
}

class DflowTypeNumber extends DflowNode {
  static kind = "typeNumber";
  static isConstant = true;
  static outputs = DflowNode.out(["DflowType"], {
    name: "number",
    data: "number",
  });
}

class DflowArgument extends DflowNode {
  static kind = "argument";
  static isConstant = true;
  static inputs = [...DflowNode.in(["DflowType"], { name: "type" })];
  static outputs = DflowNode.out();
  onBeforeConnectInput(sourceNode: DflowNode, sourcePosition: number) {
    const pinType = sourceNode.output(sourcePosition).data as DflowPinType;
    this.output(0).addType(pinType);
  }
}

export class DflowFunction extends DflowNode {
  static kind = "function";
  static isConstant = true;
  static outputs = Dflow.out(["DflowId"], { name: "id" });
  onCreate() {
    this.output(0).data = this.id;
  }
}

export class DflowFunctionCall extends DflowNode {
  static kind = "functionCall";
  static inputs = [
    ...DflowNode.in(["DflowId"], { name: "functionId" }),
    ...DflowNode.in([], { name: "argument0" }),
  ];
  static outputs = DflowNode.out();
  run() {
    const functionId = this.input(0).data;

    const args = [];
    for (let i = 1; i < this.numInputs; i++) {
      const arg = this.input(i).data;
      if (DflowData.isUndefined(arg)) {
        break;
      } else {
        args.push(arg);
      }
    }

    if (DflowData.isDflowId(functionId)) {
      try {
        this.output(0).data = this.host.executeFunction(
          functionId as DflowId,
          args as DflowArray,
        );
      } catch (error) {
        console.error(error);
      }
    }
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
  [DflowComment.kind]: DflowComment,
  [DflowFunction.kind]: DflowFunction,
  [DflowFunctionCall.kind]: DflowFunctionCall,
  [DflowReturn.kind]: DflowReturn,
  [DflowTypeNumber.kind]: DflowTypeNumber,
};
