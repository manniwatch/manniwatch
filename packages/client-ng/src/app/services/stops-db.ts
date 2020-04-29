import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import Dexie from 'dexie';


export class StopsDb extends Dexie {
    public stopLocations: Dexie.Table<IStopLocation, string>;
    public stopPointLocations: Dexie.Table<IStopPointLocation, string>;

    public constructor() {
        super('ManniwatchStopsDb');
        this.version(1).stores({
            stopPoints: '&id,[latitude+longitude],name',
            stops: '&id,[latitude+longitude],name',
        });
        this.stopLocations = this.table('stops');
        this.stopPointLocations = this.table('stopPoints');
    }
}
