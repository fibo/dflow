import { DflowNode, DflowSerializedNode } from "../engine.ts";
import {
  oneAnyOut,
  oneArrOut,
  oneBoolOut,
  oneNumOut,
  oneObjOut,
  oneStrOut,
} from "./abstract.ts";

class DflowData extends DflowNode {
  static kind = "data";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneAnyOut()] });
  }

  run() {}
}

class DflowArray extends DflowNode {
  static kind = "array";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneArrOut()] });
  }

  run() {}
}

class DflowBoolean extends DflowNode {
  static kind = "boolean";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneBoolOut()] });
  }

  run() {}
}

class DflowNumber extends DflowNode {
  static kind = "number";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneNumOut()] });
  }

  run() {}
}

class DflowObject extends DflowNode {
  static kind = "object";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneObjOut()] });
  }

  run() {}
}

class DflowString extends DflowNode {
  static kind = "string";

  constructor(arg: DflowSerializedNode) {
    super({ ...arg, outputs: [oneStrOut()] });
  }

  run() {}
}

export const catalog = {
  [DflowData.kind]: DflowData,
  [DflowArray.kind]: DflowArray,
  [DflowBoolean.kind]: DflowBoolean,
  [DflowNumber.kind]: DflowNumber,
  [DflowObject.kind]: DflowObject,
  [DflowString.kind]: DflowString,
};
