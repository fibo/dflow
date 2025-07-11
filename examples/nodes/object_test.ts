import { test } from "node:test";
import type { DflowArray, DflowObject } from "../../dflow.ts";
import { newDflow, testOneInOneOut } from "./_test-utils.ts";

test("objectKeys", () => {
  const dflow = newDflow();
  const nodeKind = "objectKeys";

  [{ foo: true }].forEach((input) => {
    testOneInOneOut<DflowObject, DflowArray>(
      dflow,
      nodeKind,
      input,
      Object.keys(input)
    );
  });
});

test("objectValues", () => {
  const dflow = newDflow();
  const nodeKind = "objectValues";

  [{ foo: true }].forEach((input) => {
    testOneInOneOut<DflowObject, DflowArray>(
      dflow,
      nodeKind,
      input,
      Object.values(input)
    );
  });
});
