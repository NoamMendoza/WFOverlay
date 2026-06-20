import { ItemI18NJson } from "./itemI18NJson";

export interface SisterWeapon {
  id: string;
  slug: string;
  gameRef: string;
  reqMasteryRank: number;
  i18m: ItemI18NJson;
}
