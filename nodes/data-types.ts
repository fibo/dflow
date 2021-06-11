import { DflowAbstractZeroInOneOut } from "./abstract.ts";

export class DflowNum extends DflowAbstractZeroInOneOut {
  static kind: "Num";

  run() {}
}

export const catalog = {
  [DflowNum.kind]: DflowNum,
};
