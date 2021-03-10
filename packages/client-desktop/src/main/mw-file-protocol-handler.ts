import { Protocol, ProtocolRequest, ProtocolResponse } from "electron";
import { existsSync, promises as fsp } from "fs";
import { URL } from "url";
import { basename, join, normalize, resolve } from "path";

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
}
type HandlerType = Parameters<Protocol['registerFileProtocol']>[1];
export const createMwFileProtocolHandler: () => HandlerType = (): HandlerType => {
    const distType: string = normalize(`${__dirname}/../../node_modules/@manniwatch/client-ng/dist/manniwatch/`);
    if (!existsSync(distType)) {
        throw new Error(`Could not find dist folder '${distType}'`);
    }
    return async (request: ProtocolRequest, callback: (response: string | ProtocolResponse) => void): Promise<void> => {
        //console.log(request);
        const parsedUrl: URL = new URL(request.url);
        if (!(parsedUrl.protocol === 'mw:')) {
            return;
        }
        if (!(parsedUrl.host === 'static')) {
            return;
        }

        const normalizedPath: string = normalize(join(distType, parsedUrl.pathname));
        //console.log(parsedUrl.protocol, parsedUrl.host, parsedUrl.pathname, guessMimeType(normalizedPath), normalizedPath);
        try {
            if ((await fsp.stat(normalizedPath)).isFile()) {
                //console.info('y', normalizedPath);
                callback({
                    charset: 'UTF-8',
                    path: normalizedPath,
                    headers: {
                        'Content-Type': guessMimeType(normalizedPath) as any,
                    }
                });
            }
            return;
        } catch (err) {

        }
        callback({ path: resolve(distType, 'index.html') });

    }
};
