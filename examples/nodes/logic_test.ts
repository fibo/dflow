import { test } from "node:test"
import { DflowData } from "../../dflow.js";
import { newDflow, testOneInOneOut, testTwoInOneOut } from "./_test-utils.js";

test("DflowNodeAnd", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.and.kind;

  [
    { inputs: [true, true], output: true && true },
    { inputs: [true, false], output: true && false },
    { inputs: [false, false], output: false && false },
    { inputs: [false, true], output: false && true },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<boolean, boolean, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

test("DflowNo", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.not.kind;

  [
    { input: true, output: false },
    { input: false, output: true },
  ].forEach(({ input, output }) => {
    testOneInOneOut<boolean, boolean>(dflow, nodeKind, input, output);
  });
});

test("DflowNodeNullishCoaleshing", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog["??"].kind;

  [
    { inputs: [undefined, undefined], output: undefined },
    { inputs: [undefined, true], output: true },
    { inputs: [undefined, false], output: false },
    { inputs: [42, undefined], output: 42 },
    { inputs: [undefined, 42], output: 42 },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<DflowData, DflowData, DflowData>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

test("DflowNodeOr", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.or.kind;

  [
    { inputs: [true, true], output: true || true },
    { inputs: [true, false], output: true || false },
    { inputs: [false, false], output: false || false },
    { inputs: [false, true], output: false || true },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<boolean, boolean, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});
