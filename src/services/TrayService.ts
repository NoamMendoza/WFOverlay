import Gio from "gi://Gio";
import GLib from "gi://GLib";

// Carga el XML de la interfaz como texto en build-time.
// AGS/gnim soporta imports de texto crudo vía "?inline" o leyendo el archivo.
// Si tu setup no soporta eso, pega el XML como string literal aquí mismo.
const ifaceXml = `
<node>
  <interface name="org.kde.StatusNotifierItem">
    <property name="Category" type="s" access="read"/>
    <property name="Id" type="s" access="read"/>
    <property name="Title" type="s" access="read"/>
    <property name="Status" type="s" access="read"/>
    <property name="WindowId" type="i" access="read"/>
    <property name="IconName" type="s" access="read"/>
    <property name="IconThemePath" type="s" access="read"/>
    <property name="ItemIsMenu" type="b" access="read"/>
    <property name="ToolTip" type="(sa(iiay)ss)" access="read"/>

    <method name="Activate">
      <arg type="i" name="x" direction="in"/>
      <arg type="i" name="y" direction="in"/>
    </method>
    <method name="SecondaryActivate">
      <arg type="i" name="x" direction="in"/>
      <arg type="i" name="y" direction="in"/>
    </method>
    <method name="ContextMenu">
      <arg type="i" name="x" direction="in"/>
      <arg type="i" name="y" direction="in"/>
    </method>
    <method name="Scroll">
      <arg type="i" name="delta" direction="in"/>
      <arg type="s" name="orientation" direction="in"/>
    </method>

    <signal name="NewTitle"/>
    <signal name="NewIcon"/>
    <signal name="NewToolTip"/>
    <signal name="NewStatus">
      <arg type="s" name="status"/>
    </signal>
  </interface>
</node>
`;

type ActivateHandler = () => void;

class TrayService {
  private exportedObject: Gio.DBusExportedObject | null = null;
  private busName: string | null = null;
  private connection: Gio.DBusConnection | null = null;
  private onActivateCb: ActivateHandler | null = null;

  private readonly objectPath = "/StatusNotifierItem";
  private readonly id = "wfoverlay";
  private readonly title = "WFOverlay";
  private readonly iconName = "application-x-executable-symbolic"; // ícono del sistema; ajusta o usa ruta absoluta vía IconThemePath

  onActivate(cb: ActivateHandler) {
    this.onActivateCb = cb;
  }

  async start() {
    this.connection = Gio.bus_get_sync(Gio.BusType.SESSION, null);

    const pid = GLib.getpid?.() ?? 0;
    this.busName = `org.kde.StatusNotifierItem-${pid}-1`;

    // 1. Tomamos el nombre de bus único para nuestro ítem
    Gio.bus_own_name_on_connection(
      this.connection,
      this.busName,
      Gio.BusNameOwnerFlags.NONE,
      () => this.onNameAcquired(),
      () => console.error("[Tray] No se pudo adquirir el nombre de bus"),
    );
  }

  private onNameAcquired() {
    if (!this.connection) return;

    const nodeInfo = Gio.DBusNodeInfo.new_for_xml(ifaceXml);
    const iface = nodeInfo.lookup_interface("org.kde.StatusNotifierItem")!;

    this.exportedObject = Gio.DBusExportedObject.wrapJSObject(
      iface,
      this.buildImplementation(),
    );
    this.exportedObject.export(this.connection, this.objectPath);

    // 2. Nos registramos ante el StatusNotifierWatcher
    this.registerWithWatcher();

    console.log(`[Tray] Ícono publicado como ${this.busName}`);
  }

  private buildImplementation() {
    return {
      // Propiedades (deben coincidir 1:1 con el XML)
      Category: "ApplicationStatus",
      Id: this.id,
      Title: this.title,
      Status: "Active",
      WindowId: 0,
      IconName: this.iconName,
      IconThemePath: "",
      ItemIsMenu: false,
      ToolTip: ["", [], this.title, "WFOverlay - Warframe Market"],

      // Métodos
      Activate: (_x: number, _y: number) => {
        this.onActivateCb?.();
      },
      SecondaryActivate: (_x: number, _y: number) => {
        this.onActivateCb?.();
      },
      ContextMenu: (_x: number, _y: number) => {
        // Aquí podrías mostrar un menú; por ahora no-op
      },
      Scroll: (_delta: number, _orientation: string) => {
        // no-op
      },
    };
  }

  private registerWithWatcher() {
    if (!this.connection || !this.busName) return;

    this.connection.call(
      "org.kde.StatusNotifierWatcher",
      "/StatusNotifierWatcher",
      "org.kde.StatusNotifierWatcher",
      "RegisterStatusNotifierItem",
      new GLib.Variant("(s)", [this.busName]),
      null,
      Gio.DBusCallFlags.NONE,
      -1,
      null,
      (conn, res) => {
        try {
          conn?.call_finish(res);
          console.log("[Tray] Registrado correctamente ante StatusNotifierWatcher");
        } catch (e) {
          console.error("[Tray] Error registrando ante el watcher:", e);
        }
      },
    );
  }
}

export const trayService = new TrayService();
