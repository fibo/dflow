import { catalog as arrayCatalog } from "./array.ts";
import { catalog as conditionalCatalog } from "./conditional.ts";
import { catalog as consoleCatalog } from "./console.ts";
import { catalog as dateCatalog } from "./date.ts";
import { catalog as dataTypesCatalog } from "./data-types.ts";
import { catalog as dflowCatalog } from "./dflow.ts";
import { catalog as logicCatalog } from "./logic.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as numberCatalog } from "./number.ts";
import { catalog as objectCatalog } from "./object.ts";
import { catalog as operatorCatalog } from "./operator.ts";
import { catalog as stringatalog } from "./string.ts";

export const catalog = {
  ...arrayCatalog,
  ...conditionalCatalog,
  ...consoleCatalog,
  ...dataTypesCatalog,
  ...dateCatalog,
  ...dflowCatalog,
  ...logicCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
  ...operatorCatalog,
  ...stringatalog,
};
