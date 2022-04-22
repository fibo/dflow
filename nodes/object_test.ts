import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";
import { testOneObjInOneArrOut } from "./_test-utils.ts";

Deno.test("objectKeys", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.objectKeys.kind;

  [{ foo: true }].forEach((input) => {
    testOneObjInOneArrOut(dflow, nodeKind, input, Object.keys(input));
  });
});

Deno.test("objectValues", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.objectValues.kind;

  [{ foo: true }].forEach((input) => {
    testOneObjInOneArrOut(dflow, nodeKind, input, Object.values(input));
  });
});
