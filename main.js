const { app, BrowserWindow } = require("electron");
const { exec } = require("child_process");
const http = require("http");

const SERVER_URL = "http://localhost:3000";
let mainWindow;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.loadURL(SERVER_URL);
}


function waitForServer() {
  const interval = setInterval(() => {
    http.get(SERVER_URL, () => {
      clearInterval(interval);
      createWindow();
    }).on('error', () => {
        console.error(`Error connecting to the server`);
    });
  }, 500);
}

app.whenReady().then(() => {
  const backend = exec("npm start");

  backend.stdout.on("data", (data) => {
    console.log(`Backend: ${data}`);
  });

  backend.stderr.on("data", (data) => {
    console.error(`Backend error: ${data}`);
  });

  waitForServer(SERVER_URL, createWindow);

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
});
