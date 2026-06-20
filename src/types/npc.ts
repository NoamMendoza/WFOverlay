import { ItemI18NJson } from "./itemI18NJson";

export interface Npc {
  id: string;
  slug: string;
  gameRef: string;
  i18n: ItemI18NJson;
}
