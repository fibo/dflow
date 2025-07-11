import { test } from "node:test";
import type { DflowData } from "../../dflow.ts";
import { newDflow, testTwoInOneOut } from "./_test-utils.ts";

test("addition", () => {
  const dflow = newDflow();
  const nodeKind = "addition";

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
  const nodeKind = "division";

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
  const nodeKind = "equality";

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
  const nodeKind = "greaterThan";

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
  const nodeKind = "greaterThanOrEqual";

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
  const nodeKind = "lessThan";

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
  const nodeKind = "lessThanOrEqual";

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
  const nodeKind = "inequality";

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
  const nodeKind = "multiplication";

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
  const nodeKind = "subtraction";

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
