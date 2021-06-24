import { DflowHost, DflowNode, DflowSerializedNode } from "../engine.ts";
import {
  oneAnyOut,
  oneArrOut,
  oneBoolOut,
  oneNumOut,
  oneNumStrOut,
  oneObjOut,
  oneStrOut,
} from "./abstract.ts";

class DflowData extends DflowNode {
  static kind = "data";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneAnyOut()] }, host);
  }

  run() {}
}

class DflowArray extends DflowNode {
  static kind = "array";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneArrOut()] }, host);
  }

  run() {}
}

class DflowBoolean extends DflowNode {
  static kind = "boolean";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneBoolOut()] }, host);
  }

  run() {}
}

class DflowNumber extends DflowNode {
  static kind = "number";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneNumOut()] }, host);
  }

  run() {}
}

class DflowNumberOrString extends DflowNode {
  static kind = "numberOrString";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneNumStrOut()] }, host);
  }

  run() {}
}

class DflowObject extends DflowNode {
  static kind = "object";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneObjOut()] }, host);
  }

  run() {}
}

class DflowString extends DflowNode {
  static kind = "string";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, outputs: [oneStrOut()] }, host);
  }

  run() {}
}

export const catalog = {
  [DflowData.kind]: DflowData,
  [DflowArray.kind]: DflowArray,
  [DflowBoolean.kind]: DflowBoolean,
  [DflowNumber.kind]: DflowNumber,
  [DflowNumberOrString.kind]: DflowNumberOrString,
  [DflowObject.kind]: DflowObject,
  [DflowString.kind]: DflowString,
};
