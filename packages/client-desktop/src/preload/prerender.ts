/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { IElectronInterface } from '@manniwatch/client-types';
import { contextBridge, ipcRenderer } from 'electron';
import { manniwatchApi } from './manniwatch-api';

const electronConfig: IElectronInterface = {
    api: manniwatchApi,
    environment: ipcRenderer.sendSync('getEnvironment'),
};

contextBridge.exposeInMainWorld(
    'electron',
    {
        manniwatch: electronConfig,
    },
);
