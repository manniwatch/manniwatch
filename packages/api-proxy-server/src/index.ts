/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-server
 */

import { createApiProxyRouter } from '@manniwatch/api-proxy-router';
import * as express from 'express';
import { Config } from './config';
const app: express.Application = express();

app.use((req: express.Request,
    res: express.Response,
    next: express.NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});
app.use('/api', createApiProxyRouter(Config.endpoint));
app.use(express.static('./../dist/static'));

app.listen(Config.port, (): void => {
    // tslint:disable-next-line:no-console
    console.log('Example app listening on port ' + Config.port + ' with endpoint "' + Config.endpoint + '"!');
});
