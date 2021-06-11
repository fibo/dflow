import { DflowAbstractZeroInOneOut } from "./abstract.ts";

export class DflowNum extends DflowAbstractZeroInOneOut {
  static kind = "num";

  run() {}
}

export const catalog = {
  [DflowNum.kind]: DflowNum,
};
