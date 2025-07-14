import { test } from "node:test";
import { newDflow, testOneInOneOut, testOneOut } from "./_test-utils.ts";

test("mathAbs", () => {
  const dflow = newDflow();
  const nodeKind = "mathAbs";
  for (const { input, output } of [
    { input: 1, output: 1 },
    { input: -1, output: 1 },
    { input: 0, output: 0 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("mathCos", () => {
  const dflow = newDflow();
  const nodeKind = "mathCos";
  for (const { input, output } of [
    { input: 1, output: Math.cos(1) },
    { input: 0, output: Math.cos(0) },
    { input: -1, output: Math.cos(-1) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("mathMax", () => {
  const dflow = newDflow();
  const nodeKind = "mathMax";
  for (const { input, output } of [
    { input: [1, 2], output: 2 },
    { input: [1, 2, 3], output: 3 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("mathMin", () => {
  const dflow = newDflow();
  const nodeKind = "mathMin";
  for (const { input, output } of [
    { input: [1, 2], output: 1 },
    { input: [1, -2, 3], output: -2 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("mathPI", () => {
  const dflow = newDflow();
  const nodeKind = "mathPI";
  testOneOut(dflow, nodeKind, Math.PI);
});

test("mathRound", () => {
  const dflow = newDflow();
  const nodeKind = "mathRound";
  for (const { input, output } of [
    { input: 1.4, output: Math.round(1.4) },
    { input: 1.5, output: Math.round(1.5) },
    { input: 1.6, output: Math.round(1.6) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("mathSin", () => {
  const dflow = newDflow();
  const nodeKind = "mathSin";
  for (const { input, output } of [
    { input: 0, output: Math.sin(0) },
    { input: 1, output: Math.sin(1) },
    { input: Math.PI / 2, output: Math.sin(Math.PI / 2) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});
