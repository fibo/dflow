import { assertArrayIncludes, assertEquals } from "std/testing/asserts.ts";

import { DflowArray, DflowHost } from "../engine.ts";
import {
  testOneArrAndOneStrInOneBoolOut,
  testOneArrAndOneStrInOneStrOut,
  testOneArrInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.arrayFilter.kind, () => {
  const nodeKind = catalog.arrayFilter.kind;

  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  const numNode = dflow.newNode({ kind: catalog.mathPI.kind });
  const typeNumNode = dflow.newNode({ kind: catalog.typeNumber.kind });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const greaterThanNode = dflow.newNode({ kind: catalog.greaterThan.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  dataNode.output(0).data = [1, 2, 3, 4, 5, 6, 7];

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(greaterThanNode).to(returnNode, 1);
  dflow.connect(typeNumNode).to(argumentNode);
  dflow.connect(argumentNode).to(greaterThanNode, 0);
  dflow.connect(numNode).to(greaterThanNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const expected = [4, 5, 6, 7];
  const result = testNode.output(0).data as DflowArray;

  assertArrayIncludes(result, expected);
  assertEquals(result.length, expected.length);
});

Deno.test(catalog.arrayIncludes.kind, () => {
  const nodeKind = catalog.arrayIncludes.kind;
  [
    { inputs: { array: undefined, element: undefined }, expected: undefined },
    { inputs: { array: ["a", "b"], element: "c" }, expected: false },
    { inputs: { array: ["a", "b"], element: "a" }, expected: true },
  ].forEach(
    ({ inputs: { array, element }, expected }) => {
      testOneArrAndOneStrInOneBoolOut(nodeKind, array, element, expected);
    },
  );
});

Deno.test(catalog.arrayJoin.kind, () => {
  const nodeKind = catalog.arrayJoin.kind;
  [
    { inputs: { array: undefined, separator: undefined }, expected: undefined },
    { inputs: { array: ["a", "b"], separator: "/" }, expected: "a/b" },
    { inputs: { array: ["a", "b"], separator: "-" }, expected: "a-b" },
    { inputs: { array: ["a", "b"], separator: undefined }, expected: "a,b" },
  ].forEach(
    ({ inputs: { array, separator }, expected }) => {
      testOneArrAndOneStrInOneStrOut(nodeKind, array, separator, expected);
    },
  );
});

Deno.test(catalog.arrayLength.kind, () => {
  const nodeKind = catalog.arrayLength.kind;
  [
    { input: undefined, expected: undefined },
    { input: ["a"], expected: 1 },
  ].forEach(({ input, expected }) => {
    testOneArrInOneNumOut(nodeKind, input, expected);
  });
});

Deno.test(catalog.arrayMap.kind, () => {
  const nodeKind = catalog.arrayMap.kind;

  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  const dataNode = dflow.newNode({ kind: catalog.array.kind });
  const numNode = dflow.newNode({ kind: catalog.number.kind });
  const typeNumNode = dflow.newNode({ kind: catalog.typeNumber.kind });
  const argumentNode = dflow.newNode({ kind: catalog.argument.kind });
  const additionNode = dflow.newNode({ kind: catalog.addition.kind });
  const returnNode = dflow.newNode({ kind: catalog.return.kind });
  const functionNode = dflow.newNode({ kind: catalog.function.kind });

  numNode.output(0).data = 1;
  dataNode.output(0).data = [1, 2, 3, 4];

  dflow.connect(functionNode).to(returnNode);
  dflow.connect(additionNode).to(returnNode, 1);
  dflow.connect(typeNumNode).to(argumentNode);
  dflow.connect(argumentNode).to(additionNode, 0);
  dflow.connect(numNode).to(additionNode, 1);
  dflow.connect(dataNode).to(testNode);
  dflow.connect(functionNode).to(testNode, 1);

  dflow.run();

  const expected = [2, 3, 4, 5];
  const result = testNode.output(0).data as DflowArray;

  assertArrayIncludes(result, expected);
  assertEquals(result.length, expected.length);
});
