import {
  testOneNumInOneNumOut,
  testOneNumOut,
  testTwoNumInOneNumOut,
} from "./_test-utils.ts";
import { catalog } from "./math.ts";

Deno.test(catalog.mathPI.kind, () => {
  const nodeKind = catalog.mathPI.kind;
  testOneNumOut(nodeKind, Math.PI);
});

Deno.test(catalog.mathCos.kind, () => {
  const nodeKind = catalog.mathCos.kind;
  [1].forEach((input) => {
    testOneNumInOneNumOut(nodeKind, input, Math.cos(input));
  });
});

Deno.test(catalog.mathCosh.kind, () => {
  const nodeKind = catalog.mathCosh.kind;
  [1].forEach((input) => {
    testOneNumInOneNumOut(nodeKind, input, Math.cosh(input));
  });
});

Deno.test(catalog.mathSin.kind, () => {
  const nodeKind = catalog.mathSin.kind;
  [1].forEach((input) => {
    testOneNumInOneNumOut(nodeKind, input, Math.sin(input));
  });
});

Deno.test(catalog.mathSinh.kind, () => {
  const nodeKind = catalog.mathSinh.kind;
  [1].forEach((input) => {
    testOneNumInOneNumOut(nodeKind, input, Math.sinh(input));
  });
});

Deno.test(catalog.mathSum.kind, () => {
  const nodeKind = catalog.mathSum.kind;
  [[2, 2]].forEach(([input1, input2]) => {
    testTwoNumInOneNumOut(nodeKind, input1, input2, input1 + input2);
  });
});
