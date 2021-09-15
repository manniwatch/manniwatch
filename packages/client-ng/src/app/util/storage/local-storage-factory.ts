import { MapStorage } from "./map-storage";

function storageAvailable(st: Storage): boolean {
    const testString: string = 'manniwatch';
    try {
        st.setItem(testString, testString);
        st.removeItem(testString);
        return true;
    } catch (e) {
        return false;
    }
}
export function LOCAL_STORAGE_FACTORY(): IStorage {
    if (storageAvailable(localStorage)) {
        return localStorage;
    } else if (storageAvailable(sessionStorage)) {
        return sessionStorage;
    }
    return new MapStorage();
}
