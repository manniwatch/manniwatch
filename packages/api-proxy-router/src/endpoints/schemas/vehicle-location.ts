import { PositionType } from "@manniwatch/api-types";
import { JSONSchemaType } from "ajv";
import { POSITION_TYPE_SCHEMA } from "./position-type";
import { UINT_SCHEMA } from "./uint";

export interface IGeoLocationSchema {
    lastUpdate?: string;
    positionType?: PositionType;
}
export const GET_VEHICLE_LOCATION_SCHEMA: JSONSchemaType<IGeoLocationSchema> = {
    additionalProperties: false,
    $id: '#manniwatch/vehicle_location',
    definitions: {
        [UINT_SCHEMA.$id!]: UINT_SCHEMA,
        [POSITION_TYPE_SCHEMA.$id!]: POSITION_TYPE_SCHEMA,
    },
    properties: {
        lastUpdate: {
            $ref: UINT_SCHEMA.$id!,
            default: '0',
            description: 'unix timestamp in ms since epoch',
            nullable: true,
        },
        positionType: {
            $ref: POSITION_TYPE_SCHEMA.$id!,
        },
    },
    required: [],
    type: 'object',
};
