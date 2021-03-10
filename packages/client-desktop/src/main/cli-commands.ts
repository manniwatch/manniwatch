/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import { Command } from 'commander';

export interface IConfig {
    endpoint: URL;
    dev: boolean;
}
export type ArgsCallback = (config: IConfig) => void;
export const parseArgs: (cb: ArgsCallback) => void = (cb: ArgsCallback): void => {
    // tslint:disable-next-line:no-unused-expression
    const cmd = new Command();
    cmd.version('0.1.0')
        .arguments('<endpoint>')
        .description('test command', {
            endpoint: 'user to login'
        })
        .option('-d, --debug', 'Debug', false)
        .action((endpoint, options, command) => {
            if (options.debug) {
                console.error('Called %s with options %o', command.name(), options);
            }
            const title = options.title ? `${options.title} ` : '';
            console.log(`Thank-you ${title}${endpoint}`, options);
            cb({
                endpoint: new URL(endpoint),
                dev: options.debug,
            });
        })
        .parse();
};
