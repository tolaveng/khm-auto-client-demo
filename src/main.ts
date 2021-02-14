import { app, BrowserWindow, Menu } from 'electron';

let mainWindow: Electron.BrowserWindow | null;
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

const createWindow = (): void => {
    mainWindow = new BrowserWindow({
        title: 'KHM Auto',
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 600,
        x: 0, y: 0,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    console.log(`Running in development: ${isDev}`);
    //const mainUrl = 'http://localhost:9000';
    const mainUrl = isDev ? 'http://localhost:9000' : `file://${app.getAppPath()}/index.html`;

    mainWindow.maximize();
    mainWindow.loadURL(mainUrl);

    // Main menu
    const mainMenuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'KHM Auto',
            submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
        },
        {
            label: 'Edit',
            submenu: [
                { role: 'undo' },
                { role: 'redo' },
                { type: 'separator' },
                { role: 'cut' },
                { role: 'copy' },
                { role: 'paste' },
                { type: 'separator' },
                { role: 'selectAll' },
                { role: 'delete' },
            ],
        },
        {
            label: 'Invoices',
            submenu: [
                {
                    label: 'Create new invoice',
                    click() {},
                },
                {
                    label: 'View all invoices',
                    click() {},
                },
            ],
        },
    ];

    if (isDev) {
        mainMenuTemplate.push({
            label: 'Tools',
            submenu: [{ role: 'forceReload' }, { role: 'toggleDevTools' }],
        });
        mainWindow.webContents.openDevTools();
    }
    const menu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(menu);
    // End main menu

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.on('close', function(e) {
        const choice = require('electron').dialog.showMessageBoxSync(mainWindow!,
          {
            type: 'question',
            buttons: ['Yes', 'No'],
            defaultId: 1,
            title: 'Confirm Close',
            message: 'Are you sure you want to close?'
          });
        if (choice === 1) {
          e.preventDefault();
        }
      });

}; // end create main window

app.on('ready', createWindow);
