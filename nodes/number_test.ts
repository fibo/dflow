import { testOneNumInOneBoolOut } from "./_test-utils.ts";
import { catalog } from "./number.ts";

Deno.test(catalog.isFinite.kind, () => {
  const nodeKind = catalog.isFinite.kind;
  testOneNumInOneBoolOut(nodeKind, 1, Number.isFinite(1));
  testOneNumInOneBoolOut(nodeKind, Infinity, Number.isFinite(Infinity));
});

Deno.test(catalog.isNaN.kind, () => {
  const nodeKind = catalog.isNaN.kind;
  testOneNumInOneBoolOut(nodeKind, 1, Number.isNaN(1));
});
