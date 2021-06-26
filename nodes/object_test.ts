import { testOneObjInOneArrOut } from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.objectKeys.kind, () => {
  const nodeKind = catalog.objectKeys.kind;
  [{ foo: true }].forEach((input) => {
    testOneObjInOneArrOut(nodeKind, input, Object.keys(input));
  });
});

Deno.test(catalog.objectValues.kind, () => {
  const nodeKind = catalog.objectValues.kind;
  [{ foo: true }].forEach((input) => {
    testOneObjInOneArrOut(nodeKind, input, Object.values(input));
  });
});
