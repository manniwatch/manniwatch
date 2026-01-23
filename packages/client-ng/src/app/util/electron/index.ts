/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
 */

import { ApiService, IElectronInterface, IEnvironmentBase } from '@manniwatch/client-types';

declare global {
    interface Window {
        electron?: {
            manniwatch?: IElectronInterface;
        };
    }
}
export const isManniwatchDesktop = (): boolean => {
    return window && 'electron' in window && 'manniwatch' in window.electron;
};

export const getManniwatchDesktopApi = (): ApiService => {
    return window.electron.manniwatch.api;
};

export const getManniwatchDesktopEnvironment = (): IEnvironmentBase => {
    return window?.electron?.manniwatch?.environment || ({} as IEnvironmentBase);
};
