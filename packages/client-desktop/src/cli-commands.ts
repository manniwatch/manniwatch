/*!
 * Source https://github.com/manniwatch/manniwatch
 */

import * as yargs from 'yargs';

export interface IConfig {
    endpoint: URL;
    dev: boolean;
    port: number;
}
export type ArgsCallback = (config: IConfig) => void;
export const parseArgs: (cb: ArgsCallback) => void = (cb: ArgsCallback): void => {
    // tslint:disable-next-line:no-unused-expression
    yargs
        .command('$0 [endpoint]', 'endpoint url to query', (ya: yargs.Argv<any>) =>
            ya
                .positional('endpoint', {
                    alias: 'endpoint',
                    describe: 'endpoint url',
                    example: 'https://the-domain.com/',
                })
                .option('port', {
                    default: 9482,
                    describe: 'port to bind on',
                    type: 'number',
                })
                .option('dev', {
                    boolean: true,
                    default: false,
                    describe: 'Enable dev mode',
                    type: 'boolean',
                })
                .coerce('endpoint', (value: string) =>
                    new URL(value))
                .check((argv: yargs.Arguments<any>, aliases: { [alias: string]: string }) =>
                    true), (argv: yargs.Arguments<any>): void => {
                        cb(argv);
                    })
        .argv;
};
