import { createState, With } from "ags";
import app from "ags/gtk4/app";
import { Astal, Gtk } from "ags/gtk4";
import { marketApi } from "../src/services/MarketApiService";
import type { MarketOrder } from "../src/types/market";

export const PriceContent = ({ itemUrl }: { itemUrl: string }) => {
  const [ofertas, setOfertas] = createState<MarketOrder[]>([]);
  const [loading, setLoading] = createState(true);

  marketApi.getLowestOnlineSellers(itemUrl, 3).then((result) => {
    setOfertas(result);
    setLoading(false);
  });

  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="price-overlay-box">
      <With value={loading}>
        {(isLoading) =>
          isLoading ? (
            <label label="Cargando precios..." />
          ) : (
            <box orientation={Gtk.Orientation.VERTICAL}>
              <With value={ofertas}>
                {(list) =>
                  list.length === 0 ? (
                    <label label="Sin ofertas disponibles." />
                  ) : (
                    <box orientation={Gtk.Orientation.VERTICAL}>
                      {list.map((o) => (
                        <label label={`${o.user.ingameName}: ${o.platinum} platinos`} />
                      ))}
                    </box>
                  )
                }
              </With>
            </box>
          )
        }
      </With>
    </box>
  );
};

export const PriceOverlay = (monitor = 0) => {
  return (
    <window
      visible={false}
      monitor={monitor}
      application={app}
      name="price-overlay"
      class="price-overlay-window"
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
      onCloseRequest={(self) => {
        self.visible = false;
        return true;
      }}
    >
    <box orientation={Gtk.Orientation.VERTICAL}>
        <button
          label="✕"
          halign={Gtk.Align.END}
          onClicked={(self) => {
            const win = self.get_root() as Astal.Window;
            win.visible = false;
          }}
        />
        <PriceContent itemUrl="glaive_prime_set" />
      </box>
    </window>
  );
};
