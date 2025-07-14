import { test } from "node:test";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

test("isFinite", () => {
  const dflow = newDflow();
  const nodeKind = "isFinite";
  for (const { input, output } of [
    { input: 1, output: true },
    // Infinity is not serializable, JSON.stringify() converts it to null.
    { input: Infinity, output: undefined }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("isInteger", () => {
  const dflow = newDflow();
  const nodeKind = "isInteger";
  for (const { input, output } of [
    { input: 1, output: true },
    { input: 2 * 2, output: true },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    // NaN is not serializable, JSON.stringify() converts it to null.
    { input: NaN, output: false }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("parseFloat", () => {
  const dflow = newDflow();
  const nodeKind = "parseFloat";
  for (const { input, output } of [
    { input: "1.5", output: 1.5 },
    { input: "1", output: 1 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});
