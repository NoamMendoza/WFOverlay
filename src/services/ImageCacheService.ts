import GLib from "gi://GLib";
import Gio from "gi://Gio";
import { execAsync } from "ags/process";

class ImageCacheService {
  private readonly cacheDir: string;
  private readonly inFlight = new Map<string, Promise<string | null>>();

  constructor() {
    this.cacheDir = `${GLib.get_user_cache_dir()}/wfoverlay/images`;
    GLib.mkdir_with_parents(this.cacheDir, 0o755);
  }

  /**
   * Regresa la ruta local del PNG para un imageName de WFCD
   * (ej. "Ash.png"), descargándolo primero si no está en caché.
   * Regresa null si la descarga falla.
   */
  async getLocalPath(imageName: string): Promise<string | null> {
    const localPath = `${this.cacheDir}/${imageName}`;
    const file = Gio.File.new_for_path(localPath);

    if (file.query_exists(null)) {
      return localPath;
    }

    // Evita descargar la misma imagen dos veces en paralelo
    if (this.inFlight.has(imageName)) {
      return this.inFlight.get(imageName)!;
    }

    const promise = this.download(imageName, localPath);
    this.inFlight.set(imageName, promise);

    try {
      return await promise;
    } finally {
      this.inFlight.delete(imageName);
    }
  }

  private async download(imageName: string, localPath: string): Promise<string | null> {
    const url = `https://cdn.warframestat.us/img/${imageName}`;
    try {
      await execAsync(["curl", "-sL", "-o", localPath, url]);

      const file = Gio.File.new_for_path(localPath);
      if (!file.query_exists(null)) return null;

      // Verifica que sea un PNG real y no una página de error HTML
      const [, contents] = file.load_contents(null);
      const isPng =
        contents.length > 4 &&
        contents[0] === 0x89 &&
        contents[1] === 0x50 &&
        contents[2] === 0x4e &&
        contents[3] === 0x47;

      if (!isPng) {
        file.delete(null);
        return null;
      }

      return localPath;
    } catch (error) {
      console.error(`[ImageCache] Error descargando ${imageName}:`, error);
      return null;
    }
  }
}

export const imageCacheService = new ImageCacheService();
