import { test } from "node:test";
import { newDflow, testTwoInOneOut } from "./utils.ts";

test("equality", () => {
  const dflow = newDflow();
  const nodeKind = "equality";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [1, 2], output: false },
    { inputs: [1, 1], output: true },
    { inputs: [1, "1"], output: true },
    { inputs: ["a", "b"], output: false },
    { inputs: ["x", "x"], output: true }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("addition", () => {
  const dflow = newDflow();
  const nodeKind = "addition";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [2, 2], output: 4 },
    { inputs: [0, 0], output: 0 },
    { inputs: [-1, 1], output: 0 },
    { inputs: ["-1", 2], output: 1 },
    { inputs: ["xx", 1], output: undefined }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("subtraction", () => {
  const dflow = newDflow();
  const nodeKind = "subtraction";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [4, 2], output: 2 },
    { inputs: [0, 0], output: 0 },
    { inputs: [5, 3], output: 2 },
    { inputs: ["1", 2], output: -1 },
    { inputs: ["xx", 1], output: undefined }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("multiplication", () => {
  const dflow = newDflow();
  const nodeKind = "multiplication";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [2, 2], output: 4 },
    { inputs: [0, 5], output: 0 },
    { inputs: [-1, 3], output: -3 }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("division", () => {
  const dflow = newDflow();
  const nodeKind = "division";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [4, 2], output: 2 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: undefined } // Division by zero
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("greaterThan", () => {
  const dflow = newDflow();
  const nodeKind = "greaterThan";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [2, 1], output: true },
    { inputs: [1, 2], output: false },
    { inputs: [2, 2], output: false }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("lessThan", () => {
  const dflow = newDflow();
  const nodeKind = "lessThan";
  for (const {
    inputs: [input1, input2],
    output
  } of [
    { inputs: [1, 2], output: true },
    { inputs: [2, 1], output: false },
    { inputs: [2, 2], output: false }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});
