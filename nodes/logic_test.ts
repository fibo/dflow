import {
  testOneBoolInOneBoolOut,
  testTwoBoolInOneBoolOut,
} from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.and.kind, () => {
  const nodeKind = catalog.and.kind;
  [
    { inputs: [true, true], expected: true && true },
    { inputs: [true, false], expected: true && false },
    { inputs: [false, false], expected: false && false },
    { inputs: [false, true], expected: false && true },
    { inputs: [undefined, true], expected: undefined },
    { inputs: [undefined, false], expected: undefined },
    { inputs: [true, undefined], expected: undefined },
    { inputs: [false, undefined], expected: undefined },
  ].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, expected);
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
    { inputs: [true, true], expected: true || true },
    { inputs: [true, false], expected: true || false },
    { inputs: [false, false], expected: false || false },
    { inputs: [false, true], expected: false || true },
    { inputs: [undefined, true], expected: undefined },
    { inputs: [undefined, false], expected: undefined },
    { inputs: [true, undefined], expected: undefined },
    { inputs: [false, undefined], expected: undefined },
  ].forEach(
    ({ inputs: [input1, input2], expected }) => {
      testTwoBoolInOneBoolOut(nodeKind, input1, input2, expected);
    },
  );
});
