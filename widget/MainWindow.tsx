import { createState, With, type Accessor, type Setter } from "ags";
import { themeAccessor, toggleTheme } from "../src/services/ThemeService";
import app from "ags/gtk4/app";
import { Gtk } from "ags/gtk4";
import { logService } from "../src/services/LogService";
import { warframeDataService, type WarframeEntry } from "../src/services/WarframeDataService";
import { imageCacheService } from "../src/services/ImageCacheService";
import {
  warframeStatusService,
  type WarframeProgress,
} from "../src/services/WarframeStatusService";

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

// ---------- Pieza individual (Blueprint / Chassis / Neuroptics / Systems) ----------
const PartChip = ({
  warframeName,
  partName,
  owned,
  onToggle,
}: {
  warframeName: string;
  partName: string;
  owned: boolean;
  onToggle: () => void;
}) => {
  return (
    <button
      class={owned ? "part-chip part-chip-owned" : "part-chip"}
      onClicked={onToggle}
      tooltipText={partName}
    >
      <label label={partName.slice(0, 1)} />
    </button>
  );
};

// ---------- Tarjeta de Warframe ----------
const WarframeCard = ({ entry }: { entry: WarframeEntry }) => {
  const [progress, setProgress] = createState<WarframeProgress>(
    warframeStatusService.getProgress(entry.name),
  );
  const [imagePath, setImagePath] = createState<string | null>(null);

  if (entry.imageName) {
    imageCacheService.getLocalPath(entry.imageName).then(setImagePath);
  }

  const refresh = () => setProgress(warframeStatusService.getProgress(entry.name));

  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="warframe-card">
      <overlay>
        <With value={imagePath}>
          {(path) =>
            path ? (
              <image file={path} class="warframe-card-image" pixelSize={96} />
            ) : (
              <box class="warframe-card-image-placeholder" />
            )
          }
        </With>
        {entry.vaulted && (
          <label label="🔒" class="vaulted-badge" halign={Gtk.Align.END} valign={Gtk.Align.START} $type="overlay" />
        )}
      </overlay>

      <label
        label={entry.name}
        class="warframe-card-name"
        wrap
        justify={Gtk.Justification.CENTER}
      />

      {entry.components.length > 0 && (
        <box orientation={Gtk.Orientation.HORIZONTAL} class="part-chip-row" halign={Gtk.Align.CENTER}>
          <With value={progress}>
            {(p) => (
              <box orientation={Gtk.Orientation.HORIZONTAL} spacing={4}>
                {entry.components.map((c) => (
                  <PartChip
                    warframeName={entry.name}
                    partName={c.name}
                    owned={!!p.parts[c.name]}
                    onToggle={() => {
                      warframeStatusService.togglePart(entry.name, c.name);
                      refresh();
                    }}
                  />
                ))}
              </box>
            )}
          </With>
        </box>
      )}

      <box orientation={Gtk.Orientation.HORIZONTAL} class="card-footer" halign={Gtk.Align.CENTER}>
        <With value={progress}>
          {(p) => (
            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={6}>
              <button
                class={p.mastered ? "footer-btn footer-btn-active" : "footer-btn"}
                onClicked={() => {
                  warframeStatusService.toggleMastered(entry.name);
                  refresh();
                }}
                tooltipText="Dominado"
              >
                <label label="⭐" />
              </button>
              <button
                class={p.subsumed ? "footer-btn footer-btn-active" : "footer-btn"}
                onClicked={() => {
                  warframeStatusService.toggleSubsumed(entry.name);
                  refresh();
                }}
                tooltipText="Subsumido (Helminth)"
              >
                <label label="🌀" />
              </button>
            </box>
          )}
        </With>
      </box>
    </box>
  );
};

const WarframeList = () => {
  const [displayList, setDisplayList] = createState<WarframeEntry[] | null>(null);
  let fullList: WarframeEntry[] = [];

  warframeDataService
    .getAll()
    .then((list) => {
      fullList = list;
      setDisplayList(list);
    })
    .catch((error) => {
      console.error("[MainWindow] Error cargando Warframes:", error);
      setDisplayList([]);
    });

  const applyFilter = (query: string) => {
    const q = query.toLowerCase().trim();
    const filtered = q ? fullList.filter((w) => w.name.toLowerCase().includes(q)) : fullList;
    setDisplayList(filtered);
  };

  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="warframe-list-container" hexpand vexpand>
      <entry
        placeholderText="Buscar Warframe..."
        class="search-bar"
        hexpand
        onNotifyText={(self: Gtk.Entry) => applyFilter(self.get_text())}
      />

      <scrolledwindow hexpand vexpand hscrollbarPolicy={Gtk.PolicyType.NEVER}>
        <With value={displayList}>
          {(list) => {
            if (list === null) {
              return <label label="Cargando lista de Warframes..." />;
            }
            if (list.length === 0) {
              return <label label="Sin resultados." class="status-hint" />;
            }
            return (
              <Gtk.FlowBox
                cssClasses={["warframe-grid"]}
                homogeneous
                rowSpacing={12}
                columnSpacing={12}
                selectionMode={Gtk.SelectionMode.NONE}
                maxChildrenPerLine={6}
                minChildrenPerLine={2}
              >
                {list.map((entry) => (
                  <WarframeCard entry={entry} />
                ))}
              </Gtk.FlowBox>
            );
          }}
        </With>
      </scrolledwindow>
    </box>
  );
};

const SectionContent = ({
  activeSection,
}: {
  activeSection: Accessor<Section>;
}) => {
  return (
    <box orientation={Gtk.Orientation.VERTICAL} class="section-content" hexpand vexpand>
      <With value={activeSection}>
        {(section) => {
          if (section === "inicio") {
            return (
              <box orientation={Gtk.Orientation.VERTICAL} hexpand vexpand>
                <label label="Mis Warframes" class="section-title" />
                <ConnectionStatus />
                <WarframeList />
              </box>
            );
          }
          if (section === "reliquias") {
            return <label label="Reliquias (próximamente)" class="section-title" />;
          }
          if (section === "mercado") {
            return <label label="Mercado (próximamente)" class="section-title" />;
          }
          if (section === "ajustes") {
            return (
              <box orientation={Gtk.Orientation.VERTICAL}>
                <label label="Ajustes" class="section-title" />
                <button label="Cambiar tema (claro/oscuro)" onClicked={() => toggleTheme()} />
              </box>
            );
          }
        }}
      </With>
    </box>
  );
};

export const MainWindow = () => {
  const [activeSection, setActiveSection] = createState<Section>("inicio");

  return (
    <Gtk.ApplicationWindow
      visible
      application={app}
      title="WFOverlay"
      class={themeAccessor}
      defaultWidth={1000}
      defaultHeight={650}
      onCloseRequest={(self: Gtk.ApplicationWindow) => {
        self.hide();
        return true;
      }}
    >
      <box orientation={Gtk.Orientation.HORIZONTAL} hexpand vexpand>
        <Sidebar setActiveSection={setActiveSection} />
        <SectionContent activeSection={activeSection} />
      </box>
    </Gtk.ApplicationWindow>
  );
};
