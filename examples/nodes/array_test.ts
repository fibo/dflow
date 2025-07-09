import { test } from "node:test";
import type { DflowArray, DflowData } from "../../dflow.ts";
import {
  newDflow,
  testOneInOneOut,
  testOneInTwoOut,
  testThreeInOneOut,
  testTwoInOneOut
} from "./_test-utils.ts";

test("arrayAt", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayAt.kind;

  [
    { input1: ["a"], input2: 0, output: "a" },
    { input1: ["a"], input2: 1, output: undefined },
    { input1: ["a", true], input2: 1, output: true },
    { input1: ["a", true, 42], input2: -1, output: 42 }
  ].forEach(({ input1, input2, output }) => {
    testTwoInOneOut<DflowArray, number, DflowData>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("arrayIncludes", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayIncludes.kind;

  [
    { inputs: { array: ["a", "b"], element: "c" }, output: false },
    { inputs: { array: ["a", "b"], element: "a" }, output: true }
  ].forEach(({ inputs: { array, element }, output }) => {
    testTwoInOneOut<DflowArray, string, boolean>(
      dflow,
      nodeKind,
      array,
      element,
      output
    );
  });
});

test("arrayJoin", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayJoin.kind;

  [
    { inputs: { array: ["a", "b"], separator: "/" }, output: "a/b" },
    { inputs: { array: ["a", "b"], separator: "-" }, output: "a-b" },
    { inputs: { array: ["a", "b"], separator: undefined }, output: "a,b" }
  ].forEach(({ inputs: { array, separator }, output }) => {
    testTwoInOneOut<DflowArray, string, string>(
      dflow,
      nodeKind,
      array,
      separator,
      output
    );
  });
});

test("arrayLength", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayLength.kind;

  [{ input: ["a"], output: 1 }].forEach(({ input, output }) => {
    testOneInOneOut<DflowArray, number>(dflow, nodeKind, input, output);
  });
});

test("arrayPop", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayPop.kind;

  [{ input: [1, 2, 3], output1: 3, output2: [1, 2] }].forEach(
    ({ input, output1, output2 }) => {
      testOneInTwoOut<DflowArray, DflowData, DflowArray>(
        dflow,
        nodeKind,
        input,
        output1,
        output2
      );
    }
  );
});

test("arrayPush", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayPush.kind;

  [
    { input1: [], input2: undefined, output: [] },
    { input1: [], input2: "x", output: ["x"] },
    { input1: [1, 2], input2: 3, output: [1, 2, 3] },
    { input1: [1, "a"], input2: true, output: [1, "a", true] }
  ].forEach(({ input1, input2, output }) => {
    testTwoInOneOut<DflowArray, DflowData, DflowArray>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("arrayReverse", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayReverse.kind;

  [{ input: [1, 2, 3], output: [3, 2, 1] }].forEach(({ input, output }) => {
    testOneInOneOut<DflowArray, DflowArray>(dflow, nodeKind, input, output);
  });
});

test("arrayShift", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arrayShift.kind;

  [{ input: [1, 2, 3], output1: 1, output2: [2, 3] }].forEach(
    ({ input, output1, output2 }) => {
      testOneInTwoOut<DflowArray, DflowData, DflowArray>(
        dflow,
        nodeKind,
        input,
        output1,
        output2
      );
    }
  );
});

test("arraySlice", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.arraySlice.kind;

  [
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
  ].forEach(({ input1, input2, input3, output }) => {
    testThreeInOneOut<DflowArray, number, number, DflowArray>(
      dflow,
      nodeKind,
      input1,
      input2,
      input3,
      output
    );
  });
});
