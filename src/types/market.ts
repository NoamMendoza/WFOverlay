export interface MarketResponseV2<T> {
  data: T; 
}
export interface MarketUser {
  ingame_name: string;
  status: "ingame" | "online" | "offline";
  reputation: number;
}
export interface MarketOrder {
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

export interface ItemOrdersPayload {
  orders: MarketOrder[];
}

export interface UserShort {
  id: string;
  ingameName: string;
  slug: string;
  reputation: number;
  platform: string;
  crossplay: boolean;
  locale: string;
  status: string;
  avatar: string;
  activity: any | null;
  lastSeen: string;
}
