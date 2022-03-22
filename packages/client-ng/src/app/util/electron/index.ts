/*
 * Package @manniwatch/client-ng
 * Source https://github.com/manniwatch/manniwatch/tree/master/packages/client-types
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
    return (
        window &&
        'electron' in window &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        'manniwatch' in window.electron
    );
};

export const getManniwatchDesktopApi = (): ApiService => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return window.electron.manniwatch.api;
};

export const getManniwatchDesktopEnvironment = (): IEnvironmentBase => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    return window?.electron?.manniwatch?.environment || ({} as IEnvironmentBase);
};
