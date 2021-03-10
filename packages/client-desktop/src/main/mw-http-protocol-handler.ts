import { Protocol, ProtocolRequest, ProtocolResponse } from "electron";
import { existsSync, promises as fsp } from "fs";
import { normalize, resolve } from "path";

type HandlerType = Parameters<Protocol['registerHttpProtocol']>[1];
export const createMwHttpProtocolHandler: () => HandlerType = (): HandlerType => {
    const distType: string = normalize(`${__dirname}/../node_modules/@manniwatch/client-ng/dist/desktop/`);
    if (!existsSync(distType)) {
        throw new Error('Could find dist folder');
    }
    return async (request: ProtocolRequest, callback: (response: ProtocolResponse) => void): Promise<void> => {
        const url: string = request.url.substr(5);
        const normalizedPath: string = resolve(distType, url);
        if ((await fsp.stat(normalizedPath)).isFile()) {

            callback({
                headers: { 'Content-Type': 'text/html; charset=UTF-8' },
                data: await fsp.readFile(normalizedPath, 'utf8'),
                path: normalizedPath,
            });
        } else {
            callback({ path: resolve(distType, 'index.html') });
        }
    }
};
