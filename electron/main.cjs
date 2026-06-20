const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function startBackend() {
  const isPackaged = app.isPackaged;
  const serverPath = isPackaged
    ? path.join(process.resourcesPath, 'server', 'dist', 'main.js')
    : path.join(__dirname, '..', 'server', 'dist', 'main.js');

  console.log(`Starting backend from: ${serverPath}`);

  // Chạy backend. Nếu chưa build, hãy build trước. Trong dev, ta dùng concurrently nên backend tự chạy.
  // Ở bản build (isPackaged), ta phải chạy node server/dist/main.js.
  if (isPackaged) {
    backendProcess = spawn('node', [serverPath], {
      cwd: path.join(process.resourcesPath, 'server'),
      env: { ...process.env, NODE_ENV: 'production' },
    });

    backendProcess.stdout.on('data', (data) => console.log(`Backend: ${data}`));
    backendProcess.stderr.on('data', (data) => console.error(`Backend Error: ${data}`));
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    // Nạp file HTML đã build (Vite dist)
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    // Chạy dev server của Vite
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  // Đợi backend khởi động 1 chút
  setTimeout(createWindow, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
