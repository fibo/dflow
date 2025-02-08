import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

test("isFinite", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isFinite.kind;

  [
    { input: 1, output: true },
    { input: Infinity, output: false },
  ].forEach(({ input, output }) => {
    testOneInOneOut<number, boolean>(dflow, nodeKind, input, output);
  });
});

test("isInteger", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isInteger.kind;

  [
    { input: 1, output: true },
    { input: 2 * 2, output: true },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: false },
  ].forEach((input) => {
    testOneInOneOut<DflowData, boolean>(
      dflow,
      nodeKind,
      input,
      Number.isInteger(input),
    );
  });
});

test("parseFloat", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.parseFloat.kind;

  [{ input: "1.5", output: 1.5 }].forEach(({ input, output }) => {
    testOneInOneOut<unknown, number>(dflow, nodeKind, input, output);
  });
});

test("parseInt", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.parseInt.kind;

  [
    { input: "1.2", output: 1 },
    { input: "1", output: 1 },
  ].forEach(({ input, output }) => {
    testOneInOneOut<string, number>(dflow, nodeKind, input, output);
  });
});
