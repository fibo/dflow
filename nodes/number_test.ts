import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./index.ts";
import {
  testOneInOneOut,
  testOneNumInOneBoolOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";

Deno.test("isFinite", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isFinite.kind;

  [
    { input: 1, output: true },
    { input: undefined, output: undefined },
    { input: Infinity, output: false },
  ].forEach(
    ({ input, output }) => {
      testOneNumInOneBoolOut(dflow, nodeKind, input, output);
    },
  );
});

Deno.test("isInteger", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isInteger.kind;

  [
    { input: undefined, output: undefined },
    { input: 1, output: true },
    { input: 2 * 2, output: true },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: false },
  ].forEach((input) => {
    testOneInOneOut<boolean>(dflow, nodeKind, input, Number.isInteger(input));
  });
});

Deno.test("isNaN", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isNaN.kind;

  [
    { input: undefined, output: false },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: true },
  ].forEach(({ input, output }) => {
    testOneInOneOut<boolean>(dflow, nodeKind, input, output);
  });
});

Deno.test("parseFloat", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.parseFloat.kind;

  [
    { input: undefined, output: undefined },
    { input: "1.5", output: 1.5 },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("parseInt", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.parseInt.kind;

  [
    { input: undefined, output: undefined },
    { input: "1.2", output: 1 },
    { input: "1", output: 1 },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(dflow, nodeKind, input, output);
  });
});
