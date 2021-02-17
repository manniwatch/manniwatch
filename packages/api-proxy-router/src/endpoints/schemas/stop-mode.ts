import { StopMode } from "@manniwatch/api-types";
import { JSONSchemaType } from "ajv";

export const STOP_MODE_SCHEMA: JSONSchemaType<StopMode> = {
    $id: '#manniwatch/stop_mode',
    default: 'departure',
    enum: ['departure', 'arrival'],
    type: 'string',
};
