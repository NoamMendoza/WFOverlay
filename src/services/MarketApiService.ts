import { Order } from "../types/order";
import { execAsync } from "ags/process";

class MarketApiService {
    private readonly baseUrl = "https://api.warframe.market/v2";

    async getManifests() {
      try{
        const url = `${this.baseUrl}/versions`;

        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);

        const manifest = JSON.parse(response);
        
        return manifest;

      }catch(error){
        console.error("[MarketApi] Error al obtener el manifiesto", error);
      }
    }

    async getAllTradeableItems(){
      try{
        const url = `${this.baseUrl}/items`;

        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);

        const items = JSON.parse(response);

        return items;

      }catch(error){
        console.error("[MarketApi] Error al obtener los items tradeables", error);
      }
    }

    async getItemInfo(urlName: string) {
      try {
        const url = `${this.baseUrl}/item/${urlName}`;
        
        const response = await execAsync([
            "curl",
            "-s",
            "-H", "Languague: en",
            "-H", "Accept: application/json",
            url
          ]);
        
        const info = JSON.parse(response);

        return info;

      } catch (error) {
        console.error(`[MarketApi] Error al obtener la información del item: ${urlName}`, error);
      }
    }

    async getItemSetInfo(urlName: string) {
      try {
        const url = `${this.baseUrl}/item/${urlName}/set`;
      
        const response = await execAsync([
            "curl",
            "-s",
            "-H", "Languague: en",
            "-H", "Accept: application/json",
            url
          ]);
        
        const info = JSON.parse(response);

        return info;

      } catch (error) {
       console.error(`[MarketApi] Error al obtener la información del set: ${urlName}`, error); 
      }
    }

    async getAllRiven() {
      try {
        const url = `${this.baseUrl}/riven/weapons`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const rivens = JSON.parse(response);

        return rivens;
      } catch (error) {
        console.error("[MarketApi] Error al obtener la información de los rivens", error);
      }
    }

    async getRivenWeapon(urlName: string) {
      try {
        const url = `${this.baseUrl}/riven/weapon/${urlName}`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const riven = JSON.parse(response);

        return riven;
      } catch (error) {
        console.log(`[MarketApi] Error al obtener la información del riven; ${urlName}`, error); 
      }
    }

    async getRivenAtrtributes() {
      try {
        const url = `${this.baseUrl}/riven/attributes`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const attributes = JSON.parse(response);

        return attributes;
      } catch (error) {
        console.log("[MarketApi] Error al obtener los atributos de los rivens", error);
      }
    }

    async getAllLichWeapons() {
      try {
        const url = `${this.baseUrl}/lich/weapons`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const lichWeapons = JSON.parse(response);

        return lichWeapons;
      } catch (error) {
        console.log("[MarketApi] Error al obtener las armas de liches", error);
      }
    }

    async getLichWeapon(urlName: string) {
      try {
        const url = `${this.baseUrl}/lich/weapon/${urlName}`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const lichWeapon = JSON.parse(response);

        return lichWeapon;
      } catch (error) {
        console.error(`[MarketApi] Error al obtener la información del arma de lich: ${urlName}`, error);
      }
    }

    async getAllLichEphimeras() {
      try {
        
      } catch (error) {
        console.error("[MarketApi] Error al obtener la información de las efimeras de liches", error);
      }
    }

    async getAllLichQuirks() {
      try {
        
      } catch (error) {
        console.error("[MarketApi] Error al obtener la información de los quirks de liches");
      }
    }

    async getAllSisterWeapons() {
      try {
        const url = `${this.baseUrl}/sister/weapons`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const sisterWeapons = JSON.parse(response);

        return sisterWeapons;
      } catch (error) {
        console.log("[MarketApi] Error al obtener las armas de hermanas de parvos", error);
      }
    }

    async getSisterWeapon(urlName: string) {
      try {
        const url = `${this.baseUrl}/sister/weapon/${urlName}`;
      
        const response = await execAsync([
          "curl",
          "-s",
          "-H", "Languague: en",
          "-H", "Accept: application/json",
          url
        ]);
      
        const sisterWeapon = JSON.parse(response);

        return sisterWeapon;
      } catch (error) {
        console.error(`[MarketApi] Error al obtener la información del arma de hermana de parvos: ${urlName}`, error);
      }
    }

    async getAllSisterEphimeras() {
      try {
        
      } catch (error) {
        console.error("[MarketApi] Error al obtener la información de las efimeras de hermanas de parvos", error);
      }
    }

    async getAllSisterQuirks() {
      try {
        
      } catch (error) {
        console.error("[MarketApi] Error al obtener la información de los quirks de hermanas de parvos");
      }
    }

    async getAllLocations() {

    }

    async getAllNPCS() {

    }

    async getAllMissions() {

    }

    async getAllOrfersRecent() {

    }

    async getItemOrders(urlName: string): Promise<Order[]> {
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

    async getTopItemOrders() {

    }

    async getAllUserOrder() {
    
    }

    async getMyOrders() {

    }

    async getOrderById() {

    }

    async postOrder() {

    }

    async patchOrder() {

    }

    async deleteOrder() {

    }

    async postClosePortionOrder() {

    }

    async patchVisibulityForOrderGroup() {

    }

    async getInfoAuthenticatedUser() {

    }

    async patchInfoAuthenticatedUser() {

    }

    async postUpdateAuthenticatedUserAvatar() {

    }

    async postUpdateAuthenticatedUserBackground() {

    }

    async getPublicInfoUser() {

    }

    async getAllAchivements() {

    }

    async getAllAchivementsFromUser() {

    }

    //TODO: Get first party app
    async postSignin() {

    }

    async postRegister() {

    }

    async postRefreshAuthenticatedUser() {

    }

    async postSignout() {

    }

    async getDashboard() {
    
    }

    // OAuth
    async oauthAuthorize() {

    }

    async oauthToken() {

    }

    async oauthRevoke() {

    }

    async getLowestOnlineSellers(urlName: string, limit: number = 5): Promise<Order[]> {
      const allOrders = await this.getItemOrders(urlName);
      
      if (!allOrders || allOrders.length === 0) return [];

      return allOrders
        .filter(order => order.type === "sell" && order.user.status === "ingame")
        .sort((a, b) => a.platinum - b.platinum)
        .slice(0, limit);
    }
}

export const marketApi = new MarketApiService();
