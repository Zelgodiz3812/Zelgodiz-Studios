// Main Electron process for Zelgodiz Studio
const { app, BrowserWindow, ipcMain } = require('electron'); // Added ipcMain
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true, // Keep true for now as per current architecture
      contextIsolation: false, // Keep false to align with nodeIntegration:true and current preload setup
                               // Ideal future state: contextIsolation: true, nodeIntegration: false, and expose all Node features via contextBridge
    },
    icon: path.join(__dirname, 'build/icon.ico'), // Ensure this icon exists or update path
    title: 'Zelgodiz Studio',
  });

  // Vite Dev Server URL (ensure Vite runs on this port, or change port)
  const viteDevServerUrl = 'http://localhost:5173'; // Default Vite port

  if (process.env.NODE_ENV === 'development') {
    console.log("Running in development mode, attempting to load URL:", viteDevServerUrl);
    win.loadURL(viteDevServerUrl).catch(err => {
      console.error("Failed to load Vite dev server URL. Make sure Vite is running.", err);
      console.log("Falling back to dist/index.html");
      win.loadFile(path.join(__dirname, 'dist/index.html'));
    });
  } else {
    // Production: load from file system
    win.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  // Optional: Open DevTools automatically in development
  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

// IPC handler for get-app-path
ipcMain.on('get-app-path', (event) => {
  event.returnValue = app.getAppPath();
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
