import { app, BrowserWindow, Menu } from "electron";
import * as path from "path";

function createWindow() {
  const win = new BrowserWindow({
    title: "XSpacePay",
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  Menu.setApplicationMenu(null);

  const startURL =
    process.env.NODE_ENV === "development"
      ? "http://82.29.56.128:3000/funil"
      : `file://${path.join(__dirname, "../out/index.html")}`;

  win.loadURL("http://82.29.56.128:3000/funil");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
