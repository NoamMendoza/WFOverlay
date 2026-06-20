import { UserShort } from "./userShort";

export interface Order {
  id: string;
  type: "buy" | "sell";
  platinum: number;
  quantity: number;
  perTrade: number;
  subtype: string;
  rank: number;
  charges: number;
  amberStars: number;
  cyanStars: number;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
  itemId: string;
  groupId: string;
  user: UserShort
}
