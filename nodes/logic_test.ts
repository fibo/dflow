import {
  newDflowHost,
  testOneBoolInOneBoolOut,
  testTwoAnyInOneAnyOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";

Deno.test("DflowNodeAnd", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.and.kind;

  [
    { inputs: [true, true], output: true && true },
    { inputs: [true, false], output: true && false },
    { inputs: [false, false], output: false && false },
    { inputs: [false, true], output: false && true },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoBoolInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("DflowNodeNot", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.not.kind;

  [
    { input: true, output: false },
    { input: false, output: true },
  ].forEach(({ input, output }) => {
    testOneBoolInOneBoolOut(dflow, nodeKind, input, output);
  });
});

Deno.test("DflowNodeNullishCoaleshing", () => {
  const dflow = newDflowHost();
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
      testTwoAnyInOneAnyOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("DflowNodeOr", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.or.kind;

  [
    { inputs: [true, true], output: true || true },
    { inputs: [true, false], output: true || false },
    { inputs: [false, false], output: false || false },
    { inputs: [false, true], output: false || true },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoBoolInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});
