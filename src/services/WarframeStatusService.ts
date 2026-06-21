import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { createState } from "ags";

export interface WarframeProgress {
  parts: Record<string, boolean>; // nombre de pieza -> ¿la tengo?
  mastered: boolean;
  subsumed: boolean;
}

type StatusMap = Record<string, WarframeProgress>;

const EMPTY_PROGRESS: WarframeProgress = { parts: {}, mastered: false, subsumed: false };

const [statusStateGet, statusStateSet] = createState<StatusMap>({});

class WarframeStatusService {
  private readonly filePath: string;
  private readonly stateGet = statusStateGet;
  private readonly stateSet = statusStateSet;

  get statusMap() {
    return this.stateGet;
  }

  constructor() {
    const dataDir = GLib.get_user_data_dir();
    const appDir = `${dataDir}/wfoverlay`;
    GLib.mkdir_with_parents(appDir, 0o755);
    this.filePath = `${appDir}/warframe-status.json`;
    this.load();
  }

  private load() {
    const file = Gio.File.new_for_path(this.filePath);
    if (!file.query_exists(null)) {
      this.stateSet({});
      return;
    }
    try {
      const [, contents] = file.load_contents(null);
      const text = new TextDecoder().decode(contents);
      const parsed = JSON.parse(text) as StatusMap;
      this.stateSet(parsed);
    } catch (error) {
      console.error("[WarframeStatus] Error leyendo estado local:", error);
      this.stateSet({});
    }
  }

  private persist() {
    const file = Gio.File.new_for_path(this.filePath);
    const json = JSON.stringify(this.stateGet.get(), null, 2);
    file.replace_contents(
      new TextEncoder().encode(json),
      null,
      false,
      Gio.FileCreateFlags.REPLACE_DESTINATION,
      null,
    );
  }

  getProgress(warframeName: string): WarframeProgress {
    return this.stateGet.get()[warframeName] ?? EMPTY_PROGRESS;
  }

  private updateProgress(warframeName: string, updater: (p: WarframeProgress) => WarframeProgress) {
    const current = { ...this.stateGet.get() };
    const existing = current[warframeName] ?? { parts: {}, mastered: false, subsumed: false };
    current[warframeName] = updater(existing);
    this.stateSet(current);
    this.persist();
  }

  togglePart(warframeName: string, partName: string) {
    this.updateProgress(warframeName, (p) => ({
      ...p,
      parts: { ...p.parts, [partName]: !p.parts[partName] },
    }));
  }

  toggleMastered(warframeName: string) {
    this.updateProgress(warframeName, (p) => ({ ...p, mastered: !p.mastered }));
  }

  toggleSubsumed(warframeName: string) {
    this.updateProgress(warframeName, (p) => ({ ...p, subsumed: !p.subsumed }));
  }
}

export const warframeStatusService = new WarframeStatusService();
