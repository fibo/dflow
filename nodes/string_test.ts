import { testOneStrInOneNumOut } from "./_test-utils.ts";
import { catalog } from "./catalog.ts";

Deno.test(catalog.stringLength.kind, () => {
  const nodeKind = catalog.stringLength.kind;
  [
    { input: undefined, output: undefined },
    { input: "foo", output: "foo".length },
  ].forEach(({ input, output }) => {
    testOneStrInOneNumOut(nodeKind, input, output);
  });
});
