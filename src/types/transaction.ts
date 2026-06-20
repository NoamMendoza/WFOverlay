import { UserShort } from "./userShort";
import { TxItem } from "./txItem";

export interface Transaction {
  id: string;
  type: string;
  originId: string;
  platinum: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  item: TxItem;
  user: UserShort
}
