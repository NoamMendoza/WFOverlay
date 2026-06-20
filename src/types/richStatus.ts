import { Activity } from "./activity";

export interface RichStatus {
  status: string;
  statusUntil: string;
  statusSetAt: string;
  activity: Activity | null;
}
