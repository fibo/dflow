import { DflowArray, DflowObject } from "dflow";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

Deno.test("objectKeys", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.objectKeys.kind;

  [{ foo: true }].forEach((input) => {
    testOneInOneOut<DflowObject, DflowArray>(
      dflow,
      nodeKind,
      input,
      Object.keys(input),
    );
  });
});

Deno.test("objectValues", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.objectValues.kind;

  [{ foo: true }].forEach((input) => {
    testOneInOneOut<DflowObject, DflowArray>(
      dflow,
      nodeKind,
      input,
      Object.values(input),
    );
  });
});
