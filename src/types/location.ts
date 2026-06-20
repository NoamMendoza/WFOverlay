import { ItemI18NJson } from "./itemI18NJson";

export interface Location {
  id: string;
  slug: string;
  gameRef: string;
  faction: string;
  minLevel: string;
  maxLevel: string;
  i18n: ItemI18NJson;
}
