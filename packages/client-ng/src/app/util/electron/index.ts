/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-ng
 */

import { ApiService } from "@manniwatch/client-types";

export const isManniwatchDesktop = (): boolean => {
    return (window &&
        'electron' in window &&
        'manniwatch' in (window as any).electron);
}

export const getManniwatchDesktopApi = (): ApiService => {
    return (window as any).electron.manniwatch.api;
}
