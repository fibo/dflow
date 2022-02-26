import {
  testOneArrInOneNumOut,
  testOneNumInOneNumOut,
  testOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.mathCos.kind, () => {
  const nodeKind = catalog.mathCos.kind;
  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.cos(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.mathCosh.kind, () => {
  const nodeKind = catalog.mathCosh.kind;
  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.cosh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.mathMax.kind, () => {
  const nodeKind = catalog.mathMax.kind;
  [
    { input: undefined, output: undefined },
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 3 },
    { input: [1, 2, "3"], output: 3 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.mathMin.kind, () => {
  const nodeKind = catalog.mathMin.kind;
  [
    { input: undefined, output: undefined },
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 1 },
    { input: ["1", 2, 3], output: 1 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.mathPI.kind, () => {
  const nodeKind = catalog.mathPI.kind;
  testOneNumOut(nodeKind, Math.PI);
});

Deno.test(catalog.mathSin.kind, () => {
  const nodeKind = catalog.mathSin.kind;
  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.sin(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.mathSinh.kind, () => {
  const nodeKind = catalog.mathSinh.kind;
  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.sinh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(nodeKind, input, output);
  });
});
