import { DflowHost, DflowSerializedNode } from "../engine.ts";
import {
  DflowAbstractOneInOneOut,
  DflowAbstractTwoInOneOut,
  oneBoolIn,
  oneBoolOut,
  twoBoolIn,
} from "./abstract.ts";

class DflowLogicAnd extends DflowAbstractTwoInOneOut {
  static kind = "logicAnd";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, inputs: twoBoolIn(), outputs: [oneBoolOut()] }, host);
  }

  task(input1: boolean, input2: boolean) {
    return input1 && input2;
  }
}

class DflowLogicNot extends DflowAbstractOneInOneOut {
  static kind = "logicNot";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, inputs: [oneBoolIn()], outputs: [oneBoolOut()] }, host);
  }

  task(input: boolean) {
    return !input;
  }
}

class DflowLogicOr extends DflowAbstractTwoInOneOut {
  static kind = "logicOr";

  constructor(arg: DflowSerializedNode, host: DflowHost) {
    super({ ...arg, inputs: twoBoolIn(), outputs: [oneBoolOut()] }, host);
  }

  task(input1: boolean, input2: boolean) {
    return input1 || input2;
  }
}

export const catalog = {
  [DflowLogicAnd.kind]: DflowLogicAnd,
  [DflowLogicNot.kind]: DflowLogicNot,
  [DflowLogicOr.kind]: DflowLogicOr,
};
