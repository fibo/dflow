import { DflowData } from "../dflow.ts";
import { newDflowHost, testTwoInOneOut } from "./_test-utils.ts";

Deno.test("addition", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.addition.kind;

  [
    { inputs: [2, 2], output: 4 },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
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
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.division.kind;

  [
    { inputs: [2, 2], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: undefined },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("equality", () => {
  const dflow = newDflowHost();
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
      testTwoInOneOut<DflowData, DflowData, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("greaterThan", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThan.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("greaterThanOrEqual", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThanOrEqual.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("lessThan", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThan.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("lessThanOrEqual", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThanOrEqual.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("inequality", () => {
  const dflow = newDflowHost();
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
      testTwoInOneOut<DflowData, DflowData, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("multiplication", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.multiplication.kind;

  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});

Deno.test("subtraction", () => {
  const dflow = newDflowHost();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.subtraction.kind;

  [{ inputs: [2, 2], output: 0 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output,
      );
    },
  );
});
