import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./index.ts";
import {
  testOneStrAndTwoNumInOneStrOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";

Deno.test("stringLength", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.stringLength.kind;

  [
    { input: undefined, output: undefined },
    { input: "foo", output: "foo".length },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("substring", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.substring.kind;

  [
    {
      input1: undefined,
      input2: undefined,
      input3: undefined,
      output: undefined,
    },
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
