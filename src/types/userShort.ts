import { Activity } from "./activity";

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
  activity: Activity | null;
  lastSeen: string;
}
