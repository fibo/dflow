import {
  testTwoNumInOneBoolOut,
  testTwoNumInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./operator.ts";

Deno.test(catalog.addition.kind, () => {
  const nodeKind = catalog.addition.kind;
  [[2, 2]].forEach(([input1, input2]) => {
    testTwoNumInOneNumOut(nodeKind, input1, input2, input1 + input2);
  });
});

Deno.test(catalog.greaterThan.kind, () => {
  const nodeKind = catalog.greaterThan.kind;
  [[1, 2]].forEach(
    ([input1, input2]) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, input1 > input2);
    },
  );
});

Deno.test(catalog.greaterThanOrEqual.kind, () => {
  const nodeKind = catalog.greaterThanOrEqual.kind;
  [[1, 2]].forEach(
    ([input1, input2]) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, input1 >= input2);
    },
  );
});

Deno.test(catalog.lessThan.kind, () => {
  const nodeKind = catalog.lessThan.kind;
  [[1, 2]].forEach(
    ([input1, input2]) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, input1 < input2);
    },
  );
});

Deno.test(catalog.lessThanOrEqual.kind, () => {
  const nodeKind = catalog.lessThanOrEqual.kind;
  [[1, 2]].forEach(
    ([input1, input2]) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, input1 <= input2);
    },
  );
});

Deno.test(catalog.subtraction.kind, () => {
  const nodeKind = catalog.subtraction.kind;
  [[2, 2]].forEach(([input1, input2]) => {
    testTwoNumInOneNumOut(nodeKind, input1, input2, input1 - input2);
  });
});
