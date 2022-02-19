import {
  testOneBoolInOneBoolOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.and.kind, () => {
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
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});

Deno.test(catalog.not.kind, () => {
  const nodeKind = catalog.not.kind;
  [true, false].forEach((input) => {
    testOneBoolInOneBoolOut(nodeKind, input, !input);
  });
});

Deno.test(catalog.or.kind, () => {
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
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, output);
    },
  );
});
