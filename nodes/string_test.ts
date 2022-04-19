import {
  testOneStrAndTwoNumInOneStrOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.stringLength.kind, () => {
  const nodeKind = catalog.stringLength.kind;
  [
    { input: undefined, output: undefined },
    { input: "foo", output: "foo".length },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.substring.kind, () => {
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
    testOneStrAndTwoNumInOneStrOut(nodeKind, input1, input2, input3, output);
  });
});
