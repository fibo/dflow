import { JsonObject } from "../engine.ts";
import { DflowAbstractOneObjInOneArrOut } from "./abstract.ts";

class DflowObjectKeys extends DflowAbstractOneObjInOneArrOut {
  static kind = "objectKeys";

  task(input: JsonObject) {
    return Object.keys(input);
  }
}

export const catalog = {
  [DflowObjectKeys.kind]: DflowObjectKeys,
};
