import { DflowObject } from "../engine.ts";
import { DflowAbstractOneObjInOneArrOut } from "./abstract.ts";

class DflowObjectKeys extends DflowAbstractOneObjInOneArrOut {
  static kind = "objectKeys";

  task(input: DflowObject) {
    return Object.keys(input);
  }
}

class DflowObjectValues extends DflowAbstractOneObjInOneArrOut {
  static kind = "objectValues";

  task(input: DflowObject) {
    return Object.values(input);
  }
}

export const catalog = {
  [DflowObjectKeys.kind]: DflowObjectKeys,
  [DflowObjectValues.kind]: DflowObjectValues,
};
