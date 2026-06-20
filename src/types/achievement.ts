import { AchievementState } from "./achievementState";

export interface Achievement {
  id: string;
  slug: string;
  type: string;
  secret: boolean;
  reputationBonus: number;
  goal: number;
  i18n: object;
  state: AchievementState | null;
}
