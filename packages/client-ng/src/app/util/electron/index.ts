/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */


import { ApiService, IElectronInterface, IEnvironmentBase } from '@manniwatch/client-types';

declare global {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    interface Window {
        electron?: {
            manniwatch?: IElectronInterface;
        };
    }
}
export const isManniwatchDesktop = (): boolean => {
    return (window &&
        'electron' in window &&
        'manniwatch' in (window as any).electron);
};

export const getManniwatchDesktopApi = (): ApiService => {
    return (window as any).electron.manniwatch.api;
};

export const getManniwatchDesktopEnvironment = (): IEnvironmentBase => {
    return window?.electron?.manniwatch?.environment || {} as any;
};
