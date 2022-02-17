import {
  testTwoAnyInOneBoolOut,
  testTwoNumInOneBoolOut,
  testTwoNumInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.addition.kind, () => {
  const nodeKind = catalog.addition.kind;
  [[2, 2]].forEach(([input1, input2]) => {
    testTwoNumInOneNumOut(nodeKind, input1, input2, input1 + input2);
  });
});

Deno.test(catalog.equality.kind, () => {
  const nodeKind = catalog.equality.kind;
  [
    {
      inputs: [1, 2],
      expected: false,
    },
    {
      inputs: [1, 1],
      expected: true,
    },
    {
      inputs: [1, "1"],
      expected: true,
    },
    {
      inputs: ["a", "b"],
      expected: false,
    },
    {
      inputs: ["x", "x"],
      expected: true,
    },
  ].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoAnyInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.greaterThan.kind, () => {
  const nodeKind = catalog.greaterThan.kind;
  [{ inputs: [1, 2], expected: false }].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.greaterThanOrEqual.kind, () => {
  const nodeKind = catalog.greaterThanOrEqual.kind;
  [{ inputs: [1, 2], expected: false }].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.lessThan.kind, () => {
  const nodeKind = catalog.lessThan.kind;
  [{ inputs: [1, 2], expected: true }].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.lessThanOrEqual.kind, () => {
  const nodeKind = catalog.lessThanOrEqual.kind;
  [{ inputs: [1, 2], expected: true }].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.inequality.kind, () => {
  const nodeKind = catalog.inequality.kind;
  [
    {
      inputs: [1, 2],
      expected: true,
    },
    {
      inputs: [1, 1],
      expected: false,
    },
    {
      inputs: [1, "1"],
      expected: false,
    },
    {
      inputs: ["a", "b"],
      expected: true,
    },
    {
      inputs: ["x", "x"],
      expected: false,
    },
  ].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoAnyInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});

Deno.test(catalog.subtraction.kind, () => {
  const nodeKind = catalog.subtraction.kind;
  [{ inputs: [2, 2], expected: 0 }].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoNumInOneNumOut(nodeKind, input1, input2, expected);
    },
  );
});
