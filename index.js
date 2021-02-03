const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

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
  globalShortcut.register(
    process.platform === "darwin" ? "Command+Alt+I" : "Ctrl+Shift+I",
    () => win.toggleDevTools()
  );
  win.on("ready", () => (win = null));
});

const menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Quit",
        accelerator: "CmdOrCtrl+Q",
        click: () => app.quit(),
      },
    ],
  },
];
if (process.platform === "darwin") {
  menuTemplate.unshift({ role: "appMenu" });
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
