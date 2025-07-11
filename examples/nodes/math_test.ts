import { test } from "node:test";
import { newDflow, testOneInOneOut, testOneOut } from "./_test-utils.ts";

test("mathAbs", () => {
  const dflow = newDflow();
  const nodeKind = "mathAbs";

  [{ input: -1, output: 1 }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathCos", () => {
  const dflow = newDflow();
  const nodeKind = "mathCos";

  [{ input: 1, output: Math.cos(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathMax", () => {
  const dflow = newDflow();
  const nodeKind = "mathMax";

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 3 }
  ].forEach(({ input, output }) => {
    testOneInOneOut<unknown[], unknown>(dflow, nodeKind, input, output);
  });
});

test("mathMin", () => {
  const dflow = newDflow();
  const nodeKind = "mathMin";

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 1 }
  ].forEach(({ input, output }) => {
    testOneInOneOut<unknown[], unknown>(dflow, nodeKind, input, output);
  });
});

test("mathPI", () => {
  const dflow = newDflow();
  const nodeKind = "mathPI";

  testOneOut<number>(dflow, nodeKind, Math.PI);
});

test("mathRound", () => {
  const dflow = newDflow();
  const nodeKind = "mathRound";

  [{ input: 1.2, output: Math.floor(1.2) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});

test("mathSin", () => {
  const dflow = newDflow();
  const nodeKind = "mathSin";

  [{ input: 1, output: Math.sin(1) }].forEach(({ input, output }) => {
    testOneInOneOut<number, number>(dflow, nodeKind, input, output);
  });
});
