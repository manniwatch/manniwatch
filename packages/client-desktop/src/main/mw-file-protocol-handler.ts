/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
 */

import { app, Protocol, ProtocolRequest, ProtocolResponse } from 'electron';
import { existsSync, promises as fsp } from 'fs';
import { basename, join, normalize, resolve } from 'path';
import { URL } from 'url';

const guessMimeType = (filepath: string): string | undefined => {
    const fileparts: string[] = basename(filepath).split('.');
    if (fileparts.length > 1) {
        switch (fileparts.slice(-1)[0].toLocaleLowerCase()) {
            case 'html':
                return 'text/html';
            case 'js':
                return 'text/javascript';
            case 'css':
                return 'text/css';
        }
    }
    return undefined;
};
type HandlerType = Parameters<Protocol['registerFileProtocol']>[1];
export const createMwFileProtocolHandler: () => HandlerType = (): HandlerType => {
    const distType: string = normalize(`${app.getAppPath()}/../static/`);
    if (!existsSync(distType)) {
        throw new Error(`Could not find dist folder '${distType}'`);
    }
    return async (request: ProtocolRequest, callback: (response: string | ProtocolResponse) => void): Promise<void> => {
        const parsedUrl: URL = new URL(request.url);
        if (parsedUrl.protocol === 'mw:' && parsedUrl.host === 'static') {
            const normalizedPath: string = normalize(join(distType, parsedUrl.pathname));
            try {
                if ((await fsp.stat(normalizedPath)).isFile()) {
                    callback({
                        charset: 'UTF-8',
                        headers: {
                            'Content-Type': guessMimeType(normalizedPath) as any,
                        },
                        path: normalizedPath,
                    });
                }
                return;
            } catch (err) {
                console.error(err);
            }
        }
        callback({ path: resolve(distType, 'index.html'), statusCode: 404 });
    };
};
