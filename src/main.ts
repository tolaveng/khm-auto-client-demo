import { app, BrowserWindow } from 'electron';

let mainWindow: Electron.BrowserWindow | null;
const isDev = process.env.NODE_ENV == 'development';

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: true
        }
    });

    console.log(`Running in development: ${isDev}`);
    //const mainUrl = 'http://localhost:9000';
    const mainUrl = isDev? 'http://localhost:9000': `file://${app.getAppPath()}/index.html`;
    mainWindow.loadURL(mainUrl);

    mainWindow.on('closed', () => {
        mainWindow = null;
      });
}
  
app.on('ready', createWindow);