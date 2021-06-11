/*!
 * Source https://github.com/manniwatch/manniwatch Package: schemas
 */

import { JSONSchemaType } from 'ajv';

export type RequireIdJSONSchemaType<T> =
    JSONSchemaType<T> & { $id: string };
