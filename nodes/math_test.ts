import { testOneNumInOneNumOut, testOneNumOut } from "./_test-utils.ts";
import { catalog } from "./math.ts";

Deno.test("Math.cos()", () => {
  const nodeKind = catalog.cos.kind;
  testOneNumInOneNumOut(nodeKind, 1, Math.cos(1));
});

Deno.test("Math.cosh()", () => {
  const nodeKind = catalog.cosh.kind;
  testOneNumInOneNumOut(nodeKind, 1, Math.cosh(1));
});

Deno.test("Math.PI", () => {
  const nodeKind = catalog.PI.kind;
  testOneNumOut(nodeKind, Math.PI);
});

Deno.test("Math.sin()", () => {
  testOneNumInOneNumOut(catalog.sin.kind, 1, Math.sin(1));
});

Deno.test("Math.sinh()", () => {
  testOneNumInOneNumOut(catalog.sinh.kind, 1, Math.sinh(1));
});
