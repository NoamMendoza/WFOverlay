import { MarketResponseV2, ItemOrdersPayload, MarketOrder } from "../types/market";
import { execAsync } from "ags/process";

class MarketApiService {
    private readonly baseUrl = "https://api.warframe.market/v2";

    async getItemOrders(urlName: string): Promise<MarketOrder[]> {
        try {
            const url = `${this.baseUrl}/orders/item/${urlName}`;
            
            const response = await execAsync([
                "curl", 
                "-s", 
                "-H", "Language: en",
                "-H", "Accept: application/json",
                url
            ]);
            
            const parsed = JSON.parse(response);
            const orders = parsed.data || []

            return orders;

        } catch (error) {
            console.error(`[MarketApi] Error al obtener órdenes para ${urlName}:`, error);
            return [];
        }
    }

    async getLowestOnlineSellers(urlName: string, limit: number = 5): Promise<MarketOrder[]> {
      const allOrders = await this.getItemOrders(urlName);
      
      if (!allOrders || allOrders.length === 0) return [];

      return allOrders
        .filter(order => order.type === "sell" && order.user.status === "ingame")
        .sort((a, b) => a.platinum - b.platinum)
        .slice(0, limit);
    }
}

export const marketApi = new MarketApiService();
