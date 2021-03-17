/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */
import { ApiService, IElectronInterface, IEnvironmentBase } from '@manniwatch/client-types';

declare global {
    // tslint:disable-next-line:interface-name
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
