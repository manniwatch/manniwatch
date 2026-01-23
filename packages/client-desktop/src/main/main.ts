/**
 * Package @manniwatch/client-desktop
 * Source https://manniwatch.github.io/manniwatch/
 */

import { appCallback } from './app-callback';
import { handleCli } from './cli/index';

handleCli(appCallback);
