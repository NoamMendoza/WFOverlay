import { ItemI18NJson } from "./itemI18NJson";

export interface LichWeapon {
  id: string;
  slug: string;
  gameRef: string;
  reqMasteryRank: number;
  i18n: ItemI18NJson;
}
