import { nodesCatalog } from "../nodes.ts";
import { DflowHost } from "../dflow.ts";
import { testOneAnyInOneBoolOut } from "./_test-utils.ts";

Deno.test("isDefined", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isDefined.kind;

  [
    { input: undefined, output: false },
    { input: true, output: true },
    { input: [], output: true },
    { input: [1, 2, 3], output: true },
    { input: { foo: "bar" }, output: true },
  ].forEach(({ input, output }) => {
    testOneAnyInOneBoolOut(dflow, nodeKind, input, output);
  });
});

Deno.test("isUndefined", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.isUndefined.kind;

  [
    { input: undefined, output: true },
    { input: false, output: false },
    { input: [], output: false },
    { input: [1, 2, 3], output: false },
    { input: { foo: "bar" }, output: false },
  ].forEach(({ input, output }) => {
    testOneAnyInOneBoolOut(dflow, nodeKind, input, output);
  });
});
