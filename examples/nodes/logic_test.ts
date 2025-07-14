import { test } from "node:test";
import { newDflow, testOneInOneOut, testTwoInOneOut } from "./_test-utils.ts";

test("And", () => {
  const dflow = newDflow();
  const nodeKind = "and";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [true, true], output: true && true },
    { inputs: [true, false], output: true && false },
    { inputs: [false, false], output: false && false },
    { inputs: [false, true], output: false && true }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("Not", () => {
  const dflow = newDflow();
  const nodeKind = "not";
  for (const { input, output } of [
    { input: true, output: false },
    { input: false, output: true }
  ])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("NullishCoaleshing", () => {
  const dflow = newDflow();
  const nodeKind = "??";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [undefined, undefined], output: undefined },
    { inputs: [undefined, true], output: true },
    { inputs: [undefined, false], output: false },
    { inputs: [42, undefined], output: 42 },
    { inputs: [undefined, 42], output: 42 },
    { inputs: ["x", "y"], output: "x" }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("Or", () => {
  const dflow = newDflow();
  const nodeKind = "or";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [true, true], output: true || true },
    { inputs: [true, false], output: true || false },
    { inputs: [false, false], output: false || false },
    { inputs: [false, true], output: false || true }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});
