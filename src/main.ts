import { app, BrowserWindow, ipcMain, shell, Menu, dialog } from 'electron';
import path from 'path';

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
        icon: __dirname + '../React/assets/icon.png'
    });

    mainWindow.maximize();

    if (isDev) {
        mainWindow.loadURL('http://localhost:9000');

    } else {
        //mainWindow.loadURL(`file://${app.getAppPath()}/index.html#`); // using HashRouter instead of BrowserRouter (NOT FOUND)
        mainWindow.loadFile(path.resolve(path.join(__dirname, 'index.html')));
    }
   
    // Main menu
    const mainMenuTemplate: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'KHM Auto',
            submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
        },
        // {
        //     label: 'Edit',
        //     submenu: [
        //         { role: 'undo' },
        //         { role: 'redo' },
        //         { type: 'separator' },
        //         { role: 'cut' },
        //         { role: 'copy' },
        //         { role: 'paste' },
        //         { type: 'separator' },
        //         { role: 'selectAll' },
        //         { role: 'delete' },
        //     ],
        // },
        {
            label: 'Invoices',
            submenu: [
                {
                    label: 'All invoices',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/invoice');
                    },
                },
                {
                    label: 'Create new invoice',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/invoice/new');
                    },
                },
            ],
        },
        {
            label: 'Quotes',
            submenu: [
                {
                    label: 'All Quotes',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/quote');
                    },
                },
                {
                    label: 'Create new quote',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/quote/new');
                    },
                },
            ],
        },
        {
            label: 'Cars',
            click() {
                mainWindow?.webContents.send('navigateTo', '/car');
            },
        },
        {
            label: 'Report',
            click() {
                mainWindow?.webContents.send('navigateTo', '/report');
            },
        },
        {
            label: 'Tools',
            submenu: [
                {
                    label: 'Company',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/company');
                    }
                },
                {
                    label: 'Backup Database',
                    click() {
                        mainWindow?.webContents.send('navigateTo', '/backup');
                    }
                }
            ]
        }
    ];

    if (isDev) {
        mainMenuTemplate.push({
            label: 'Devs',
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

    mainWindow.on('close', function (e) {
        const choice = dialog.showMessageBoxSync(mainWindow!,
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

// open file in explorer
ipcMain.on('open-file-in-folder', (event, filePath) => {
    shell.showItemInFolder(filePath);
});

