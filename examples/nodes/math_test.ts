import { test } from "node:test";
import { newDflow, testOneInOneOut, testOneOut } from "./_test-utils.ts";

test("Math.abs", () => {
  const dflow = newDflow();
  const nodeKind = "Math.abs";
  for (const { input, output } of [
    { input: 1, output: 1 },
    { input: -1, output: 1 },
    { input: 0, output: 0 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("Math.cos", () => {
  const dflow = newDflow();
  const nodeKind = "Math.cos";
  for (const { input, output } of [
    { input: 1, output: Math.cos(1) },
    { input: 0, output: Math.cos(0) },
    { input: -1, output: Math.cos(-1) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("Math.max", () => {
  const dflow = newDflow();
  const nodeKind = "Math.max";
  for (const { input, output } of [
    { input: [1, 2], output: 2 },
    { input: [1, 2, 3], output: 3 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("Math.min", () => {
  const dflow = newDflow();
  const nodeKind = "Math.min";
  for (const { input, output } of [
    { input: [1, 2], output: 1 },
    { input: [1, -2, 3], output: -2 }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("Math.PI", () => {
  const dflow = newDflow();
  const nodeKind = "Math.PI";
  testOneOut(dflow, nodeKind, Math.PI);
});

test("Math.round", () => {
  const dflow = newDflow();
  const nodeKind = "Math.round";
  for (const { input, output } of [
    { input: 1.4, output: Math.round(1.4) },
    { input: 1.5, output: Math.round(1.5) },
    { input: 1.6, output: Math.round(1.6) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("Math.sin", () => {
  const dflow = newDflow();
  const nodeKind = "Math.sin";
  for (const { input, output } of [
    { input: 0, output: Math.sin(0) },
    { input: 1, output: Math.sin(1) },
    { input: Math.PI / 2, output: Math.sin(Math.PI / 2) }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});
