import { Role } from "./role";
import { Tier } from "./tier";
import { Status } from "./status";
import { Activity } from "./activity";
import { Platform } from "./platform";
import { Language } from "./language";

export interface User {
  id: string;
  role: Role;
  tier: Tier;
  ingameName: string;
  slug: string;
  avatar: string;
  background: string;
  about: string;
  reputation: number;
  masteryRank: number;
  status: Status;
  activity: Activity | null;
  lastSeen: string;
  platform: Platform;
  crossplay: boolean;
  locale: Language;
  banned: boolean;
  banUntil: string;
  banMessage: string;
  createdAt: string;
  warned: boolean;
  warnMessage: string;
  warnedBy: string;
  warnedAt: string;
  bannedBy: string;
  bannedAt: string;
  nameHistory: NameHistory[];
  uid: string;
}
