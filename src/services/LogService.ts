import GLib from "gi://GLib";
import Gio from "gi://Gio";

export interface LogDetectionResult {
  found: boolean;
  path: string | null;
}

class LogService {
  private readonly candidatePaths: string[];

  constructor() {
    const home = GLib.get_home_dir();

    this.candidatePaths = [
      // Steam + Proton (ruta más común, appid de Warframe = 230410)
      `${home}/.local/share/Steam/steamapps/compatdata/230410/pfx/drive_c/users/steamuser/AppData/Local/Warframe/EE.log`,
      // Steam instalado en otra unidad/carpeta custom
      `${home}/.steam/steam/steamapps/compatdata/230410/pfx/drive_c/users/steamuser/AppData/Local/Warframe/EE.log`,
      // Lutris (wine prefix default)
      `${home}/Games/warframe/drive_c/users/${GLib.get_user_name()}/AppData/Local/Warframe/EE.log`,
      // Wine standalone (prefix default ~/.wine)
      `${home}/.wine/drive_c/users/${GLib.get_user_name()}/AppData/Local/Warframe/EE.log`,
    ];
  }

  /** Revisa las rutas candidatas y regresa la primera que exista */
  detect(): LogDetectionResult {
    for (const path of this.candidatePaths) {
      const file = Gio.File.new_for_path(path);
      if (file.query_exists(null)) {
        return { found: true, path };
      }
    }
    return { found: false, path: null };
  }

  getCandidatePaths(): string[] {
    return this.candidatePaths;
  }
}

export const logService = new LogService();
