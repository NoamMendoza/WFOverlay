import app from "ags/gtk4/app";
import style from "./style.scss";
import { PriceOverlay } from "./widget/PriceOverlay";
import { MainWindow } from "./widget/MainWindow";
import { trayService } from "./src/services/TrayService";

app.start({
  css: style,
  requestHandler(request, response) {
    if (request === "toggle-overlay") {
      const win = app.get_window("price-overlay");
      if (win) win.visible = !win.visible;
      response("ok");
      return;
    }
    response("unknown request");
  },
  main() {
    const mainWin = MainWindow();
    PriceOverlay(); // sigue siendo layer-shell (overlay encima de todo)

    trayService.onActivate(() => {
      if (mainWin.visible) {
        mainWin.hide();
      } else {
        mainWin.present(); // mejor que solo visible=true para ventanas normales
      }
    });

    trayService.start();
  },
});
