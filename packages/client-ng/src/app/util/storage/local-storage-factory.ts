/*
 * Package @manniwatch/client-ng
 * Source https://manniwatch.github.io/manniwatch/
 */

import { MapStorage } from './map-storage';
import { IStorage } from './storage';

const storageAvailable: (st: Storage) => boolean = (st: Storage): boolean => {
    const testString = 'manniwatch';
    try {
        st.setItem(testString, testString);
        st.removeItem(testString);
        return true;
    } catch (e) {
        return false;
    }
};

export const LOCAL_STORAGE_FACTORY: () => IStorage = (): IStorage => {
    if (storageAvailable(localStorage)) {
        return localStorage;
    } else if (storageAvailable(sessionStorage)) {
        return sessionStorage;
    }
    return new MapStorage();
};
