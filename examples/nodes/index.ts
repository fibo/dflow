import type { DflowNodesCatalog } from "../../dflow.js";
import { catalog as arrayCatalog } from "./array.js";
import { catalog as conditionalCatalog } from "./conditional.js";
import { catalog as consoleCatalog } from "./console.js";
import { catalog as dateCatalog } from "./date.js";
import { catalog as logicCatalog } from "./logic.js";
import { catalog as mathCatalog } from "./math.js";
import { catalog as numberCatalog } from "./number.js";
import { catalog as objectCatalog } from "./object.js";
import { catalog as operatorCatalog } from "./operator.js";
import { catalog as stringCatalog } from "./string.js";

export const nodesCatalog: DflowNodesCatalog = {
  ...arrayCatalog,
  ...conditionalCatalog,
  ...consoleCatalog,
  ...dateCatalog,
  ...logicCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
  ...operatorCatalog,
  ...stringCatalog,
};
