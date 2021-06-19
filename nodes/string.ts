import { DflowAbstractOneStrInOneNumOut } from "./abstract.ts";

class DflowStringLength extends DflowAbstractOneStrInOneNumOut {
  static kind = "stringLength";

  task(input: string) {
    return input.length;
  }
}

export const catalog = {
  [DflowStringLength.kind]: DflowStringLength,
};
