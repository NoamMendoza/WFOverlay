import { ItemI18NJson } from "./itemI18NJson";

export interface RivenItem {
  id: string;
  slug: string;
  gameRef: string;
  group: string;
  rivenType: string;
  disposition: string;
  reqMasteryRank: string;
  i18n: ItemI18NJson;
}
