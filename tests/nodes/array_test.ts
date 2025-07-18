import { test } from "node:test";
import {
  newDflow,
  testOneInOneOut,
  testOneInTwoOut,
  testThreeInOneOut,
  testTwoInOneOut
} from "./utils.ts";

test("arrayAt", () => {
  const dflow = newDflow();
  const nodeKind = "arrayAt";
  for (const { input1, input2, output } of [
    { input1: ["a"], input2: 0, output: "a" },
    { input1: ["a"], input2: 1, output: undefined },
    { input1: ["a", true], input2: 1, output: true },
    { input1: ["a", true, 42], input2: -1, output: 42 }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("arrayIncludes", () => {
  const dflow = newDflow();
  const nodeKind = "arrayIncludes";
  for (const {
    inputs: { array, element },
    output
  } of [
    { inputs: { array: ["a", "b"], element: "c" }, output: false },
    { inputs: { array: ["a", "b"], element: "a" }, output: true }
  ])
    testTwoInOneOut(dflow, nodeKind, array, element, output);
});

test("arrayJoin", () => {
  const dflow = newDflow();
  const nodeKind = "arrayJoin";
  for (const {
    inputs: { array, separator },
    output
  } of [
    { inputs: { array: ["a", "b"], separator: "/" }, output: "a/b" },
    { inputs: { array: ["a", "b"], separator: "-" }, output: "a-b" },
    { inputs: { array: ["a", "b"], separator: undefined }, output: "a,b" }
  ])
    testTwoInOneOut(dflow, nodeKind, array, separator, output);
});

test("arrayLength", () => {
  const dflow = newDflow();
  const nodeKind = "arrayLength";
  for (const { input, output } of [{ input: ["a"], output: 1 }])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("arrayPop", () => {
  const dflow = newDflow();
  const nodeKind = "arrayPop";
  for (const { input, output1, output2 } of [
    { input: [1, 2, 3], output1: 3, output2: [1, 2] }
  ])
    testOneInTwoOut(dflow, nodeKind, input, output1, output2);
});

test("arrayPush", () => {
  const dflow = newDflow();
  const nodeKind = "arrayPush";
  for (const { input1, input2, output } of [
    { input1: [], input2: undefined, output: [] },
    { input1: [], input2: "x", output: ["x"] },
    { input1: [1, 2], input2: 3, output: [1, 2, 3] },
    { input1: [1, "a"], input2: true, output: [1, "a", true] }
  ])
    testTwoInOneOut(dflow, nodeKind, input1, input2, output);
});

test("arrayShift", () => {
  const dflow = newDflow();
  const nodeKind = "arrayShift";
  for (const { input, output1, output2 } of [
    { input: [1, 2, 3], output1: 1, output2: [2, 3] }
  ])
    testOneInTwoOut(dflow, nodeKind, input, output1, output2);
});

test("arraySlice", () => {
  const dflow = newDflow();
  const nodeKind = "arraySlice";
  for (const { input1, input2, input3, output } of [
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: undefined,
      output: ["camel", "duck", "elephant"]
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: 4,
      output: ["camel", "duck"]
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 1,
      input3: 5,
      output: ["bison", "camel", "duck", "elephant"]
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: -1,
      output: ["camel", "duck"]
    }
  ])
    testThreeInOneOut(dflow, nodeKind, input1, input2, input3, output);
});
