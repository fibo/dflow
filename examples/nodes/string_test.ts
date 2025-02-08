import { test } from "node:test";
import { newDflow, testOneInOneOut, testThreeInOneOut } from "./_test-utils.ts";

test("stringLength", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.stringLength.kind;

  [{ input: "foo", output: "foo".length }].forEach(({ input, output }) => {
    testOneInOneOut<string, number>(dflow, nodeKind, input, output);
  });
});

test("substring", () => {
  const dflow = newDflow();
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
    testThreeInOneOut<string, number, number, string>(
      dflow,
      nodeKind,
      input1,
      input2,
      input3,
      output,
    );
  });
});
