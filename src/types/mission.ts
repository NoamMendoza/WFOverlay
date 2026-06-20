import { ItemI18NJson } from "./itemI18NJson";

export interface Mission {
  id: string;
  slug: string;
  gameRef: string;
  i18n: ItemI18NJson;
}
