import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import Dexie, { Transaction } from 'dexie';
interface IStringMap { [key: string]: boolean; }
type DatabaseLocations = IStopPointLocation | IStopLocation;
type DatabaseLocationEntry = DatabaseLocations & { search_keys: string[] };
export const createSearchKeys: (source: string) => string[] = (source: string): string[] => {
    const allWordsIncludingDups: string[] = source.replace(/[^A-Za-zÄÖÜẞäöüß]+/gi, ' ').trim().split(' ');
    const wordSet: IStringMap = allWordsIncludingDups.reduce((prev: IStringMap, current: string): IStringMap => {
        prev[current] = true;
        return prev;
    }, {});
    return Object.keys(wordSet);
};
const createCallback: (primKey: string, obj: DatabaseLocations, transaction: Transaction) => void =
    (primKey: string, obj: DatabaseLocations, transaction: Transaction): void => {
        if (typeof obj.name === 'string') {
            (obj as any).search_keys = createSearchKeys(obj.name);
        }
    };
const readCallback: (obj: DatabaseLocationEntry) => DatabaseLocationEntry = (obj: DatabaseLocationEntry): DatabaseLocationEntry => {
    delete obj.search_keys;
    return obj;
};
const updateCallback: (mod: Partial<DatabaseLocations>,
    primKey: string,
    obj: DatabaseLocations,
    transaction: Transaction) => Partial<DatabaseLocationEntry> =
    (mod: Partial<DatabaseLocations>,
        primKey: string,
        obj: DatabaseLocationEntry,
        transaction: Transaction): Partial<DatabaseLocationEntry> => {
        if (mod.hasOwnProperty('name')) {
            if (typeof mod.name === 'string') {
                return { search_keys: createSearchKeys(mod.name) };
            } else {
                return { search_keys: [] };
            }
        }
    };

export class StopsDb extends Dexie {
    public stopLocations: Dexie.Table<IStopLocation, string>;
    public stopPointLocations: Dexie.Table<IStopPointLocation, string>;

    public constructor() {
        super('ManniwatchStopsDb');
        this.version(1).stores({
            stopPoints: '&id,[latitude+longitude],*search_keys',
            stops: '&id,[latitude+longitude],*search_keys',
        });
        this.stopLocations = this.table('stops');
        this.stopPointLocations = this.table('stopPoints');
        this.stopLocations.hook('creating', createCallback);
        this.stopLocations.hook('updating', updateCallback);
        this.stopLocations.hook('reading', readCallback);
        this.stopPointLocations.hook('creating', createCallback);
        this.stopPointLocations.hook('updating', updateCallback);
        /**
         * Fixes some weird typescript error where reading is interpreted as deleting
         */
        this.stopPointLocations.hook('reading' as any, readCallback);
    }
}
