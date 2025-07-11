import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow, testOneInOneOut, testTwoInOneOut } from "./_test-utils.ts";

test("And", () => {
  const dflow = newDflow();
  const nodeKind = "and";

  [
    { inputs: [true, true], output: true && true },
    { inputs: [true, false], output: true && false },
    { inputs: [false, false], output: false && false },
    { inputs: [false, true], output: false && true }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<boolean, boolean, boolean>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("Not", () => {
  const dflow = newDflow();
  const nodeKind = "not";

  [
    { input: true, output: false },
    { input: false, output: true }
  ].forEach(({ input, output }) => {
    testOneInOneOut<boolean, boolean>(dflow, nodeKind, input, output);
  });
});

test("NullishCoaleshing", () => {
  const dflow = newDflow();
  const nodeKind = "??";

  [
    { inputs: [undefined, undefined], output: undefined },
    { inputs: [undefined, true], output: true },
    { inputs: [undefined, false], output: false },
    { inputs: [42, undefined], output: 42 },
    { inputs: [undefined, 42], output: 42 }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<DflowData, DflowData, DflowData>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("Or", () => {
  const dflow = newDflow();
  const nodeKind = "or";

  [
    { inputs: [true, true], output: true || true },
    { inputs: [true, false], output: true || false },
    { inputs: [false, false], output: false || false },
    { inputs: [false, true], output: false || true }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<boolean, boolean, boolean>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});
