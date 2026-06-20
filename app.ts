import app from "ags/gtk4/app";
import style from "./style.scss";
import { PriceOverlay } from "./widget/PriceOverlay";
import { marketApi } from "./src/services/MarketApiService";

// Función de prueba asíncrona (standalone, para debug por consola)
async function probarApi() {
  console.log("Conectando con Warframe Market (AGS v2 GTK4)...");

  const ofertas = await marketApi.getLowestOnlineSellers("glaive_prime_set", 3);

  if (ofertas.length === 0) {
    console.log("No se encontraron ofertas o hubo un error.");
    return;
  }

  console.log("\n=== 🔧 Mejores ofertas (Vendedores In-Game) ===");
  ofertas.forEach((oferta, indice) => {
    console.log(`[${indice + 1}] Jugador: ${oferta.user.ingameName} | Precio: ${oferta.platinum} platinos`);
  });
  console.log("=========================================\n");
}

app.start({
  css: style,
  main() {
    probarApi(); // ahora sí se invoca la prueba al iniciar
    PriceOverlay(0); // levanta el overlay en el monitor 0
  },
});
