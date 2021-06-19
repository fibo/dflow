import {
  testOneAnyInOneBoolOut,
  testOneNumInOneBoolOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";
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
  [1, 'x', null].forEach((input) => {
  testOneAnyInOneBoolOut(nodeKind, input, Number.isNaN(input));
  })
});

Deno.test(catalog.parseFloat.kind, () => {
  const nodeKind = catalog.parseFloat.kind;
  testOneStrInOneNumOut(nodeKind, "1.5", Number.parseFloat("1.5"));
});

Deno.test(catalog.parseInt.kind, () => {
  const nodeKind = catalog.parseInt.kind;
  testOneStrInOneNumOut(nodeKind, "1", Number.parseInt("1"));
});
