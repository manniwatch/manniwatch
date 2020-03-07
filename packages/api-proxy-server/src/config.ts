/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import * as nconf from 'nconf';

export class Config {
    private static sNconf: nconf.Provider;
    private static get nconf(): nconf.Provider {
        if (Config.sNconf) {
            return Config.sNconf;
        }
        Config.sNconf = new nconf.Provider({})
            .file('config.json')
            .argv({
                e: {
                    alias: 'endpoint',
                    demand: true,
                    describe: 'the endpoint to use',
                },
                p: {
                    alias: 'port',
                    describe: 'the port to run on',
                },
            }).defaults({
                endpoint: undefined,
                port: 3000,
            });
        return Config.sNconf;
    }

    /**
     * gets the port for the server
     */
    public static get port(): number {
        return Config.nconf.get('port');
    }

    public static get endpoint(): string {
        return Config.nconf.get('endpoint');
    }

}
