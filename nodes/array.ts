import { JsonArray } from "../engine.ts";
import { DflowAbstractOneArrInOneNumOut } from "./abstract.ts";

class DflowArrayLength extends DflowAbstractOneArrInOneNumOut {
  static kind = "arrayLength";

  task(input: JsonArray) {
    return input.length;
  }
}

export const catalog = {
  [DflowArrayLength.kind]: DflowArrayLength,
};
