import { catalog as dataTypesCatalog } from "./data-types.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as numberCatalog } from "./number.ts";
import { catalog as objectCatalog } from "./object.ts";

export const catalog = {
  ...dataTypesCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
};
