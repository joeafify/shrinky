const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

const isDev = (process.env.NODE_ENV = "development");
const isMac = process.platform === "darwin";
let win;

function createMainWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./shrink.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  win.loadFile("app/index.html");
}
// app.whenReady().then(createMainWindow);
app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  globalShortcut.register("CmdOrCtrl+R", () => win.reload());
  globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () =>
    win.toggleDevTools()
  );
  win.on("ready", () => (win = null));
});

const menuTemplate = [
  {
    role: "fileMenu",
  },
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            {
              role: "reload",
            },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];
if (isMac) {
  menuTemplate.unshift({ role: "appMenu" });
}
app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
