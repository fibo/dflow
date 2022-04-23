import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";
import { DflowArray, DflowHost } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";
import {
  testOneAnyInOneBoolOut,
  testOneArrAndOneAnyInOneArrOut,
  testOneArrAndOneNumInOneAnyOut,
  testOneArrAndOneStrInOneBoolOut,
  testOneArrAndOneStrInOneStrOut,
  testOneArrAndTwoNumInOneArrOut,
  testOneArrInOneAnyAndOneArrOut,
  testOneArrInOneArrOut,
  testOneArrInOneNumOut,
} from "./_test-utils.ts";

Deno.test("arrayAt", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayAt.kind;

  [
    { input1: undefined, input2: undefined, output: undefined },
    { input1: ["a"], input2: 0, output: "a" },
    { input1: ["a"], input2: 1, output: undefined },
    { input1: ["a", true], input2: 1, output: true },
    { input1: ["a", true, 42], input2: -1, output: 42 },
  ].forEach(({ input1, input2, output }) => {
    testOneArrAndOneNumInOneAnyOut(dflow, nodeKind, input1, input2, output);
  });
});

Deno.test("arrayFindIndex", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayFindIndex.kind;

  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["array"], data: [1, 2, 3, 4, 5, 6, 7] }],
  });
  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const numberNode = dflow.newNode({ kind: catalog.number.kind });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const greaterThanNode = dflow.newNode({ kind: catalog.greaterThan.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(greaterThanNode).to(returnNode, 1);
  dflow.connect(argumentNode).to(numberNode);
  dflow.connect(numberNode).to(greaterThanNode, 0);
  dflow.connect(numNode).to(greaterThanNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const output = 3;
  const result = testNode.output(0).data as number;

  assertEquals(result, output);
});

Deno.test("arrayFindLastIndex", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayFindLastIndex.kind;

  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["array"], data: [1, 2, 3, 4, 5, 6, 0] }],
  });
  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const numberNode = dflow.newNode({ kind: catalog.number.kind });
  const greaterThanNode = dflow.newNode({ kind: catalog.greaterThan.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(greaterThanNode).to(returnNode, 1);
  dflow.connect(argumentNode).to(numberNode);
  dflow.connect(numberNode).to(greaterThanNode, 0);
  dflow.connect(numNode).to(greaterThanNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const output = 5;
  const result = testNode.output(0).data as number;

  assertEquals(result, output);
});

Deno.test("arrayFilter", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayFilter.kind;

  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["array"], data: [1, 2, 3, 4, 5, 6, 7] }],
  });
  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const numberNode = dflow.newNode({ kind: catalog.number.kind });
  const greaterThanNode = dflow.newNode({ kind: catalog.greaterThan.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(greaterThanNode).to(returnNode, 1);
  dflow.connect(argumentNode).to(numberNode);
  dflow.connect(numberNode).to(greaterThanNode, 0);
  dflow.connect(numNode).to(greaterThanNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const output = [4, 5, 6, 7];
  const result = testNode.output(0).data as DflowArray;

  assertArrayIncludes(result, output);
  assertEquals(result.length, output.length);
});

Deno.test("arrayIncludes", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayIncludes.kind;

  [
    { inputs: { array: undefined, element: undefined }, output: undefined },
    { inputs: { array: ["a", "b"], element: "c" }, output: false },
    { inputs: { array: ["a", "b"], element: "a" }, output: true },
  ].forEach(
    ({ inputs: { array, element }, output }) => {
      testOneArrAndOneStrInOneBoolOut(dflow, nodeKind, array, element, output);
    },
  );
});

Deno.test("arrayJoin", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayJoin.kind;

  [
    { inputs: { array: undefined, separator: undefined }, output: undefined },
    { inputs: { array: ["a", "b"], separator: "/" }, output: "a/b" },
    { inputs: { array: ["a", "b"], separator: "-" }, output: "a-b" },
    { inputs: { array: ["a", "b"], separator: undefined }, output: "a,b" },
  ].forEach(
    ({ inputs: { array, separator }, output }) => {
      testOneArrAndOneStrInOneStrOut(dflow, nodeKind, array, separator, output);
    },
  );
});

Deno.test("arrayLength", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayLength.kind;

  [
    { input: undefined, output: undefined },
    { input: ["a"], output: 1 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("arrayMap", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayMap.kind;

  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["array"], data: [1, 2, 3, 4] }],
  });
  const numNode = dflow.newNode({
    kind: catalog.data.kind,
    outputs: [{ id: "out", types: ["number"], data: 1 }],
  });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const numberNode = dflow.newNode({ kind: catalog.number.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  numNode.output(0).data = 1;
  dataNode.output(0).data = [1, 2, 3, 4];

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(argumentNode).to(numberNode);
  dflow.connect(numberNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const output = [2, 3, 4, 5];
  const result = testNode.output(0).data as DflowArray;

  assertArrayIncludes(result, output);
  assertEquals(result.length, output.length);
});

Deno.test("arrayPop", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayPop.kind;

  [
    { input: undefined, output1: undefined, output2: undefined },
    { input: [1, 2, 3], output1: 3, output2: [1, 2] },
  ].forEach(({ input, output1, output2 }) => {
    testOneArrInOneAnyAndOneArrOut(dflow, nodeKind, input, output1, output2);
  });
});

Deno.test("arrayPush", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayPush.kind;

  [
    { input1: undefined, input2: undefined, output: undefined },
    { input1: undefined, input2: "foo", output: undefined },
    { input1: [], input2: undefined, output: [] },
    { input1: [], input2: "x", output: ["x"] },
    { input1: [1, 2], input2: 3, output: [1, 2, 3] },
    { input1: [1, "a"], input2: true, output: [1, "a", true] },
  ].forEach(({ input1, input2, output }) => {
    testOneArrAndOneAnyInOneArrOut(dflow, nodeKind, input1, input2, output);
  });
});

Deno.test("arrayReverse", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayReverse.kind;

  [
    { input: undefined, output: undefined },
    { input: [1, 2, 3], output: [3, 2, 1] },
  ].forEach(({ input, output }) => {
    testOneArrInOneArrOut(dflow, nodeKind, input, output);
  });
});

Deno.test("arrayShift", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayShift.kind;

  [
    { input: undefined, output1: undefined, output2: undefined },
    { input: [1, 2, 3], output1: 1, output2: [2, 3] },
  ].forEach(({ input, output1, output2 }) => {
    testOneArrInOneAnyAndOneArrOut(dflow, nodeKind, input, output1, output2);
  });
});

Deno.test("arraySlice", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arraySlice.kind;

  [
    {
      input1: undefined,
      input2: undefined,
      input3: undefined,
      output: undefined,
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: undefined,
      output: ["camel", "duck", "elephant"],
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: 4,
      output: ["camel", "duck"],
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 1,
      input3: 5,
      output: ["bison", "camel", "duck", "elephant"],
    },
    {
      input1: ["ant", "bison", "camel", "duck", "elephant"],
      input2: 2,
      input3: -1,
      output: ["camel", "duck"],
    },
  ].forEach(({ input1, input2, input3, output }) => {
    testOneArrAndTwoNumInOneArrOut(
      dflow,
      nodeKind,
      input1,
      input2,
      input3,
      output,
    );
  });
});
