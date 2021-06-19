import {
  testOneObjInOneArrOut,
} from "./_test-utils.ts";
import { catalog } from "./object.ts";

Deno.test(catalog.objectKeys.kind, () => {
  const nodeKind = catalog.objectKeys.kind;
  [{foo: true}].forEach((input) => {
    testOneObjInOneArrOut(nodeKind, input, Object.keys(input));
  });
});
