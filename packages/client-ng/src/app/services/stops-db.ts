import { IStopLocation, IStopPointLocation } from '@manniwatch/api-types';
import Dexie, { Transaction } from 'dexie';
interface IStringMap { [key: string]: string; }
type DatabaseLocations = IStopPointLocation | IStopLocation;
type DatabaseLocationEntry = DatabaseLocations & { search_keys: string[] };

/**
 * Splits an input string into valid search terms
 *
 * @example
 * // returns ['test','case']
 * splitSearchKeys('test case 19');
 * @param source String to split into search keys
 * @returns Array of search keys
 */
export const splitSearchKeys: (source: string) => string[] = (source: string): string[] => {
    const splitRegex: RegExp = /[^A-Za-zÄÖÜẞäöüß]+/gi;
    /**
     * Not deduplicated
     */
    const allTerms: string[] = source
        .replace(splitRegex, ' ')
        .trim()
        .split(' ');
    /**
     * Map of search terms
     */
    const wordSet: IStringMap = allTerms.reduce((prev: IStringMap, current: string): IStringMap => {
        prev[current.toLocaleLowerCase()] = current;
        return prev;
    }, {});
    return Object.values(wordSet);
};

const createCallback: (primKey: string, obj: DatabaseLocations, transaction: Transaction) => void =
    (primKey: string, obj: DatabaseLocations, transaction: Transaction): void => {
        if (typeof obj.name === 'string') {
            (obj as any).search_keys = splitSearchKeys(obj.name);
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
                return { search_keys: splitSearchKeys(mod.name) };
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
