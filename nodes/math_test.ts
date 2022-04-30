import {
  newDflowHost,
  testOneArrInOneNumOut,
  testOneNumInOneNumOut,
  testOneNumOut,
} from "./_test-utils.ts";

Deno.test("mathAbs", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathAbs.kind;

  [
    { input: -1, output: 1 },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathCos", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCos.kind;

  [
    { input: 1, output: Math.cos(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathCosh", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCosh.kind;

  [
    { input: 1, output: Math.cosh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathFloor", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathFloor.kind;

  [
    { input: 1.2, output: Math.floor(1.2) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathMax", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMax.kind;

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 3 },
    { input: [1, 2, "3"], output: 3 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathMin", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMin.kind;

  [
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 1 },
    { input: ["1", 2, 3], output: 1 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathPI", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathPI.kind;

  testOneNumOut(dflow, nodeKind, Math.PI);
});

Deno.test("mathRound", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathRound.kind;

  [
    { input: 1.2, output: Math.floor(1.2) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathSin", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSin.kind;

  [
    { input: 1, output: Math.sin(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathSinh", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSinh.kind;

  [
    { input: 1, output: Math.sinh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});
