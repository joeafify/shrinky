const { app, BrowserWindow, Menu, globalShortcut } = require("electron");

const isDev = (process.env.NODE_ENV = "development" ? true : false);
const isMac = process.platform === "darwin" ? true : false;
let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./assets/images/shrink.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadFile("app/index.html");
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    icon: "./assets/images/shrink.png",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  aboutWindow.loadFile("app/about.html");
}

// app.whenReady().then(createMainWindow);
app.on("ready", () => {
  createMainWindow();
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);
  globalShortcut.register("CmdOrCtrl+R", () => mainWindow.reload());
  globalShortcut.register(isMac ? "Command+Alt+I" : "Ctrl+Shift+I", () =>
    mainWindow.toggleDevTools()
  );
  mainWindow.on("ready", () => (mainWindow = null));
});

const menuTemplate = [
  {
    role: "fileMenu",
  },
  {
    label: "About",
    submenu: [
      {
        label: "About Shrinky",
        click: createAboutWindow,
      },
    ],
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
  menuTemplate.unshift({ role: app.name });
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
