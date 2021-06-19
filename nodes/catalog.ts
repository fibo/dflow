import { catalog as arrayCatalog } from "./array.ts";
import { catalog as dataTypesCatalog } from "./data-types.ts";
import { catalog as mathCatalog } from "./math.ts";
import { catalog as numberCatalog } from "./number.ts";
import { catalog as objectCatalog } from "./object.ts";
import { catalog as stringatalog } from "./string.ts";

export const catalog = {
  ...arrayCatalog,
  ...dataTypesCatalog,
  ...mathCatalog,
  ...numberCatalog,
  ...objectCatalog,
  ...stringatalog,
};
