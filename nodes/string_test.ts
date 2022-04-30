import {
  newDflowHost,
  testOneStrAndTwoNumInOneStrOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";

Deno.test("stringLength", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.stringLength.kind;

  [
    { input: "foo", output: "foo".length },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("substring", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.substring.kind;

  [
    {
      input1: "hello",
      input2: 2,
      input3: undefined,
      output: "llo",
    },
    {
      input1: "hello",
      input2: 2,
      input3: 4,
      output: "ll",
    },
  ].forEach(({ input1, input2, input3, output }) => {
    testOneStrAndTwoNumInOneStrOut(
      dflow,
      nodeKind,
      input1,
      input2,
      input3,
      output,
    );
  });
});
