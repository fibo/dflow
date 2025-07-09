import { test } from "node:test";
import { newDflow, testOneInOneOut, testOneOut } from "./_test-utils.ts";

test("mathAbs", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathAbs.kind;

  [{ input: -1, output: 1 }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathCos", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCos.kind;

  [{ input: 1, output: Math.cos(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathCosh", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCosh.kind;

  [{ input: 1, output: Math.cosh(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathFloor", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathFloor.kind;

  [{ input: 1.2, output: Math.floor(1.2) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathMax", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMax.kind;

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 3 },
    { input: [1, 2, "3"], output: 3 }
  ].forEach(({ input, output }) => {
    testOneInOneOut<unknown[], unknown>(dflow, nodeKind, input, output);
  });
});

test("mathMin", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMin.kind;

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 1 },
    { input: ["1", 2, 3], output: 1 }
  ].forEach(({ input, output }) => {
    testOneInOneOut<unknown[], unknown>(dflow, nodeKind, input, output);
  });
});

test("mathPI", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathPI.kind;

  testOneOut<number>(dflow, nodeKind, Math.PI);
});

test("mathRound", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathRound.kind;

  [{ input: 1.2, output: Math.floor(1.2) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathSin", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSin.kind;

  [{ input: 1, output: Math.sin(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathSinh", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSinh.kind;

  [{ input: 1, output: Math.sinh(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});
