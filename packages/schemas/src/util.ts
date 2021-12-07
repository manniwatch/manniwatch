/*
 * Package @manniwatch/schemas
 * Source https://manniwatch.github.io/manniwatch/
 */

import { JSONSchemaType } from 'ajv';

export type RequireIdJSONSchemaType<T> = JSONSchemaType<T> & { $id: string };
