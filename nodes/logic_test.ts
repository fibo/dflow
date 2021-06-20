import {
  testOneBoolInOneBoolOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";
import { catalog } from "./logic.ts";

Deno.test(catalog.logicAnd.kind, () => {
  const nodeKind = catalog.logicAnd.kind;
  [[true, true], [true, false], [false, false], [false, true]].forEach(
    ([input1, input2]) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, input1 && input2);
    },
  );
});

Deno.test(catalog.logicNot.kind, () => {
  const nodeKind = catalog.logicNot.kind;
  [true, false].forEach((input) => {
    testOneBoolInOneBoolOut(nodeKind, input, !input);
  });
});

Deno.test(catalog.logicOr.kind, () => {
  const nodeKind = catalog.logicOr.kind;
  [[true, true], [true, false], [false, false], [false, true]].forEach(
    ([input1, input2]) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, input1 || input2);
    },
  );
});
