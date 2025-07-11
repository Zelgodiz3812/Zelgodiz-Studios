// Preload script for Electron
const { contextBridge, ipcRenderer } = require('electron');
const path = require('path'); // Node.js path module

contextBridge.exposeInMainWorld('electronEnv', {
  getAppPath: () => ipcRenderer.sendSync('get-app-path'),
  pathJoin: (...args) => path.join(...args),
  // Expose other path functions if needed by the renderer, e.g., path.resolve
  pathResolve: (...args) => path.resolve(...args),
});

window.addEventListener('DOMContentLoaded', () => {
  // You can also expose specific Node modules or versions if truly needed, e.g.
  // contextBridge.exposeInMainWorld('versions', {
  //   node: () => process.versions.node,
  //   chrome: () => process.versions.chrome,
  //   electron: () => process.versions.electron,
  // });
});
