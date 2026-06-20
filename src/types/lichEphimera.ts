import { ItemI18NJson } from "./itemI18NJson";

export interface LichEphimera {
  id: string;
  slug: string;
  gameRef: string;
  animation: string;
  element: string;
  i18n: ItemI18NJson;
}
