import { app, BrowserWindow } from 'electron';
import * as Path from 'path';

class MyApp {
    mainWindow: Electron.BrowserWindow | null = null;

    constructor(public app: Electron.App) {
        this.app.on('window-all-closed', () => {
            if (process.platform != 'darwin') {
                setTimeout(() => { this.app.quit(); }, 50);
            }
        });

        this.app.on('ready', () => {
            this.mainWindow = new BrowserWindow({
                width: 800,
                height: 545,
                minWidth: 80,
                minHeight: 45
            });
       
            this.mainWindow.on('closed', (event: Electron.Event) => {
                this.mainWindow = null;
            });

			//FIXME ad-hoc
            this.mainWindow.loadURL(`file://${Path.resolve('')}/dist/index.html`);
        });
    }
}

const myapp = new MyApp(app);
