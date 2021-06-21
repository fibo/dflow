import {
  testOneAnyInOneBoolOut,
  testOneNumInOneBoolOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./number.ts";

Deno.test(catalog.isFinite.kind, () => {
  const nodeKind = catalog.isFinite.kind;
  [1, Infinity].forEach((input) => {
    testOneNumInOneBoolOut(nodeKind, input, Number.isFinite(input));
  });
});

Deno.test(catalog.isInteger.kind, () => {
  const nodeKind = catalog.isInteger.kind;
  [1, 1.5].forEach((input) => {
    testOneAnyInOneBoolOut(nodeKind, input, Number.isInteger(input));
  });
});

Deno.test(catalog.isNaN.kind, () => {
  const nodeKind = catalog.isNaN.kind;
  [1, "x", null].forEach((input) => {
    testOneAnyInOneBoolOut(nodeKind, input, Number.isNaN(input));
  });
});

Deno.test(catalog.parseFloat.kind, () => {
  const nodeKind = catalog.parseFloat.kind;
  ["1.5"].forEach((input) => {
    testOneStrInOneNumOut(nodeKind, input, Number.parseFloat(input));
  });
});

Deno.test(catalog.parseInt.kind, () => {
  const nodeKind = catalog.parseInt.kind;
  ["1", "1.5"].forEach((input) => {
    testOneStrInOneNumOut(nodeKind, input, Number.parseInt(input));
  });
});
