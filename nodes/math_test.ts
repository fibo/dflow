import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./index.ts";
import {
  testOneArrInOneNumOut,
  testOneNumInOneNumOut,
  testOneNumOut,
} from "./_test-utils.ts";

Deno.test("mathAbs", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathAbs.kind;

  [
    { input: undefined, output: undefined },
    { input: -1, output: 1 },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathCos", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCos.kind;

  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.cos(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathCosh", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathCosh.kind;

  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.cosh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathFloor", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathFloor.kind;

  [
    { input: undefined, output: undefined },
    { input: 1.2, output: Math.floor(1.2) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathMax", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMax.kind;

  [
    { input: undefined, output: undefined },
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 3 },
    { input: [1, 2, "3"], output: 3 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathMin", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathMin.kind;

  [
    { input: undefined, output: undefined },
    { input: [1, 2, undefined], output: undefined },
    { input: [1, 2, "x"], output: undefined },
    { input: [1, 2, 3], output: 1 },
    { input: ["1", 2, 3], output: 1 },
  ].forEach(({ input, output }) => {
    testOneArrInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathPI", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathPI.kind;

  testOneNumOut(dflow, nodeKind, Math.PI);
});

Deno.test("mathRound", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathRound.kind;

  [
    { input: undefined, output: undefined },
    { input: 1.2, output: Math.floor(1.2) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathSin", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSin.kind;

  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.sin(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});

Deno.test("mathSinh", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.mathSinh.kind;

  [
    { input: undefined, output: undefined },
    { input: 1, output: Math.sinh(1) },
  ].forEach(({ input, output }) => {
    testOneNumInOneNumOut(dflow, nodeKind, input, output);
  });
});
