import { DflowArray } from "../engine.ts";
import { DflowAbstractOneArrInOneNumOut } from "./abstract.ts";

class DflowArrayLength extends DflowAbstractOneArrInOneNumOut {
  static kind = "arrayLength";

  task(input: DflowArray) {
    return input.length;
  }
}

export const catalog = {
  [DflowArrayLength.kind]: DflowArrayLength,
};
