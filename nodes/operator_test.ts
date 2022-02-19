import {
  testTwoAnyInOneBoolOut,
  testTwoNumInOneBoolOut,
  testTwoNumInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.addition.kind, () => {
  const nodeKind = catalog.addition.kind;
  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.division.kind, () => {
  const nodeKind = catalog.division.kind;
  [
    { inputs: [2, 2], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: undefined },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.equality.kind, () => {
  const nodeKind = catalog.equality.kind;
  [
    {
      inputs: [1, 2],
      output: false,
    },
    {
      inputs: [1, 1],
      output: true,
    },
    {
      inputs: [1, "1"],
      output: true,
    },
    {
      inputs: ["a", "b"],
      output: false,
    },
    {
      inputs: ["x", "x"],
      output: true,
    },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoAnyInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.greaterThan.kind, () => {
  const nodeKind = catalog.greaterThan.kind;
  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.greaterThanOrEqual.kind, () => {
  const nodeKind = catalog.greaterThanOrEqual.kind;
  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.lessThan.kind, () => {
  const nodeKind = catalog.lessThan.kind;
  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.lessThanOrEqual.kind, () => {
  const nodeKind = catalog.lessThanOrEqual.kind;
  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.inequality.kind, () => {
  const nodeKind = catalog.inequality.kind;
  [
    {
      inputs: [1, 2],
      output: true,
    },
    {
      inputs: [1, 1],
      output: false,
    },
    {
      inputs: [1, "1"],
      output: false,
    },
    {
      inputs: ["a", "b"],
      output: true,
    },
    {
      inputs: ["x", "x"],
      output: false,
    },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoAnyInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.multiplication.kind, () => {
  const nodeKind = catalog.multiplication.kind;
  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.subtraction.kind, () => {
  const nodeKind = catalog.subtraction.kind;
  [{ inputs: [2, 2], output: 0 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(nodeKind, input1, input2, output);
    },
  );
});
