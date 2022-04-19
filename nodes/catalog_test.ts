import { assertEquals } from "std/testing/asserts.ts";

import { catalog as arrayCatalog } from "./array.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as objectCatalog } from "./object.ts";
import { catalog as stringCatalog } from "./string.ts";

/**
Naming convention for nodes kind mimic JavaScript if it makes sense.

For example number catalog provides for example `isFinite` which is global,
no need to prefix it.  Math catalog provides for example `Math.cos()`
so its node will be of kind 'mathCos'.
*/

const exceptions = ["substring"];

Deno.test("catalog naming conventions", () => {
  [
    { catalog: arrayCatalog, prefix: "array" },
    { catalog: mathCatalog, prefix: "math" },
    { catalog: objectCatalog, prefix: "object" },
    { catalog: stringCatalog, prefix: "string" },
  ].forEach(({ catalog, prefix }) => {
    Object.keys(catalog).filter((nodeKind) => !exceptions.includes(nodeKind))
      .forEach((nodeKind) => {
        assertEquals(nodeKind.substring(0, prefix.length), prefix);
      });
  });
});
