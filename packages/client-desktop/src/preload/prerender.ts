/*
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { IElectronInterface } from '@manniwatch/client-types';
import { contextBridge, ipcRenderer } from 'electron';
import { manniwatchApi } from './manniwatch-api';

/* eslint-disable @typescript-eslint/no-explicit-any,
  @typescript-eslint/no-unsafe-member-access,
  @typescript-eslint/no-unsafe-argument,
  @typescript-eslint/no-unsafe-assignment,
  @typescript-eslint/no-unsafe-return,
  sort-keys */
const electronConfig: IElectronInterface = {
    api: manniwatchApi,
    environment: ipcRenderer.sendSync('getEnvironment'),
};

contextBridge.exposeInMainWorld('electron', {
    manniwatch: electronConfig,
});
