/*!
 * Source https://github.com/manniwatch/manniwatch Package: api-proxy-router
 */

import { JSONSchemaType } from 'ajv';

export type RequireIdJSONSchemaType<T, _partial extends boolean = false> =
    JSONSchemaType<T, _partial> & { $id: string };
