import { testOneArrInOneNumOut } from "./_test-utils.ts";
import { catalog } from "./array.ts";

Deno.test(catalog.arrayLength.kind, () => {
  const nodeKind = catalog.arrayLength.kind;
  [["a"]].forEach((input) => {
    testOneArrInOneNumOut(nodeKind, input, input.length);
  });
});
