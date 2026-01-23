/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

export interface ICliConfig {
    /**
     * Path to config file
     */
    config: string;
    /**
     * Run in debug
     */
    debug: boolean;
    /**
     * CLI Command to override endpoint
     */
    endpoint: string;
}
