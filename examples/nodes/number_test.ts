import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

test("isFinite", () => {
  const dflow = newDflow();
  const nodeKind = "isFinite";

  [
    { input: 1, output: true },
    // Infinity is not serializable, JSON.stringify will convert it to null.
    { input: Infinity, output: undefined }
  ].forEach(({ input, output }) => {
    testOneInOneOut<number, boolean>(dflow, nodeKind, input, output);
  });
});

test("isInteger", () => {
  const dflow = newDflow();
  const nodeKind = "isInteger";

  [
    { input: 1, output: true },
    { input: 2 * 2, output: true },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: false }
  ].forEach((input) => {
    testOneInOneOut<DflowData, boolean>(
      dflow,
      nodeKind,
      input,
      Number.isInteger(input)
    );
  });
});

test("parseFloat", () => {
  const dflow = newDflow();
  const nodeKind = "parseFloat";

  [
    {
      input: "1.5",
      output: 1.5
    },
    {
      input: "1",
      output: 1
    }
  ].forEach(({ input, output }) => {
    testOneInOneOut<unknown, number>(dflow, nodeKind, input, output);
  });
});
