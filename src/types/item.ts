import { ItemI18NJson } from "./itemI18NJson";

export interface Item {
  id: string;
  slug: string;
  gameRef: string;
  tags: string[];
  setRoot: boolean;
  setParts: string[];
  quantityInSet: number;
  rarity: string;
  bulkTradeable: boolean;
  subtypes: string[];
  maxRank: number;
  maxCharges: number;
  maxAmberStars: number;
  maxCyanStars: number;
  baseEndo: number;
  endoMultiplier: number;
  ducats: number;
  vosfor: number;
  reqMasteryRank: number;
  vaulted: boolean;
  tradingTax: number;
  i18n: Record<string, ItemI18NJson>;
  tradeable: boolean;
}
