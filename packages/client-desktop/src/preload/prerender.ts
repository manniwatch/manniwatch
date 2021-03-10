const { contextBridge } = require('electron');
import { ManniwatchApi } from './manniwatch-api';

contextBridge.exposeInMainWorld(
    'electron',
    {
        manniwatch: ManniwatchApi,
    }
)
