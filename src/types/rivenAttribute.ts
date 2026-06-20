import { ItemI18NJson } from "./itemI18NJson";

export interface RivenAttribute {
  id: string;
  slug: string;
  gameRef: string;
  group: string;
  prefix: string;
  sufix: string;
  exclusiveTo: string[];
  positiveIsNegative: boolean;
  unit: string;
  positiveOnly: boolean;
  negativeOnly: boolean;
  i18n: ItemI18NJson;
}
