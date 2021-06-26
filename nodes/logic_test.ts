import {
  testOneBoolInOneBoolOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.and.kind, () => {
  const nodeKind = catalog.and.kind;
  [[true, true], [true, false], [false, false], [false, true]].forEach(
    ([input1, input2]) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, input1 && input2);
    },
  );
});

Deno.test(catalog.not.kind, () => {
  const nodeKind = catalog.not.kind;
  [true, false].forEach((input) => {
    testOneBoolInOneBoolOut(nodeKind, input, !input);
  });
});

Deno.test(catalog.or.kind, () => {
  const nodeKind = catalog.or.kind;
  [[true, true], [true, false], [false, false], [false, true]].forEach(
    ([input1, input2]) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, input1 || input2);
    },
  );
});
