const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the renderer window
contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  onMessage: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args))
});
