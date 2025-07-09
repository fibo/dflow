import { catalog as arrayCatalog } from "./array.ts";
import { catalog as conditionalCatalog } from "./conditional.ts";
import { catalog as consoleCatalog } from "./console.ts";
import { catalog as dateCatalog } from "./date.ts";
import { catalog as logicCatalog } from "./logic.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as numberCatalog } from "./number.ts";
import { catalog as objectCatalog } from "./object.ts";
import { catalog as operatorCatalog } from "./operator.ts";
import { catalog as stringCatalog } from "./string.ts";

export const nodesCatalog = {
  ...arrayCatalog,
  ...conditionalCatalog,
  ...consoleCatalog,
  ...dateCatalog,
  ...logicCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
  ...operatorCatalog,
  ...stringCatalog
};
