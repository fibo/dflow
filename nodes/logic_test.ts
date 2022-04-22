import { DflowHost } from "../dflow.ts";
import { nodesCatalog } from "../nodes.ts";
import { nodesCatalog as catalog } from "../nodes.ts";
import {
  testOneBoolInOneBoolOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";

Deno.test("and", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.and.kind;

  [
    { inputs: [true, true], output: true && true },
    { inputs: [true, false], output: true && false },
    { inputs: [false, false], output: false && false },
    { inputs: [false, true], output: false && true },
    { inputs: [undefined, true], output: undefined },
    { inputs: [undefined, false], output: undefined },
    { inputs: [true, undefined], output: undefined },
    { inputs: [false, undefined], output: undefined },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoBoolInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});

Deno.test("not", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.not.kind;

  [true, false].forEach((input) => {
    testOneBoolInOneBoolOut(dflow, nodeKind, input, !input);
  });
});

Deno.test("or", () => {
  const dflow = new DflowHost(nodesCatalog);
  const catalog = dflow.nodesCatalog;
  const nodeKind = catalog.or.kind;

  [
    { inputs: [true, true], output: true || true },
    { inputs: [true, false], output: true || false },
    { inputs: [false, false], output: false || false },
    { inputs: [false, true], output: false || true },
    { inputs: [undefined, true], output: undefined },
    { inputs: [undefined, false], output: undefined },
    { inputs: [true, undefined], output: undefined },
    { inputs: [false, undefined], output: undefined },
  ].forEach(
    ({ inputs: [input1, input2], output }) => {
      testTwoBoolInOneBoolOut(dflow, nodeKind, input1, input2, output);
    },
  );
});
