const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut,
  ipcMain,
  shell,
} = require("electron");
const log = require("electron-log")
const path = require("path");
const os = require("os");
const imagemin = require("imagemin");
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const slash = require("slash");

const isDev = (process.env.NODE_ENV = "development" ? true : false);
const isMac = process.platform === "darwin" ? true : false;
let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 500,
    height: 600,
    resizable: false,
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

ipcMain.on("image:minimize", (e, { imgPath, quality }) => {
  const dest = path.join(os.homedir(), "shrinky", "output");
  optimizeImg(imgPath, quality, dest);
});
async function optimizeImg(imgPath, quality, dest) {
  try {
    const files = await imagemin([slash(imgPath)], {
      destination: dest,
      plugins: [
        imageminMozjpeg({ quality }),
        imageminPngquant({ quality: [quality / 100, quality / 100] }),
      ],
    });
    mainWindow.webContents.send("optimize:done")
    log.info(files)
    shell.openItem(dest);
  } catch (error) {
    log.error(error)
  }
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
