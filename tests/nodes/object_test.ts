import { test } from "node:test";
import { newDflow, testOneInOneOut } from "./utils.ts";

test("objectKeys", () => {
  const dflow = newDflow();
  const nodeKind = "objectKeys";
  [{ foo: true }].forEach((input) => {
    testOneInOneOut(dflow, nodeKind, input, Object.keys(input));
  });
});

test("objectValues", () => {
  const dflow = newDflow();
  const nodeKind = "objectValues";
  [{ foo: true }].forEach((input) => {
    testOneInOneOut(dflow, nodeKind, input, Object.values(input));
  });
});
