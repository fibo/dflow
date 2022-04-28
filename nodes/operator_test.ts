import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "./index.ts";
import {
  testOneNumAndOneMultiNumInOneNumOut,
  testTwoAnyInOneBoolOut,
  testTwoNumInOneBoolOut,
  testTwoNumInOneNumOut,
} from "./_test-utils.ts";

Deno.test("addition", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.addition.kind;

  [
    { inputs: [undefined, undefined], output: undefined },
    { inputs: [2, 2], output: 4 },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(dflow, nodeKind, input1, input2, output);
    },
  );

  [
    { input1: undefined, input2: undefined, output: undefined },
    { input1: 2, input2: [1], output: 3 },
    { input1: 2, input2: [1, 2], output: 5 },
    { input1: 2, input2: [1, 2, 3], output: 8 },
  ].forEach(
    ({ input1, input2, output }) => {
      testOneNumAndOneMultiNumInOneNumOut(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("division", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.division.kind;

  [
    { inputs: [2, 2], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: undefined },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("equality", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.equality.kind;

  [
    {
      inputs: [1, 2],
      output: false,
    },
    {
      inputs: [1, 1],
      output: true,
    },
    {
      inputs: [1, "1"],
      output: true,
    },
    {
      inputs: ["a", "b"],
      output: false,
    },
    {
      inputs: ["x", "x"],
      output: true,
    },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoAnyInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("greaterThan", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThan.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("greaterThanOrEqual", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThanOrEqual.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("lessThan", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThan.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("lessThanOrEqual", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThanOrEqual.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("inequality", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.inequality.kind;

  [
    {
      inputs: [1, 2],
      output: true,
    },
    {
      inputs: [1, 1],
      output: false,
    },
    {
      inputs: [1, "1"],
      output: false,
    },
    {
      inputs: ["a", "b"],
      output: true,
    },
    {
      inputs: ["x", "x"],
      output: false,
    },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoAnyInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("multiplication", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.multiplication.kind;

  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("subtraction", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.subtraction.kind;

  [{ inputs: [2, 2], output: 0 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoNumInOneNumOut(dflow, nodeKind, input1, input2, output);
    },
  );
});
