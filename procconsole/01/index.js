const { app, BrowserWindow } = require('electron')
const path = require('path')

const loadMainWindow = () => {
    const mainWindow = new BrowserWindow({
        width : 1200,
        height: 800,
        webPreferences : {
            nodeIntegration : true
        }
    })

    mainWindow.loadFile(path.join(__dirname, "index.html"));
}

console.log('starting');

app.on("ready", loadMainWindow);