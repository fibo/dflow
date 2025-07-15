import { test } from "node:test";
import { newDflow, testOneInOneOut, testThreeInOneOut } from "./_test-utils.ts";

test("stringLength", () => {
  const dflow = newDflow();
  const nodeKind = "stringLength";
  for (const { input, output } of [{ input: "foo", output: "foo".length }])
    testOneInOneOut(dflow, nodeKind, input, output);
});

test("substring", () => {
  const dflow = newDflow();
  const nodeKind = "substring";
  for (const { input1, input2, input3, output } of [
    {
      input1: "hello",
      input2: 2,
      input3: undefined,
      output: "llo"
    },
    {
      input1: "hello",
      input2: 2,
      input3: 4,
      output: "ll"
    }
  ])
    testThreeInOneOut(dflow, nodeKind, input1, input2, input3, output);
});
