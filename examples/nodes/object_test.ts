import { test } from "node:test";
import type { DflowArray, DflowObject } from "../../dflow.ts";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

test("objectKeys", () => {
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

test("objectValues", () => {
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
