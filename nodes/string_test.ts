import { testOneStrInOneNumOut } from "./_test-utils.ts";
import { catalog } from "./string.ts";

Deno.test(catalog.stringLength.kind, () => {
  const nodeKind = catalog.stringLength.kind;
  ["foo"].forEach((input) => {
    testOneStrInOneNumOut(nodeKind, input, input.length);
  });
});
