/*!
 * Source https://github.com/manniwatch/manniwatch Package: client-desktop
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
