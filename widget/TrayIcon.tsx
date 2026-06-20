import AstalTray from "gi://AstalTray";
import { createBinding } from "ags";

const tray = AstalTray.get_default();

export const TrayIcons = () => {
  const items = createBinding(tray, "items");

  return (
    <box>
      {items((list) =>
        list.map((item) => (
          <menubutton
            tooltipMarkup={item.tooltipMarkup}
            menuModel={item.menuModel}
          >
            <image gicon={item.gicon} />
          </menubutton>
        ))
      )}
    </box>
  );
};
