import { createState, With, type Accessor, type Setter } from "ags";
import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import { logService } from "../src/services/LogService";

type Section = "inicio" | "reliquias" | "mercado" | "ajustes";

const NAV_ITEMS: { id: Section; label: string }[] = [
  { id: "inicio", label: "Inicio" },
  { id: "reliquias", label: "Reliquias" },
  { id: "mercado", label: "Mercado" },
  { id: "ajustes", label: "Ajustes" },
];

const Sidebar = ({
  setActiveSection,
}: {
  setActiveSection: Setter<Section>;
}) => {
  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="sidebar">
      <label label="WFOverlay" class="sidebar-title" />
      {NAV_ITEMS.map((item) => (
        <button class="sidebar-item" onClicked={() => setActiveSection(item.id)}>
          <label label={item.label} />
        </button>
      ))}
    </box>
  );
};

const ConnectionStatus = () => {
  const [status, setStatus] = createState<{ found: boolean; path: string | null }>({
    found: false,
    path: null,
  });

  // Detecta al montar el componente (una sola vez por ahora)
  setStatus(logService.detect());

  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="connection-status">
      <With value={status}>
        {(s) =>
          s.found ? (
            <box orientation={Gtk.Orientation.VERTICAL} class="status-ok">
              <label label="🟢 EE.log detectado" />
              <label label={s.path ?? ""} class="status-path" />
            </box>
          ) : (
            <box orientation={Gtk.Orientation.VERTICAL} class="status-error">
              <label label="🔴 EE.log no encontrado" />
              <label label="Verifica que Warframe esté instalado." class="status-hint" />
            </box>
          )
        }
      </With>
    </box>
  );
};

const SectionContent = ({
  activeSection,
}: {
  activeSection: Accessor<Section>;
}) => {
  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="section-content">
      <With value={activeSection}>
        {(section) => {
          if (section === "inicio") {
            return (
              <box orientation={Gtk.Orientation.VERTICAL}>
                <label label="Bienvenido a WFOverlay" class="section-title" />
                <ConnectionStatus />
              </box>
            );
          }
          if (section === "reliquias") {
            return <label label="Reliquias (próximamente)" class="section-title" />;
          }
          if (section === "mercado") {
            return <label label="Mercado (próximamente)" class="section-title" />;
          }
          return <label label="Ajustes (próximamente)" class="section-title" />;
        }}
      </With>
    </box>
  );
};

export const MainWindow = () => {
  const [activeSection, setActiveSection] = createState<Section>("inicio");

  return (
    <window
      visible
      application={app}
      name="main-window"
      title="WFOverlay"
      class="main-window"
      defaultWidth={800}
      defaultHeight={500}
      onCloseRequest={(self) => {
        self.visible = false;
        return true;
      }}
    >
      <box orientation={Gtk.Orientation.HORIZONTAL}>
        <Sidebar setActiveSection={setActiveSection} />
        <SectionContent activeSection={activeSection} />
      </box>
    </window>
  );
};
