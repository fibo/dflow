import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow, testTwoInOneOut } from "./_test-utils.ts";

test("addition", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.addition.kind;

  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("division", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.division.kind;

  [
    { inputs: [2, 2], output: 1 },
    { inputs: [0, 1], output: 0 },
    { inputs: [1, 0], output: undefined }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<number, number, number>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("equality", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.equality.kind;

  [
    {
      inputs: [1, 2],
      output: false
    },
    {
      inputs: [1, 1],
      output: true
    },
    {
      inputs: [1, "1"],
      output: true
    },
    {
      inputs: ["a", "b"],
      output: false
    },
    {
      inputs: ["x", "x"],
      output: true
    }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<DflowData, DflowData, boolean>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("greaterThan", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThan.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("greaterThanOrEqual", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.greaterThanOrEqual.kind;

  [{ inputs: [1, 2], output: false }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("lessThan", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThan.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("lessThanOrEqual", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.lessThanOrEqual.kind;

  [{ inputs: [1, 2], output: true }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, boolean>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("inequality", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.inequality.kind;

  [
    {
      inputs: [1, 2],
      output: true
    },
    {
      inputs: [1, 1],
      output: false
    },
    {
      inputs: [1, "1"],
      output: false
    },
    {
      inputs: ["a", "b"],
      output: true
    },
    {
      inputs: ["x", "x"],
      output: false
    }
  ].forEach(({ inputs: [input1, input2], output }) => {
    testTwoInOneOut<DflowData, DflowData, boolean>(
      dflow,
      nodeKind,
      input1,
      input2,
      output
    );
  });
});

test("multiplication", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.multiplication.kind;

  [{ inputs: [2, 2], output: 4 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});

test("subtraction", () => {
  const dflow = newDflow();
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.subtraction.kind;

  [{ inputs: [2, 2], output: 0 }].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoInOneOut<number, number, number>(
        dflow,
        nodeKind,
        input1,
        input2,
        output
      );
    }
  );
});
