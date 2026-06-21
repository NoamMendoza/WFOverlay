import { execAsync } from "ags/process";

export interface WarframeComponent {
  name: string; // "Blueprint" | "Chassis" | "Neuroptics" | "Systems" | etc.
  imageName: string | null;
  ducats: number | null;
}

export interface WarframeEntry {
  name: string;
  isPrime: boolean;
  imageName: string | null;
  vaulted: boolean;
  components: WarframeComponent[];
}

class WarframeDataService {
  private readonly sourceUrl =
    "https://raw.githubusercontent.com/WFCD/warframe-items/master/data/json/Warframes.json";

  private cache: WarframeEntry[] | null = null;

  async getAll(): Promise<WarframeEntry[]> {
    if (this.cache) return this.cache;

    try {
      const response = await execAsync(["curl", "-s", this.sourceUrl]);
      const raw = JSON.parse(response) as Array<{
        name: string;
        imageName?: string;
        vaulted?: boolean;
        components?: Array<{
          uniqueName: string;
          name: string;
          imageName?: string;
          ducats?: number;
        }>;
      }>;

      const entries: WarframeEntry[] = raw
        .filter((item) => !!item.name)
        .map((item) => {
          // Solo piezas "construibles" (recetas), no recursos genéricos
          // como Orokin Cell, Neural Sensors, etc.
          const components: WarframeComponent[] = (item.components ?? [])
            .filter((c) => c.uniqueName.includes("/Recipes/"))
            .map((c) => ({
              name: c.name,
              imageName: c.imageName ?? null,
              ducats: c.ducats ?? null,
            }));

          return {
            name: item.name,
            isPrime: item.name.includes("Prime"),
            imageName: item.imageName ?? null,
            vaulted: item.vaulted ?? false,
            components,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name, "es"));

      this.cache = entries;
      return entries;
    } catch (error) {
      console.error("[WarframeData] Error obteniendo lista de Warframes:", error);
      return [];
    }
  }
}

export const warframeDataService = new WarframeDataService();
