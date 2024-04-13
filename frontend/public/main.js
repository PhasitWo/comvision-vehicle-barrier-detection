const { app, BrowserWindow, dialog, ipcMain, process, shell } = require("electron");
const path = require("path");
const url = require("url");

function createWindow() {
    // production
    // url.format({
    //     pathname: path.join(__dirname, "../dist/index.html"),
    //     protocol: "file:",
    //     slashes: true,
    // });
    const startUrl = url.format({
        pathname: path.join(__dirname, "../dist/index.html"),
        protocol: "file:",
        slashes: true,
    });
    const win = new BrowserWindow({
        width: 1600,
        height: 900,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            webSecurity: false,
        },
    });
    ipcMain.handle("openDialog", async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ["openFile", "multiSelections"],
        });
        if (canceled) return [];
        else return filePaths;
    });

    win.loadURL(startUrl);
    app.on("window-all-closed", () => {
        app.quit();
    });
}
app.whenReady().then(() => {
    createWindow();
    try {
        // .. + .. for production
        shell.openPath(path.join(__dirname, "..", "..", "predict", "predict.exe"));
    } catch (err) {
        fs.writeFileSync("error-log.txt", err.message);
    }
});
app.on("window-all-closed", () => {
    try {
        const execSync = require("child_process").execSync;
        execSync("taskkill /im predict.exe /f");
    } finally {
        app.quit();
    }
});
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
