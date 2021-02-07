import { app, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null;

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');
    mainWindow.on('closed', () => {
        mainWindow = null;
      });
}
  
app.on('ready', createWindow);