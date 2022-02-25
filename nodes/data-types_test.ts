import { assertEquals } from "std/testing/asserts.ts";

import { DflowHost } from "../dflow.ts";
import { testOneAnyInOneBoolOut } from "./_test-utils.ts";
import { catalog } from "./data-types.ts";

Deno.test(catalog.boolean.kind, () => {
  const nodeKind = catalog.boolean.kind;

  const bool = true;
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.output(0).data = bool;
  assertEquals(testNode.output(0).data, bool);
});

Deno.test(catalog.number.kind, () => {
  const nodeKind = catalog.number.kind;

  const num = Math.random();
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.output(0).data = num;
  assertEquals(testNode.output(0).data, num);
});

Deno.test(catalog.string.kind, () => {
  const nodeKind = catalog.string.kind;

  const str = "foo";
  const dflow = new DflowHost(catalog);
  const testNode = dflow.newNode({ kind: nodeKind });
  testNode.output(0).data = str;
  assertEquals(testNode.output(0).data, str);
});

Deno.test(catalog.isArray.kind, () => {
  const nodeKind = catalog.isArray.kind;
  [
    { input: undefined, output: false },
    { input: [], output: true },
    { input: [1, 2, 3], output: true },
    { input: true, output: false },
    { input: { foo: "bar" }, output: false },
  ].forEach((input) => {
    testOneAnyInOneBoolOut(nodeKind, input, Number.isInteger(input));
  });
});
