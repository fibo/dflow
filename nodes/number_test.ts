import { testOneNumInOneBoolOut, testOneNumInOneNumOut } from "./_test-utils.ts";
import { catalog } from "./number.ts";

Deno.test(catalog.isFinite.kind, () => {
  const nodeKind = catalog.isFinite.kind;
  testOneNumInOneBoolOut(nodeKind, 1, Number.isFinite(1));
  testOneNumInOneBoolOut(nodeKind, Infinity, Number.isFinite(Infinity));
});

Deno.test(catalog.isInteger.kind, () => {
  const nodeKind = catalog.isInteger.kind;
  testOneNumInOneBoolOut(nodeKind, 1, Number.isInteger(1));
  testOneNumInOneBoolOut(nodeKind, 1.5, Number.isInteger(1.5));
});

Deno.test(catalog.isNaN.kind, () => {
  const nodeKind = catalog.isNaN.kind;
  testOneNumInOneBoolOut(nodeKind, 1, Number.isNaN(1));
});

Deno.test(catalog.parseFloat.kind, () => {
  const nodeKind = catalog.parseFloat.kind;
  testOneNumInOneNumOut(nodeKind, 1.5, Number.parseFloat('1.5'));
});

Deno.test(catalog.parseInt.kind, () => {
  const nodeKind = catalog.parseInt.kind;
  testOneNumInOneNumOut(nodeKind, 1, Number.parseInt('1'));
});
