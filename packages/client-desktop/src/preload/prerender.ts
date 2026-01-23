/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IElectronInterface } from '@manniwatch/client-types';
import { contextBridge, ipcRenderer } from 'electron';
import { manniwatchApi } from './manniwatch-api';

const electronConfig: IElectronInterface = {
    api: manniwatchApi,
    environment: ipcRenderer.sendSync('getEnvironment'),
};

contextBridge.exposeInMainWorld('electron', {
    manniwatch: electronConfig,
});
