import {
  testOneAnyInOneBoolOut,
  testOneNumInOneBoolOut,
  testOneStrInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.isFinite.kind, () => {
  const nodeKind = catalog.isFinite.kind;
  [
    { input: 1, output: true },
    { input: undefined, output: undefined },
    { input: Infinity, output: false },
  ].forEach(
    ({ input, output }) => {
      testOneNumInOneBoolOut(nodeKind, input, output);
    },
  );
});

Deno.test(catalog.isInteger.kind, () => {
  const nodeKind = catalog.isInteger.kind;
  [
    { input: undefined, output: undefined },
    { input: 1, output: true },
    { input: 2 * 2, output: true },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: false },
  ].forEach((input) => {
    testOneAnyInOneBoolOut(nodeKind, input, Number.isInteger(input));
  });
});

Deno.test(catalog.isNaN.kind, () => {
  const nodeKind = catalog.isNaN.kind;
  [
    { input: undefined, output: false },
    { input: 1.5, output: false },
    { input: true, output: false },
    { input: "x", output: false },
    { input: NaN, output: true },
  ].forEach(({ input, output }) => {
    testOneAnyInOneBoolOut(nodeKind, input, output);
  });
});

Deno.test(catalog.parseFloat.kind, () => {
  const nodeKind = catalog.parseFloat.kind;
  [
    { input: undefined, output: undefined },
    { input: "1.5", output: 1.5 },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(nodeKind, input, output);
  });
});

Deno.test(catalog.parseInt.kind, () => {
  const nodeKind = catalog.parseInt.kind;
  [
    { input: undefined, output: undefined },
    { input: "1.2", output: 1 },
    { input: "1", output: 1 },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(nodeKind, input, output);
  });
});
