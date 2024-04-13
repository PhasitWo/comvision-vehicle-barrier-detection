const { contextBridge, ipcRenderer} = require("electron");

contextBridge.exposeInMainWorld("api", {
    openDialog: () => ipcRenderer.invoke("openDialog"),
});
